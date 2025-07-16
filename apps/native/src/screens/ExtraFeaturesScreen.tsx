import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign, Feather } from "@expo/vector-icons";
import { darkTheme } from "../theme";
import AdaptiveAvatar from "../components/AdaptiveAvatar";

const { width } = Dimensions.get("window");

const ExtraFeaturesScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color={darkTheme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>DF</Text>
            </View>
            <Text style={styles.title}>DailyForm</Text>
          </View>
          <Text style={styles.subtitle}>Advanced Features & Analytics</Text>
        </View>
      </View>

      {/* Adaptive Avatar Section */}
      <View style={styles.avatarSection}>
        <AdaptiveAvatar />
      </View>

      {/* How Your Inputs Affect the Avatar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How Your Inputs Affect the Avatar</Text>
        
        <View style={styles.effectsGrid}>
          {/* Water Intake Effects */}
          <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
              <View style={[styles.effectIcon, { backgroundColor: "rgba(59, 130, 246, 0.2)" }]}>
                <Text style={styles.effectEmoji}>💧</Text>
              </View>
              <Text style={styles.effectTitle}>Water Intake</Text>
            </View>
            <View style={styles.effectList}>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.effectText}>60%+ daily goal: Blue hydration waves appear</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.effectText}>80%+ daily goal: Radiant golden glow around head</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.effectText}>90%+ daily goal: Sparkles appear around avatar</Text>
              </View>
            </View>
          </View>

          {/* Exercise Effects */}
          <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
              <View style={[styles.effectIcon, { backgroundColor: "rgba(245, 158, 11, 0.2)" }]}>
                <Text style={styles.effectEmoji}>💪</Text>
              </View>
              <Text style={styles.effectTitle}>Exercise</Text>
            </View>
            <View style={styles.effectList}>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#FBBF24" }]} />
                <Text style={styles.effectText}>40%+ muscle level: Chest muscle definition appears</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#FBBF24" }]} />
                <Text style={styles.effectText}>50%+ muscle level: Arms get slightly bulkier</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#FBBF24" }]} />
                <Text style={styles.effectText}>70%+ muscle level: Sweat drops appear</Text>
              </View>
            </View>
          </View>

          {/* Sleep Effects */}
          <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
              <View style={[styles.effectIcon, { backgroundColor: "rgba(147, 51, 234, 0.2)" }]}>
                <Text style={styles.effectEmoji}>😴</Text>
              </View>
              <Text style={styles.effectTitle}>Sleep Quality</Text>
            </View>
            <View style={styles.effectList}>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#A78BFA" }]} />
                <Text style={styles.effectText}>&lt;6 hours: Dark circles under eyes</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#A78BFA" }]} />
                <Text style={styles.effectText}>&lt;6 hours: Avatar becomes gray/tired</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#A78BFA" }]} />
                <Text style={styles.effectText}>7-9 hours: Bright, energetic appearance</Text>
              </View>
            </View>
          </View>

          {/* Mood Effects */}
          <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
              <View style={[styles.effectIcon, { backgroundColor: "rgba(34, 197, 94, 0.2)" }]}>
                <Text style={styles.effectEmoji}>😊</Text>
              </View>
              <Text style={styles.effectTitle}>Mood</Text>
            </View>
            <View style={styles.effectList}>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.effectText}>&gt;3/5: Bright, alert eyes</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.effectText}>&gt;3/5: Smiling expression</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.effectText}>&lt;3/5: Frowning expression</Text>
              </View>
            </View>
          </View>

          {/* BMI Effects */}
          <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
              <View style={[styles.effectIcon, { backgroundColor: "rgba(249, 115, 22, 0.2)" }]}>
                <Text style={styles.effectEmoji}>📊</Text>
              </View>
              <Text style={styles.effectTitle}>BMI Changes</Text>
            </View>
            <View style={styles.effectList}>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#FB923C" }]} />
                <Text style={styles.effectText}>Body width adjusts based on BMI</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#FB923C" }]} />
                <Text style={styles.effectText}>Proportions change realistically</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#FB923C" }]} />
                <Text style={styles.effectText}>Maintains healthy appearance</Text>
              </View>
            </View>
          </View>

          {/* Energy Level Effects */}
          <View style={styles.effectCard}>
            <View style={styles.effectHeader}>
              <View style={[styles.effectIcon, { backgroundColor: "rgba(34, 197, 94, 0.2)" }]}>
                <Text style={styles.effectEmoji}>⚡</Text>
              </View>
              <Text style={styles.effectTitle}>Energy Level</Text>
            </View>
            <View style={styles.effectList}>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.effectText}>&gt;70%: Green energy aura appears</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.effectText}>Based on sleep + mood combination</Text>
              </View>
              <View style={styles.effectItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.effectText}>Dotted pattern shows vitality</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Feature Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Features</Text>
        
        <View style={styles.featureCards}>
          {/* Real-time Avatar */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: "rgba(249, 115, 22, 0.2)" }]}>
              <Text style={styles.featureEmoji}>👤</Text>
            </View>
            <Text style={styles.featureTitle}>Adaptive Avatar</Text>
            <Text style={styles.featureDescription}>
              Your avatar changes based on your real fitness data - BMI, muscle definition, hydration, and energy levels.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#FB923C" }]} />
                <Text style={styles.featureItemText}>Body proportions based on BMI</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#FBBF24" }]} />
                <Text style={styles.featureItemText}>Muscle definition from exercise</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.featureItemText}>Hydration effects and waves</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.featureItemText}>Energy aura from sleep & mood</Text>
              </View>
            </View>
          </View>

          {/* Health Analytics */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: "rgba(59, 130, 246, 0.2)" }]}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <Text style={styles.featureTitle}>Health Analytics</Text>
            <Text style={styles.featureDescription}>
              Advanced health insights and personalized recommendations based on your data patterns.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.featureItemText}>BMI tracking and categorization</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.featureItemText}>Exercise intensity analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.featureItemText}>Sleep quality assessment</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#60A5FA" }]} />
                <Text style={styles.featureItemText}>Mood correlation insights</Text>
              </View>
            </View>
          </View>

          {/* Progress Tracking */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: "rgba(34, 197, 94, 0.2)" }]}>
              <Text style={styles.featureEmoji}>📈</Text>
            </View>
            <Text style={styles.featureTitle}>Progress Tracking</Text>
            <Text style={styles.featureDescription}>
              Visual progress tracking with interactive charts and trend analysis over time.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.featureItemText}>Weight and body composition</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.featureItemText}>Exercise performance trends</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.featureItemText}>Sleep pattern analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.bullet, { backgroundColor: "#4ADE80" }]} />
                <Text style={styles.featureItemText}>Mood and wellness tracking</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: darkTheme.colors.primary,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: darkTheme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "linear-gradient(135deg, #F97316, #EA580C)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    color: darkTheme.colors.text,
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  title: {
    fontSize: RFValue(32),
    fontWeight: "bold",
    color: darkTheme.colors.text,
  },
  subtitle: {
    fontSize: RFValue(16),
    color: darkTheme.colors.textSecondary,
    textAlign: "center",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: darkTheme.colors.background,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: darkTheme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  effectsGrid: {
    gap: 16,
  },
  effectCard: {
    backgroundColor: darkTheme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  effectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  effectIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  effectEmoji: {
    fontSize: RFValue(20),
  },
  effectTitle: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: darkTheme.colors.text,
  },
  effectList: {
    gap: 8,
  },
  effectItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  effectText: {
    fontSize: RFValue(12),
    color: darkTheme.colors.textSecondary,
    flex: 1,
  },
  featureCards: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: darkTheme.colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: RFValue(24),
  },
  featureTitle: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: darkTheme.colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: RFValue(12),
    color: darkTheme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureItemText: {
    fontSize: RFValue(10),
    color: darkTheme.colors.textSecondary,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ExtraFeaturesScreen; 