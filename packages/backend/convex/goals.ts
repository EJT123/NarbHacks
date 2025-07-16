import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

// Get all active goals for a user
export const getGoals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user_type", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return goals;
  },
});

// Create a new goal
export const createGoal = mutation({
  args: {
    type: v.string(),
    target: v.number(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    // Check if goal already exists for this type
    const existingGoal = await ctx.db
      .query("goals")
      .withIndex("by_user_type", (q) => 
        q.eq("userId", userId).eq("type", args.type)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (existingGoal) {
      // Update existing goal
      return await ctx.db.patch(existingGoal._id, {
        target: args.target,
        startDate: args.startDate,
        endDate: args.endDate,
        current: args.target, // Reset current progress
      });
    } else {
      // Create new goal
      return await ctx.db.insert("goals", {
        userId,
        type: args.type,
        target: args.target,
        current: args.target,
        startDate: args.startDate,
        endDate: args.endDate,
        isActive: true,
      });
    }
  },
});

// Update goal progress
export const updateGoalProgress = mutation({
  args: {
    type: v.string(),
    current: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const goal = await ctx.db
      .query("goals")
      .withIndex("by_user_type", (q) => 
        q.eq("userId", userId).eq("type", args.type)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (goal) {
      return await ctx.db.patch(goal._id, {
        current: args.current,
      });
    }
  },
});

// Deactivate a goal
export const deactivateGoal = mutation({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const goal = await ctx.db
      .query("goals")
      .withIndex("by_user_type", (q) => 
        q.eq("userId", userId).eq("type", args.type)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (goal) {
      return await ctx.db.patch(goal._id, {
        isActive: false,
      });
    }
  },
}); 