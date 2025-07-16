import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const FitnessHistoryScreen = ({ navigation }) => {
  const logs = useQuery(api.fitness.getFitnessLogs);

  const chartData = logs?.slice(0, 7).reverse().map((log, index) => ({
    day: `Day ${index + 1}`,
    water: log.water,
    weight: log.weight,
  })) || [];

  return (
    <View style={styles.container}>
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Water Intake Chart */}
        {logs && logs.length > 0 ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Water Intake Trend</Text>
            <LineChart
              data={{
                labels: logs.slice(0, 7).map((log, idx) => `#${idx + 1}`),
                datasets: [
                  {
                    data: logs.slice(0, 7).map(log => Number(log.water) || 0),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 48}
              height={220}
              yAxisSuffix={"ml"}
              chartConfig={{
                backgroundColor: '#1F2937',
                backgroundGradientFrom: '#1F2937',
                backgroundGradientTo: '#1F2937',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#F97316',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#374151',
                  strokeWidth: 1,
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <AntDesign name="barchart" size={48} color="#6B7280" />
            </View>
            <Text style={styles.emptyText}>No data available for charts</Text>
            <Text style={styles.emptySubtext}>Start logging your fitness data to see progress</Text>
          </View>
        )}

        {/* Logs List */}
        {!logs || logs.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <AntDesign name="calendar" size={48} color="#6B7280" />
            </View>
            <Text style={styles.emptyText}>No logs found</Text>
            <Text style={styles.emptySubtext}>Start tracking your fitness journey today</Text>
          </View>
        ) : (
          <View style={styles.logsContainer}>
            <Text style={styles.logsTitle}>Recent Activity</Text>
            {logs.map(log => (
              <View key={log._id} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <Text style={styles.logExercise}>
                    {log.exerciseType} ({log.exerciseDuration}m)
                  </Text>
                </View>
                <View style={styles.logStats}>
                  <View style={styles.logStat}>
                    <Text style={styles.logStatLabel}>💧 Water</Text>
                    <Text style={styles.logStatValue}>{log.water}ml</Text>
                  </View>
                  <View style={styles.logStat}>
                    <Text style={styles.logStatLabel}>😴 Sleep</Text>
                    <Text style={styles.logStatValue}>{log.sleep}h</Text>
                  </View>
                  <View style={styles.logStat}>
                    <Text style={styles.logStatLabel}>😊 Mood</Text>
                    <Text style={styles.logStatValue}>{log.mood}/5</Text>
                  </View>
                  <View style={styles.logStat}>
                    <Text style={styles.logStatLabel}>⚖️ Weight</Text>
                    <Text style={styles.logStatValue}>{log.weight}kg</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  chartCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  logsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  logItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  logExercise: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  logStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  logStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minWidth: '45%',
  },
  logStatLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 8,
  },
  logStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FitnessHistoryScreen; 