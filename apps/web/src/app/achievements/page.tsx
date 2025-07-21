'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Badge, Star, Target, Zap, Heart, Calendar, TrendingUp } from 'lucide-react';

export default function AchievementsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'inProgress'>('all');

  // Queries
  const userAchievements = useQuery(api.achievements.getUserAchievements);
  const allAchievements = useQuery(api.achievements.getAllAchievements);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Calendar className="w-6 h-6" />;
      case 'exercise':
        return <Zap className="w-6 h-6" />;
      case 'goal':
        return <Target className="w-6 h-6" />;
      case 'social':
        return <Heart className="w-6 h-6" />;
      case 'milestone':
        return <Star className="w-6 h-6" />;
      default:
        return <Badge className="w-6 h-6" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'streak':
        return 'text-blue-400';
      case 'exercise':
        return 'text-green-400';
      case 'goal':
        return 'text-purple-400';
      case 'social':
        return 'text-pink-400';
      case 'milestone':
        return 'text-yellow-400';
      default:
        return 'text-orange-400';
    }
  };

  const getAchievementBgColor = (type: string) => {
    switch (type) {
      case 'streak':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'exercise':
        return 'bg-green-500/10 border-green-500/20';
      case 'goal':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'social':
        return 'bg-pink-500/10 border-pink-500/20';
      case 'milestone':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-orange-500/10 border-orange-500/20';
    }
  };

  const filteredAchievements = allAchievements?.filter(achievement => {
    if (selectedFilter === 'completed') {
      return userAchievements?.some(ua => ua.achievementId === achievement._id && ua.completed);
    } else if (selectedFilter === 'inProgress') {
      return userAchievements?.some(ua => ua.achievementId === achievement._id && !ua.completed);
    }
    return true;
  });

  const completedCount = userAchievements?.filter(ua => ua.completed).length || 0;
  const totalCount = allAchievements?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Achievements</h1>
          <p className="text-gray-400">Unlock badges and track your progress</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress Overview</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">{completedCount}/{totalCount}</div>
              <div className="text-sm text-gray-400">Achievements Unlocked</div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>0%</span>
            <span>{Math.round(progressPercentage)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {[
            { key: 'all', label: 'All', count: totalCount },
            { key: 'completed', label: 'Completed', count: completedCount },
            { key: 'inProgress', label: 'In Progress', count: totalCount - completedCount }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements?.map((achievement) => {
            const userAchievement = userAchievements?.find(ua => ua.achievementId === achievement._id);
            const isCompleted = userAchievement?.completed || false;
            const progress = userAchievement?.progress || 0;
            const progressPercentage = (progress / achievement.target) * 100;

            return (
              <div
                key={achievement._id}
                className={`bg-gray-800 rounded-lg p-6 border transition-all duration-300 ${
                  isCompleted 
                    ? `${getAchievementBgColor(achievement.type)} border-2` 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${isCompleted ? getAchievementBgColor(achievement.type) : 'bg-gray-700'}`}>
                    {getAchievementIcon(achievement.type)}
                  </div>
                  {isCompleted && (
                    <div className="text-yellow-400">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className={isCompleted ? 'text-green-400' : 'text-gray-400'}>
                      {Math.min(progress, achievement.target)}/{achievement.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-400">Reward: </span>
                    <span className={`font-semibold ${getAchievementColor(achievement.type)}`}>
                      {achievement.points} points
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      Completed
                    </div>
                  )}
                </div>

                {/* Completion Date */}
                {isCompleted && userAchievement?.completedAt && (
                  <div className="mt-3 text-xs text-gray-500">
                    Completed on {new Date(userAchievement.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{completedCount}</div>
            <div className="text-sm text-gray-400">Achievements Unlocked</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {userAchievements?.reduce((sum, ua) => sum + (ua.completed ? ua.achievement.points : 0), 0) || 0}
            </div>
            <div className="text-sm text-gray-400">Total Points Earned</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {userAchievements?.filter(ua => ua.achievement.type === 'streak' && ua.completed).length || 0}
            </div>
            <div className="text-sm text-gray-400">Streak Badges</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {userAchievements?.filter(ua => ua.achievement.type === 'milestone' && ua.completed).length || 0}
            </div>
            <div className="text-sm text-gray-400">Milestone Badges</div>
          </div>
        </div>
      </div>
    </div>
  );
} 