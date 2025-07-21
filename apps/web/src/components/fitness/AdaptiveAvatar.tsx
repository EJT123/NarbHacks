"use client";

import React, { useState } from "react";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

interface AvatarParams {
  bodyWidth: number;
  muscleDefinition: number;
  hydrationLevel: number;
  energyLevel: number;
  bmi: number;
  height: number;
  weight: number;
  recentExercise: number;
  avgWater: number;
  avgSleep: number;
  avgMood: number;
}

const defaultAvatarParams: AvatarParams = {
  bodyWidth: 80,
  muscleDefinition: 30,
  hydrationLevel: 50,
  energyLevel: 60,
  bmi: 22,
  height: 170,
  weight: 70,
  recentExercise: 0,
  avgWater: 1500,
  avgSleep: 7,
  avgMood: 3
};

const AdaptiveAvatar = () => {
  const logs = useQuery(api.fitness.getFitnessLogs);
  const [avatarMode, setAvatarMode] = useState<'body' | 'muscle' | 'hydration'>('body');

  // Calculate avatar parameters based on user data
  const getAvatarParams = (): AvatarParams => {
    if (!logs || logs.length === 0) return defaultAvatarParams;

    const latestLog = logs[0];
    const recentLogs = logs.slice(0, 7); // Last 7 days
    
    // BMI calculation
    const heightInMeters = latestLog.height / 100;
    const bmi = latestLog.weight / (heightInMeters * heightInMeters);
    
    // Body width based on BMI
    const bodyWidth = Math.max(60, Math.min(120, 80 + (bmi - 22) * 8));
    
    // Muscle definition based on exercise
    const totalExercise = recentLogs.reduce((sum, log) => sum + log.exerciseDuration, 0);
    const muscleDefinition = Math.min(100, totalExercise / 10); // 0-100 scale
    
    // Hydration level
    const avgWater = recentLogs.reduce((sum, log) => sum + log.water, 0) / recentLogs.length;
    const hydrationLevel = Math.min(100, (avgWater / 2000) * 100);
    
    // Energy level based on sleep and mood
    const avgSleep = recentLogs.reduce((sum, log) => sum + log.sleep, 0) / recentLogs.length;
    const avgMood = recentLogs.reduce((sum, log) => sum + log.mood, 0) / recentLogs.length;
    const energyLevel = Math.min(100, ((avgSleep / 8) + (avgMood / 5)) * 50);

    return {
      bodyWidth,
      muscleDefinition,
      hydrationLevel,
      energyLevel,
      bmi,
      height: latestLog.height,
      weight: latestLog.weight,
      recentExercise: totalExercise,
      avgWater,
      avgSleep,
      avgMood
    };
  };

  const avatarParams = getAvatarParams();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' };
    return { category: 'Obese', color: '#EF4444' };
  };

  const getMuscleLevel = (definition: number) => {
    if (definition < 20) return { level: 'Beginner', icon: '💪', color: '#6B7280' };
    if (definition < 50) return { level: 'Intermediate', icon: '💪', color: '#F59E0B' };
    if (definition < 80) return { level: 'Advanced', icon: '💪', color: '#F97316' };
    return { level: 'Elite', icon: '💪', color: '#EF4444' };
  };

  const getHydrationStatus = (level: number) => {
    if (level < 50) return { status: 'Dehydrated', icon: '💧', color: '#EF4444' };
    if (level < 80) return { status: 'Moderate', icon: '💧', color: '#F59E0B' };
    return { status: 'Well Hydrated', icon: '💧', color: '#10B981' };
  };

  const renderAvatar = () => {
    const { bodyWidth, muscleDefinition, hydrationLevel, energyLevel, avgSleep, avgMood, bmi } = avatarParams;
    const centerX = 200;
    
    return (
      <div className="relative w-full max-w-md mx-auto">
        <svg width="400" height="400" className="w-full h-auto">
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="hydrationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="radiantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="tiredGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6B7280" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4B5563" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Head */}
          <circle
            cx={centerX}
            cy={80}
            r={25}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <circle
            cx={centerX - 8}
            cy={75}
            r={3}
            fill="#FFFFFF"
            opacity={avgMood > 3 ? 1 : 0.7}
          />
          <circle
            cx={centerX + 8}
            cy={75}
            r={3}
            fill="#FFFFFF"
            opacity={avgMood > 3 ? 1 : 0.7}
          />
          
          {/* Dark circles under eyes (poor sleep) */}
          {avgSleep < 6 && (
            <>
              <circle
                cx={centerX - 8}
                cy={79}
                r={4}
                fill="#1F2937"
                opacity="0.6"
              />
              <circle
                cx={centerX + 8}
                cy={79}
                r={4}
                fill="#1F2937"
                opacity="0.6"
              />
            </>
          )}
          
          {/* Radiant glow (good hydration) */}
          {hydrationLevel > 80 && (
            <circle
              cx={centerX}
              cy={80}
              r={35}
              fill="url(#radiantGradient)"
              opacity="0.3"
            />
          )}
          
          {/* Body */}
          <rect
            x={centerX - bodyWidth / 2}
            y={105}
            width={bodyWidth}
            height={120}
            rx={bodyWidth / 4}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Arms with muscle definition */}
          <rect
            x={centerX - bodyWidth / 2 - 15}
            y={115}
            width={15 + (muscleDefinition > 50 ? 3 : 0)}
            height={80}
            rx={7.5 + (muscleDefinition > 50 ? 2 : 0)}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          <rect
            x={centerX + bodyWidth / 2}
            y={115}
            width={15 + (muscleDefinition > 50 ? 3 : 0)}
            height={80}
            rx={7.5 + (muscleDefinition > 50 ? 2 : 0)}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Chest muscles (from exercise) */}
          {muscleDefinition > 40 && (
            <>
              <path
                d={`M ${centerX - bodyWidth / 3} 115 Q ${centerX} 125 ${centerX + bodyWidth / 3} 115`}
                stroke="url(#muscleGradient)"
                strokeWidth={muscleDefinition / 15}
                fill="none"
                opacity={muscleDefinition / 100}
              />
              <path
                d={`M ${centerX - bodyWidth / 4} 125 Q ${centerX} 135 ${centerX + bodyWidth / 4} 125`}
                stroke="url(#muscleGradient)"
                strokeWidth={muscleDefinition / 20}
                fill="none"
                opacity={muscleDefinition / 100}
              />
            </>
          )}
          
          {/* Legs */}
          <rect
            x={centerX - bodyWidth / 3}
            y={225}
            width={bodyWidth / 3}
            height={100}
            rx={bodyWidth / 6}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          <rect
            x={centerX}
            y={225}
            width={bodyWidth / 3}
            height={100}
            rx={bodyWidth / 6}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Hydration waves (multiple levels) */}
          {hydrationLevel > 60 && (
            <path
              d={`M ${centerX - bodyWidth / 2} 140 Q ${centerX} 130 ${centerX + bodyWidth / 2} 140`}
              stroke="url(#hydrationGradient)"
              strokeWidth="3"
              fill="none"
              opacity={hydrationLevel / 100}
            />
          )}
          {hydrationLevel > 80 && (
            <path
              d={`M ${centerX - bodyWidth / 2 + 5} 150 Q ${centerX} 140 ${centerX + bodyWidth / 2 - 5} 150`}
              stroke="url(#hydrationGradient)"
              strokeWidth="2"
              fill="none"
              opacity={hydrationLevel / 100}
            />
          )}
          
          {/* Energy aura (good sleep + mood) */}
          {energyLevel > 70 && (
            <circle
              cx={centerX}
              cy={160}
              r={bodyWidth / 2 + 20}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              opacity={energyLevel / 100}
              strokeDasharray="5,5"
            />
          )}
          
          {/* Mood indicator (smile/frown) */}
          <path
            d={avgMood > 3 
              ? `M ${centerX - 8} 85 Q ${centerX} 95 ${centerX + 8} 85` // Smile
              : `M ${centerX - 8} 95 Q ${centerX} 85 ${centerX + 8} 95` // Frown
            }
            stroke="#374151"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          
          {/* Sweat drops (intense exercise) */}
          {muscleDefinition > 70 && (
            <>
              <circle
                cx={centerX - 15}
                cy={70}
                r={2}
                fill="#3B82F6"
                opacity="0.7"
              />
              <circle
                cx={centerX + 15}
                cy={70}
                r={2}
                fill="#3B82F6"
                opacity="0.7"
              />
            </>
          )}
          
          {/* Sparkles (excellent hydration) */}
          {hydrationLevel > 90 && (
            <>
              <circle
                cx={centerX - 20}
                cy={60}
                r={1.5}
                fill="#FCD34D"
                opacity="0.8"
              />
              <circle
                cx={centerX + 20}
                cy={65}
                r={1}
                fill="#FCD34D"
                opacity="0.8"
              />
              <circle
                cx={centerX - 25}
                cy={75}
                r={1.2}
                fill="#FCD34D"
                opacity="0.8"
              />
            </>
          )}
        </svg>
        
        {/* Avatar stats overlay */}
        <div className="flex justify-around mt-6">
          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-center">
            <div className="text-lg font-bold text-orange-400">{avatarParams.bmi.toFixed(1)}</div>
            <div className="text-xs text-gray-400">BMI</div>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-center">
            <div className="text-lg font-bold text-orange-400">{Math.round(avatarParams.recentExercise)}m</div>
            <div className="text-xs text-gray-400">Exercise</div>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-center">
            <div className="text-lg font-bold text-orange-400">{Math.round(avatarParams.avgWater)}ml</div>
            <div className="text-xs text-gray-400">Water</div>
          </div>
        </div>
        
        {/* Visual effects legend */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-white mb-3">Avatar Effects:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Hydration waves</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Muscle definition</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Energy aura</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Radiant glow</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Your Adaptive Avatar</h3>
        <p className="text-gray-400 text-sm">
          Your avatar reflects your real fitness data and progress
        </p>
      </div>
      
      {renderAvatar()}
      
      {/* Avatar Mode Selector */}
      <div className="flex bg-gray-700 rounded-lg p-1 mt-6">
        {[
          { key: 'body', label: 'Body', icon: '👤' },
          { key: 'muscle', label: 'Muscle', icon: '💪' },
          { key: 'hydration', label: 'Hydration', icon: '💧' }
        ].map((mode) => (
          <button
            key={mode.key}
            onClick={() => setAvatarMode(mode.key as any)}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
              avatarMode === mode.key
                ? 'bg-gray-600 text-orange-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="mr-2">{mode.icon}</span>
            <span className="text-sm font-medium">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Avatar Analysis */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">Avatar Analysis</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* BMI Analysis */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">📊</span>
              <span className="text-sm font-medium text-white">BMI Status</span>
            </div>
            <div className={`text-2xl font-bold mb-1`} style={{ color: getBMICategory(avatarParams.bmi).color }}>
              {avatarParams.bmi.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400 mb-1">
              {getBMICategory(avatarParams.bmi).category}
            </div>
            <div className="text-xs text-gray-500">
              {avatarParams.height}cm • {avatarParams.weight}kg
            </div>
          </div>

          {/* Muscle Analysis */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{getMuscleLevel(avatarParams.muscleDefinition).icon}</span>
              <span className="text-sm font-medium text-white">Muscle Level</span>
            </div>
            <div className={`text-2xl font-bold mb-1`} style={{ color: getMuscleLevel(avatarParams.muscleDefinition).color }}>
              {Math.round(avatarParams.muscleDefinition)}%
            </div>
            <div className="text-xs text-gray-400 mb-1">
              {getMuscleLevel(avatarParams.muscleDefinition).level}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(avatarParams.recentExercise)}m this week
            </div>
          </div>

          {/* Hydration Analysis */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{getHydrationStatus(avatarParams.hydrationLevel).icon}</span>
              <span className="text-sm font-medium text-white">Hydration</span>
            </div>
            <div className={`text-2xl font-bold mb-1`} style={{ color: getHydrationStatus(avatarParams.hydrationLevel).color }}>
              {Math.round(avatarParams.hydrationLevel)}%
            </div>
            <div className="text-xs text-gray-400 mb-1">
              {getHydrationStatus(avatarParams.hydrationLevel).status}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(avatarParams.avgWater)}ml daily avg
            </div>
          </div>

          {/* Energy Analysis */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">⚡</span>
              <span className="text-sm font-medium text-white">Energy Level</span>
            </div>
            <div className={`text-2xl font-bold mb-1`} style={{ color: avatarParams.energyLevel > 70 ? '#10B981' : '#F59E0B' }}>
              {Math.round(avatarParams.energyLevel)}%
            </div>
            <div className="text-xs text-gray-400 mb-1">
              {avatarParams.energyLevel > 70 ? 'High' : avatarParams.energyLevel > 50 ? 'Moderate' : 'Low'}
            </div>
            <div className="text-xs text-gray-500">
              {avatarParams.avgSleep.toFixed(1)}h sleep • {avatarParams.avgMood.toFixed(1)}/5 mood
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">How to Improve Your Avatar</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-orange-400 text-sm">💪</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Build Muscle Definition</div>
              <div className="text-xs text-gray-400">Log strength training exercises to increase muscle definition</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-blue-400 text-sm">💧</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Stay Hydrated</div>
              <div className="text-xs text-gray-400">Drink 2L+ of water daily to see hydration effects</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-green-400 text-sm">😴</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Optimize Sleep & Mood</div>
              <div className="text-xs text-gray-400">Get 7-9 hours of sleep and maintain good mood for energy aura</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveAvatar; 