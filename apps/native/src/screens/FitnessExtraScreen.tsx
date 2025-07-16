import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const FitnessExtraScreen = ({ navigation }) => {
  const logs = useQuery(api.fitness.getFitnessLogs);
  const stats = useQuery(api.fitness.getFitnessStats);
  const healthInsights = useQuery(api.fitness.getHealthInsights);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [avatarMode, setAvatarMode] = useState('body'); // body, muscle, hydration

  // Calculate avatar parameters based on user data
  const getAvatarParams = () => {
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

  const defaultAvatarParams = {
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

  const avatarParams = getAvatarParams();

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' };
    return { category: 'Obese', color: '#EF4444' };
  };

  const getMuscleLevel = (definition) => {
    if (definition < 20) return { level: 'Beginner', icon: '💪', color: '#6B7280' };
    if (definition < 50) return { level: 'Intermediate', icon: '💪', color: '#F59E0B' };
    if (definition < 80) return { level: 'Advanced', icon: '💪', color: '#F97316' };
    return { level: 'Elite', icon: '💪', color: '#EF4444' };
  };

  const getHydrationStatus = (level) => {
    if (level < 50) return { status: 'Dehydrated', icon: '💧', color: '#EF4444' };
    if (level < 80) return { status: 'Moderate', icon: '💧', color: '#F59E0B' };
    return { status: 'Well Hydrated', icon: '💧', color: '#10B981' };
  };

  const renderAdaptiveAvatar = () => {
    const { bodyWidth, muscleDefinition, hydrationLevel, energyLevel, avgSleep, avgMood } = avatarParams;
    
    return (
      <View style={styles.avatarContainer}>
        <Svg width={width * 0.8} height={400} style={styles.avatarSvg}>
          <Defs>
            <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
            </LinearGradient>
            <LinearGradient id="muscleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
            </LinearGradient>
            <LinearGradient id="hydrationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.6" />
            </LinearGradient>
            <LinearGradient id="radiantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FCD34D" stopOpacity="0.6" />
              <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
            </LinearGradient>
            <LinearGradient id="tiredGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6B7280" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#4B5563" stopOpacity="0.6" />
            </LinearGradient>
          </Defs>
          
          {/* Head */}
          <Circle
            cx={width * 0.4}
            cy={80}
            r={25}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <Circle
            cx={width * 0.4 - 8}
            cy={75}
            r={3}
            fill="#FFFFFF"
            opacity={avgMood > 3 ? 1 : 0.7}
          />
          <Circle
            cx={width * 0.4 + 8}
            cy={75}
            r={3}
            fill="#FFFFFF"
            opacity={avgMood > 3 ? 1 : 0.7}
          />
          
          {/* Dark circles under eyes (poor sleep) */}
          {avgSleep < 6 && (
            <>
              <Circle
                cx={width * 0.4 - 8}
                cy={79}
                r={4}
                fill="#1F2937"
                opacity="0.6"
              />
              <Circle
                cx={width * 0.4 + 8}
                cy={79}
                r={4}
                fill="#1F2937"
                opacity="0.6"
              />
            </>
          )}
          
          {/* Radiant glow (good hydration) */}
          {hydrationLevel > 80 && (
            <Circle
              cx={width * 0.4}
              cy={80}
              r={35}
              fill="url(#radiantGradient)"
              opacity="0.3"
            />
          )}
          
          {/* Body */}
          <Rect
            x={width * 0.4 - bodyWidth / 2}
            y={105}
            width={bodyWidth}
            height={120}
            rx={bodyWidth / 4}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Arms with muscle definition */}
          <Rect
            x={width * 0.4 - bodyWidth / 2 - 15}
            y={115}
            width={15 + (muscleDefinition > 50 ? 3 : 0)}
            height={80}
            rx={7.5 + (muscleDefinition > 50 ? 2 : 0)}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          <Rect
            x={width * 0.4 + bodyWidth / 2}
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
              <Path
                d={`M ${width * 0.4 - bodyWidth / 3} 115 Q ${width * 0.4} 125 ${width * 0.4 + bodyWidth / 3} 115`}
                stroke="url(#muscleGradient)"
                strokeWidth={muscleDefinition / 15}
                fill="none"
                opacity={muscleDefinition / 100}
              />
              <Path
                d={`M ${width * 0.4 - bodyWidth / 4} 125 Q ${width * 0.4} 135 ${width * 0.4 + bodyWidth / 4} 125`}
                stroke="url(#muscleGradient)"
                strokeWidth={muscleDefinition / 20}
                fill="none"
                opacity={muscleDefinition / 100}
              />
            </>
          )}
          
          {/* Legs */}
          <Rect
            x={width * 0.4 - bodyWidth / 3}
            y={225}
            width={bodyWidth / 3}
            height={100}
            rx={bodyWidth / 6}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          <Rect
            x={width * 0.4}
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
            <Path
              d={`M ${width * 0.4 - bodyWidth / 2} 140 Q ${width * 0.4} 130 ${width * 0.4 + bodyWidth / 2} 140`}
              stroke="url(#hydrationGradient)"
              strokeWidth="3"
              fill="none"
              opacity={hydrationLevel / 100}
            />
          )}
          {hydrationLevel > 80 && (
            <Path
              d={`M ${width * 0.4 - bodyWidth / 2 + 5} 150 Q ${width * 0.4} 140 ${width * 0.4 + bodyWidth / 2 - 5} 150`}
              stroke="url(#hydrationGradient)"
              strokeWidth="2"
              fill="none"
              opacity={hydrationLevel / 100}
            />
          )}
          
          {/* Energy aura (good sleep + mood) */}
          {energyLevel > 70 && (
            <Circle
              cx={width * 0.4}
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
          <Path
            d={avgMood > 3 
              ? `M ${width * 0.4 - 8} 85 Q ${width * 0.4} 95 ${width * 0.4 + 8} 85` // Smile
              : `M ${width * 0.4 - 8} 95 Q ${width * 0.4} 85 ${width * 0.4 + 8} 95` // Frown
            }
            stroke="#374151"
            strokeWidth="2"
            fill="none"
            opacity={0.8}
          />
          
          {/* Sweat drops (intense exercise) */}
          {muscleDefinition > 70 && (
            <>
              <Circle
                cx={width * 0.4 - 15}
                cy={70}
                r={2}
                fill="#3B82F6"
                opacity="0.7"
              />
              <Circle
                cx={width * 0.4 + 15}
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
              <Circle
                cx={width * 0.4 - 20}
                cy={60}
                r={1.5}
                fill="#FCD34D"
                opacity="0.8"
              />
              <Circle
                cx={width * 0.4 + 20}
                cy={65}
                r={1}
                fill="#FCD34D"
                opacity="0.8"
              />
              <Circle
                cx={width * 0.4 - 25}
                cy={75}
                r={1.2}
                fill="#FCD34D"
                opacity="0.8"
              />
            </>
          )}
        </Svg>
        
        {/* Avatar stats overlay */}
        <View style={styles.avatarStats}>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{avatarParams.bmi.toFixed(1)}</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{Math.round(avatarParams.recentExercise)}m</Text>
            <Text style={styles.statLabel}>Exercise</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{Math.round(avatarParams.avgWater)}ml</Text>
            <Text style={styles.statLabel}>Water</Text>
          </View>
        </View>
        
        {/* Visual effects legend */}
        <View style={styles.effectsLegend}>
          <Text style={styles.legendTitle}>Avatar Effects:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>Hydration waves</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Muscle definition</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Energy aura</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FCD34D' }]} />
              <Text style={styles.legendText}>Radiant glow</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerLogo}>
            <Text style={styles.headerLogoText}>DF</Text>
          </View>
          <Text style={styles.headerTitle}>DailyForm</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Adaptive Avatar Section */}
      <View style={styles.avatarSection}>
        <Text style={styles.sectionTitle}>Your Adaptive Avatar</Text>
        <Text style={styles.sectionSubtitle}>
          Your avatar reflects your real fitness data and progress
        </Text>
        
        {renderAdaptiveAvatar()}
        
        {/* Avatar Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={[styles.modeButton, avatarMode === 'body' && styles.modeButtonActive]}
            onPress={() => setAvatarMode('body')}
          >
            <Ionicons name="body" size={20} color={avatarMode === 'body' ? '#F97316' : '#9CA3AF'} />
            <Text style={[styles.modeText, avatarMode === 'body' && styles.modeTextActive]}>Body</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, avatarMode === 'muscle' && styles.modeButtonActive]}
            onPress={() => setAvatarMode('muscle')}
          >
            <FontAwesome5 name="dumbbell" size={20} color={avatarMode === 'muscle' ? '#F97316' : '#9CA3AF'} />
            <Text style={[styles.modeText, avatarMode === 'muscle' && styles.modeTextActive]}>Muscle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, avatarMode === 'hydration' && styles.modeButtonActive]}
            onPress={() => setAvatarMode('hydration')}
          >
            <MaterialCommunityIcons name="cup-water" size={20} color={avatarMode === 'hydration' ? '#F97316' : '#9CA3AF'} />
            <Text style={[styles.modeText, avatarMode === 'hydration' && styles.modeTextActive]}>Hydration</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar Analysis */}
      <View style={styles.analysisSection}>
        <Text style={styles.sectionTitle}>Avatar Analysis</Text>
        
        <View style={styles.analysisGrid}>
          {/* BMI Analysis */}
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Text style={styles.analysisIcon}>📊</Text>
              <Text style={styles.analysisTitle}>BMI Status</Text>
            </View>
            <Text style={[styles.analysisValue, { color: getBMICategory(avatarParams.bmi).color }]}>
              {avatarParams.bmi.toFixed(1)}
            </Text>
            <Text style={styles.analysisLabel}>
              {getBMICategory(avatarParams.bmi).category}
            </Text>
            <Text style={styles.analysisDetails}>
              {avatarParams.height}cm • {avatarParams.weight}kg
            </Text>
          </View>

          {/* Muscle Analysis */}
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Text style={styles.analysisIcon}>{getMuscleLevel(avatarParams.muscleDefinition).icon}</Text>
              <Text style={styles.analysisTitle}>Muscle Level</Text>
            </View>
            <Text style={[styles.analysisValue, { color: getMuscleLevel(avatarParams.muscleDefinition).color }]}>
              {Math.round(avatarParams.muscleDefinition)}%
            </Text>
            <Text style={styles.analysisLabel}>
              {getMuscleLevel(avatarParams.muscleDefinition).level}
            </Text>
            <Text style={styles.analysisDetails}>
              {Math.round(avatarParams.recentExercise)}m this week
            </Text>
          </View>

          {/* Hydration Analysis */}
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Text style={styles.analysisIcon}>{getHydrationStatus(avatarParams.hydrationLevel).icon}</Text>
              <Text style={styles.analysisTitle}>Hydration</Text>
            </View>
            <Text style={[styles.analysisValue, { color: getHydrationStatus(avatarParams.hydrationLevel).color }]}>
              {Math.round(avatarParams.hydrationLevel)}%
            </Text>
            <Text style={styles.analysisLabel}>
              {getHydrationStatus(avatarParams.hydrationLevel).status}
            </Text>
            <Text style={styles.analysisDetails}>
              {Math.round(avatarParams.avgWater)}ml daily avg
            </Text>
          </View>

          {/* Energy Analysis */}
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Text style={styles.analysisIcon}>⚡</Text>
              <Text style={styles.analysisTitle}>Energy Level</Text>
            </View>
            <Text style={[styles.analysisValue, { color: avatarParams.energyLevel > 70 ? '#10B981' : '#F59E0B' }]}>
              {Math.round(avatarParams.energyLevel)}%
            </Text>
            <Text style={styles.analysisLabel}>
              {avatarParams.energyLevel > 70 ? 'High' : avatarParams.energyLevel > 50 ? 'Moderate' : 'Low'}
            </Text>
            <Text style={styles.analysisDetails}>
              {avatarParams.avgSleep.toFixed(1)}h sleep • {avatarParams.avgMood.toFixed(1)}/5 mood
            </Text>
          </View>
        </View>
      </View>

      {/* Avatar Customization Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>How to Improve Your Avatar</Text>
        
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <MaterialCommunityIcons name="weight-lifter" size={20} color="#F97316" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Build Muscle Definition</Text>
              <Text style={styles.tipDescription}>
                Log strength training exercises to increase muscle definition in your avatar
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <MaterialCommunityIcons name="cup-water" size={20} color="#3B82F6" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipDescription}>
                Drink 2L+ of water daily to see hydration effects in your avatar
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <MaterialCommunityIcons name="sleep" size={20} color="#10B981" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Optimize Sleep & Mood</Text>
              <Text style={styles.tipDescription}>
                Get 7-9 hours of sleep and maintain good mood for energy aura
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <MaterialCommunityIcons name="scale-balance" size={20} color="#F59E0B" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Balance Your BMI</Text>
              <Text style={styles.tipDescription}>
                Maintain a healthy BMI range for optimal avatar proportions
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeSection}>
        <Text style={styles.sectionTitle}>Data Timeframe</Text>
        <View style={styles.timeframeSelector}>
          {['week', 'month', 'year'].map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[styles.timeframeButton, selectedTimeframe === timeframe && styles.timeframeButtonActive]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text style={[styles.timeframeText, selectedTimeframe === timeframe && styles.timeframeTextActive]}>
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#111827',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    backgroundColor: '#F97316',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarSection: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarSvg: {
    alignSelf: 'center',
  },
  avatarStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  modeButtonActive: {
    backgroundColor: '#374151',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginLeft: 8,
  },
  modeTextActive: {
    color: '#F97316',
  },
  analysisSection: {
    padding: 20,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analysisCard: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  analysisValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  analysisLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  analysisDetails: {
    fontSize: 10,
    color: '#6B7280',
  },
  tipsSection: {
    padding: 20,
  },
  tipsList: {
    marginTop: 16,
  },
  tipItem: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tipIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#374151',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  timeframeSection: {
    padding: 20,
    paddingBottom: 40,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#374151',
    marginTop: 16,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  timeframeButtonActive: {
    backgroundColor: '#374151',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  timeframeTextActive: {
    color: '#F97316',
  },
  effectsLegend: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default FitnessExtraScreen; 