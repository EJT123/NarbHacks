import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  fitness: defineTable({
    userId: v.string(),
    date: v.string(), // YYYY-MM-DD format
    water: v.number(), // in ml
    sleep: v.number(), // in hours
    mood: v.number(), // 1-5 scale
    exerciseType: v.string(),
    exerciseDuration: v.number(), // in minutes
    height: v.number(), // in cm
    weight: v.number(), // in kg
    waist: v.optional(v.number()), // in cm
    hip: v.optional(v.number()), // in cm
    chest: v.optional(v.number()), // in cm
    bodyFat: v.optional(v.number()), // percentage
    useMetric: v.boolean(), // true for metric, false for imperial
  }).index("by_user_date", ["userId", "date"]),
  goals: defineTable({
    userId: v.string(),
    type: v.string(), // "weight", "water", "exercise", "sleep"
    target: v.number(),
    current: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    isActive: v.boolean(),
  }).index("by_user_type", ["userId", "type"]),
});
