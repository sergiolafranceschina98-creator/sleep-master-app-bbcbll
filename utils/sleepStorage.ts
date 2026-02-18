
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CURRENT_SESSION: '@sleep_master:current_session',
  SLEEP_HISTORY: '@sleep_master:sleep_history',
  SETTINGS: '@sleep_master:settings',
};

export interface SleepSession {
  id: string;
  startTime: string; // ISO 8601 format
  endTime?: string; // ISO 8601 format
  duration?: number; // in minutes
  score?: number;
  deepSleep?: number; // in minutes
  lightSleep?: number; // in minutes
  awakenings?: number;
  notes?: string;
}

export interface SleepSettings {
  suggestedBedtime: string;
  suggestedWakeTime: string;
  sleepGoalHours: number;
}

// Current Session Management
export const saveCurrentSession = async (session: SleepSession): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    console.log('Sleep session saved:', session);
  } catch (error) {
    console.error('Error saving current session:', error);
    throw error;
  }
};

export const getCurrentSession = async (): Promise<SleepSession | null> => {
  try {
    const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      console.log('Current session loaded:', session);
      return session;
    }
    return null;
  } catch (error) {
    console.error('Error loading current session:', error);
    return null;
  }
};

export const clearCurrentSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    console.log('Current session cleared');
  } catch (error) {
    console.error('Error clearing current session:', error);
    throw error;
  }
};

// Sleep History Management
export const saveSleepHistory = async (sessions: SleepSession[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SLEEP_HISTORY, JSON.stringify(sessions));
    console.log('Sleep history saved, total sessions:', sessions.length);
  } catch (error) {
    console.error('Error saving sleep history:', error);
    throw error;
  }
};

export const getSleepHistory = async (): Promise<SleepSession[]> => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_HISTORY);
    if (historyData) {
      const history = JSON.parse(historyData);
      console.log('Sleep history loaded, total sessions:', history.length);
      return history;
    }
    return [];
  } catch (error) {
    console.error('Error loading sleep history:', error);
    return [];
  }
};

export const addSessionToHistory = async (session: SleepSession): Promise<void> => {
  try {
    const history = await getSleepHistory();
    history.unshift(session); // Add to beginning
    // Keep only last 90 days of data
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const filteredHistory = history.filter(s => new Date(s.startTime) > ninetyDaysAgo);
    await saveSleepHistory(filteredHistory);
    console.log('Session added to history:', session.id);
  } catch (error) {
    console.error('Error adding session to history:', error);
    throw error;
  }
};

export const getLastNightSession = async (): Promise<SleepSession | null> => {
  try {
    const history = await getSleepHistory();
    if (history.length === 0) {
      return null;
    }
    // Get the most recent completed session
    const completedSessions = history.filter(s => s.endTime);
    if (completedSessions.length === 0) {
      return null;
    }
    return completedSessions[0];
  } catch (error) {
    console.error('Error getting last night session:', error);
    return null;
  }
};

// Settings Management
export const saveSettings = async (settings: SleepSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    console.log('Settings saved:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const getSettings = async (): Promise<SleepSettings> => {
  try {
    const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (settingsData) {
      return JSON.parse(settingsData);
    }
    // Default settings
    return {
      suggestedBedtime: '11:00 PM',
      suggestedWakeTime: '7:00 AM',
      sleepGoalHours: 8,
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      suggestedBedtime: '11:00 PM',
      suggestedWakeTime: '7:00 AM',
      sleepGoalHours: 8,
    };
  }
};

// Utility Functions
export const calculateSleepDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  return Math.floor(durationMs / (1000 * 60)); // Convert to minutes
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const calculateSleepScore = (session: SleepSession): number => {
  if (!session.duration) {
    return 0;
  }
  
  // Simple scoring algorithm
  let score = 0;
  
  // Duration score (0-40 points) - optimal is 7-9 hours
  const durationHours = session.duration / 60;
  if (durationHours >= 7 && durationHours <= 9) {
    score += 40;
  } else if (durationHours >= 6 && durationHours < 7) {
    score += 30;
  } else if (durationHours >= 5 && durationHours < 6) {
    score += 20;
  } else {
    score += 10;
  }
  
  // Deep sleep score (0-30 points) - should be 20-25% of total
  if (session.deepSleep) {
    const deepSleepPercentage = (session.deepSleep / session.duration) * 100;
    if (deepSleepPercentage >= 20 && deepSleepPercentage <= 25) {
      score += 30;
    } else if (deepSleepPercentage >= 15 && deepSleepPercentage < 20) {
      score += 20;
    } else {
      score += 10;
    }
  }
  
  // Awakenings score (0-30 points) - fewer is better
  if (session.awakenings !== undefined) {
    if (session.awakenings === 0) {
      score += 30;
    } else if (session.awakenings === 1) {
      score += 25;
    } else if (session.awakenings === 2) {
      score += 20;
    } else if (session.awakenings <= 4) {
      score += 10;
    } else {
      score += 5;
    }
  }
  
  return Math.min(100, score);
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
