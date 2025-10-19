// mobile/src/components/ActiveTransferBanner.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, typography } from '../styles';

interface ActiveTransferBannerProps {
  clientRef: string;
  currentStep: number;
  currentStepLabel: string;
  onResume: () => void;
  onDismiss: () => void;
}

interface ActiveTransferBannerProps {
  clientRef: string;
  currentStep: number;
  currentStepLabel: string;
   progressPercentage: number;
  onResume: () => void;
  onDismiss: () => void;
}

export const ActiveTransferBanner: React.FC<ActiveTransferBannerProps> = ({
  clientRef,
  // currentStep,
  currentStepLabel,
  progressPercentage,
  onResume,
  onDismiss,
}) => {
  // ✅ حساب النسبة بناءً على عدد الخطوات الفعلي
  const totalSteps = 5; // إجمالي الخطوات

  return (
    <View style={[
      commonStyles.card, 
      { 
        backgroundColor: colors.primary[50], 
        borderColor: colors.primary[200],
        borderWidth: 1,
        marginBottom: 16,
      }
    ]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="time-outline" size={18} color={colors.primary[600]} />
            <Text style={[typography.body, { fontWeight: '700', color: colors.primary[700] }]}>
              معاملة قيد التنفيذ
            </Text>
          </View>
          
          <Text style={[typography.mutedSmall, { color: colors.primary[600], marginBottom: 2 }]}>
            المرجع: <Text style={{ fontWeight: '700' }}>{clientRef}</Text>
          </Text>
          
          <Text style={[typography.mutedSmall, { color: colors.primary[600] }]}>
            الخطوة الحالية: <Text style={{ fontWeight: '700' }}>{currentStepLabel}</Text>
          </Text>
        </View> 

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <TouchableOpacity 
            onPress={onResume}
            style={[
              commonStyles.button, 
              commonStyles.buttonSmall, 
              { 
                backgroundColor: colors.primary[500],
                paddingHorizontal: 12,
              }
            ]}
          >
            <Text style={commonStyles.buttonText}>استئناف</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onDismiss}
            style={[
              commonStyles.button, 
              commonStyles.buttonSmall, 
              commonStyles.buttonOutline,
              { 
                paddingHorizontal: 8,
                minWidth: 36,
              }
            ]}
          >
            <Ionicons name="close-outline" size={16} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginTop: 12 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 4 
        }}>
          <Text style={[typography.mutedXSmall, { color: colors.primary[600] }]}>
            التقدم
          </Text>
          <Text style={[typography.mutedXSmall, { color: colors.primary[600] }]}>
            {progressPercentage}%
          </Text>
        </View>
        <View style={{
          height: 6,
          backgroundColor: colors.primary[200],
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <View style={{
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: colors.primary[500],
            borderRadius: 3,
          }} />
        </View>
      </View>
    </View>
  );
};