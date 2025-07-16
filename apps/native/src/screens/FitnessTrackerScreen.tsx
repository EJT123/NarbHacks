import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Animated, Dimensions } from "react-native";
import { AntDesign, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const FitnessTrackerScreen = ({ navigation }) => {
  const createFitnessLog = useMutation(api.fitness.createFitnessLog);
  const todayLog = useQuery(api.fitness.getFitnessLogByDate, { date: getTodayKey() });
  const logs = useQuery(api.fitness.getFitnessLogs);
  const stats = useQuery(api.fitness.getFitnessStats);

  // Animation values
  const [waterAnimation] = useState(new Animated.Value(1));
  const [sleepAnimation] = useState(new Animated.Value(1));
  const [moodAnimation] = useState(new Animated.Value(1));
  const [exerciseAnimation] = useState(new Animated.Value(1));
  const [avatarAnimation] = useState(new Animated.Value(1));

  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [mood, setMood] = useState(3);
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  // Load existing data when component mounts
  useEffect(() => {
    if (todayLog) {
      setWater(todayLog.water);
      setSleep(todayLog.sleep);
      setMood(todayLog.mood);
      setExerciseType(todayLog.exerciseType);
      setExerciseDuration(todayLog.exerciseDuration);
    }
  }, [todayLog]);

  // Animation functions
  const animateLog = (animationValue, callback) => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const animateAvatar = () => {
    Animated.sequence([
      Animated.timing(avatarAnimation, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(avatarAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleWaterLog = async (amount) => {
    const newWater = water + amount;
    setWater(newWater);
    animateLog(waterAnimation, () => {
      animateAvatar();
    });
    
    try {
      await createFitnessLog({
        date: getTodayKey(),
        water: newWater,
        sleep: sleep,
        mood: mood,
        exerciseType: exerciseType,
        exerciseDuration: exerciseDuration,
        height: 170, // Default values
        weight: 70,
        useMetric: true,
      });
    } catch (error) {
      console.error('Error updating water:', error);
    }
  };

  const handleSleepLog = async (hours) => {
    setSleep(hours);
    animateLog(sleepAnimation, () => {
      animateAvatar();
    });
    
    try {
      await createFitnessLog({
        date: getTodayKey(),
        water: water,
        sleep: hours,
        mood: mood,
        exerciseType: exerciseType,
        exerciseDuration: exerciseDuration,
        height: 170,
        weight: 70,
        useMetric: true,
      });
    } catch (error) {
      console.error('Error updating sleep:', error);
    }
  };

  const handleMoodLog = async (moodValue) => {
    setMood(moodValue);
    animateLog(moodAnimation, () => {
      animateAvatar();
    });
    
    try {
      await createFitnessLog({
        date: getTodayKey(),
        water: water,
        sleep: sleep,
        mood: moodValue,
        exerciseType: exerciseType,
        exerciseDuration: exerciseDuration,
        height: 170,
        weight: 70,
        useMetric: true,
      });
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  const handleExerciseLog = async () => {
    if (!exerciseType.trim() || exerciseDuration <= 0) {
      Alert.alert("Missing Information", "Please enter exercise type and duration.");
      return;
    }

    animateLog(exerciseAnimation, () => {
      animateAvatar();
    });
    
    try {
      await createFitnessLog({
        date: getTodayKey(),
        water: water,
        sleep: sleep,
        mood: mood,
        exerciseType: exerciseType.trim(),
        exerciseDuration: exerciseDuration,
        height: 170,
        weight: 70,
        useMetric: true,
      });
      
      Alert.alert("Exercise Logged!", `Great job! You've logged ${exerciseDuration} minutes of ${exerciseType}.`);
      setExerciseType("");
      setExerciseDuration(0);
    } catch (error) {
      console.error('Error logging exercise:', error);
    }
  };

  const renderAnimatedAvatar = () => {
    const { bodyWidth, muscleDefinition, hydrationLevel, energyLevel, avgSleep, avgMood } = getAvatarParams();
    
    return (
      <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarAnimation }] }]}>
        <Svg width={width * 0.7} height={350} style={styles.avatarSvg}>
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
            cx={width * 0.35}
            cy={70}
            r={22}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <Circle
            cx={width * 0.35 - 7}
            cy={65}
            r={3}
            fill="#FFFFFF"
            opacity={avgMood > 3 ? 1 : 0.7}
          />
          <Circle
            cx={width * 0.35 + 7}
            cy={65}
            r={3}
            fill="#FFFFFF"
            opacity={avgMood > 3 ? 1 : 0.7}
          />
          
          {/* Dark circles under eyes (poor sleep) */}
          {avgSleep < 6 && (
            <>
              <Circle
                cx={width * 0.35 - 7}
                cy={69}
                r={4}
                fill="#1F2937"
                opacity="0.6"
              />
              <Circle
                cx={width * 0.35 + 7}
                cy={69}
                r={4}
                fill="#1F2937"
                opacity="0.6"
              />
            </>
          )}
          
          {/* Radiant glow (good hydration) */}
          {hydrationLevel > 80 && (
            <Circle
              cx={width * 0.35}
              cy={70}
              r={32}
              fill="url(#radiantGradient)"
              opacity="0.3"
            />
          )}
          
          {/* Body */}
          <Rect
            x={width * 0.35 - bodyWidth / 2}
            y={92}
            width={bodyWidth}
            height={110}
            rx={bodyWidth / 4}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Arms with muscle definition */}
          <Rect
            x={width * 0.35 - bodyWidth / 2 - 14}
            y={102}
            width={14 + (muscleDefinition > 50 ? 3 : 0)}
            height={75}
            rx={7 + (muscleDefinition > 50 ? 2 : 0)}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          <Rect
            x={width * 0.35 + bodyWidth / 2}
            y={102}
            width={14 + (muscleDefinition > 50 ? 3 : 0)}
            height={75}
            rx={7 + (muscleDefinition > 50 ? 2 : 0)}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Chest muscles (from exercise) */}
          {muscleDefinition > 40 && (
            <>
              <Path
                d={`M ${width * 0.35 - bodyWidth / 3} 102 Q ${width * 0.35} 112 ${width * 0.35 + bodyWidth / 3} 102`}
                stroke="url(#muscleGradient)"
                strokeWidth={muscleDefinition / 15}
                fill="none"
                opacity={muscleDefinition / 100}
              />
              <Path
                d={`M ${width * 0.35 - bodyWidth / 4} 112 Q ${width * 0.35} 122 ${width * 0.35 + bodyWidth / 4} 112`}
                stroke="url(#muscleGradient)"
                strokeWidth={muscleDefinition / 20}
                fill="none"
                opacity={muscleDefinition / 100}
              />
            </>
          )}
          
          {/* Legs */}
          <Rect
            x={width * 0.35 - bodyWidth / 3}
            y={202}
            width={bodyWidth / 3}
            height={90}
            rx={bodyWidth / 6}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          <Rect
            x={width * 0.35}
            y={202}
            width={bodyWidth / 3}
            height={90}
            rx={bodyWidth / 6}
            fill={avgSleep < 6 ? "url(#tiredGradient)" : "url(#bodyGradient)"}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Hydration waves (multiple levels) */}
          {hydrationLevel > 60 && (
            <Path
              d={`M ${width * 0.35 - bodyWidth / 2} 127 Q ${width * 0.35} 117 ${width * 0.35 + bodyWidth / 2} 127`}
              stroke="url(#hydrationGradient)"
              strokeWidth="3"
              fill="none"
              opacity={hydrationLevel / 100}
            />
          )}
          {hydrationLevel > 80 && (
            <Path
              d={`M ${width * 0.35 - bodyWidth / 2 + 5} 137 Q ${width * 0.35} 127 ${width * 0.35 + bodyWidth / 2 - 5} 137`}
              stroke="url(#hydrationGradient)"
              strokeWidth="2"
              fill="none"
              opacity={hydrationLevel / 100}
            />
          )}
          
          {/* Energy aura (good sleep + mood) */}
          {energyLevel > 70 && (
            <Circle
              cx={width * 0.35}
              cy={147}
              r={bodyWidth / 2 + 18}
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
              ? `M ${width * 0.35 - 7} 75 Q ${width * 0.35} 85 ${width * 0.35 + 7} 75` // Smile
              : `M ${width * 0.35 - 7} 85 Q ${width * 0.35} 75 ${width * 0.35 + 7} 85` // Frown
            }
            stroke="#374151"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          
          {/* Sweat drops (intense exercise) */}
          {muscleDefinition > 70 && (
            <>
              <Circle
                cx={width * 0.35 - 13}
                cy={60}
                r={2}
                fill="#3B82F6"
                opacity="0.7"
              />
              <Circle
                cx={width * 0.35 + 13}
                cy={60}
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
                cx={width * 0.35 - 18}
                cy={50}
                r={1.5}
                fill="#FCD34D"
                opacity="0.8"
              />
              <Circle
                cx={width * 0.35 + 18}
                cy={55}
                r={1}
                fill="#FCD34D"
                opacity="0.8"
              />
              <Circle
                cx={width * 0.35 - 23}
                cy={65}
                r={1.2}
                fill="#FCD34D"
                opacity="0.8"
              />
            </>
          )}
        </Svg>
      </Animated.View>
    );
  };

  const getAvatarParams = () => {
    if (!logs || logs.length === 0) return {
      bodyWidth: 80,
      muscleDefinition: 30,
      hydrationLevel: 50,
      energyLevel: 60,
      avgSleep: 7,
      avgMood: 3
    };

    const recentLogs = logs.slice(0, 7);
    const totalExercise = recentLogs.reduce((sum, log) => sum + log.exerciseDuration, 0);
    const muscleDefinition = Math.min(100, totalExercise / 10);
    const avgWater = recentLogs.reduce((sum, log) => sum + log.water, 0) / recentLogs.length;
    const hydrationLevel = Math.min(100, (avgWater / 2000) * 100);
    const avgSleep = recentLogs.reduce((sum, log) => sum + log.sleep, 0) / recentLogs.length;
    const avgMood = recentLogs.reduce((sum, log) => sum + log.mood, 0) / recentLogs.length;
    const energyLevel = Math.min(100, ((avgSleep / 8) + (avgMood / 5)) * 50);

    return {
      bodyWidth: 80,
      muscleDefinition,
      hydrationLevel,
      energyLevel,
      avgSleep,
      avgMood
    };
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
        <TouchableOpacity onPress={() => navigation.navigate('FitnessHistoryScreen')} style={styles.historyButton}>
          <MaterialCommunityIcons name="history" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <Text style={styles.sectionTitle}>Your Avatar Today</Text>
        {renderAnimatedAvatar()}
      </View>

      {/* Quick Log Section */}
      <View style={styles.quickLogSection}>
        <Text style={styles.sectionTitle}>Quick Log</Text>
        
        {/* Water Logging */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <MaterialCommunityIcons name="cup-water" size={24} color="#3B82F6" />
            <Text style={styles.logTitle}>Water Intake</Text>
            <Text style={styles.logValue}>{water}ml</Text>
          </View>
          <View style={styles.quickButtons}>
            <Animated.View style={{ transform: [{ scale: waterAnimation }] }}>
              <TouchableOpacity style={styles.quickButton} onPress={() => handleWaterLog(250)}>
                <Text style={styles.quickButtonText}>+250ml</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: waterAnimation }] }}>
              <TouchableOpacity style={styles.quickButton} onPress={() => handleWaterLog(500)}>
                <Text style={styles.quickButtonText}>+500ml</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: waterAnimation }] }}>
              <TouchableOpacity style={styles.quickButton} onPress={() => handleWaterLog(1000)}>
                <Text style={styles.quickButtonText}>+1L</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Sleep Logging */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <MaterialCommunityIcons name="sleep" size={24} color="#8B5CF6" />
            <Text style={styles.logTitle}>Sleep Hours</Text>
            <Text style={styles.logValue}>{sleep}h</Text>
          </View>
          <View style={styles.quickButtons}>
            {[6, 7, 8, 9].map((hours) => (
              <Animated.View key={hours} style={{ transform: [{ scale: sleepAnimation }] }}>
                <TouchableOpacity 
                  style={[styles.quickButton, sleep === hours && styles.quickButtonActive]} 
                  onPress={() => handleSleepLog(hours)}
                >
                  <Text style={[styles.quickButtonText, sleep === hours && styles.quickButtonTextActive]}>
                    {hours}h
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Mood Logging */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <MaterialCommunityIcons name="emoticon" size={24} color="#10B981" />
            <Text style={styles.logTitle}>Mood</Text>
            <Text style={styles.logValue}>{mood}/5</Text>
          </View>
          <View style={styles.quickButtons}>
            {[1, 2, 3, 4, 5].map((moodValue) => (
              <Animated.View key={moodValue} style={{ transform: [{ scale: moodAnimation }] }}>
                <TouchableOpacity 
                  style={[styles.quickButton, mood === moodValue && styles.quickButtonActive]} 
                  onPress={() => handleMoodLog(moodValue)}
                >
                  <Text style={[styles.quickButtonText, mood === moodValue && styles.quickButtonTextActive]}>
                    {moodValue}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Exercise Logging */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <FontAwesome5 name="dumbbell" size={24} color="#F59E0B" />
            <Text style={styles.logTitle}>Exercise</Text>
            <Text style={styles.logValue}>{exerciseDuration}m</Text>
          </View>
          <View style={styles.exerciseInputs}>
            <TextInput
              style={styles.exerciseInput}
              value={exerciseType}
              onChangeText={setExerciseType}
              placeholder="Exercise type (e.g., Running)"
              placeholderTextColor="#6B7280"
            />
            <TextInput
              style={styles.exerciseInput}
              value={exerciseDuration.toString()}
              onChangeText={(text) => setExerciseDuration(Number(text) || 0)}
              placeholder="Duration (minutes)"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
            <Animated.View style={{ transform: [{ scale: exerciseAnimation }] }}>
              <TouchableOpacity style={styles.logExerciseButton} onPress={handleExerciseLog}>
                <Text style={styles.logExerciseButtonText}>Log Exercise</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Weekly Summary */}
      {stats && (
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>This Week's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="cup-water" size={20} color="#3B82F6" />
              <Text style={styles.summaryValue}>{Math.round(stats.avgWater)}ml</Text>
              <Text style={styles.summaryLabel}>Avg Water</Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="sleep" size={20} color="#8B5CF6" />
              <Text style={styles.summaryValue}>{stats.avgSleep.toFixed(1)}h</Text>
              <Text style={styles.summaryLabel}>Avg Sleep</Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="emoticon" size={20} color="#10B981" />
              <Text style={styles.summaryValue}>{stats.avgMood.toFixed(1)}/5</Text>
              <Text style={styles.summaryLabel}>Avg Mood</Text>
            </View>
            <View style={styles.summaryCard}>
              <FontAwesome5 name="dumbbell" size={20} color="#F59E0B" />
              <Text style={styles.summaryValue}>{Math.round(stats.totalExerciseMinutes)}m</Text>
              <Text style={styles.summaryLabel}>Total Exercise</Text>
            </View>
          </View>
        </View>
      )}

      {/* Advanced Features Button */}
      <View style={styles.bottomButtonSection}>
        <TouchableOpacity 
          onPress={() => {
            console.log("Advanced Features button pressed - navigating to ExtraFeaturesScreen");
            Alert.alert("Button Pressed", "Advanced Features button was pressed!");
            try {
              // Test with a known working screen first
              navigation.navigate('FitnessHistoryScreen');
              // If that works, uncomment the line below:
              // navigation.navigate('ExtraFeaturesScreen');
            } catch (error) {
              console.error("Navigation error:", error);
              Alert.alert("Navigation Error", "Could not navigate to Extra Features screen");
            }
          }} 
          style={styles.advancedFeaturesButton}
        >
          <MaterialCommunityIcons name="star" size={24} color="#fff" />
          <Text style={styles.advancedFeaturesButtonText}>Advanced Features & Analytics</Text>
        </TouchableOpacity>
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

  historyButton: {
    padding: 8,
  },
  avatarSection: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarSvg: {
    alignSelf: 'center',
  },
  quickLogSection: {
    padding: 20,
  },
  logCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  logValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F97316',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  quickButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  quickButtonTextActive: {
    color: '#FFFFFF',
  },
  exerciseInputs: {
    gap: 12,
  },
  exerciseInput: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  logExerciseButton: {
    backgroundColor: '#F97316',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logExerciseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summarySection: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomButtonSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  advancedFeaturesButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EA580C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  advancedFeaturesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FitnessTrackerScreen; 