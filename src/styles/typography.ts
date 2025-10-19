
// src/styles/typography.ts
import { StyleSheet } from 'react-native';

export const typography = {
  // Headings
  h1: {
    fontSize: 24,
    fontWeight: '900' as const,
    lineHeight: 32,
    color: '#0f172a',
  },
  h2: {
    fontSize: 20,
    fontWeight: '900' as const,
    lineHeight: 28,
    color: '#0f172a',
  },
  h3: {
    fontSize: 18,
    fontWeight: '800' as const,
    lineHeight: 24,
    color: '#0f172a',
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: '#374151',
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: '#374151',
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: '#374151',
  },
  
  // Muted Text
  mutedLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: '#64748b',
  },
  muted: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: '#64748b',
  },
  mutedSmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: '#64748b',
  },
  mutedXSmall: {
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 12,
    color: '#64748b',
  },
  
  // Button Text
  buttonLarge: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#ffffff',
  },
  button: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#ffffff',
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: '#ffffff',
  },
};

export const textStyles = StyleSheet.create(typography);