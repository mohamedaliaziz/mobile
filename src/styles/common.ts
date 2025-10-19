// src/styles/common.ts

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';

export const commonStyles = StyleSheet.create({
  
  gradientBackground: {
    flex: 1,
  },
  modalGradient: {
    borderRadius: 20,
    padding: 0, // إزالة البادنج الأساسي
    overflow: 'hidden', // علشان الخلفية المتدرجة ما تطلع برا
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  formBackground: {
    backgroundColor: colors.background.primary,
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  auth: {
    container: {
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    
    title: {
      ...typography.h2,
      color: colors.text.primary,
    },
    
    inputGroup: {
      marginBottom: 16,
    },
    
    label: {
      ...typography.body,
      fontWeight: '700',
      marginBottom: 8,
      color: colors.text.primary,
    },
    
    footer: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    
    switchText: {
      ...typography.muted,
      textAlign: 'center',
    },
    
    switchLink: {
      color: colors.primary[500],
      fontWeight: '700',
    },
  },

  // أنماط الرفع (Upload)
  upload: {
    button: {
      backgroundColor: colors.primary[500],
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
    },
    buttonText: {
      color: colors.text.inverse,
      fontWeight: '800',
      fontSize: 12,
    },
    fileName: {
      ...typography.mutedSmall,
      color: colors.text.secondary,
    },
  },

  // أنماط الجدول الزمني (Timeline)
  timeline: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      position: 'relative',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.neutral[300],
    },
    dotActive: {
      backgroundColor: colors.primary[500],
    },
    bar: {
      height: 2,
      backgroundColor: colors.neutral[300],
      position: 'absolute',
      left: '50%',
      right: '-50%',
      top: 4,
    },
    barActive: {
      backgroundColor: colors.primary[500],
    },
    label: {
      ...typography.mutedXSmall,
      color: colors.text.secondary,
      marginTop: 4,
      textAlign: 'center',
    },
    labelActive: {
      color: colors.primary[500],
      fontWeight: '900',
    },
  },

  // أنماط الهيدر
  header: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.primary[200],
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text.primary,
    },
    spacer: {
      width: 36,
    },
  },
  // Layout
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 140,
  },
  scrollContainerNoPadding: {
    flexGrow: 1,
  },
  
  // Cards
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  cardSmall: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 8,
  },
  
  // Buttons
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  buttonSuccess: {
    backgroundColor: colors.success[500],
  },
  buttonWarning: {
    backgroundColor: colors.warning[500],
  },
  buttonError: {
    backgroundColor: colors.error[500],
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  buttonDisabled: {
    backgroundColor: colors.neutral[300],
    opacity: 0.6,
  },
  
  // Inputs
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...typography.body,
  },
  inputFocused: {
    borderColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error[500],
  },
  
  // Badges
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.primary[100],
    borderWidth: 1,
    borderColor: colors.primary[300],
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...typography.mutedXSmall,
    color: colors.primary[700],
    fontWeight: '800',
  },
  badgeMuted: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[300],
  },
  badgeMutedText: {
    color: colors.neutral[600],
  },
  
  // Separators
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 12,
  },
  separatorSmall: {
    marginVertical: 8,
  },
  
  // Loading States
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  // Utility Classes
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});