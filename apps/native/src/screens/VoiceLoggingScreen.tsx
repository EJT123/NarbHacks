import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function VoiceLoggingScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  const createFitnessLog = useMutation(api.fitness.createFitnessLog);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions to use voice logging.');
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setIsListening(true);
      
      // Provide voice feedback
      Speech.speak('Start speaking your fitness data', {
        language: 'en',
        pitch: 1,
        rate: 0.9,
      });
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsListening(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      // Simulate transcription (in a real app, you'd use a speech-to-text service)
      simulateTranscription();
    }
  };

  const simulateTranscription = () => {
    // Simulate processing time
    setTimeout(() => {
      const sampleTranscriptions = [
        "I weighed 75 kilograms today and did 30 minutes of cardio",
        "Workout for 45 minutes, weight 70 kg, drank 2 liters of water",
        "Ran for 20 minutes, weight 72 kg, slept 8 hours",
        "Weight training for 60 minutes, current weight 68 kg",
        "Yoga session 30 minutes, weight 71 kg, water intake 1.5 liters"
      ];
      
      const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
      setTranscribedText(randomTranscription);
      parseVoiceData(randomTranscription);
    }, 2000);
  };

  const parseVoiceData = (text: string) => {
    const data: any = {
      weight: null,
      exerciseDuration: 0,
      waterIntake: 0,
      sleepHours: 0,
      exerciseType: '',
    };

    // Simple parsing logic (in a real app, you'd use NLP)
    const lowerText = text.toLowerCase();
    
    // Extract weight
    const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(kg|kilograms?|kilos?)/i);
    if (weightMatch) {
      data.weight = parseFloat(weightMatch[1]);
    }

    // Extract exercise duration
    const durationMatch = text.match(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      if (lowerText.includes('hour') || lowerText.includes('hr')) {
        data.exerciseDuration = value * 60;
      } else {
        data.exerciseDuration = value;
      }
    }

    // Extract water intake
    const waterMatch = text.match(/(\d+(?:\.\d+)?)\s*(liters?|l|glasses?)/i);
    if (waterMatch) {
      data.waterIntake = parseFloat(waterMatch[1]);
    }

    // Extract sleep hours
    const sleepMatch = text.match(/(\d+)\s*hours?\s*sleep/i);
    if (sleepMatch) {
      data.sleepHours = parseInt(sleepMatch[1]);
    }

    // Extract exercise type
    if (lowerText.includes('cardio') || lowerText.includes('run') || lowerText.includes('jog')) {
      data.exerciseType = 'Cardio';
    } else if (lowerText.includes('weight') || lowerText.includes('strength')) {
      data.exerciseType = 'Strength Training';
    } else if (lowerText.includes('yoga')) {
      data.exerciseType = 'Yoga';
    } else if (data.exerciseDuration > 0) {
      data.exerciseType = 'General Exercise';
    }

    setParsedData(data);
  };

  const confirmAndSave = async () => {
    if (!parsedData) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      await createFitnessLog({
        date: today,
        weight: parsedData.weight || 0,
        exerciseDuration: parsedData.exerciseDuration || 0,
        waterIntake: parsedData.waterIntake || 0,
        sleepHours: parsedData.sleepHours || 0,
        exerciseType: parsedData.exerciseType || '',
        notes: `Voice logged: ${transcribedText}`,
      });

      // Provide voice feedback
      Speech.speak('Fitness data saved successfully!', {
        language: 'en',
        pitch: 1,
        rate: 0.9,
      });

      Alert.alert('Success', 'Fitness data saved!');
      
      // Reset
      setTranscribedText('');
      setParsedData(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save fitness data');
    }
  };

  const editData = (field: string, value: string) => {
    if (!parsedData) return;
    
    setParsedData({
      ...parsedData,
      [field]: field === 'weight' || field === 'waterIntake' ? parseFloat(value) || 0 : parseInt(value) || 0,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Logging</Text>
        <Text style={styles.subtitle}>Log your fitness data with voice commands</Text>
      </View>

      {/* Voice Recording Section */}
      <View style={styles.recordingSection}>
        <View style={styles.recordingButtonContainer}>
          <TouchableOpacity
            style={[styles.recordingButton, isRecording && styles.recordingActive]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? "stop" : "mic"} 
              size={RFValue(32)} 
              color={isRecording ? "#EF4444" : "#FFFFFF"} 
            />
          </TouchableOpacity>
          <Text style={styles.recordingLabel}>
            {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
          </Text>
        </View>

        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>🎤 Listening...</Text>
            <View style={styles.pulseDot} />
          </View>
        )}
      </View>

      {/* Transcription Section */}
      {transcribedText && (
        <View style={styles.transcriptionSection}>
          <Text style={styles.sectionTitle}>What you said:</Text>
          <View style={styles.transcriptionBox}>
            <Text style={styles.transcriptionText}>{transcribedText}</Text>
          </View>
        </View>
      )}

      {/* Parsed Data Section */}
      {parsedData && (
        <View style={styles.parsedSection}>
          <Text style={styles.sectionTitle}>Parsed Data:</Text>
          
          <View style={styles.dataGrid}>
            {parsedData.weight !== null && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.dataInput}
                  value={parsedData.weight?.toString() || ''}
                  onChangeText={(value) => editData('weight', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            {parsedData.exerciseDuration > 0 && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Exercise (min)</Text>
                <TextInput
                  style={styles.dataInput}
                  value={parsedData.exerciseDuration?.toString() || ''}
                  onChangeText={(value) => editData('exerciseDuration', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            {parsedData.waterIntake > 0 && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Water (L)</Text>
                <TextInput
                  style={styles.dataInput}
                  value={parsedData.waterIntake?.toString() || ''}
                  onChangeText={(value) => editData('waterIntake', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            {parsedData.sleepHours > 0 && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Sleep (hrs)</Text>
                <TextInput
                  style={styles.dataInput}
                  value={parsedData.sleepHours?.toString() || ''}
                  onChangeText={(value) => editData('sleepHours', value)}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
          </View>

          {parsedData.exerciseType && (
            <View style={styles.exerciseTypeContainer}>
              <Text style={styles.dataLabel}>Exercise Type:</Text>
              <Text style={styles.exerciseTypeText}>{parsedData.exerciseType}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={confirmAndSave}>
            <Text style={styles.saveButtonText}>Save Data</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Voice Commands Help */}
      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>💡 Voice Command Examples:</Text>
        <View style={styles.commandList}>
          <Text style={styles.commandText}>• "I weighed 75 kilograms today"</Text>
          <Text style={styles.commandText}>• "Did 30 minutes of cardio"</Text>
          <Text style={styles.commandText}>• "Drank 2 liters of water"</Text>
          <Text style={styles.commandText}>• "Slept 8 hours last night"</Text>
          <Text style={styles.commandText}>• "Weight training for 60 minutes"</Text>
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
  recordingSection: {
    alignItems: 'center',
    padding: 20,
  },
  recordingButtonContainer: {
    alignItems: 'center',
  },
  recordingButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordingActive: {
    backgroundColor: '#EF4444',
    transform: [{ scale: 1.1 }],
  },
  recordingLabel: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listeningText: {
    fontSize: RFValue(14),
    color: '#F97316',
    marginRight: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  transcriptionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  transcriptionBox: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  transcriptionText: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    lineHeight: 24,
  },
  parsedSection: {
    padding: 20,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dataItem: {
    width: '48%',
    marginBottom: 16,
    marginRight: '2%',
  },
  dataLabel: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
    marginBottom: 8,
  },
  dataInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: RFValue(16),
  },
  exerciseTypeContainer: {
    marginBottom: 20,
  },
  exerciseTypeText: {
    fontSize: RFValue(16),
    color: '#F97316',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#1F2937',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  commandList: {
    gap: 8,
  },
  commandText: {
    fontSize: RFValue(14),
    color: '#9CA3AF',
  },
}); 