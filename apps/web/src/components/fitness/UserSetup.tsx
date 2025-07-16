"use client";

import React, { useState } from "react";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

const UserSetup = () => {
  const createFitnessLog = useMutation(api.fitness.createFitnessLog);
  const router = useRouter();
  
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [useMetric, setUseMetric] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate BMI for preview
  const calculateBMI = () => {
    if (!height || !weight) return null;
    const heightInMeters = useMetric ? Number(height) / 100 : Number(height) * 0.0254;
    const weightInKg = useMetric ? Number(weight) * 0.453592 : Number(weight);
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
      <div className="flex justify-center items-center mb-8">
        <svg width="300" height="350" className="mx-auto">
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Head */}
          <circle
            cx="150"
            cy="70"
            r="22"
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <circle
            cx="143"
            cy="65"
            r="3"
            fill="#FFFFFF"
          />
          <circle
            cx="157"
            cy="65"
            r="3"
            fill="#FFFFFF"
          />
          
          {/* Smile */}
          <path
            d="M 143 75 Q 150 85 157 75"
            stroke="#374151"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Body */}
          <rect
            x={150 - bodyWidth / 2}
            y="92"
            width={bodyWidth}
            height="110"
            rx={bodyWidth / 4}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Arms */}
          <rect
            x={150 - bodyWidth / 2 - 14}
            y="102"
            width="14"
            height="75"
            rx="7"
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          <rect
            x={150 + bodyWidth / 2}
            y="102"
            width="14"
            height="75"
            rx="7"
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Legs */}
          <rect
            x={150 - bodyWidth / 3}
            y="202"
            width={bodyWidth / 3}
            height="90"
            rx={bodyWidth / 6}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
          <rect
            x="150"
            y="202"
            width={bodyWidth / 3}
            height="90"
            rx={bodyWidth / 6}
            fill="url(#bodyGradient)"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>
        
        {bmi && (
          <div className="text-center mt-4">
            <div className="text-2xl font-bold text-orange-500">{bmi.toFixed(1)}</div>
            <div className={`text-lg font-semibold mt-1`} style={{ color: getBMICategory(bmi).color }}>
              {getBMICategory(bmi).category}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!height || !weight || !gender) {
      alert("Please fill in all fields to continue.");
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
      
      alert("Setup Complete! Your profile has been created. You can now start tracking your daily fitness data.");
      router.push('/fitness');
    } catch (error) {
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl font-bold text-white">DF</span>
            </div>
            <h1 className="text-3xl font-bold text-white">DailyForm</h1>
          </div>
          <p className="text-gray-400 text-lg">Let's get to know you</p>
        </div>

        {/* Avatar Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-4">Your Avatar Preview</h2>
          <p className="text-gray-400 text-center mb-8">
            Based on your measurements, here's how your avatar will look
          </p>
          {renderPreviewAvatar()}
        </div>

        {/* Setup Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Your Information</h2>
          
          {/* Unit Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className="text-gray-400 mr-4">Units:</span>
            <button
              className={`px-4 py-2 rounded-lg border mr-2 ${
                useMetric 
                  ? 'bg-gray-700 border-orange-500 text-orange-500' 
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
              onClick={() => setUseMetric(true)}
            >
              Metric
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${
                !useMetric 
                  ? 'bg-gray-700 border-orange-500 text-orange-500' 
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
              onClick={() => setUseMetric(false)}
            >
              Imperial
            </button>
          </div>

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Height ({useMetric ? 'cm' : 'inches'})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={useMetric ? "e.g. 175" : "e.g. 69"}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Weight Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Weight ({useMetric ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={useMetric ? "e.g. 70" : "e.g. 154"}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Gender Selection */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4">Gender</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'male', label: 'Male', icon: '👨' },
                { value: 'female', label: 'Female', icon: '👩' },
                { value: 'other', label: 'Other', icon: '👤' }
              ].map((option) => (
                <button
                  key={option.value}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center ${
                    gender === option.value
                      ? 'bg-gray-700 border-orange-500 text-orange-500'
                      : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                  onClick={() => setGender(option.value)}
                >
                  <span className="text-2xl mb-2">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BMI Info */}
          {bmi && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Your BMI: {bmi.toFixed(1)}</h3>
              <p className={`text-lg font-semibold mb-3`} style={{ color: getBMICategory(bmi).color }}>
                {getBMICategory(bmi).category}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                This helps us personalize your fitness recommendations and avatar appearance.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center ${
              (!height || !weight || !gender || isSubmitting)
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={handleSubmit}
            disabled={!height || !weight || !gender || isSubmitting}
          >
            {isSubmitting ? "Creating Profile..." : "Create My Profile"}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Daily Logging</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Log your water intake, sleep, mood, and workouts daily
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                See your avatar evolve and view progress charts
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Set Goals</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get personalized recommendations based on your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSetup; 