'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Button } from '@/components/common/button';
import { Avatar } from '@/components/common/avatar';

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'friends' | 'requests' | 'discover'>('friends');

  // Queries
  const friends = useQuery(api.social.getFriends);
  const friendRequests = useQuery(api.social.getFriendRequests);
  const userProfile = useQuery(api.social.getUserProfile);
  const allUsers = useQuery(api.social.getAllUsers);

  // Mutations
  const sendFriendRequest = useMutation(api.social.sendFriendRequest);
  const acceptFriendRequest = useMutation(api.social.acceptFriendRequest);
  const rejectFriendRequest = useMutation(api.social.rejectFriendRequest);
  const removeFriend = useMutation(api.social.removeFriend);

  const filteredUsers = allUsers?.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user._id !== userProfile?._id &&
    !friends?.some(friend => friend._id === user._id) &&
    !friendRequests?.some(req => req.fromUserId === user._id)
  );

  const handleSendRequest = async (userId: string) => {
    try {
      await sendFriendRequest({ toUserId: userId });
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest({ requestId });
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest({ requestId });
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend({ friendId });
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Social Hub</h1>
          <p className="text-gray-400">Connect with friends and challenge each other</p>
        </div>

        {/* Profile Section */}
        {userProfile && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={userProfile.avatarUrl} 
                alt={userProfile.name || 'User'} 
                className="w-16 h-16"
              />
              <div>
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <p className="text-gray-400">{userProfile.email}</p>
                <div className="flex space-x-4 mt-2">
                  <span className="text-sm text-gray-400">
                    {friends?.length || 0} friends
                  </span>
                  <span className="text-sm text-gray-400">
                    Level {userProfile.level || 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setSelectedTab('friends')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'friends'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends ({friends?.length || 0})
          </button>
          <button
            onClick={() => setSelectedTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'requests'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Requests ({friendRequests?.length || 0})
          </button>
          <button
            onClick={() => setSelectedTab('discover')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'discover'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Discover
          </button>
        </div>

        {/* Content */}
        {selectedTab === 'friends' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Friends</h3>
            {friends && friends.length > 0 ? (
              <div className="grid gap-4">
                {friends.map((friend) => (
                  <div key={friend._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={friend.avatarUrl} 
                        alt={friend.name || 'Friend'} 
                        className="w-12 h-12"
                      />
                      <div>
                        <h4 className="font-medium">{friend.name}</h4>
                        <p className="text-sm text-gray-400">Level {friend.level || 1}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFriend(friend._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No friends yet. Start by discovering new people!</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Friend Requests</h3>
            {friendRequests && friendRequests.length > 0 ? (
              <div className="grid gap-4">
                {friendRequests.map((request) => (
                  <div key={request._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={request.fromUser?.avatarUrl} 
                        alt={request.fromUser?.name || 'User'} 
                        className="w-12 h-12"
                      />
                      <div>
                        <h4 className="font-medium">{request.fromUser?.name}</h4>
                        <p className="text-sm text-gray-400">Wants to be your friend</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No pending friend requests</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'discover' && (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <h3 className="text-xl font-semibold">Discover People</h3>
            {filteredUsers && filteredUsers.length > 0 ? (
              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={user.avatarUrl} 
                        alt={user.name || 'User'} 
                        className="w-12 h-12"
                      />
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-400">Level {user.level || 1}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendRequest(user._id)}
                    >
                      Add Friend
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 