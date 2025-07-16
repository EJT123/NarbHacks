import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

const { width } = Dimensions.get('window');

const AdaptiveAvatar = () => {
  const logs = useQuery(api.fitness.getFitnessLogs);

  const getAvatarParams = () => {
    if (!logs || logs.length === 0) return {
      bodyWidth: 80,
      muscleDefinition: 30,
      hydrationLevel: 50,
      energyLevel: 60,
      avgSleep: 7,
      avgMood: 3
    };

    const recentLogs = logs.slice(0, 7);
    const totalExercise = recentLogs.reduce((sum, log) => sum + log.exerciseDuration, 0);
    const muscleDefinition = Math.min(100, totalExercise / 10);
    const avgWater = recentLogs.reduce((sum, log) => sum + log.water, 0) / recentLogs.length;
    const hydrationLevel = Math.min(100, (avgWater / 2000) * 100);
    const avgSleep = recentLogs.reduce((sum, log) => sum + log.sleep, 0) / recentLogs.length;
    const avgMood = recentLogs.reduce((sum, log) => sum + log.mood, 0) / recentLogs.length;
    const energyLevel = Math.min(100, ((avgSleep / 8) + (avgMood / 5)) * 50);

    return {
      bodyWidth: 80,
      muscleDefinition,
      hydrationLevel,
      energyLevel,
      avgSleep,
      avgMood
    };
  };

  const { bodyWidth, muscleDefinition, hydrationLevel, energyLevel, avgSleep, avgMood } = getAvatarParams();

  return (
    <View style={styles.container}>
      <Svg width={width * 0.7} height={350} style={styles.avatarSvg}>
        <Defs>
          <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="muscleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
          </LinearGradient>
          <LinearGradient id="hydrationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="radiantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FCD34D" stopOpacity="0.6" />
            <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
          </LinearGradient>
        </Defs>

        {/* Energy Aura */}
        {energyLevel > 70 && (
          <Circle
            cx={width * 0.35}
            cy={175}
            r={120}
            fill="none"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        )}

        {/* Radiant Glow (excellent hydration) */}
        {hydrationLevel > 80 && (
          <Circle
            cx={width * 0.35}
            cy={175}
            r={110}
            fill="url(#radiantGradient)"
            opacity="0.4"
          />
        )}

        {/* Head */}
        <Circle
          cx={width * 0.35}
          cy={80}
          r={25}
          fill="url(#bodyGradient)"
        />

        {/* Eyes */}
        <Circle
          cx={width * 0.35 - 8}
          cy={75}
          r={3}
          fill={avgMood > 3 ? "#FFFFFF" : "#374151"}
        />
        <Circle
          cx={width * 0.35 + 8}
          cy={75}
          r={3}
          fill={avgMood > 3 ? "#FFFFFF" : "#374151"}
        />

        {/* Dark circles under eyes (poor sleep) */}
        {avgSleep < 6 && (
          <>
            <Circle
              cx={width * 0.35 - 8}
              cy={75}
              r={5}
              fill="#1F2937"
              opacity="0.3"
            />
            <Circle
              cx={width * 0.35 + 8}
              cy={75}
              r={5}
              fill="#1F2937"
              opacity="0.3"
            />
          </>
        )}

        {/* Mouth expression based on mood */}
        <Path
          d={avgMood > 3 
            ? `M ${width * 0.35 - 8} 85 Q ${width * 0.35} 90 ${width * 0.35 + 8} 85`
            : `M ${width * 0.35 - 8} 90 Q ${width * 0.35} 85 ${width * 0.35 + 8} 90`
          }
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
        />

        {/* Body */}
        <Rect
          x={width * 0.35 - bodyWidth / 2}
          y={105}
          width={bodyWidth}
          height={120}
          rx={bodyWidth / 2}
          fill="url(#bodyGradient)"
        />

        {/* Muscle definition (chest) */}
        {muscleDefinition > 40 && (
          <Rect
            x={width * 0.35 - (bodyWidth + 10) / 2}
            y={115}
            width={bodyWidth + 10}
            height={40}
            rx={(bodyWidth + 10) / 2}
            fill="url(#muscleGradient)"
            opacity={muscleDefinition / 100}
          />
        )}

        {/* Arms */}
        <Rect
          x={width * 0.35 - bodyWidth / 2 - 15}
          y={115}
          width={15}
          height={80}
          rx={7.5}
          fill="url(#bodyGradient)"
        />
        <Rect
          x={width * 0.35 + bodyWidth / 2}
          y={115}
          width={15}
          height={80}
          rx={7.5}
          fill="url(#bodyGradient)"
        />

        {/* Muscle definition (arms) */}
        {muscleDefinition > 50 && (
          <>
            <Rect
              x={width * 0.35 - bodyWidth / 2 - 18}
              y={115}
              width={18}
              height={80}
              rx={9}
              fill="url(#muscleGradient)"
              opacity={muscleDefinition / 100}
            />
            <Rect
              x={width * 0.35 + bodyWidth / 2}
              y={115}
              width={18}
              height={80}
              rx={9}
              fill="url(#muscleGradient)"
              opacity={muscleDefinition / 100}
            />
          </>
        )}

        {/* Sweat drops (intense exercise) */}
        {muscleDefinition > 70 && (
          <>
            <Circle
              cx={width * 0.35 - bodyWidth / 2 - 25}
              cy={100}
              r={2}
              fill="#3B82F6"
              opacity="0.7"
            />
            <Circle
              cx={width * 0.35 + bodyWidth / 2 + 25}
              cy={95}
              r={1.5}
              fill="#3B82F6"
              opacity="0.7"
            />
            <Circle
              cx={width * 0.35 - bodyWidth / 2 - 22}
              cy={90}
              r={1.8}
              fill="#3B82F6"
              opacity="0.7"
            />
          </>
        )}

        {/* Legs */}
        <Rect
          x={width * 0.35 - bodyWidth / 2}
          y={225}
          width={bodyWidth / 2 - 5}
          height={80}
          rx={bodyWidth / 4}
          fill="url(#bodyGradient)"
        />
        <Rect
          x={width * 0.35 + 5}
          y={225}
          width={bodyWidth / 2 - 5}
          height={80}
          rx={bodyWidth / 4}
          fill="url(#bodyGradient)"
        />

        {/* Hydration waves */}
        {hydrationLevel > 60 && (
          <>
            <Path
              d={`M ${width * 0.35 - 60} 200 Q ${width * 0.35 - 30} 195 ${width * 0.35} 200 Q ${width * 0.35 + 30} 205 ${width * 0.35 + 60} 200`}
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <Path
              d={`M ${width * 0.35 - 60} 210 Q ${width * 0.35 - 30} 205 ${width * 0.35} 210 Q ${width * 0.35 + 30} 215 ${width * 0.35 + 60} 210`}
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </>
        )}

        {/* Sparkles (excellent hydration) */}
        {hydrationLevel > 90 && (
          <>
            <Circle
              cx={width * 0.35 - 18}
              cy={50}
              r={1.5}
              fill="#FCD34D"
              opacity="0.8"
            />
            <Circle
              cx={width * 0.35 + 18}
              cy={55}
              r={1}
              fill="#FCD34D"
              opacity="0.8"
            />
            <Circle
              cx={width * 0.35 - 23}
              cy={65}
              r={1.2}
              fill="#FCD34D"
              opacity="0.8"
            />
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSvg: {
    alignSelf: 'center',
  },
});

export default AdaptiveAvatar; 