
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const theme = useTheme();
  const [isSleeping, setIsSleeping] = useState(false);

  // Mock data for last night's sleep
  const lastNightData = {
    duration: '7h 32m',
    score: 82,
    bedtime: '11:15 PM',
    wakeTime: '6:47 AM',
    deepSleep: '2h 15m',
    lightSleep: '4h 45m',
    awakenings: 2,
  };

  const sleepScoreColor = lastNightData.score >= 80 ? colors.success : lastNightData.score >= 60 ? colors.warning : colors.error;

  const handleStartSleep = () => {
    console.log('User tapped Start Sleep button');
    setIsSleeping(!isSleeping);
    // TODO: Backend Integration - POST /api/sleep/sessions to start a new sleep session
    // Body: { startTime: ISO8601 timestamp }
    // Returns: { sessionId, startTime }
  };

  const sleepTip = "Try dimming your lights 30 minutes before bed to help your body prepare for sleep.";
  const suggestedBedtime = "11:00 PM";

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Sleep Master",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLargeTitle: true,
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sleep Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.cardTitle}>Last Night</Text>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNumber, { color: sleepScoreColor }]}>
              {lastNightData.score}
            </Text>
            <Text style={styles.scoreLabel}>Sleep Score</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="bed.double.fill" 
                android_material_icon_name="hotel" 
                size={20} 
                color={colors.textSecondary} 
              />
              <Text style={styles.statValue}>{lastNightData.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="moon.zzz.fill" 
                android_material_icon_name="nightlight" 
                size={20} 
                color={colors.textSecondary} 
              />
              <Text style={styles.statValue}>{lastNightData.deepSleep}</Text>
              <Text style={styles.statLabel}>Deep Sleep</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="waveform" 
                android_material_icon_name="show-chart" 
                size={20} 
                color={colors.textSecondary} 
              />
              <Text style={styles.statValue}>{lastNightData.awakenings}</Text>
              <Text style={styles.statLabel}>Awakenings</Text>
            </View>
          </View>
        </View>

        {/* Sleep Quality Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sleep Breakdown</Text>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownRow}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.breakdownLabel}>Deep Sleep</Text>
            </View>
            <Text style={styles.breakdownValue}>{lastNightData.deepSleep}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownRow}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.secondary }]} />
              <Text style={styles.breakdownLabel}>Light Sleep</Text>
            </View>
            <Text style={styles.breakdownValue}>{lastNightData.lightSleep}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownRow}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.textSecondary }]} />
              <Text style={styles.breakdownLabel}>Awake</Text>
            </View>
            <Text style={styles.breakdownValue}>32m</Text>
          </View>
        </View>

        {/* Daily Tip */}
        <View style={[styles.card, styles.tipCard]}>
          <View style={styles.tipHeader}>
            <IconSymbol 
              ios_icon_name="lightbulb.fill" 
              android_material_icon_name="lightbulb" 
              size={24} 
              color={colors.accent} 
            />
            <Text style={styles.tipTitle}>Today's Tip</Text>
          </View>
          <Text style={styles.tipText}>{sleepTip}</Text>
        </View>

        {/* Suggested Bedtime */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tonight</Text>
          <View style={styles.bedtimeRow}>
            <IconSymbol 
              ios_icon_name="moon.stars.fill" 
              android_material_icon_name="bedtime" 
              size={32} 
              color={colors.accent} 
            />
            <View style={styles.bedtimeInfo}>
              <Text style={styles.bedtimeLabel}>Suggested Bedtime</Text>
              <Text style={styles.bedtimeValue}>{suggestedBedtime}</Text>
            </View>
          </View>
        </View>

        {/* Start Sleep Button */}
        <TouchableOpacity 
          style={[styles.sleepButton, isSleeping && styles.sleepButtonActive]}
          onPress={handleStartSleep}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isSleeping ? [colors.error, '#C85A5A'] : [colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sleepButtonGradient}
          >
            <IconSymbol 
              ios_icon_name={isSleeping ? "stop.fill" : "moon.stars.fill"} 
              android_material_icon_name={isSleeping ? "stop" : "bedtime"} 
              size={32} 
              color={colors.text} 
            />
            <Text style={styles.sleepButtonText}>
              {isSleeping ? 'Stop Sleep Tracking' : 'Start Sleep'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 8,
    borderColor: colors.primary,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.success,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  breakdownLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tipCard: {
    backgroundColor: colors.cardLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bedtimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bedtimeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  bedtimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  bedtimeValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  sleepButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  sleepButtonActive: {
    shadowColor: colors.error,
  },
  sleepButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  sleepButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 100,
  },
});
