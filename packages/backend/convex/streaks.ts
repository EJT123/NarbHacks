import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./fitness";

export const updateStreak = mutation({
  args: {
    date: v.string(),
    streakType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get existing streak
    const existingStreak = await ctx.db
      .query("streaks")
      .withIndex("by_user_type", (q) => 
        q.eq("userId", userId).eq("streakType", args.streakType)
      )
      .first();

    if (existingStreak) {
      const lastLogDate = existingStreak.lastLogDate;
      
      if (lastLogDate === today) {
        // Already logged today, no change
        return existingStreak;
      } else if (lastLogDate === yesterday) {
        // Consecutive day, increment streak
        const newStreak = existingStreak.currentStreak + 1;
        const longestStreak = Math.max(existingStreak.longestStreak, newStreak);
        
        await ctx.db.patch(existingStreak._id, {
          currentStreak: newStreak,
          longestStreak,
          lastLogDate: today,
        });

        // Send celebration notification for milestones
        if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
          // TODO: Send push notification for streak milestone
          console.log(`🎉 ${newStreak} day streak achieved!`);
        }

        return { currentStreak: newStreak, longestStreak };
      } else {
        // Streak broken, reset to 1
        await ctx.db.patch(existingStreak._id, {
          currentStreak: 1,
          lastLogDate: today,
        });
        return { currentStreak: 1, longestStreak: existingStreak.longestStreak };
      }
    } else {
      // First time logging, create streak
      const streakId = await ctx.db.insert("streaks", {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastLogDate: today,
        streakType: args.streakType,
      });
      return { currentStreak: 1, longestStreak: 1 };
    }
  },
});

export const getStreak = query({
  args: { streakType: v.string() },
  handler: async (ctx, { streakType }) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_user_type", (q) => 
        q.eq("userId", userId).eq("streakType", streakType)
      )
      .first();

    return streak || { currentStreak: 0, longestStreak: 0 };
  },
}); 