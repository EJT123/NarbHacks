import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./fitness";

export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("streak"), v.literal("workout"), v.literal("goal"), v.literal("weight")),
    target: v.number(),
    duration: v.number(), // days
    rewards: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + args.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const challengeId = await ctx.db.insert("challenges", {
      creatorId: userId,
      title: args.title,
      description: args.description,
      type: args.type,
      target: args.target,
      duration: args.duration,
      startDate,
      endDate,
      isActive: true,
      participants: [userId],
      rewards: args.rewards,
    });

    // Add creator as participant
    await ctx.db.insert("challengeParticipants", {
      challengeId,
      userId,
      joinedAt: new Date().toISOString(),
      progress: 0,
      completed: false,
    });

    return challengeId;
  },
});

export const joinChallenge = mutation({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge || !challenge.isActive) {
      throw new Error("Challenge not found or inactive");
    }

    // Check if already participating
    const existingParticipant = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.challengeId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingParticipant) {
      throw new Error("Already participating in this challenge");
    }

    // Add to participants
    await ctx.db.insert("challengeParticipants", {
      challengeId: args.challengeId,
      userId,
      joinedAt: new Date().toISOString(),
      progress: 0,
      completed: false,
    });

    // Update challenge participants list
    const updatedParticipants = [...challenge.participants, userId];
    await ctx.db.patch(args.challengeId, {
      participants: updatedParticipants,
    });

    return { success: true };
  },
});

export const updateChallengeProgress = mutation({
  args: {
    challengeId: v.id("challenges"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const participant = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.challengeId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!participant) {
      throw new Error("Not participating in this challenge");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) throw new Error("Challenge not found");

    const completed = args.progress >= challenge.target;

    await ctx.db.patch(participant._id, {
      progress: args.progress,
      completed,
    });

    return { success: true, completed };
  },
});

export const getActiveChallenges = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const challenges = await ctx.db
      .query("challenges")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // Get user's participation status for each challenge
    const challengesWithParticipation = await Promise.all(
      challenges.map(async (challenge) => {
        const participant = await ctx.db
          .query("challengeParticipants")
          .withIndex("by_challenge", (q) => q.eq("challengeId", challenge._id))
          .filter((q) => q.eq(q.field("userId"), userId))
          .first();

        const creatorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", challenge.creatorId))
          .first();

        return {
          ...challenge,
          isParticipating: !!participant,
          userProgress: participant?.progress || 0,
          userCompleted: participant?.completed || false,
          creatorName: creatorProfile?.displayName || "Anonymous",
        };
      })
    );

    return challengesWithParticipation;
  },
});

export const getUserChallenges = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const participations = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const challenges = await Promise.all(
      participations.map(async (participation) => {
        const challenge = await ctx.db.get(participation.challengeId);
        if (!challenge) return null;

        const creatorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", challenge.creatorId))
          .first();

        return {
          ...challenge,
          userProgress: participation.progress,
          userCompleted: participation.completed,
          creatorName: creatorProfile?.displayName || "Anonymous",
        };
      })
    );

    return challenges.filter(Boolean);
  },
});

export const getChallengeLeaderboard = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.challengeId))
      .collect();

    const leaderboard = await Promise.all(
      participants.map(async (participant) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", participant.userId))
          .first();

        return {
          userId: participant.userId,
          displayName: profile?.displayName || "Anonymous",
          progress: participant.progress,
          completed: participant.completed,
          joinedAt: participant.joinedAt,
        };
      })
    );

    return leaderboard.sort((a, b) => b.progress - a.progress);
  },
});

export const getMyChallenges = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const participations = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const challenges = await Promise.all(
      participations.map(async (participation) => {
        const challenge = await ctx.db.get(participation.challengeId);
        if (!challenge) return null;

        const creatorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", challenge.creatorId))
          .first();

        return {
          ...challenge,
          userProgress: {
            progress: participation.progress,
            completed: participation.completed,
          },
          creatorName: creatorProfile?.displayName || "Anonymous",
          status: participation.completed ? "completed" : challenge.isActive ? "active" : "failed",
        };
      })
    );

    return challenges.filter(Boolean);
  },
});

export const getCompletedChallenges = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const participations = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    const challenges = await Promise.all(
      participations.map(async (participation) => {
        const challenge = await ctx.db.get(participation.challengeId);
        if (!challenge) return null;

        const creatorProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", challenge.creatorId))
          .first();

        return {
          ...challenge,
          userProgress: {
            progress: participation.progress,
            completed: participation.completed,
          },
          creatorName: creatorProfile?.displayName || "Anonymous",
          status: "completed",
        };
      })
    );

    return challenges.filter(Boolean);
  },
}); 