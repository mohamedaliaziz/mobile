import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles';

interface TabIconProps {
  focused: boolean;
  icon: {
    focused: string;
    outline: string;
  };
  size: number;
}

export const TabIcon: React.FC<TabIconProps> = memo(({ 
  focused, 
  icon, 
  size 
}) => {
  const iconName = focused ? icon.focused : icon.outline;
  const color = focused ? colors.primary[500] : colors.neutral[500];

  return (
    <Ionicons 
      name={iconName as any} 
      size={size} 
      color={color} 
    />
  );
});