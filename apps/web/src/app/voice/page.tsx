'use client';

import React, { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Button } from '@/components/common/button';
import { Mic, MicOff, Play, Square, Save, Edit3 } from 'lucide-react';

export default function VoiceLoggingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [parsedData, setParsedData] = useState({
    exerciseType: '',
    duration: 0,
    intensity: 5,
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const createFitnessLog = useMutation(api.fitness.createFitnessLog);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
        // Simulate transcription
        simulateTranscription();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const simulateTranscription = () => {
    // Simulate voice transcription with common fitness phrases
    const sampleTranscriptions = [
      "I did 30 minutes of running at moderate intensity",
      "Completed 45 minutes of weight training focusing on upper body",
      "Did 20 minutes of yoga for flexibility and relaxation",
      "Ran 5 kilometers in 25 minutes, feeling great",
      "Worked out for 60 minutes doing circuit training"
    ];
    
    const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    setTranscription(randomTranscription);
    parseTranscription(randomTranscription);
  };

  const parseTranscription = (text: string) => {
    // Simple parsing logic for demonstration
    const lowerText = text.toLowerCase();
    
    let exerciseType = '';
    let duration = 0;
    let intensity = 5;
    let notes = '';

    // Extract exercise type
    if (lowerText.includes('running') || lowerText.includes('run')) {
      exerciseType = 'Running';
    } else if (lowerText.includes('weight') || lowerText.includes('strength')) {
      exerciseType = 'Weight Training';
    } else if (lowerText.includes('yoga')) {
      exerciseType = 'Yoga';
    } else if (lowerText.includes('circuit')) {
      exerciseType = 'Circuit Training';
    } else if (lowerText.includes('walking') || lowerText.includes('walk')) {
      exerciseType = 'Walking';
    } else {
      exerciseType = 'General Exercise';
    }

    // Extract duration
    const durationMatch = text.match(/(\d+)\s*minutes?/);
    if (durationMatch) {
      duration = parseInt(durationMatch[1]);
    }

    // Extract intensity
    if (lowerText.includes('high intensity') || lowerText.includes('intense')) {
      intensity = 9;
    } else if (lowerText.includes('moderate')) {
      intensity = 6;
    } else if (lowerText.includes('low intensity') || lowerText.includes('light')) {
      intensity = 3;
    }

    // Extract notes
    if (lowerText.includes('feeling great')) {
      notes = 'Feeling great after workout';
    } else if (lowerText.includes('focusing on')) {
      const focusMatch = text.match(/focusing on (.+)/);
      if (focusMatch) {
        notes = `Focused on ${focusMatch[1]}`;
      }
    }

    setParsedData({ exerciseType, duration, intensity, notes });
  };

  const handleSave = async () => {
    if (!parsedData.exerciseType || parsedData.duration === 0) {
      alert('Please ensure exercise type and duration are filled out');
      return;
    }

    setIsSaving(true);
    try {
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      await createFitnessLog({
        date: dateKey,
        water: 0,
        sleep: 0,
        mood: 3,
        exerciseType: parsedData.exerciseType,
        exerciseDuration: parsedData.duration,
        height: 0,
        weight: 0,
        useMetric: true,
        gender: 'other',
        fitnessGoal: 'general_fitness',
        notes: parsedData.notes,
        intensity: parsedData.intensity
      });

      alert('Workout logged successfully!');
      resetForm();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTranscription('');
    setParsedData({
      exerciseType: '',
      duration: 0,
      intensity: 5,
      notes: ''
    });
    setIsEditing(false);
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Voice Logging</h1>
          <p className="text-gray-400">Log your workouts using voice commands</p>
        </div>

        {/* Recording Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Record Your Workout</h2>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            
            {audioRef.current?.src && (
              <Button
                onClick={playRecording}
                disabled={isPlaying}
                variant="outline"
                className="w-12 h-12 rounded-full"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-2">
              {isRecording ? 'Recording... Click to stop' : 'Click the microphone to start recording'}
            </p>
            <p className="text-sm text-gray-500">
              Try saying: "I did 30 minutes of running at moderate intensity"
            </p>
          </div>
        </div>

        {/* Transcription Section */}
        {transcription && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Transcription</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </Button>
            </div>
            
            {isEditing ? (
              <textarea
                value={transcription}
                onChange={(e) => {
                  setTranscription(e.target.value);
                  parseTranscription(e.target.value);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none h-24"
                placeholder="Edit the transcription..."
              />
            ) : (
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-white">{transcription}</p>
              </div>
            )}
          </div>
        )}

        {/* Parsed Data Section */}
        {parsedData.exerciseType && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Workout Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Exercise Type
                </label>
                <input
                  type="text"
                  value={parsedData.exerciseType}
                  onChange={(e) => setParsedData({ ...parsedData, exerciseType: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={parsedData.duration}
                  onChange={(e) => setParsedData({ ...parsedData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Intensity (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={parsedData.intensity}
                  onChange={(e) => setParsedData({ ...parsedData, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Low</span>
                  <span>{parsedData.intensity}</span>
                  <span>High</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={parsedData.notes}
                  onChange={(e) => setParsedData({ ...parsedData, notes: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {parsedData.exerciseType && (
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-8 py-3"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Workout'}</span>
            </Button>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Voice Command Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Exercise Examples:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• "I did 30 minutes of running"</li>
                <li>• "Completed 45 minutes of weight training"</li>
                <li>• "Did 20 minutes of yoga"</li>
                <li>• "Worked out for 60 minutes"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Intensity Keywords:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• "High intensity" or "intense"</li>
                <li>• "Moderate" or "medium"</li>
                <li>• "Low intensity" or "light"</li>
                <li>• "Easy" or "relaxed"</li>
              </ul>
            </div>
          </div>
        </div>

        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
} 