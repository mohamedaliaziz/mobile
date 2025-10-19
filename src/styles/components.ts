
// src/styles/components.ts

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { commonStyles } from './common';

export const componentStyles = {
 styles:StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral[500],
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
  },
  documentsList: {
    flex: 1,
    padding: 16,
  },
  documentCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 22,
  },
  documentDescription: {
    fontSize: 14,
    color: colors.neutral[600],
    marginTop: 6,
    lineHeight: 20,
  },
  documentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadDate: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  fileSize: {
    fontSize: 12,
    color: colors.neutral[400],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  expirySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.warning[50],
    borderLeftWidth: 3,
    borderLeftColor: colors.warning[500],
  },
  expiryText: {
    fontSize: 12,
    color: colors.warning[700],
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    fontSize: 16,
    color: colors.neutral[500],
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[600],
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
}),

  // إضافة أنماط المساعد الذكي
aiAssistant: StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.primary,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 6,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  userMessageContent: {
    backgroundColor: colors.primary[500],
  },
  aiMessageContent: {
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.text.inverse,
  },
  aiMessageText: {
    color: colors.text.primary,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.6,
  },
  userTimestamp: {
    color: colors.text.inverse,
    textAlign: 'left',
  },
  aiTimestamp: {
    color: colors.text.secondary,
    textAlign: 'right',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  typingText: {
    fontSize: 14,
    color: colors.neutral[500],
    fontStyle: 'italic',
  },
  quickQuestions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 80,
  },
  quickQuestionChip: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary[200],
    marginRight: 8,
  },
  quickQuestionText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 14,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral[300],
    opacity: 0.6,
  },
}),
  // Header Styles
  header: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
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
      ...typography.h2,
      textAlign: 'center',
    },
    spacer: {
      width: 36,
    },
  }),

  // Upload Component
  upload: StyleSheet.create({
    container: {
      gap: 6,
      marginTop: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    label: {
      ...typography.body,
      fontWeight: '700',
      color: colors.text.primary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
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
      ...typography.buttonSmall,
    },
    fileName: {
      ...typography.mutedSmall,
      marginTop: 2,
    },
  }),

  // Timeline Component
  timeline: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
      paddingHorizontal: 8,
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
      marginTop: 4,
      textAlign: 'center',
    },
    labelActive: {
      color: colors.primary[500],
      fontWeight: '900',
    },
  }),

  // Segmented Control
  segmented: StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
    },
    segment: {
      flex: 1,
      backgroundColor: colors.neutral[100],
      borderColor: colors.neutral[300],
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    segmentActive: {
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[300],
    },
    segmentText: {
      ...typography.body,
      color: colors.neutral[600],
      fontWeight: '700',
    },
    segmentTextActive: {
      color: colors.primary[500],
      fontWeight: '900',
    },
  }),

  // Toggle Switch
  toggle: StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    switch: {
      width: 44,
      height: 26,
      borderRadius: 14,
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    switchOn: {
      backgroundColor: colors.success[500],
    },
    switchOff: {
      backgroundColor: colors.neutral[300],
    },
    thumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.background.primary,
    },
  }),

  // Wallet Card
  wallet: StyleSheet.create({
    card: {
      backgroundColor: colors.background.primary,
      borderRadius: 22,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      ...commonStyles.card,
    },
    title: {
      ...typography.body,
      fontWeight: '800',
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.mutedSmall,
      marginTop: 2,
    },
    points: {
      ...typography.h1,
      color: colors.primary[500],
      lineHeight: 24,
    },
    pointsLabel: {
      ...typography.mutedSmall,
      marginTop: 2,
    },
  }),

  // Service Grid
  services: StyleSheet.create({
    scrollContainer: {
      paddingVertical: 10,
      paddingRight: 14,
    },
    item: {
      width: 132, // ITEM + GAP
      alignItems: 'center',
    },
    circle: {
      width: 116,
      height: 116,
      borderRadius: 58,
      backgroundColor: colors.background.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    title: {
      ...typography.mutedSmall,
      fontWeight: '800',
      color: colors.text.primary,
      textAlign: 'center',
      width: 122,
      marginTop: 8,
    },
    price: {
      ...typography.mutedXSmall,
      marginTop: 2,
    },
  }),

  // WhatsApp Button
  whatsapp: StyleSheet.create({
    button: {
      marginTop: 14,
      backgroundColor: colors.success[500],
      borderRadius: 16,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    text: {
      color: colors.text.inverse,
      fontWeight: '800',
      flex: 1,
    },
  }),

  // Auth Modal
  authModal: StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.background.primary,
      padding: 16,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      gap: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    title: {
      ...typography.h3,
      color: colors.text.primary,
    },
    eyeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      height: 28,
      width: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    note: {
      ...typography.mutedSmall,
      color: colors.neutral[600],
    },
    hint: {
      textAlign: 'center',
      ...typography.mutedSmall,
      color: colors.neutral[500],
      marginTop: 6,
      lineHeight: 18,
    },
  }),

  // Bottom Navigation
  bottomNav: StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 72,
      backgroundColor: colors.background.primary,
      borderTopWidth: 1,
      borderColor: colors.border.light,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    tab: {
      alignItems: 'center',
      paddingVertical: 8,
      minWidth: 100,
      opacity: 0.85,
    },
    tabActive: {
      opacity: 1,
    },
  }),

  inquiry: StyleSheet.create({
    header: {
      alignItems: 'center',
      marginBottom: 24,
      gap: 8,
    },
    title: {
      ...typography.h1,
      textAlign: 'center',
    },
    searchSection: {
      gap: 12,
      marginBottom: 24,
    },
    input: {
      ...commonStyles.input,
      textAlign: 'right',
      fontSize: 16,
    },
    searchButton: {
      ...commonStyles.button,
      flexDirection: 'row',
      gap: 8,
    },
    searchButtonText: {
      ...commonStyles.buttonText,
    },
    results: {
      gap: 16,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      gap: 12,
    },
    emptyStateTitle: {
      ...typography.h3,
      color: colors.neutral[600],
    },
    emptyStateText: {
      ...typography.muted,
      textAlign: 'center',
      lineHeight: 20,
    },
  }),

  // Transfer Status Component - إضافة جديدة
  status: StyleSheet.create({
    container: {
      ...commonStyles.card,
      gap: 12,
    },
    title: {
      ...typography.h3,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      ...typography.body,
      color: colors.neutral[600],
    },
    value: {
      ...typography.body,
      fontWeight: '700',
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      ...typography.mutedSmall,
      color: colors.text.inverse,
      fontWeight: '800',
    },
    description: {
      ...typography.muted,
      lineHeight: 20,
      marginTop: 4,
    },
    notes: {
      backgroundColor: colors.primary[50],
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary[500],
      marginTop: 8,
    },
    notesTitle: {
      ...typography.bodySmall,
      fontWeight: '700',
      color: colors.primary[700],
      marginBottom: 4,
    },
    notesText: {
      ...typography.muted,
      lineHeight: 20,
    },
  }),

  // Documents List Component - إضافة جديدة
  documents: StyleSheet.create({
    container: {
      ...commonStyles.card,
      gap: 12,
    },
    title: {
      ...typography.h3,
      marginBottom: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      backgroundColor: colors.neutral[50],
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    info: {
      flex: 1,
    },
    name: {
      ...typography.body,
      fontWeight: '700',
      marginBottom: 2,
    },
    filename: {
      ...typography.mutedSmall,
    },
  }),

  // Tabs Navigation - إضافة جديدة
  tabs: StyleSheet.create({
    navigator: {
      headerShown: false,
      tabBarActiveTintColor: colors.primary[500],
      tabBarInactiveTintColor: colors.neutral[500],
      tabBarStyle: {
        height: 72,
        backgroundColor: colors.background.primary,
        borderTopColor: colors.border.light,
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 4,
      },
    },
  }),

 inquiry: StyleSheet.create({
    header: {
      alignItems: 'center',
      marginBottom: 24,
      gap: 8,
    },
    title: {
      ...typography.h1,
      textAlign: 'center',
    },
    searchSection: {
      gap: 12,
      marginBottom: 24,
    },
    input: {
      ...commonStyles.input,
      textAlign: 'right',
      fontSize: 16,
    },
    searchButton: {
      ...commonStyles.button,
      flexDirection: 'row',
      gap: 8,
    },
    searchButtonText: {
      ...commonStyles.buttonText,
    },
    results: {
      gap: 16,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      gap: 12,
    },
    emptyStateTitle: {
      ...typography.h3,
      color: colors.neutral[600],
    },
    emptyStateText: {
      ...typography.muted,
      textAlign: 'center',
      lineHeight: 20,
    },
  }),

  // Transfer Status Component - إضافة جديدة
status: StyleSheet.create({
  container: {
    ...commonStyles.card,
    gap: 16,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    ...typography.body,
    color: colors.neutral[600],
    flex: 1,
  },
  value: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'left',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 120,
  },
  badgeText: {
    ...typography.mutedSmall,
    color: colors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  documentFilename: {
    ...typography.mutedSmall,
    color: colors.neutral[500],
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  messageText: {
    ...typography.muted,
    color: colors.primary[700],
    flex: 1,
    lineHeight: 20,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: colors.warning[50],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning[500],
  },
  notesText: {
    ...typography.mutedSmall,
    color: colors.warning[700],
    flex: 1,
    lineHeight: 18,
  },
  pollingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  pollingText: {
    ...typography.mutedXSmall,
    color: colors.neutral[500],
  },
  inputContainer: {
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    padding: 4,
  },
  copyTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  copyText: {
    ...typography.mutedSmall,
    color: colors.primary[500],
    fontWeight: '700',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  loadingText: {
    ...typography.muted,
    color: colors.neutral[600],
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    ...typography.mutedSmall,
    color: colors.neutral[600],
    minWidth: 40,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error[500],
    textAlign: 'center',
    padding: 16,
  },
}),

  // Documents List Component - إضافة جديدة
  documents: StyleSheet.create({
    container: {
      ...commonStyles.card,
      gap: 12,
    },
    title: {
      ...typography.h3,
      marginBottom: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      backgroundColor: colors.neutral[50],
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    info: {
      flex: 1,
    },
    name: {
      ...typography.body,
      fontWeight: '700',
      marginBottom: 2,
    },
    filename: {
      ...typography.mutedSmall,
    },
  }),

  // Tabs Navigation - إضافة جديدة
  tabs: StyleSheet.create({
    navigator: {
      headerShown: false,
      tabBarActiveTintColor: colors.primary[500],
      tabBarInactiveTintColor: colors.neutral[500],
      tabBarStyle: {
        height: 72,
        backgroundColor: colors.background.primary,
        borderTopColor: colors.border.light,
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 4,
      },
    },
  }),

  // Header with Logo - إضافة جديدة
  headerWithLogo: StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    logo: {
      ...typography.h1,
      color: colors.primary[500],
      marginLeft: 8,
    },
    authButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.primary[500],
      borderRadius: 12,
      backgroundColor: colors.background.primary,
      marginLeft: 8,
    },
    authButtonText: {
      ...typography.buttonSmall,
      color: colors.primary[500],
    },
    authButtonRegister: {
      borderColor: colors.success[500],
    },
    authButtonRegisterText: {
      ...typography.buttonSmall,
      color: colors.success[500],
    },
    aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.warning[500],
    borderRadius: 12,
    backgroundColor: colors.warning[50],
    marginLeft: 8,
  },
  aiButtonText: {
    ...typography.buttonSmall,
    color: colors.warning[500],
  },
  }),

  // Service Slider - إضافة جديدة
  serviceSlider: StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    loadingText: {
      ...typography.muted,
      textAlign: 'center',
    },
  }),

  // Phone Section - إضافة جديدة
  phoneSection: StyleSheet.create({
    container: {
      ...commonStyles.card,
      marginTop: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
  }),

  // CTA Section - إضافة جديدة
  ctaSection: StyleSheet.create({
    container: {
      ...commonStyles.card,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  }),

  // Refresh Button - إضافة جديدة
  refreshButton: StyleSheet.create({
    container: {
      marginTop: 4,
    },
    text: {
      fontSize: 11,
      color: colors.primary[500],
      fontWeight: '800',
    },
  }),

  // Loading States - إضافة جديدة
  loading: StyleSheet.create({
    overlay: {
      ...commonStyles.loadingOverlay,
    },
    text: {
      ...typography.muted,
      marginTop: 8,
    },
  }),


  status: StyleSheet.create({
  container: {
    ...commonStyles.card,
    gap: 16,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    ...typography.body,
    color: colors.neutral[600],
    flex: 1,
  },
  value: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'left',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 120,
  },
  badgeText: {
    ...typography.mutedSmall,
    color: colors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  documentFilename: {
    ...typography.mutedSmall,
    color: colors.neutral[500],
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  messageText: {
    ...typography.muted,
    color: colors.primary[700],
    flex: 1,
    lineHeight: 20,
  },
  pollingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  pollingText: {
    ...typography.mutedXSmall,
    color: colors.neutral[500],
  },
  inputContainer: {
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    padding: 4,
  },
  copyTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  copyText: {
    ...typography.mutedSmall,
    color: colors.primary[500],
    fontWeight: '700',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  loadingText: {
    ...typography.muted,
    color: colors.neutral[600],
  },
}),
};
