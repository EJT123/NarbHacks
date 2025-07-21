'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Button } from '@/components/common/button';
import { Avatar } from '@/components/common/avatar';
import { Trophy, Users, Calendar, Target, Zap, Plus } from 'lucide-react';

export default function ChallengesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'active' | 'myChallenges' | 'completed'>('active');

  // Queries
  const activeChallenges = useQuery(api.challenges.getActiveChallenges);
  const myChallenges = useQuery(api.challenges.getMyChallenges);
  const completedChallenges = useQuery(api.challenges.getCompletedChallenges);
  const userProfile = useQuery(api.social.getUserProfile);

  // Mutations
  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const createChallenge = useMutation(api.challenges.createChallenge);
  const updateChallengeProgress = useMutation(api.challenges.updateChallengeProgress);

  const getChallengesData = () => {
    switch (selectedTab) {
      case 'active':
        return activeChallenges;
      case 'myChallenges':
        return myChallenges;
      case 'completed':
        return completedChallenges;
      default:
        return activeChallenges;
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return <Zap className="w-5 h-5" />;
      case 'streak':
        return <Calendar className="w-5 h-5" />;
      case 'goal':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'exercise':
        return 'text-green-400';
      case 'streak':
        return 'text-blue-400';
      case 'goal':
        return 'text-purple-400';
      default:
        return 'text-orange-400';
    }
  };

  const getChallengeStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'completed':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallenge({ challengeId });
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const challengesData = getChallengesData();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-400 mb-2">Challenges</h1>
            <p className="text-gray-400">Compete with friends and achieve your goals together</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Challenge</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {[
            { key: 'active', label: 'Active Challenges', count: activeChallenges?.length || 0 },
            { key: 'myChallenges', label: 'My Challenges', count: myChallenges?.length || 0 },
            { key: 'completed', label: 'Completed', count: completedChallenges?.length || 0 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengesData?.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-700 ${getChallengeTypeColor(challenge.type)}`}>
                    {getChallengeTypeIcon(challenge.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <p className="text-sm text-gray-400">by {challenge.creatorName}</p>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${getChallengeStatusColor(challenge.status)}`}>
                  {challenge.status}
                </div>
              </div>

              {/* Challenge Description */}
              <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

              {/* Challenge Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Target:</span>
                  <span className="font-medium">
                    {challenge.target} {challenge.type === 'exercise' ? 'minutes' : 
                                     challenge.type === 'streak' ? 'days' : 'points'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">{challenge.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Participants:</span>
                  <span className="font-medium flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants?.length || 0}</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {challenge.userProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Your Progress</span>
                    <span className="text-orange-400">
                      {challenge.userProgress.progress}/{challenge.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((challenge.userProgress.progress / challenge.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Participants */}
              {challenge.participants && challenge.participants.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Participants</h4>
                  <div className="flex -space-x-2">
                    {challenge.participants.slice(0, 5).map((participant, index) => (
                      <Avatar
                        key={participant.userId}
                        src={participant.user?.avatarUrl}
                        alt={participant.user?.name || 'User'}
                        className="w-8 h-8 border-2 border-gray-800"
                      />
                    ))}
                    {challenge.participants.length > 5 && (
                      <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs">
                        +{challenge.participants.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {!challenge.userProgress && challenge.status === 'active' && (
                  <Button
                    size="sm"
                    onClick={() => handleJoinChallenge(challenge._id)}
                    className="flex-1"
                  >
                    Join Challenge
                  </Button>
                )}
                {challenge.userProgress && challenge.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    View Progress
                  </Button>
                )}
                {challenge.status === 'completed' && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Completed!</span>
                  </div>
                )}
              </div>

              {/* Challenge End Date */}
              <div className="mt-3 text-xs text-gray-500">
                Ends: {new Date(challenge.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!challengesData || challengesData.length === 0) && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {selectedTab === 'active' && 'No Active Challenges'}
              {selectedTab === 'myChallenges' && 'No Challenges Created'}
              {selectedTab === 'completed' && 'No Completed Challenges'}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedTab === 'active' && 'Be the first to create a challenge!'}
              {selectedTab === 'myChallenges' && 'Start by creating your first challenge'}
              {selectedTab === 'completed' && 'Complete some challenges to see them here'}
            </p>
            {selectedTab === 'active' && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create Challenge
              </Button>
            )}
          </div>
        )}

        {/* Create Challenge Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Challenge</h2>
              <p className="text-gray-400 mb-4">This feature is coming soon!</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 