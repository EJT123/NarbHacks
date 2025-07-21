import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  
  const friends = useQuery(api.social.getFriends);
  const friendRequests = useQuery(api.social.getFriendRequests);
  const userProfile = useQuery(api.social.getUserProfile);
  
  const createProfile = useMutation(api.social.createUserProfile);
  const sendFriendRequest = useMutation(api.social.sendFriendRequest);
  const respondToRequest = useMutation(api.social.respondToFriendRequest);

  const handleCreateProfile = async () => {
    try {
      await createProfile({
        displayName: 'Fitness Enthusiast',
        bio: 'Working on my fitness goals! 💪',
        isPublic: true,
      });
      Alert.alert('Success', 'Profile created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile');
    }
  };

  const handleSendFriendRequest = async (toUserId: string) => {
    try {
      await sendFriendRequest({
        toUserId,
        message: 'Hey! Let\'s motivate each other on our fitness journey!',
      });
      Alert.alert('Success', 'Friend request sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const handleRespondToRequest = async (requestId: string, response: 'accepted' | 'rejected') => {
    try {
      await respondToRequest({ requestId, response });
      Alert.alert('Success', `Friend request ${response}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to respond to request');
    }
  };

  const renderFriend = ({ item }: { item: any }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.displayName}</Text>
        <Text style={styles.friendBio}>{item.bio}</Text>
      </View>
      <TouchableOpacity style={styles.messageButton}>
        <Feather name="message-circle" size={20} color="#F97316" />
      </TouchableOpacity>
    </View>
  );

  const renderFriendRequest = ({ item }: { item: any }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>Friend Request</Text>
        <Text style={styles.requestMessage}>{item.message}</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={[styles.requestButton, styles.acceptButton]}
          onPress={() => handleRespondToRequest(item._id, 'accepted')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.requestButton, styles.rejectButton]}
          onPress={() => handleRespondToRequest(item._id, 'rejected')}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <Text style={styles.subtitle}>Connect with fitness friends</Text>
      </View>

      {/* Profile Section */}
      {!userProfile && (
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Create Your Profile</Text>
          <TouchableOpacity style={styles.createProfileButton} onPress={handleCreateProfile}>
            <Text style={styles.buttonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends ({friends?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests ({friendRequests?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'friends' && (
        <View style={styles.content}>
          {friends && friends.length > 0 ? (
            <FlatList
              data={friends}
              renderItem={renderFriend}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <AntDesign name="team" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>No friends yet</Text>
              <Text style={styles.emptySubtext}>Add friends to motivate each other!</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'requests' && (
        <View style={styles.content}>
          {friendRequests && friendRequests.length > 0 ? (
            <FlatList
              data={friendRequests}
              renderItem={renderFriendRequest}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <AntDesign name="inbox" size={48} color="#6B7280" />
              <Text style={styles.emptyText}>No pending requests</Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </View>
          )}
        </View>
      )}
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
  profileSection: {
    padding: 20,
    backgroundColor: '#1F2937',
    margin: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  createProfileButton: {
    backgroundColor: '#F97316',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  },
  friendCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  friendBio: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
  },
  messageButton: {
    padding: 8,
  },
  requestCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  requestInfo: {
    marginBottom: 12,
  },
  requestName: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  requestMessage: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
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
}); 