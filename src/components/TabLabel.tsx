import React, { memo } from 'react';
import { Text } from 'react-native';
import { colors, typography } from '../styles';

interface TabLabelProps {
  focused: boolean;
  label: string;
}

export const TabLabel: React.FC<TabLabelProps> = memo(({ 
  focused, 
  label 
}) => {
  const color = focused ? colors.primary[500] : colors.neutral[500];
  
  return (
    <Text style={[typography.mutedXSmall, { 
      color, 
      fontWeight: '800',
      marginBottom: 4,
    }]}>
      {label}
    </Text>
  );
});