
import { useState, useEffect, useCallback } from 'react';
import {
  SleepSession,
  getCurrentSession,
  saveCurrentSession,
  clearCurrentSession,
  addSessionToHistory,
  getLastNightSession,
  calculateSleepDuration,
  calculateSleepScore,
  generateSessionId,
  formatDuration,
} from '@/utils/sleepStorage';

export const useSleepTracking = () => {
  const [currentSession, setCurrentSession] = useState<SleepSession | null>(null);
  const [lastNightSession, setLastNightSession] = useState<SleepSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
    try {
      console.log('Loading sleep data...');
      setIsLoading(true);
      
      // Load current session
      const current = await getCurrentSession();
      if (current) {
        setCurrentSession(current);
        setIsSleeping(true);
        console.log('Active sleep session found:', current.id);
      }
      
      // Load last night's session
      const lastNight = await getLastNightSession();
      if (lastNight) {
        setLastNightSession(lastNight);
        console.log('Last night session loaded:', lastNight.id);
      }
    } catch (error) {
      console.error('Error loading sleep data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSleep = useCallback(async () => {
    try {
      console.log('User starting sleep tracking...');
      const newSession: SleepSession = {
        id: generateSessionId(),
        startTime: new Date().toISOString(),
      };
      
      await saveCurrentSession(newSession);
      setCurrentSession(newSession);
      setIsSleeping(true);
      console.log('Sleep tracking started:', newSession);
      
      return newSession;
    } catch (error) {
      console.error('Error starting sleep:', error);
      throw error;
    }
  }, []);

  const stopSleep = useCallback(async () => {
    try {
      if (!currentSession) {
        console.warn('No active session to stop');
        return null;
      }
      
      console.log('User stopping sleep tracking...');
      const endTime = new Date().toISOString();
      const duration = calculateSleepDuration(currentSession.startTime, endTime);
      
      // Generate realistic sleep data based on duration
      const durationHours = duration / 60;
      const deepSleepMinutes = Math.floor(duration * 0.25); // 25% deep sleep
      const lightSleepMinutes = Math.floor(duration * 0.65); // 65% light sleep
      const awakenings = Math.floor(Math.random() * 3) + 1; // 1-3 awakenings
      
      const completedSession: SleepSession = {
        ...currentSession,
        endTime,
        duration,
        deepSleep: deepSleepMinutes,
        lightSleep: lightSleepMinutes,
        awakenings,
      };
      
      // Calculate sleep score
      completedSession.score = calculateSleepScore(completedSession);
      
      // Save to history
      await addSessionToHistory(completedSession);
      
      // Clear current session
      await clearCurrentSession();
      
      // Update state
      setCurrentSession(null);
      setIsSleeping(false);
      setLastNightSession(completedSession);
      
      console.log('Sleep tracking stopped:', completedSession);
      return completedSession;
    } catch (error) {
      console.error('Error stopping sleep:', error);
      throw error;
    }
  }, [currentSession]);

  const toggleSleep = useCallback(async () => {
    if (isSleeping) {
      return await stopSleep();
    } else {
      return await startSleep();
    }
  }, [isSleeping, startSleep, stopSleep]);

  return {
    currentSession,
    lastNightSession,
    isSleeping,
    isLoading,
    startSleep,
    stopSleep,
    toggleSleep,
    reloadData: loadSleepData,
  };
};
