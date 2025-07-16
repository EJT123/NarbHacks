import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const UserSetupScreen = ({ navigation }) => {
  console.log("UserSetupScreen loaded");
  const createFitnessLog = useMutation(api.fitness.createFitnessLog);
  
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [useMetric, setUseMetric] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate BMI for preview
  const calculateBMI = () => {
    if (!height || !weight) return null;
    const heightInMeters = useMetric ? Number(height) / 100 : Number(height) * 0.0254;
    const weightInKg = useMetric ? Number(weight) : Number(weight) * 0.453592;
    return weightInKg / (heightInMeters * heightInMeters);
  };

  const bmi = calculateBMI();

  const getBMICategory = (bmi) => {
    if (!bmi) return { category: 'Normal', color: '#10B981' };
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' };
    return { category: 'Obese', color: '#EF4444' };
  };

  const getDefaultAvatarParams = () => {
    if (!bmi) return { bodyWidth: 80, muscleDefinition: 30, hydrationLevel: 50, energyLevel: 60 };
    
    const bodyWidth = Math.max(60, Math.min(120, 80 + (bmi - 22) * 8));
    return {
      bodyWidth,
      muscleDefinition: 30,
      hydrationLevel: 50,
      energyLevel: 60,
      bmi
    };
  };

  const renderPreviewAvatar = () => {
    const { bodyWidth } = getDefaultAvatarParams();
    
    return (
      <View style={styles.avatarContainer}>
        <Svg width={width * 0.6} height={300} style={styles.avatarSvg}>
          <Defs>
            <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
            </LinearGradient>
          </Defs>
          
          {/* Head */}
          <Circle
            cx={width * 0.3}
            cy={60}
            r={20}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <Circle
            cx={width * 0.3 - 6}
            cy={56}
            r={2.5}
            fill="#FFFFFF"
          />
          <Circle
            cx={width * 0.3 + 6}
            cy={56}
            r={2.5}
            fill="#FFFFFF"
          />
          
          {/* Smile */}
          <Path
            d={`M ${width * 0.3 - 6} 68 Q ${width * 0.3} 72 ${width * 0.3 + 6} 68`}
            stroke="#374151"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Body */}
          <Rect
            x={width * 0.3 - bodyWidth / 2}
            y={80}
            width={bodyWidth}
            height={100}
            rx={bodyWidth / 4}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Arms */}
          <Rect
            x={width * 0.3 - bodyWidth / 2 - 12}
            y={90}
            width={12}
            height={70}
            rx={6}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          <Rect
            x={width * 0.3 + bodyWidth / 2}
            y={90}
            width={12}
            height={70}
            rx={6}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Legs */}
          <Rect
            x={width * 0.3 - bodyWidth / 3}
            y={180}
            width={bodyWidth / 3}
            height={80}
            rx={bodyWidth / 6}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          <Rect
            x={width * 0.3}
            y={180}
            width={bodyWidth / 3}
            height={80}
            rx={bodyWidth / 6}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
        </Svg>
        
        {bmi && (
          <View style={styles.bmiPreview}>
            <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
            <Text style={[styles.bmiCategory, { color: getBMICategory(bmi).color }]}>
              {getBMICategory(bmi).category}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handleSubmit = async () => {
    if (!height || !weight || !gender) {
      Alert.alert("Missing Information", "Please fill in all fields to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      await createFitnessLog({
        date: dateKey,
        water: 0,
        sleep: 0,
        mood: 3,
        exerciseType: "",
        exerciseDuration: 0,
        height: Number(height),
        weight: Number(weight),
        useMetric,
        gender: gender.toLowerCase(),
      });
      
      Alert.alert(
        "Setup Complete!", 
        "Your profile has been created. You can now start tracking your daily fitness data.",
        [{ text: "Start Tracking", onPress: () => navigation.navigate('FitnessTrackerScreen') }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerLogo}>
            <Text style={styles.headerLogoText}>DF</Text>
          </View>
          <Text style={styles.headerTitle}>DailyForm</Text>
        </View>
        <Text style={styles.headerSubtitle}>Let's get to know you</Text>
      </View>

      {/* Avatar Preview */}
      <View style={styles.previewSection}>
        <Text style={styles.sectionTitle}>Your Avatar Preview</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your measurements, here's how your avatar will look
        </Text>
        {renderPreviewAvatar()}
      </View>

      {/* Setup Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Your Information</Text>
        
        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <Text style={styles.unitLabel}>Units:</Text>
          <TouchableOpacity
            style={[styles.unitButton, useMetric && styles.unitButtonActive]}
            onPress={() => setUseMetric(true)}
          >
            <Text style={[styles.unitButtonText, useMetric && styles.unitButtonTextActive]}>
              Metric
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, !useMetric && styles.unitButtonActive]}
            onPress={() => setUseMetric(false)}
          >
            <Text style={[styles.unitButtonText, !useMetric && styles.unitButtonTextActive]}>
              Imperial
            </Text>
          </TouchableOpacity>
        </View>

        {/* Height Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height ({useMetric ? 'cm' : 'inches'})</Text>
          <TextInput
            style={styles.textInput}
            value={height}
            onChangeText={setHeight}
            placeholder={useMetric ? "e.g. 175" : "e.g. 69"}
            keyboardType="numeric"
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Weight Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight ({useMetric ? 'kg' : 'lbs'})</Text>
          <TextInput
            style={styles.textInput}
            value={weight}
            onChangeText={setWeight}
            placeholder={useMetric ? "e.g. 70" : "e.g. 154"}
            keyboardType="numeric"
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderButtons}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => setGender('male')}
            >
              <MaterialCommunityIcons 
                name="gender-male" 
                size={24} 
                color={gender === 'male' ? '#F97316' : '#9CA3AF'} 
              />
              <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => setGender('female')}
            >
              <MaterialCommunityIcons 
                name="gender-female" 
                size={24} 
                color={gender === 'female' ? '#F97316' : '#9CA3AF'} 
              />
              <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
              onPress={() => setGender('other')}
            >
              <MaterialCommunityIcons 
                name="gender-male-female" 
                size={24} 
                color={gender === 'other' ? '#F97316' : '#9CA3AF'} 
              />
              <Text style={[styles.genderButtonText, gender === 'other' && styles.genderButtonTextActive]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BMI Info */}
        {bmi && (
          <View style={styles.bmiInfo}>
            <Text style={styles.bmiInfoTitle}>Your BMI: {bmi.toFixed(1)}</Text>
            <Text style={[styles.bmiInfoCategory, { color: getBMICategory(bmi).color }]}>
              {getBMICategory(bmi).category}
            </Text>
            <Text style={styles.bmiInfoDescription}>
              This helps us personalize your fitness recommendations and avatar appearance.
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (!height || !weight || !gender) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!height || !weight || !gender || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Creating Profile..." : "Create My Profile"}
          </Text>
          <AntDesign name="arrowright" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What's Next?</Text>
        <View style={styles.infoItems}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <MaterialCommunityIcons name="calendar-check" size={20} color="#F97316" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Daily Logging</Text>
              <Text style={styles.infoItemDescription}>
                Log your water intake, sleep, mood, and workouts daily
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#F97316" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Track Progress</Text>
              <Text style={styles.infoItemDescription}>
                See your avatar evolve and view progress charts
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <MaterialCommunityIcons name="target" size={20} color="#F97316" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Set Goals</Text>
              <Text style={styles.infoItemDescription}>
                Get personalized recommendations based on your data
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLogo: {
    width: 40,
    height: 40,
    backgroundColor: '#F97316',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  previewSection: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarSvg: {
    alignSelf: 'center',
  },
  bmiPreview: {
    marginTop: 16,
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
  },
  bmiCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  formSection: {
    padding: 20,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  unitLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 16,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  unitButtonActive: {
    backgroundColor: '#374151',
    borderColor: '#F97316',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  unitButtonTextActive: {
    color: '#F97316',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  genderButtonActive: {
    backgroundColor: '#374151',
    borderColor: '#F97316',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginLeft: 8,
  },
  genderButtonTextActive: {
    color: '#F97316',
  },
  bmiInfo: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 24,
  },
  bmiInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bmiInfoCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  bmiInfoDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#F97316',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  infoSection: {
    padding: 20,
    paddingBottom: 40,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoItems: {
    space: 16,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#374151',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  infoItemDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
});

export default UserSetupScreen; 