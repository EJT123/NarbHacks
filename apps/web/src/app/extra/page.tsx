"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdaptiveAvatar from "@/components/fitness/AdaptiveAvatar";

export default function ExtraFeaturesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="text-center mb-8 relative">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">DF</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DailyForm
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Advanced Features & Analytics</p>
        </div>

        {/* Adaptive Avatar Section */}
        <div className="mb-8">
          <AdaptiveAvatar />
        </div>

        {/* How Your Inputs Affect the Avatar */}
        <div className="mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Your Inputs Affect the Avatar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Water Intake Effects */}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">💧</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Water Intake</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>60%+ daily goal: Blue hydration waves appear</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>80%+ daily goal: Radiant golden glow around head</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>90%+ daily goal: Sparkles appear around avatar</span>
                </div>
              </div>
            </div>

            {/* Exercise Effects */}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">💪</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Exercise</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span>40%+ muscle level: Chest muscle definition appears</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span>50%+ muscle level: Arms get slightly bulkier</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span>70%+ muscle level: Sweat drops appear</span>
                </div>
              </div>
            </div>

            {/* Sleep Effects */}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">😴</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Sleep Quality</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  <span>&lt;6 hours: Dark circles under eyes</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  <span>&lt;6 hours: Avatar becomes gray/tired</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  <span>7-9 hours: Bright, energetic appearance</span>
                </div>
              </div>
            </div>

            {/* Mood Effects */}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">😊</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Mood</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>&gt;3/5: Bright, alert eyes</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>&gt;3/5: Smiling expression</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>&lt;3/5: Frowning expression</span>
                </div>
              </div>
            </div>

            {/* BMI Effects */}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-white">BMI Changes</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span>Body width adjusts based on BMI</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span>Proportions change realistically</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span>Maintains healthy appearance</span>
                </div>
              </div>
            </div>

            {/* Energy Level Effects */}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Energy Level</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>&gt;70%: Green energy aura appears</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Based on sleep + mood combination</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Dotted pattern shows vitality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Real-time Avatar */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Adaptive Avatar</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your avatar changes based on your real fitness data - BMI, muscle definition, hydration, and energy levels.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Body proportions based on BMI
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Muscle definition from exercise
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Hydration effects and waves
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Energy aura from sleep & mood
              </div>
            </div>
          </div>

          {/* Health Analytics */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Health Analytics</h3>
            <p className="text-gray-400 text-sm mb-4">
              Advanced health insights and personalized recommendations based on your data patterns.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                BMI tracking and categorization
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Exercise intensity analysis
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Sleep quality assessment
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Mood correlation insights
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm mb-4">
              Visual progress tracking with interactive charts and trend analysis over time.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Weight and body composition
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Exercise volume and intensity
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Hydration and nutrition
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Sleep and recovery patterns
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Recommendations</h3>
            <p className="text-gray-400 text-sm mb-4">
              AI-powered recommendations to optimize your fitness routine and health outcomes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Personalized workout suggestions
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Nutrition and hydration tips
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Sleep optimization advice
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Goal achievement strategies
              </div>
            </div>
          </div>

          {/* Social Features */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Social Features</h3>
            <p className="text-gray-400 text-sm mb-4">
              Connect with friends, share achievements, and participate in fitness challenges.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Friend connections and sharing
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Achievement badges and rewards
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Group fitness challenges
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Community support and motivation
              </div>
            </div>
          </div>

          {/* Data Export */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📤</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Data Export</h3>
            <p className="text-gray-400 text-sm mb-4">
              Export your fitness data for analysis, sharing with healthcare providers, or backup purposes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                CSV and JSON export formats
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                Custom date range selection
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                Healthcare provider reports
              </div>
              <div className="flex items-center text-xs text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                Secure data backup options
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-xl border border-gray-600">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-300 mb-6">
              We're constantly working on new features to enhance your fitness journey
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🏃‍♂️</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Workout Plans</h3>
                <p className="text-gray-400 text-sm">Customized workout plans based on your goals and fitness level</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🍎</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Nutrition Tracking</h3>
                <p className="text-gray-400 text-sm">Comprehensive nutrition tracking with barcode scanning</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Goal Setting</h3>
                <p className="text-gray-400 text-sm">Smart goal setting with progress tracking and milestones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 