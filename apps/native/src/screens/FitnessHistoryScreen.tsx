import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const FitnessHistoryScreen = ({ navigation }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const fitnessKeys = keys.filter(k => k.startsWith('fitnesslog-'));
        const stores = await AsyncStorage.multiGet(fitnessKeys);
        const parsed = stores.map(([key, value]) => {
          try {
            return { key, ...JSON.parse(value) };
          } catch {
            return null;
          }
        }).filter(Boolean);
        // Sort by date descending
        parsed.sort((a, b) => (a.key < b.key ? 1 : -1));
        setLogs(parsed);
      } catch (e) {
        setLogs([]);
      }
    };
    loadLogs();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backIconContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Fitness Log History</Text>
        {logs.length === 0 ? (
          <Text style={styles.placeholder}>No logs found.</Text>
        ) : (
          logs.map(log => (
            <View key={log.key} style={styles.logItem}>
              <Text style={styles.logDate}>{log.key.replace('fitnesslog-', '')}</Text>
              <Text style={styles.logSummary}>
                Water: {log.water}oz | Sleep: {log.sleep}h | Mood: {log.mood} | Weight: {log.weight}kg
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#181A20",
    flexGrow: 1,
  },
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 80, // Adjust for the back icon
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F1F1F1",
    marginBottom: 24,
    textAlign: "center",
  },
  placeholder: {
    color: "#F1F1F1",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  logItem: {
    backgroundColor: "#23262F",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  logDate: {
    color: "#FFD166",
    fontWeight: "bold",
    marginBottom: 4,
  },
  logSummary: {
    color: "#F1F1F1",
  },
});

export default FitnessHistoryScreen; 