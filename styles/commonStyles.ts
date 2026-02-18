
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Sleep Master - Calming sleep-focused color palette
export const colors = {
  primary: '#6B5CE7',      // Soft purple - calming and sleep-associated
  secondary: '#9D8DF1',    // Light purple
  accent: '#F4B860',       // Warm gold for highlights
  background: '#0F0E1A',   // Deep navy/black for night theme
  backgroundAlt: '#1A1828', // Slightly lighter background
  text: '#E8E6F0',         // Soft white text
  textSecondary: '#9B97B0', // Muted purple-grey
  card: '#252238',         // Dark purple card background
  cardLight: '#2D2A42',    // Lighter card variant
  success: '#6BCF7F',      // Soft green for good sleep
  warning: '#F4B860',      // Warm gold for warnings
  error: '#E77C7C',        // Soft red for poor sleep
  highlight: '#8B7FF5',    // Bright purple for active states
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: "white",
  },
});
