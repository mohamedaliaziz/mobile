// src/styles/authStyles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  // Modal Container
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.85,
    backgroundColor: colors.background.primary,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
    borderRadius: 8,
  },

  // Content
  scrollContent: {
    flexGrow: 1,
  },

  // Profile Card
  profileCard: {
    backgroundColor: colors.primary[50],
    margin: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary[700],
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: colors.primary[600],
  },

  // Welcome Section
  welcomeSection: {
    backgroundColor: colors.background.primary,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[600],
    textAlign: 'center',
    marginBottom: 4,
  },
  motivationalText: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.primary[500],
    lineHeight: 18,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
    color: colors.neutral[500],
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Sections
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.primary[200],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.primary[700],
  },

  // Transfer Stats
  transferStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transferStat: {
    alignItems: 'center',
    flex: 1,
  },
  transferCount: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  transferLabel: {
    fontSize: 10,
  },

  // Documents List
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
  },
  documentName: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  documentDate: {
    fontSize: 10,
    color: colors.primary[500],
  },

  // Achievements
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 10,
    color: colors.primary[700],
    fontWeight: '700',
  },

  // Form
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text.primary,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    fontSize: 14,
    textAlign: 'right',
  },

  // Password Input
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },

  // Buttons
  submitButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral[300],
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text.inverse,
  },
  logoutButton: {
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[500],
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.error[500],
  },

  // Auth Switch
  authSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  // Help Text
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    color: colors.neutral[500],
  },

  // Empty State
  emptyStateText: {
    fontSize: 12,
    color: colors.neutral[500],
    textAlign: 'center',
  },
});