'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export default function LeaderboardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'exercise' | 'streak' | 'achievements' | 'challenges'>('exercise');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'allTime'>('week');

  // Queries
  const exerciseLeaderboard = useQuery(api.leaderboards.getExerciseLeaderboard, { timeframe: selectedTimeframe });
  const streakLeaderboard = useQuery(api.leaderboards.getStreakLeaderboard, { timeframe: selectedTimeframe });
  const achievementsLeaderboard = useQuery(api.leaderboards.getAchievementsLeaderboard, { timeframe: selectedTimeframe });
  const challengesLeaderboard = useQuery(api.leaderboards.getChallengesLeaderboard, { timeframe: selectedTimeframe });

  const getLeaderboardData = () => {
    switch (selectedCategory) {
      case 'exercise':
        return exerciseLeaderboard;
      case 'streak':
        return streakLeaderboard;
      case 'achievements':
        return achievementsLeaderboard;
      case 'challenges':
        return challengesLeaderboard;
      default:
        return exerciseLeaderboard;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise':
        return <TrendingUp className="w-5 h-5" />;
      case 'streak':
        return <Award className="w-5 h-5" />;
      case 'achievements':
        return <Medal className="w-5 h-5" />;
      case 'challenges':
        return <Trophy className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'exercise':
        return 'Exercise Minutes';
      case 'streak':
        return 'Longest Streaks';
      case 'achievements':
        return 'Achievement Points';
      case 'challenges':
        return 'Challenge Wins';
      default:
        return 'Exercise Minutes';
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'allTime':
        return 'All Time';
      default:
        return 'This Week';
    }
  };

  const leaderboardData = getLeaderboardData();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Leaderboards</h1>
          <p className="text-gray-400">See how you rank against other fitness enthusiasts</p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {[
            { key: 'exercise', label: 'Exercise', icon: <TrendingUp className="w-4 h-4" /> },
            { key: 'streak', label: 'Streaks', icon: <Award className="w-4 h-4" /> },
            { key: 'achievements', label: 'Achievements', icon: <Medal className="w-4 h-4" /> },
            { key: 'challenges', label: 'Challenges', icon: <Trophy className="w-4 h-4" /> }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Timeframe Selection */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {[
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'allTime', label: 'All Time' }
          ].map((timeframe) => (
            <button
              key={timeframe.key}
              onClick={() => setSelectedTimeframe(timeframe.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              {getCategoryIcon(selectedCategory)}
              <span>{getCategoryTitle(selectedCategory)}</span>
            </h2>
            <span className="text-sm text-gray-400">{getTimeframeLabel(selectedTimeframe)}</span>
          </div>

          {leaderboardData && leaderboardData.length > 0 ? (
            <div className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    index === 1 ? 'bg-gray-400/10 border border-gray-400/20' :
                    index === 2 ? 'bg-orange-500/10 border border-orange-500/20' :
                    'bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-sm font-bold">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{entry.userName || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-400">Level {entry.userLevel || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-400">
                      {selectedCategory === 'exercise' && `${entry.totalMinutes || 0} min`}
                      {selectedCategory === 'streak' && `${entry.currentStreak || 0} days`}
                      {selectedCategory === 'achievements' && `${entry.achievementPoints || 0} pts`}
                      {selectedCategory === 'challenges' && `${entry.challengeWins || 0} wins`}
                    </div>
                    {index < 3 && (
                      <div className="text-xs text-gray-400">
                        {index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No data available for this category and timeframe</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Your Rank</h3>
            <p className="text-2xl font-bold text-orange-400">
              {leaderboardData?.findIndex(entry => entry.isCurrentUser) + 1 || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Participants</h3>
            <p className="text-2xl font-bold text-white">
              {leaderboardData?.length || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Your Score</h3>
            <p className="text-2xl font-bold text-green-400">
              {leaderboardData?.find(entry => entry.isCurrentUser)?.totalMinutes || 
               leaderboardData?.find(entry => entry.isCurrentUser)?.currentStreak ||
               leaderboardData?.find(entry => entry.isCurrentUser)?.achievementPoints ||
               leaderboardData?.find(entry => entry.isCurrentUser)?.challengeWins || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 