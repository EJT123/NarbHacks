import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function ChallengesScreen() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeType, setChallengeType] = useState('streak');
  const [challengeTarget, setChallengeTarget] = useState('');
  const [challengeDuration, setChallengeDuration] = useState('7');

  const activeChallenges = useQuery(api.challenges.getActiveChallenges);
  const userChallenges = useQuery(api.challenges.getUserChallenges);

  const createChallenge = useMutation(api.challenges.createChallenge);
  const joinChallenge = useMutation(api.challenges.joinChallenge);

  const challengeTypes = [
    { key: 'streak', title: 'Streak', icon: '🔥', description: 'Maintain logging streak' },
    { key: 'workout', title: 'Workout', icon: '💪', description: 'Complete workouts' },
    { key: 'goal', title: 'Goal', icon: '🎯', description: 'Achieve fitness goals' },
    { key: 'weight', title: 'Weight', icon: '⚖️', description: 'Weight loss/gain' },
  ];

  const handleCreateChallenge = async () => {
    if (!challengeTitle || !challengeDescription || !challengeTarget || !challengeDuration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await createChallenge({
        title: challengeTitle,
        description: challengeDescription,
        type: challengeType,
        target: parseInt(challengeTarget),
        duration: parseInt(challengeDuration),
        rewards: 'Bragging rights and motivation!',
      });
      
      setShowCreateModal(false);
      setChallengeTitle('');
      setChallengeDescription('');
      setChallengeTarget('');
      setChallengeDuration('7');
      Alert.alert('Success', 'Challenge created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create challenge');
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallenge({ challengeId });
      Alert.alert('Success', 'Joined challenge!');
    } catch (error) {
      Alert.alert('Error', 'Failed to join challenge');
    }
  };

  const renderChallenge = ({ item }: { item: any }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeType}>
          <Text style={styles.challengeTypeIcon}>
            {challengeTypes.find(t => t.key === item.type)?.icon}
          </Text>
          <Text style={styles.challengeTypeText}>
            {challengeTypes.find(t => t.key === item.type)?.title}
          </Text>
        </View>
        <Text style={styles.challengeCreator}>by {item.creatorName}</Text>
      </View>

      <Text style={styles.challengeTitle}>{item.title}</Text>
      <Text style={styles.challengeDescription}>{item.description}</Text>

      <View style={styles.challengeStats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Target</Text>
          <Text style={styles.statValue}>{item.target}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{item.duration} days</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Participants</Text>
          <Text style={styles.statValue}>{item.participants?.length || 0}</Text>
        </View>
      </View>

      {item.isParticipating ? (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${Math.min((item.userProgress / item.target) * 100, 100)}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.userProgress} / {item.target}
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => handleJoinChallenge(item._id)}
        >
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Challenge</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Challenge Title"
            placeholderTextColor="#9CA3AF"
            value={challengeTitle}
            onChangeText={setChallengeTitle}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Challenge Description"
            placeholderTextColor="#9CA3AF"
            value={challengeDescription}
            onChangeText={setChallengeDescription}
            multiline
          />

          <Text style={styles.sectionTitle}>Challenge Type</Text>
          <View style={styles.typeContainer}>
            {challengeTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[styles.typeOption, challengeType === type.key && styles.selectedType]}
                onPress={() => setChallengeType(type.key)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[styles.typeText, challengeType === type.key && styles.selectedTypeText]}>
                  {type.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <TextInput
                style={styles.input}
                placeholder="Target"
                placeholderTextColor="#9CA3AF"
                value={challengeTarget}
                onChangeText={setChallengeTarget}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <TextInput
                style={styles.input}
                placeholder="Duration (days)"
                placeholderTextColor="#9CA3AF"
                value={challengeDuration}
                onChangeText={setChallengeDuration}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateChallenge}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Challenges</Text>
          <Text style={styles.subtitle}>Compete with friends and stay motivated</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active ({activeChallenges?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'my' && styles.activeTab]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
              My Challenges ({userChallenges?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'active' && (
            activeChallenges && activeChallenges.length > 0 ? (
              <FlatList
                data={activeChallenges}
                renderItem={renderChallenge}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="emoji-events" size={64} color="#6B7280" />
                <Text style={styles.emptyText}>No active challenges</Text>
                <Text style={styles.emptySubtext}>Create a challenge to get started!</Text>
              </View>
            )
          )}

          {activeTab === 'my' && (
            userChallenges && userChallenges.length > 0 ? (
              <FlatList
                data={userChallenges}
                renderItem={renderChallenge}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="person" size={64} color="#6B7280" />
                <Text style={styles.emptyText}>No challenges joined</Text>
                <Text style={styles.emptySubtext}>Join or create a challenge!</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>

      {/* Create Challenge Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create Challenge</Text>
      </TouchableOpacity>

      {renderCreateModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F97316',
  },
  tabText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  challengeCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeTypeIcon: {
    fontSize: RFValue(20),
    marginRight: 8,
  },
  challengeTypeText: {
    fontSize: RFValue(14),
    color: '#F97316',
    fontWeight: '600',
  },
  challengeCreator: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
  },
  challengeTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
    marginBottom: 16,
  },
  challengeStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: RFValue(12),
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  joinButton: {
    backgroundColor: '#F97316',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F97316',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 16,
    fontSize: RFValue(16),
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeOption: {
    width: '48%',
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    marginRight: '2%',
  },
  selectedType: {
    backgroundColor: '#F97316',
  },
  typeIcon: {
    fontSize: RFValue(24),
    marginBottom: 4,
  },
  typeText: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 