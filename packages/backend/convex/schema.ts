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
    fitnessGoal: v.optional(v.string()), // <-- Added for onboarding
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
  
  streaks: defineTable({
    userId: v.string(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastLogDate: v.string(),
    streakType: v.string(), // "logging", "workout", "water", etc.
  }).index("by_user_type", ["userId", "streakType"]),
  
  notificationPreferences: defineTable({
    userId: v.string(),
    dailyReminderEnabled: v.boolean(),
    dailyReminderTime: v.string(), // "HH:MM" format
    weeklyCheckinEnabled: v.boolean(),
    pushToken: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  
  userProfiles: defineTable({
    userId: v.string(),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPublic: v.boolean(), // whether profile is visible to others
  }).index("by_user", ["userId"]),
  
  friends: defineTable({
    userId: v.string(),
    friendId: v.string(),
    status: v.string(), // "pending", "accepted", "blocked"
    createdAt: v.string(),
  }).index("by_user", ["userId"]).index("by_friend", ["friendId"]).index("by_user_status", ["userId", "status"]),
  
  friendRequests: defineTable({
    fromUserId: v.string(),
    toUserId: v.string(),
    status: v.string(), // "pending", "accepted", "rejected"
    message: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_to_user", ["toUserId"]).index("by_from_user", ["fromUserId"]).index("by_to_user_status", ["toUserId", "status"]),
  
  achievements: defineTable({
    userId: v.string(),
    type: v.string(), // "streak", "goal", "workout", "social", "milestone"
    title: v.string(),
    description: v.string(),
    icon: v.string(), // emoji or icon name
    unlockedAt: v.string(),
    progress: v.number(), // current progress towards achievement
    target: v.number(), // target to unlock
  }).index("by_user", ["userId"]).index("by_type", ["type"]),
  
  challenges: defineTable({
    creatorId: v.string(),
    title: v.string(),
    description: v.string(),
    type: v.string(), // "streak", "workout", "goal", "weight"
    target: v.number(),
    duration: v.number(), // days
    startDate: v.string(),
    endDate: v.string(),
    isActive: v.boolean(),
    participants: v.array(v.string()), // user IDs
    rewards: v.optional(v.string()),
  }).index("by_creator", ["creatorId"]).index("by_active", ["isActive"]),
  
  challengeParticipants: defineTable({
    challengeId: v.id("challenges"),
    userId: v.string(),
    joinedAt: v.string(),
    progress: v.number(),
    completed: v.boolean(),
  }).index("by_challenge", ["challengeId"]).index("by_user", ["userId"]),
});
