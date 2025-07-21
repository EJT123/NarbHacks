import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LeaderboardsScreen() {
  const [activeCategory, setActiveCategory] = useState('streaks');
  const [timeframe, setTimeframe] = useState('all_time');

  const leaderboard = useQuery(api.leaderboards.getLeaderboard, {
    type: activeCategory,
    timeframe,
  });

  const categories = [
    { key: 'streaks', title: 'Streaks', icon: '🔥' },
    { key: 'goals', title: 'Goals', icon: '🎯' },
    { key: 'workouts', title: 'Workouts', icon: '💪' },
    { key: 'consistency', title: 'Consistency', icon: '📊' },
  ];

  const timeframes = [
    { key: 'week', title: 'Week' },
    { key: 'month', title: 'Month' },
    { key: 'all_time', title: 'All Time' },
  ];

  const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.leaderboardItem, item.isCurrentUser && styles.currentUserItem]}>
      <View style={styles.rankContainer}>
        {index < 3 ? (
          <View style={[styles.medal, styles[`medal${index + 1}`]]}>
            <Text style={styles.medalText}>{index + 1}</Text>
          </View>
        ) : (
          <Text style={styles.rankText}>{index + 1}</Text>
        )}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, item.isCurrentUser && styles.currentUserName]}>
          {item.displayName}
        </Text>
        {item.isCurrentUser && <Text style={styles.currentUserLabel}>You</Text>}
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, item.isCurrentUser && styles.currentUserScore]}>
          {activeCategory === 'consistency' ? `${item.score}%` : item.score}
        </Text>
      </View>
    </View>
  );

  const getCategoryDescription = () => {
    switch (activeCategory) {
      case 'streaks':
        return 'Longest logging streaks';
      case 'goals':
        return 'Goal completion rates';
      case 'workouts':
        return 'Workout frequency';
      case 'consistency':
        return 'Daily logging consistency';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboards</Text>
        <Text style={styles.subtitle}>{getCategoryDescription()}</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[styles.categoryTab, activeCategory === category.key && styles.activeCategoryTab]}
            onPress={() => setActiveCategory(category.key)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[styles.categoryText, activeCategory === category.key && styles.activeCategoryText]}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {timeframes.map((tf) => (
          <TouchableOpacity
            key={tf.key}
            style={[styles.timeframeTab, timeframe === tf.key && styles.activeTimeframeTab]}
            onPress={() => setTimeframe(tf.key)}
          >
            <Text style={[styles.timeframeText, timeframe === tf.key && styles.activeTimeframeText]}>
              {tf.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leaderboard */}
      <View style={styles.leaderboardContainer}>
        {leaderboard && leaderboard.length > 0 ? (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.userId}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="leaderboard" size={64} color="#6B7280" />
            <Text style={styles.emptyText}>No data yet</Text>
            <Text style={styles.emptySubtext}>Start logging to see rankings!</Text>
          </View>
        )}
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{leaderboard?.length || 0}</Text>
          <Text style={styles.statLabel}>Participants</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {leaderboard && leaderboard.length > 0 ? Math.round(leaderboard[0]?.score || 0) : 0}
          </Text>
          <Text style={styles.statLabel}>Top Score</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: RFValue(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: RFValue(16),
    color: '#9CA3AF',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    minWidth: 80,
  },
  activeCategoryTab: {
    backgroundColor: '#F97316',
  },
  categoryIcon: {
    fontSize: RFValue(24),
    marginBottom: 4,
  },
  categoryText: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  timeframeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 4,
  },
  timeframeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeframeTab: {
    backgroundColor: '#374151',
  },
  timeframeText: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: '#FFFFFF',
  },
  leaderboardContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: '#F97316',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  medal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medal1: {
    backgroundColor: '#FFD700',
  },
  medal2: {
    backgroundColor: '#C0C0C0',
  },
  medal3: {
    backgroundColor: '#CD7F32',
  },
  medalText: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currentUserName: {
    color: '#FFFFFF',
  },
  currentUserLabel: {
    fontSize: RFValue(12),
    color: '#F59E0B',
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#F97316',
  },
  currentUserScore: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
    textAlign: 'center',
  },
}); 