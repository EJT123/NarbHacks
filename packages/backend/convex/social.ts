import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./fitness";

export const createUserProfile = mutation({
  args: {
    displayName: v.string(),
    bio: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return await ctx.db.patch(existingProfile._id, args);
    } else {
      return await ctx.db.insert("userProfiles", {
        userId,
        ...args,
      });
    }
  },
});

export const getUserProfile = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const currentUserId = await getUserId(ctx);
    if (!currentUserId) return null;

    const targetUserId = args.userId || currentUserId;
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId))
      .first();

    return profile;
  },
});

export const sendFriendRequest = mutation({
  args: {
    toUserId: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fromUserId = await getUserId(ctx);
    if (!fromUserId) throw new Error("User not found");

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("friendRequests")
      .withIndex("by_from_user", (q) => 
        q.eq("fromUserId", fromUserId).eq("toUserId", args.toUserId)
      )
      .first();

    if (existingRequest) {
      throw new Error("Friend request already sent");
    }

    return await ctx.db.insert("friendRequests", {
      fromUserId,
      toUserId: args.toUserId,
      status: "pending",
      message: args.message,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getFriendRequests = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const requests = await ctx.db
      .query("friendRequests")
      .withIndex("by_to_user_status", (q) => 
        q.eq("toUserId", userId).eq("status", "pending")
      )
      .collect();

    // Get the user profiles for the requests
    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const fromUser = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", request.fromUserId))
          .first();
        return {
          ...request,
          fromUser
        };
      })
    );

    return requestsWithProfiles;
  },
});

export const respondToFriendRequest = mutation({
  args: {
    requestId: v.id("friendRequests"),
    response: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const request = await ctx.db.get(args.requestId);
    if (!request || request.toUserId !== userId) {
      throw new Error("Invalid request");
    }

    await ctx.db.patch(args.requestId, { status: args.response });

    if (args.response === "accepted") {
      // Create friend relationship
      await ctx.db.insert("friends", {
        userId: request.fromUserId,
        friendId: userId,
        status: "accepted",
        createdAt: new Date().toISOString(),
      });
      
      await ctx.db.insert("friends", {
        userId,
        friendId: request.fromUserId,
        status: "accepted",
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true };
  },
});

export const getFriends = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const friendships = await ctx.db
      .query("friends")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", userId).eq("status", "accepted")
      )
      .collect();

    const friendProfiles = await Promise.all(
      friendships.map(async (friendship) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", friendship.friendId))
          .first();
        return profile;
      })
    );

    return friendProfiles.filter(Boolean);
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const profiles = await ctx.db
      .query("userProfiles")
      .collect();

    return profiles;
  },
});

export const acceptFriendRequest = mutation({
  args: {
    requestId: v.id("friendRequests"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const request = await ctx.db.get(args.requestId);
    if (!request || request.toUserId !== userId) {
      throw new Error("Invalid request");
    }

    await ctx.db.patch(args.requestId, { status: "accepted" });

    // Create friend relationship
    await ctx.db.insert("friends", {
      userId: request.fromUserId,
      friendId: userId,
      status: "accepted",
      createdAt: new Date().toISOString(),
    });
    
    await ctx.db.insert("friends", {
      userId,
      friendId: request.fromUserId,
      status: "accepted",
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const rejectFriendRequest = mutation({
  args: {
    requestId: v.id("friendRequests"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const request = await ctx.db.get(args.requestId);
    if (!request || request.toUserId !== userId) {
      throw new Error("Invalid request");
    }

    await ctx.db.patch(args.requestId, { status: "rejected" });

    return { success: true };
  },
});

export const removeFriend = mutation({
  args: {
    friendId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    // Remove both friendship records
    const friendships = await ctx.db
      .query("friends")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", userId).eq("status", "accepted")
      )
      .filter((q) => q.eq(q.field("friendId"), args.friendId))
      .collect();

    for (const friendship of friendships) {
      await ctx.db.delete(friendship._id);
    }

    const reverseFriendships = await ctx.db
      .query("friends")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", args.friendId).eq("status", "accepted")
      )
      .filter((q) => q.eq(q.field("friendId"), userId))
      .collect();

    for (const friendship of reverseFriendships) {
      await ctx.db.delete(friendship._id);
    }

    return { success: true };
  },
}); 