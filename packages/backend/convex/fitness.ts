import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

// Get all fitness logs for a specific user
export const getFitnessLogs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const logs = await ctx.db
      .query("fitness")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return logs;
  },
});

// Get fitness log for a specific date
export const getFitnessLogByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const log = await ctx.db
      .query("fitness")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", userId).eq("date", date)
      )
      .first();

    return log;
  },
});

// Create or update a fitness log
export const createFitnessLog = mutation({
  args: {
    date: v.string(),
    water: v.number(),
    sleep: v.number(),
    mood: v.number(),
    exerciseType: v.string(),
    exerciseDuration: v.number(),
    height: v.number(),
    weight: v.number(),
    waist: v.optional(v.number()),
    hip: v.optional(v.number()),
    chest: v.optional(v.number()),
    bodyFat: v.optional(v.number()),
    useMetric: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    // Check if log already exists for this date
    const existingLog = await ctx.db
      .query("fitness")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", userId).eq("date", args.date)
      )
      .first();

    if (existingLog) {
      // Update existing log
      return await ctx.db.patch(existingLog._id, args);
    } else {
      // Create new log
      return await ctx.db.insert("fitness", {
        userId,
        ...args,
      });
    }
  },
});

// Delete a fitness log
export const deleteFitnessLog = mutation({
  args: { id: v.id("fitness") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const log = await ctx.db.get(id);
    if (!log || log.userId !== userId) {
      throw new Error("Log not found or access denied");
    }

    await ctx.db.delete(id);
    return true;
  },
});

// Get fitness statistics for the last 30 days
export const getFitnessStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const logs = await ctx.db
      .query("fitness")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", userId).gte("date", startDate)
      )
      .collect();

    if (logs.length === 0) return null;

    const stats = {
      totalDays: logs.length,
      avgWater: logs.reduce((sum, log) => sum + log.water, 0) / logs.length,
      avgSleep: logs.reduce((sum, log) => sum + log.sleep, 0) / logs.length,
      avgMood: logs.reduce((sum, log) => sum + log.mood, 0) / logs.length,
      totalExerciseMinutes: logs.reduce((sum, log) => sum + log.exerciseDuration, 0),
      avgWeight: logs.reduce((sum, log) => sum + log.weight, 0) / logs.length,
      weightChange: logs[logs.length - 1].weight - logs[0].weight,
    };

    return stats;
  },
});

// Calculate BMI and health insights
export const getHealthInsights = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const latestLog = await ctx.db
      .query("fitness")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    if (!latestLog || !latestLog.height || !latestLog.weight) return null;

    // Calculate BMI (weight in kg / height in m²)
    const heightInMeters = latestLog.height / 100;
    const bmi = latestLog.weight / (heightInMeters * heightInMeters);

    // BMI Categories
    let bmiCategory = "";
    let bmiColor = "";
    if (bmi < 18.5) {
      bmiCategory = "Underweight";
      bmiColor = "#3B82F6"; // Blue
    } else if (bmi < 25) {
      bmiCategory = "Normal Weight";
      bmiColor = "#10B981"; // Green
    } else if (bmi < 30) {
      bmiCategory = "Overweight";
      bmiColor = "#F59E0B"; // Yellow
    } else {
      bmiCategory = "Obese";
      bmiColor = "#EF4444"; // Red
    }

    // Health insights
    const insights = [];
    
    if (latestLog.water < 2000) {
      insights.push("Consider increasing your water intake to 2L daily");
    }
    
    if (latestLog.sleep < 7) {
      insights.push("Aim for 7-9 hours of sleep for optimal health");
    }
    
    if (latestLog.exerciseDuration < 30) {
      insights.push("Try to exercise for at least 30 minutes daily");
    }

    if (bmi > 25) {
      insights.push("Consider increasing physical activity and monitoring calorie intake");
    }

    return {
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmiColor,
      insights,
      height: latestLog.height,
      weight: latestLog.weight,
    };
  },
}); 