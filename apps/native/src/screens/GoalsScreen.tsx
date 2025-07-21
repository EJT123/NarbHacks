import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

const GOAL_LABELS: Record<string, string> = {
  fat_loss: "Fat Loss",
  muscle_gain: "Muscle Gain",
  cardio_endurance: "Cardio Endurance",
  mobility_recovery: "Mobility/Recovery",
};

const getBarColor = (percent: number) => {
  if (percent < 33) return "#ef4444"; // red
  if (percent < 66) return "#3b82f6"; // blue
  return "#22c55e"; // green
};

const types = ["fat_loss", "muscle_gain", "cardio_endurance", "mobility_recovery"];

export default function GoalsScreen() {
  const createGoal = useMutation(api.goals.createGoal);
  const [formState, setFormState] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [suggestion, setSuggestion] = useState({});

  const handleInput = (type: string, field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleSuggest = (type: string) => {
    const weightChange = Number(formState[type]?.weightChange || 0);
    if (!weightChange) return;
    const perWeek = 1;
    const weeks = Math.ceil(Math.abs(weightChange) / perWeek);
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + weeks * 7);
    setSuggestion((prev) => ({
      ...prev,
      [type]: {
        target: Math.abs(weightChange),
        startDate: today.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        weeks,
      },
    }));
    setFormState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        target: Math.abs(weightChange),
        startDate: today.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
      },
    }));
  };

  const handleCreateGoal = async (type: string) => {
    setSubmitting(true);
    const { target, startDate, endDate } = formState[type] || {};
    if (!target || !startDate || !endDate) {
      alert("Please fill all fields");
      setSubmitting(false);
      return;
    }
    await createGoal({ type, target: Number(target), startDate, endDate });
    setSubmitting(false);
    setFormState((prev) => ({ ...prev, [type]: undefined }));
    setSuggestion((prev) => ({ ...prev, [type]: undefined }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.header}>Your Goals</Text>
      {types.map((type) => {
        const progress = useQuery(api.goals.getGoalProgress, { type });
        if (!progress) {
          // Show goal creation form
          return (
            <View key={type} style={styles.goalCard}>
              <Text style={styles.goalLabel}>{GOAL_LABELS[type]}</Text>
              {(type === "fat_loss" || type === "muscle_gain") && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={`How much weight do you want to ${type === "fat_loss" ? "lose" : "gain"}? (lbs)`}
                    placeholderTextColor="#a1a1aa"
                    keyboardType="numeric"
                    value={formState[type]?.weightChange || ""}
                    onChangeText={val => handleInput(type, "weightChange", val)}
                  />
                  <TouchableOpacity
                    style={[styles.suggestButton, { backgroundColor: '#3b82f6' }]}
                    onPress={() => handleSuggest(type)}
                  >
                    <Text style={styles.suggestButtonText}>Suggest Goal</Text>
                  </TouchableOpacity>
                  {suggestion[type] && (
                    <View style={styles.suggestionBox}>
                      <Text style={{ color: '#fff' }}>
                        Suggested: {suggestion[type].target} lbs in {suggestion[type].weeks} weeks (by {suggestion[type].endDate})
                      </Text>
                    </View>
                  )}
                </>
              )}
              <TextInput
                style={styles.input}
                placeholder="Target value"
                placeholderTextColor="#a1a1aa"
                keyboardType="numeric"
                value={formState[type]?.target || ""}
                onChangeText={val => handleInput(type, "target", val)}
              />
              <TextInput
                style={styles.input}
                placeholder="Start date (YYYY-MM-DD)"
                placeholderTextColor="#a1a1aa"
                value={formState[type]?.startDate || ""}
                onChangeText={val => handleInput(type, "startDate", val)}
              />
              <TextInput
                style={styles.input}
                placeholder="End date (YYYY-MM-DD)"
                placeholderTextColor="#a1a1aa"
                value={formState[type]?.endDate || ""}
                onChangeText={val => handleInput(type, "endDate", val)}
              />
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#f97316' }]}
                onPress={() => handleCreateGoal(type)}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Set Goal</Text>}
              </TouchableOpacity>
            </View>
          );
        }
        return (
          <View key={type} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>{GOAL_LABELS[type]}</Text>
              <Text style={styles.percent}>{progress.percent.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress.percent}%`,
                    backgroundColor: getBarColor(progress.percent),
                  },
                ]}
              />
            </View>
            <View style={styles.goalFooter}>
              <Text style={styles.goalFooterText}>Current: {progress.current}</Text>
              <Text style={styles.goalFooterText}>Target: {progress.target}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: '#27272a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  percent: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  progressBarBg: {
    width: '100%',
    height: 18,
    backgroundColor: '#3f3f46',
    borderRadius: 9,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: 18,
    borderRadius: 9,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalFooterText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#3f3f46',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  suggestButton: {
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  suggestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionBox: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: -5,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 