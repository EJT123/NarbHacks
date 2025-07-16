import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const FitnessTrackerScreen = () => {
  const [water, setWater] = useState(0); // ounces
  const [sleep, setSleep] = useState(0); // hours
  const [mood, setMood] = useState(3); // 1-5
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState(0); // minutes
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [chest, setChest] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Daily Fitness Tracker</Text>
      <Text style={styles.label}>Water Intake (oz):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={water.toString()}
        onChangeText={v => setWater(Number(v))}
        placeholder="e.g. 64"
      />
      <Text style={styles.label}>Sleep Hours:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={sleep.toString()}
        onChangeText={v => setSleep(Number(v))}
        placeholder="e.g. 7.5"
      />
      <Text style={styles.label}>Mood (1-5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={mood.toString()}
        onChangeText={v => setMood(Number(v))}
        placeholder="1-5"
      />
      <Text style={styles.label}>Exercise Type:</Text>
      <TextInput
        style={styles.input}
        value={exerciseType}
        onChangeText={setExerciseType}
        placeholder="e.g. Running"
      />
      <Text style={styles.label}>Exercise Duration (min):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={exerciseDuration.toString()}
        onChangeText={v => setExerciseDuration(Number(v))}
        placeholder="e.g. 30"
      />
      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        placeholder="e.g. 180"
      />
      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholder="e.g. 75"
      />
      <Text style={styles.label}>Waist (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={waist}
        onChangeText={setWaist}
        placeholder="e.g. 80"
      />
      <Text style={styles.label}>Hip (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={hip}
        onChangeText={setHip}
        placeholder="e.g. 95"
      />
      <Text style={styles.label}>Chest (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={chest}
        onChangeText={setChest}
        placeholder="e.g. 100"
      />
      <Text style={styles.label}>Body Fat % (optional):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={bodyFat}
        onChangeText={setBodyFat}
        placeholder="e.g. 15"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#181A20",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F1F1F1",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    color: "#F1F1F1",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#23262F",
    color: "#F1F1F1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#4F8CFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FitnessTrackerScreen; 