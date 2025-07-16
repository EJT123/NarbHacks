import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { AntDesign, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const getTodayKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const FitnessTrackerScreen = ({ navigation }) => {
  const createFitnessLog = useMutation(api.fitness.createFitnessLog);
  const todayLog = useQuery(api.fitness.getFitnessLogByDate, { date: getTodayKey() });
  const logs = useQuery(api.fitness.getFitnessLogs);
  const stats = useQuery(api.fitness.getFitnessStats);
  const healthInsights = useQuery(api.fitness.getHealthInsights);
  
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [mood, setMood] = useState(3);
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState(0);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [chest, setChest] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [useMetric, setUseMetric] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    if (todayLog) {
      setWater(todayLog.water);
      setSleep(todayLog.sleep);
      setMood(todayLog.mood);
      setExerciseType(todayLog.exerciseType);
      setExerciseDuration(todayLog.exerciseDuration);
      setHeight(todayLog.height.toString());
      setWeight(todayLog.weight.toString());
      setWaist(todayLog.waist?.toString() || "");
      setHip(todayLog.hip?.toString() || "");
      setChest(todayLog.chest?.toString() || "");
      setBodyFat(todayLog.bodyFat?.toString() || "");
      setUseMetric(todayLog.useMetric);
    }
  }, [todayLog]);

  const handleSubmit = async () => {
    if (!water || !sleep || !exerciseType.trim() || !height || !weight) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createFitnessLog({
        date: getTodayKey(),
        water: Number(water),
        sleep: Number(sleep),
        mood: Number(mood),
        exerciseType: exerciseType.trim(),
        exerciseDuration: Number(exerciseDuration),
        height: Number(height),
        weight: Number(weight),
        waist: waist ? Number(waist) : undefined,
        hip: hip ? Number(hip) : undefined,
        chest: chest ? Number(chest) : undefined,
        bodyFat: bodyFat ? Number(bodyFat) : undefined,
        useMetric,
      });
      
      Alert.alert("Success", "Your fitness data has been saved!");
    } catch (error) {
      Alert.alert("Error", "Could not save your fitness data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return '#3B82F6'; // Blue for underweight
    if (bmi < 25) return '#10B981'; // Green for normal
    if (bmi < 30) return '#F59E0B'; // Yellow for overweight
    return '#EF4444'; // Red for obese
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#111827' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fitness Tracker</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats Overview Cards */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Monthly Average</Text>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Water</Text>
                  <Text style={styles.statValue}>{Math.round(stats.avgWater)}ml</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sleep</Text>
                  <Text style={styles.statValue}>{stats.avgSleep.toFixed(1)}h</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Mood</Text>
                  <Text style={styles.statValue}>{stats.avgMood.toFixed(1)}/5</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Exercise</Text>
                <Text style={[styles.statValue, { color: '#3B82F6', fontSize: 24 }]}>
                  {Math.round(stats.totalExerciseMinutes / 60)}h {stats.totalExerciseMinutes % 60}m
                </Text>
                <Text style={styles.statSubtitle}>Total in 30 days</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Weight Change</Text>
                <Text style={[styles.statValue, { 
                  color: stats.weightChange > 0 ? '#EF4444' : '#10B981',
                  fontSize: 24 
                }]}>
                  {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}kg
                </Text>
                <Text style={styles.statSubtitle}>Last 30 days</Text>
              </View>

              {healthInsights && (
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>BMI Status</Text>
                  <Text style={[styles.statValue, { 
                    color: getBMIColor(healthInsights.bmi),
                    fontSize: 24 
                  }]}>
                    {healthInsights.bmi}
                  </Text>
                  <Text style={styles.statSubtitle}>{healthInsights.bmiCategory}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Unit Toggle */}
        <View style={styles.unitToggleCard}>
          <Text style={styles.unitToggleLabel}>Metric</Text>
          <Switch
            value={!useMetric}
            onValueChange={() => setUseMetric(!useMetric)}
            thumbColor={useMetric ? '#F97316' : '#fff'}
            trackColor={{ false: '#374151', true: '#F97316' }}
          />
          <Text style={styles.unitToggleLabel}>Imperial</Text>
        </View>

        {/* Input Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Today's Data</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Water Intake ({useMetric ? 'ml' : 'oz'})</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={water.toString()}
              onChangeText={v => setWater(Number(v) || 0)}
              placeholder={useMetric ? "e.g. 2000" : "e.g. 64"}
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sleep Hours</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={sleep.toString()}
              onChangeText={v => setSleep(Number(v) || 0)}
              placeholder="e.g. 7.5"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mood (1-5)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={mood.toString()}
              onChangeText={v => setMood(Number(v) || 3)}
              placeholder="1-5"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exercise Type</Text>
            <TextInput
              style={styles.input}
              value={exerciseType}
              onChangeText={setExerciseType}
              placeholder="e.g. Running"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exercise Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={exerciseDuration.toString()}
              onChangeText={v => setExerciseDuration(Number(v) || 0)}
              placeholder="e.g. 30"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Height ({useMetric ? 'cm' : 'in'})</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder={useMetric ? "e.g. 180" : "e.g. 70"}
                placeholderTextColor="#6B7280"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Weight ({useMetric ? 'kg' : 'lbs'})</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder={useMetric ? "e.g. 75" : "e.g. 165"}
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Saving..." : "Save Today's Data"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Health Insights */}
        {healthInsights && healthInsights.insights.length > 0 && (
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Health Insights</Text>
            {healthInsights.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={styles.insightDot} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Activity */}
        {logs && logs.length > 0 && (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            {logs.slice(0, 3).map((log) => (
              <View key={log._id} style={styles.activityItem}>
                <View style={styles.activityDate}>
                  <Text style={styles.activityDateText}>{log.date}</Text>
                  <View style={styles.activityStats}>
                    <Text style={styles.activityStat}>💧 {log.water}ml</Text>
                    <Text style={styles.activityStat}>😴 {log.sleep}h</Text>
                    <Text style={styles.activityStat}>😊 {log.mood}/5</Text>
                  </View>
                </View>
                <Text style={styles.activityExercise}>
                  {log.exerciseType} ({log.exerciseDuration}m)
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigation.navigate('FitnessHistoryScreen')}
          >
            <Text style={styles.navButtonText}>View History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: '#3B82F6' }]} 
            onPress={() => navigation.navigate('FitnessExtraScreen')}
          >
            <Text style={styles.navButtonText}>Extra Features</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    backgroundColor: "#111827",
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  unitToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  unitToggleLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginHorizontal: 12,
  },
  formCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  insightsCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
    marginTop: 6,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  activityCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  activityDate: {
    flex: 1,
  },
  activityDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
    marginBottom: 4,
  },
  activityStats: {
    flexDirection: 'row',
  },
  activityStat: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 12,
  },
  activityExercise: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FitnessTrackerScreen; 