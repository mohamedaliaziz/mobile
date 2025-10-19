import { StyleSheet } from 'react-native';
import { colors } from '../colors';

export const tabStyles = StyleSheet.create({
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
  tabBar: {
    height: 72,
    backgroundColor: colors.background.primary,
    borderTopColor: colors.border.light,
    borderTopWidth: 1,
  },
});