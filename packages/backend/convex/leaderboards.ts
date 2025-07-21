import { v } from "convex/values";
import { query } from "./_generated/server";
import { getUserId } from "./fitness";

export const getLeaderboard = query({
  args: { 
    type: v.union(
      v.literal("streaks"), 
      v.literal("goals"), 
      v.literal("workouts"),
      v.literal("consistency")
    ),
    timeframe: v.union(
      v.literal("week"), 
      v.literal("month"), 
      v.literal("all_time")
    )
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    let leaderboardData = [];

    if (args.type === "streaks") {
      // Get all users' longest streaks
      const allStreaks = await ctx.db
        .query("streaks")
        .filter((q) => q.eq(q.field("streakType"), "logging"))
        .collect();

      // Group by user and get their longest streak
      const userStreaks = new Map();
      allStreaks.forEach(streak => {
        const current = userStreaks.get(streak.userId) || 0;
        userStreaks.set(streak.userId, Math.max(current, streak.longestStreak));
      });

      leaderboardData = Array.from(userStreaks.entries())
        .map(([userId, streak]) => ({ userId, score: streak }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    if (args.type === "goals") {
      // Get all active goals and their completion percentages
      const allGoals = await ctx.db
        .query("goals")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      const userGoalScores = new Map();
      allGoals.forEach(goal => {
        const current = userGoalScores.get(goal.userId) || 0;
        const completionRate = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
        userGoalScores.set(goal.userId, current + completionRate);
      });

      leaderboardData = Array.from(userGoalScores.entries())
        .map(([userId, score]) => ({ userId, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    if (args.type === "workouts") {
      // Get workout frequency in the last week/month
      const now = new Date();
      let startDate;
      
      if (args.timeframe === "week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (args.timeframe === "month") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(0); // All time
      }

      const allLogs = await ctx.db
        .query("fitness")
        .filter((q) => q.gte(q.field("date"), startDate.toISOString().split('T')[0]))
        .collect();

      const userWorkoutCounts = new Map();
      allLogs.forEach(log => {
        if (log.exerciseDuration > 0) {
          const current = userWorkoutCounts.get(log.userId) || 0;
          userWorkoutCounts.set(log.userId, current + 1);
        }
      });

      leaderboardData = Array.from(userWorkoutCounts.entries())
        .map(([userId, score]) => ({ userId, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    if (args.type === "consistency") {
      // Calculate logging consistency (days logged / total days)
      const allLogs = await ctx.db.query("fitness").collect();
      
      const userConsistency = new Map();
      const userDates = new Map();

      allLogs.forEach(log => {
        if (!userDates.has(log.userId)) {
          userDates.set(log.userId, new Set());
        }
        userDates.get(log.userId).add(log.date);
      });

      userDates.forEach((dates, userId) => {
        const consistency = dates.size / 30; // Assuming 30 days as baseline
        userConsistency.set(userId, consistency * 100);
      });

      leaderboardData = Array.from(userConsistency.entries())
        .map(([userId, score]) => ({ userId, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    // Get user profiles for display names
    const userIds = leaderboardData.map(item => item.userId);
    const profiles = await Promise.all(
      userIds.map(async (id) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", id))
          .first();
        return profile;
      })
    );

    return leaderboardData.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      displayName: profiles[index]?.displayName || "Anonymous",
      score: Math.round(item.score * 100) / 100,
      isCurrentUser: item.userId === userId,
    }));
  },
});

export const getUserRank = query({
  args: { 
    type: v.union(
      v.literal("streaks"), 
      v.literal("goals"), 
      v.literal("workouts"),
      v.literal("consistency")
    )
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const leaderboard = await ctx.db.query("leaderboards", {
      type: args.type,
    });

    const userRank = leaderboard.findIndex(item => item.userId === userId);
    return userRank >= 0 ? userRank + 1 : null;
  },
});

// Specific leaderboard functions for the web app
export const getExerciseLeaderboard = query({
  args: { 
    timeframe: v.union(
      v.literal("week"), 
      v.literal("month"), 
      v.literal("allTime")
    )
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const now = new Date();
    let startDate;
    
    if (args.timeframe === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (args.timeframe === "month") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(0); // All time
    }

    const allLogs = await ctx.db
      .query("fitness")
      .filter((q) => q.gte(q.field("date"), startDate.toISOString().split('T')[0]))
      .collect();

    const userExerciseMinutes = new Map();
    allLogs.forEach(log => {
      if (log.exerciseDuration > 0) {
        const current = userExerciseMinutes.get(log.userId) || 0;
        userExerciseMinutes.set(log.userId, current + log.exerciseDuration);
      }
    });

    const leaderboardData = Array.from(userExerciseMinutes.entries())
      .map(([userId, totalMinutes]) => ({ userId, totalMinutes }))
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
      .slice(0, 10);

    // Get user profiles for display names
    const userIds = leaderboardData.map(item => item.userId);
    const profiles = await Promise.all(
      userIds.map(async (id) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", id))
          .first();
        return profile;
      })
    );

    return leaderboardData.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      userName: profiles[index]?.displayName || "Anonymous",
      userLevel: profiles[index]?.level || 1,
      totalMinutes: item.totalMinutes,
      isCurrentUser: item.userId === userId,
    }));
  },
});

export const getStreakLeaderboard = query({
  args: { 
    timeframe: v.union(
      v.literal("week"), 
      v.literal("month"), 
      v.literal("allTime")
    )
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const allStreaks = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("streakType"), "logging"))
      .collect();

    const userStreaks = new Map();
    allStreaks.forEach(streak => {
      const current = userStreaks.get(streak.userId) || 0;
      userStreaks.set(streak.userId, Math.max(current, streak.longestStreak));
    });

    const leaderboardData = Array.from(userStreaks.entries())
      .map(([userId, currentStreak]) => ({ userId, currentStreak }))
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 10);

    // Get user profiles for display names
    const userIds = leaderboardData.map(item => item.userId);
    const profiles = await Promise.all(
      userIds.map(async (id) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", id))
          .first();
        return profile;
      })
    );

    return leaderboardData.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      userName: profiles[index]?.displayName || "Anonymous",
      userLevel: profiles[index]?.level || 1,
      currentStreak: item.currentStreak,
      isCurrentUser: item.userId === userId,
    }));
  },
});

