import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./fitness";

// Achievement definitions
const ACHIEVEMENTS = {
  // Streak achievements
  streak_7: { title: "Week Warrior", description: "7-day logging streak", icon: "🔥", target: 7 },
  streak_30: { title: "Monthly Master", description: "30-day logging streak", icon: "⭐", target: 30 },
  streak_100: { title: "Century Club", description: "100-day logging streak", icon: "👑", target: 100 },
  
  // Goal achievements
  goal_complete: { title: "Goal Getter", description: "Complete your first goal", icon: "🎯", target: 1 },
  goal_master: { title: "Goal Master", description: "Complete 5 goals", icon: "🏆", target: 5 },
  
  // Workout achievements
  workout_first: { title: "First Steps", description: "Log your first workout", icon: "💪", target: 1 },
  workout_10: { title: "Dedicated", description: "Complete 10 workouts", icon: "🏋️", target: 10 },
  workout_50: { title: "Fitness Fanatic", description: "Complete 50 workouts", icon: "🚀", target: 50 },
  
  // Social achievements
  friend_first: { title: "Social Butterfly", description: "Add your first friend", icon: "👥", target: 1 },
  friend_5: { title: "Team Player", description: "Add 5 friends", icon: "🤝", target: 5 },
  
  // Consistency achievements
  log_week: { title: "Consistent", description: "Log 7 days in a row", icon: "📅", target: 7 },
  log_month: { title: "Dedicated Logger", description: "Log 30 days", icon: "📊", target: 30 },
};

export const checkAndAwardAchievements = mutation({
  args: {
    type: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const newAchievements = [];

    // Check for achievements based on type
    if (args.type === "streak") {
      for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (key.startsWith("streak_") && args.progress >= achievement.target) {
          const existing = await ctx.db
            .query("achievements")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("title"), achievement.title))
            .first();

          if (!existing) {
            const achievementId = await ctx.db.insert("achievements", {
              userId,
              type: "streak",
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              unlockedAt: new Date().toISOString(),
              progress: args.progress,
              target: achievement.target,
            });
            newAchievements.push(achievement);
          }
        }
      }
    }

    if (args.type === "goal") {
      for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (key.startsWith("goal_") && args.progress >= achievement.target) {
          const existing = await ctx.db
            .query("achievements")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("title"), achievement.title))
            .first();

          if (!existing) {
            const achievementId = await ctx.db.insert("achievements", {
              userId,
              type: "goal",
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              unlockedAt: new Date().toISOString(),
              progress: args.progress,
              target: achievement.target,
            });
            newAchievements.push(achievement);
          }
        }
      }
    }

    if (args.type === "workout") {
      for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (key.startsWith("workout_") && args.progress >= achievement.target) {
          const existing = await ctx.db
            .query("achievements")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("title"), achievement.title))
            .first();

          if (!existing) {
            const achievementId = await ctx.db.insert("achievements", {
              userId,
              type: "workout",
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              unlockedAt: new Date().toISOString(),
              progress: args.progress,
              target: achievement.target,
            });
            newAchievements.push(achievement);
          }
        }
      }
    }

    if (args.type === "social") {
      for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (key.startsWith("friend_") && args.progress >= achievement.target) {
          const existing = await ctx.db
            .query("achievements")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("title"), achievement.title))
            .first();

          if (!existing) {
            const achievementId = await ctx.db.insert("achievements", {
              userId,
              type: "social",
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              unlockedAt: new Date().toISOString(),
              progress: args.progress,
              target: achievement.target,
            });
            newAchievements.push(achievement);
          }
        }
      }
    }

    return newAchievements;
  },
});

export const getUserAchievements = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return achievements;
  },
});

export const getAchievementProgress = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return achievements;
  },
});

export const getAllAchievements = query({
  handler: async (ctx) => {
    // Return all possible achievements that can be unlocked
    const allAchievements = [
      // Streak achievements
      {
        _id: "streak_7",
        type: "streak",
        title: "Week Warrior",
        description: "7-day logging streak",
        icon: "🔥",
        target: 7,
        points: 50,
      },
      {
        _id: "streak_30",
        type: "streak",
        title: "Monthly Master",
        description: "30-day logging streak",
        icon: "⭐",
        target: 30,
        points: 100,
      },
      {
        _id: "streak_100",
        type: "streak",
        title: "Century Club",
        description: "100-day logging streak",
        icon: "👑",
        target: 100,
        points: 500,
      },
      
      // Goal achievements
      {
        _id: "goal_complete",
        type: "goal",
        title: "Goal Getter",
        description: "Complete your first goal",
        icon: "🎯",
        target: 1,
        points: 25,
      },
      {
        _id: "goal_master",
        type: "goal",
        title: "Goal Master",
        description: "Complete 5 goals",
        icon: "🏆",
        target: 5,
        points: 150,
      },
      
      // Workout achievements
      {
        _id: "workout_first",
        type: "exercise",
        title: "First Steps",
        description: "Log your first workout",
        icon: "💪",
        target: 1,
        points: 25,
      },
      {
        _id: "workout_10",
        type: "exercise",
        title: "Dedicated",
        description: "Complete 10 workouts",
        icon: "🏋️",
        target: 10,
        points: 75,
      },
      {
        _id: "workout_50",
        type: "exercise",
        title: "Fitness Fanatic",
        description: "Complete 50 workouts",
        icon: "🚀",
        target: 50,
        points: 300,
      },
      
      // Social achievements
      {
        _id: "friend_first",
        type: "social",
        title: "Social Butterfly",
        description: "Add your first friend",
        icon: "👥",
        target: 1,
        points: 25,
      },
      {
        _id: "friend_5",
        type: "social",
        title: "Team Player",
        description: "Add 5 friends",
        icon: "🤝",
        target: 5,
        points: 100,
      },
      
      // Consistency achievements
      {
        _id: "log_week",
        type: "milestone",
        title: "Consistent",
        description: "Log 7 days in a row",
        icon: "📅",
        target: 7,
        points: 50,
      },
      {
        _id: "log_month",
        type: "milestone",
        title: "Dedicated Logger",
        description: "Log 30 days",
        icon: "📊",
        target: 30,
        points: 150,
      },
    ];

    return allAchievements;
  },
}); 