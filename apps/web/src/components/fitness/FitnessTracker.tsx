"use client";

import { useState, useEffect } from "react";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdaptiveAvatar from "./AdaptiveAvatar";

const getTodayKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const FitnessTracker = () => {
  const createFitnessLog = useMutation(api.fitness.createFitnessLog);
  const todayLog = useQuery(api.fitness.getFitnessLogByDate, { date: getTodayKey() });
  const logs = useQuery(api.fitness.getFitnessLogs);
  const stats = useQuery(api.fitness.getFitnessStats);
  const healthInsights = useQuery(api.fitness.getHealthInsights);

  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [mood, setMood] = useState(3);
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState(0);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [chest, setChest] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [useMetric, setUseMetric] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    if (todayLog) {
      setWater(todayLog.water);
      setSleep(todayLog.sleep);
      setMood(todayLog.mood);
      setExerciseType(todayLog.exerciseType);
      setExerciseDuration(todayLog.exerciseDuration);
      setHeight(todayLog.height.toString());
      setWeight(todayLog.weight.toString());
      setWaist(todayLog.waist?.toString() || "");
      setHip(todayLog.hip?.toString() || "");
      setChest(todayLog.chest?.toString() || "");
      setBodyFat(todayLog.bodyFat?.toString() || "");
      setUseMetric(todayLog.useMetric);
    }
  }, [todayLog]);

  const handleSubmit = async () => {
    if (!water || !sleep || !exerciseType.trim() || !height || !weight) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createFitnessLog({
        date: getTodayKey(),
        water: Number(water),
        sleep: Number(sleep),
        mood: Number(mood),
        exerciseType: exerciseType.trim(),
        exerciseDuration: Number(exerciseDuration),
        height: Number(height),
        weight: Number(weight),
        waist: waist ? Number(waist) : undefined,
        hip: hip ? Number(hip) : undefined,
        chest: chest ? Number(chest) : undefined,
        bodyFat: bodyFat ? Number(bodyFat) : undefined,
        useMetric,
      });
      alert("Fitness data saved successfully!");
    } catch (error) {
      alert("Error saving fitness data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = logs?.slice(0, 7).reverse().map((log, index) => ({
    day: `Day ${index + 1}`,
    water: log.water,
    weight: log.weight,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">DF</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DailyForm
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Your Personal Fitness & Wellness Tracker</p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats && (
            <>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-orange-400 mb-4">Monthly Average</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Water</span>
                    <span className="text-white font-semibold">{Math.round(stats.avgWater)}ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sleep</span>
                    <span className="text-white font-semibold">{stats.avgSleep.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mood</span>
                    <span className="text-white font-semibold">{stats.avgMood.toFixed(1)}/5</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Exercise</h3>
                <p className="text-3xl font-bold text-blue-400 mb-2">
                  {Math.round(stats.totalExerciseMinutes / 60)}h {stats.totalExerciseMinutes % 60}m
                </p>
                <p className="text-sm text-gray-400">Total in 30 days</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Weight Change</h3>
                <p className={`text-3xl font-bold ${stats.weightChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}kg
                </p>
                <p className="text-sm text-gray-400">Last 30 days</p>
              </div>
            </>
          )}
          
          {/* BMI Card */}
          {healthInsights && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">BMI Status</h3>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2" style={{ color: healthInsights.bmiColor }}>
                  {healthInsights.bmi}
                </p>
                <p className="text-sm text-gray-300 mb-2">{healthInsights.bmiCategory}</p>
                <div className="text-xs text-gray-400">
                  {healthInsights.height}cm • {healthInsights.weight}kg
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Adaptive Avatar Section */}
        <div className="mb-8">
          <AdaptiveAvatar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">Today's Data</h2>
            
            {/* Unit Toggle */}
            <div className="flex items-center justify-center mb-6">
              <span className="mr-3 text-gray-300">Metric</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!useMetric}
                  onChange={() => setUseMetric(!useMetric)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
              <span className="ml-3 text-gray-300">Imperial</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Water Intake ({useMetric ? 'ml' : 'oz'})
                </label>
                <input
                  type="number"
                  value={water}
                  onChange={(e) => setWater(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                  placeholder={useMetric ? "e.g. 2000" : "e.g. 64"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sleep Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                  placeholder="e.g. 7.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mood (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Type
                </label>
                <input
                  type="text"
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                  placeholder="e.g. Running"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Duration (minutes)
                </label>
                <input
                  type="number"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                  placeholder="e.g. 30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Height ({useMetric ? 'cm' : 'in'})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                    placeholder={useMetric ? "e.g. 180" : "e.g. 70"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight ({useMetric ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                    placeholder={useMetric ? "e.g. 75" : "e.g. 165"}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
              >
                {isSubmitting ? "Saving..." : "Save Today's Data"}
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">Activity Monitor</h2>
            
            {chartData.length > 0 ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-orange-400 mb-4">Water Intake Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="water" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        fill="url(#waterGradient)"
                        fillOpacity={0.3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-blue-400 mb-4">Weight Progress</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        fill="url(#weightGradient)"
                        fillOpacity={0.3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-400">No data available for charts</p>
                <p className="text-gray-500 text-sm mt-2">Start logging your fitness data to see progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Health Insights */}
        {healthInsights && healthInsights.insights.length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">Health Insights</h2>
            <div className="space-y-3">
              {healthInsights.insights.map((insight, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Logs */}
        {logs && logs.length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">Recent Activity</h2>
            <div className="space-y-4">
              {logs.slice(0, 5).map((log) => (
                <div key={log._id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div>
                    <span className="font-medium text-orange-400">{log.date}</span>
                    <div className="text-gray-300 mt-1">
                      <span className="mr-4">💧 {log.water}ml</span>
                      <span className="mr-4">😴 {log.sleep}h</span>
                      <span className="mr-4">😊 {log.mood}/5</span>
                    </div>
                  </div>
                  <div className="text-sm text-blue-400 font-medium">
                    {log.exerciseType} ({log.exerciseDuration}m)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessTracker; 