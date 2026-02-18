
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { useSleepTracking } from "@/hooks/useSleepTracking";
import { formatDuration } from "@/utils/sleepStorage";

export default function HomeScreen() {
  const theme = useTheme();
  const { 
    currentSession, 
    lastNightSession, 
    isSleeping, 
    isLoading, 
    toggleSleep 
  } = useSleepTracking();

  // Default data for when no sleep history exists
  const defaultData = {
    duration: '0h 0m',
    score: 0,
    deepSleep: '0h 0m',
    lightSleep: '0h 0m',
    awakenings: 0,
  };

  // Use last night's data if available, otherwise use defaults
  const displayData = lastNightSession ? {
    duration: formatDuration(lastNightSession.duration || 0),
    score: lastNightSession.score || 0,
    deepSleep: formatDuration(lastNightSession.deepSleep || 0),
    lightSleep: formatDuration(lastNightSession.lightSleep || 0),
    awakenings: lastNightSession.awakenings || 0,
  } : defaultData;

  const sleepScoreColor = displayData.score >= 80 ? colors.success : displayData.score >= 60 ? colors.warning : colors.error;

  const handleStartSleep = async () => {
    try {
      console.log('User tapped Start Sleep button');
      await toggleSleep();
    } catch (error) {
      console.error('Error toggling sleep:', error);
    }
  };

  const sleepTip = "Try dimming your lights 30 minutes before bed to help your body prepare for sleep.";
  const suggestedBedtime = "11:00 PM";

  const hasData = lastNightSession !== null;
  const noDataText = "No sleep data yet";
  const startTrackingText = "Start tracking your sleep to see insights here";

  if (isLoading) {
    const loadingText = "Loading...";
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
        <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{loadingText}</Text>
        </View>
      </React.Fragment>
    );
  }

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
          <Text style={styles.cardTitle}>{hasData ? 'Last Night' : 'Sleep Score'}</Text>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNumber, { color: sleepScoreColor }]}>
              {displayData.score}
            </Text>
            <Text style={styles.scoreLabel}>Sleep Score</Text>
          </View>
          {!hasData && (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
              {startTrackingText}
            </Text>
          )}
          {hasData && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="bed.double.fill" 
                  android_material_icon_name="hotel" 
                  size={20} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.statValue}>{displayData.duration}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="moon.zzz.fill" 
                  android_material_icon_name="nightlight" 
                  size={20} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.statValue}>{displayData.deepSleep}</Text>
                <Text style={styles.statLabel}>Deep Sleep</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="waveform" 
                  android_material_icon_name="show-chart" 
                  size={20} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.statValue}>{displayData.awakenings}</Text>
                <Text style={styles.statLabel}>Awakenings</Text>
              </View>
            </View>
          )}
        </View>

        {/* Sleep Quality Breakdown */}
        {hasData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sleep Breakdown</Text>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <View style={[styles.breakdownDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.breakdownLabel}>Deep Sleep</Text>
              </View>
              <Text style={styles.breakdownValue}>{displayData.deepSleep}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <View style={[styles.breakdownDot, { backgroundColor: colors.secondary }]} />
                <Text style={styles.breakdownLabel}>Light Sleep</Text>
              </View>
              <Text style={styles.breakdownValue}>{displayData.lightSleep}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <View style={[styles.breakdownDot, { backgroundColor: colors.textSecondary }]} />
                <Text style={styles.breakdownLabel}>Awake</Text>
              </View>
              <Text style={styles.breakdownValue}>
                {formatDuration((lastNightSession?.duration || 0) - (lastNightSession?.deepSleep || 0) - (lastNightSession?.lightSleep || 0))}
              </Text>
            </View>
          </View>
        )}

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

        {/* Current Session Info */}
        {isSleeping && currentSession && (
          <View style={[styles.card, styles.activeSessionCard]}>
            <View style={styles.activeSessionHeader}>
              <View style={styles.pulsingDot} />
              <Text style={styles.activeSessionText}>Sleep tracking active</Text>
            </View>
            <Text style={[styles.activeSessionTime, { color: colors.textSecondary }]}>
              Started at {new Date(currentSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}

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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
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
  noDataText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
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
  activeSessionCard: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  activeSessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    marginRight: 12,
  },
  activeSessionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  activeSessionTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});