export const getAchievementsLeaderboard = query({
  args: { 
    timeframe: v.union(
      v.literal("week"), 
      v.literal("month"), 
      v.literal("allTime")
    )
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const allAchievements = await ctx.db.query("achievements").collect();

    const userAchievementPoints = new Map();
    allAchievements.forEach(achievement => {
      const current = userAchievementPoints.get(achievement.userId) || 0;
      userAchievementPoints.set(achievement.userId, current + achievement.progress);
    });

    const leaderboardData = Array.from(userAchievementPoints.entries())
      .map(([userId, achievementPoints]) => ({ userId, achievementPoints }))
      .sort((a, b) => b.achievementPoints - a.achievementPoints)
      .slice(0, 10);

    // Get user profiles for display names
    const userIds = leaderboardData.map(item => item.userId);
    const profiles = await Promise.all(
      userIds.map(async (id) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", id))
          .first();
        return profile;
      })
    );

    return leaderboardData.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      userName: profiles[index]?.displayName || "Anonymous",
      userLevel: profiles[index]?.level || 1,
      achievementPoints: item.achievementPoints,
      isCurrentUser: item.userId === userId,
    }));
  },
});

export const getChallengesLeaderboard = query({
  args: { 
    timeframe: v.union(
      v.literal("week"), 
      v.literal("month"), 
      v.literal("allTime")
    )
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const allChallenges = await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("isActive"), false))
      .collect();

    const userChallengeWins = new Map();
    allChallenges.forEach(challenge => {
      challenge.participants.forEach(participantId => {
        const current = userChallengeWins.get(participantId) || 0;
        userChallengeWins.set(participantId, current + 1);
      });
    });

    const leaderboardData = Array.from(userChallengeWins.entries())
      .map(([userId, challengeWins]) => ({ userId, challengeWins }))
      .sort((a, b) => b.challengeWins - a.challengeWins)
      .slice(0, 10);

    // Get user profiles for display names
    const userIds = leaderboardData.map(item => item.userId);
    const profiles = await Promise.all(
      userIds.map(async (id) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", id))
          .first();
        return profile;
      })
    );

    return leaderboardData.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      userName: profiles[index]?.displayName || "Anonymous",
      userLevel: profiles[index]?.level || 1,
      challengeWins: item.challengeWins,
      isCurrentUser: item.userId === userId,
    }));
  },
}); 