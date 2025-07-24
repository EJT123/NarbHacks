import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";

export default function LoginScreen({ navigation }) {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn, isLoaded } = useAuth();

  const onPress = React.useCallback(async () => {
    if (!isLoaded) {
      Alert.alert("Please wait", "Authentication is still loading.");
      return;
    }
    if (isSignedIn) {
      Alert.alert("Already Signed In", "You are already signed in.");
      return;
    }
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        navigation.navigate("NotesDashboardScreen");
      }
    } catch (err) {
      Alert.alert("Login Error", err?.message || "An error occurred during login.");
      console.error("OAuth error", err);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Logo and Branding */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>DF</Text>
            <View style={styles.logoPulse} />
          </View>
        </View>
        <Text style={styles.appName}>DailyForm</Text>
        <Text style={styles.tagline}>Track. Transform. Thrive.</Text>
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome to DailyForm</Text>
        <Text style={styles.welcomeSubtitle}>
          Your personal fitness and wellness companion. Start your journey to better health today.
        </Text>
      </View>

      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={onPress}>
          <View style={styles.buttonContent}>
            <AntDesign name="google" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>

      {/* Features Preview */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <AntDesign name="linechart" size={16} color="#F97316" />
          </View>
          <Text style={styles.featureText}>Smart Analytics</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <AntDesign name="heart" size={16} color="#3B82F6" />
          </View>
          <Text style={styles.featureText}>Health Insights</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <AntDesign name="sync" size={16} color="#10B981" />
          </View>
          <Text style={styles.featureText}>Real-time Sync</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#111827',
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#F97316",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoPulse: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  googleButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 18,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  featureItem: {
    alignItems: "center",
  },
  featureIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#1F2937",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
