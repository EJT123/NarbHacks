import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Button, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const getTodayKey = () => {
  const today = new Date();
  return `fitnesslog-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const FitnessTrackerScreen = ({ navigation }) => {
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

  const handleSubmit = async () => {
    try {
      const key = getTodayKey();
      const data = {
        water, sleep, mood, exerciseType, exerciseDuration, height, weight, waist, hip, chest, bodyFat
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
      Alert.alert("Success", "Your measurements have been saved!", [
        { text: "OK", onPress: () => navigation.navigate("NotesDashboardScreen") }
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not save your measurements.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#181A20' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.backIconContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
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
        </ScrollView>
        <View style={styles.buttonFooter}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#FF6B81', marginTop: 12 }]} onPress={() => navigation.navigate('FitnessHistoryScreen')}>
            <Text style={styles.buttonText}>View History</Text>
          </TouchableOpacity>
          <Button
            title="Go to Extra Fitness Page"
            onPress={() => navigation.navigate("FitnessExtraScreen")}
            color="#D2691E"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    backgroundColor: "#181A20",
    paddingBottom: 24,
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
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonFooter: {
    padding: 24,
    backgroundColor: "#181A20",
  },
  backIconContainer: {
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
  },
});

export default FitnessTrackerScreen; 