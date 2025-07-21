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

export default function AchievementsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');

  const achievements = useQuery(api.achievements.getUserAchievements);

  const filters = [
    { key: 'all', title: 'All', icon: '🏆' },
    { key: 'streak', title: 'Streaks', icon: '🔥' },
    { key: 'goal', title: 'Goals', icon: '🎯' },
    { key: 'workout', title: 'Workouts', icon: '💪' },
    { key: 'social', title: 'Social', icon: '👥' },
  ];

  const filteredAchievements = achievements?.filter(achievement => 
    activeFilter === 'all' || achievement.type === activeFilter
  ) || [];

  const unlockedCount = achievements?.filter(a => a.progress >= a.target).length || 0;
  const totalCount = achievements?.length || 0;

  const renderAchievement = ({ item }: { item: any }) => {
    const isUnlocked = item.progress >= item.target;
    const progressPercentage = Math.min((item.progress / item.target) * 100, 100);

    return (
      <View style={[styles.achievementCard, isUnlocked && styles.unlockedCard]}>
        <View style={styles.achievementHeader}>
          <View style={[styles.iconContainer, isUnlocked && styles.unlockedIcon]}>
            <Text style={styles.achievementIcon}>{item.icon}</Text>
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, isUnlocked && styles.unlockedTitle]}>
              {item.title}
            </Text>
            <Text style={styles.achievementDescription}>
              {item.description}
            </Text>
            <Text style={styles.achievementDate}>
              {isUnlocked ? `Unlocked ${new Date(item.unlockedAt).toLocaleDateString()}` : 'Not unlocked yet'}
            </Text>
          </View>
        </View>
        
        {!isUnlocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress} / {item.target}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const getFilterDescription = () => {
    switch (activeFilter) {
      case 'streak':
        return 'Achievements for maintaining logging streaks';
      case 'goal':
        return 'Achievements for completing fitness goals';
      case 'workout':
        return 'Achievements for workout consistency';
      case 'social':
        return 'Achievements for social interactions';
      default:
        return 'All your fitness achievements and progress';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>{getFilterDescription()}</Text>
      </View>

      {/* Achievement Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{unlockedCount}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterTab, activeFilter === filter.key && styles.activeFilterTab]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text style={[styles.filterText, activeFilter === filter.key && styles.activeFilterText]}>
              {filter.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements List */}
      <View style={styles.achievementsContainer}>
        {filteredAchievements.length > 0 ? (
          <FlatList
            data={filteredAchievements}
            renderItem={renderAchievement}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={64} color="#6B7280" />
            <Text style={styles.emptyText}>
              {activeFilter === 'all' ? 'No achievements yet' : `No ${activeFilter} achievements`}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeFilter === 'all' 
                ? 'Start logging to unlock achievements!' 
                : `Complete ${activeFilter} activities to unlock achievements!`
              }
            </Text>
          </View>
        )}
      </View>

      {/* Achievement Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Achievement Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Log daily to build streaks</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Set and complete fitness goals</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Add friends for social achievements</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Stay consistent with workouts</Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    minWidth: 70,
  },
  activeFilterTab: {
    backgroundColor: '#F97316',
  },
  filterIcon: {
    fontSize: RFValue(20),
    marginBottom: 4,
  },
  filterText: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    opacity: 0.6,
  },
  unlockedCard: {
    opacity: 1,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unlockedIcon: {
    backgroundColor: '#F97316',
  },
  achievementIcon: {
    fontSize: RFValue(24),
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  unlockedTitle: {
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: RFValue(12),
    color: '#6B7280',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 3,
  },
  progressText: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
    textAlign: 'center',
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
  tipsContainer: {
    backgroundColor: '#1F2937',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
  },
}); 