import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles, colors, typography } from '../styles';

interface WalletCardProps {
  points: number | null;
  checkingWallet: boolean;
  onRefresh: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = memo(({
  points,
  checkingWallet,
  onRefresh,
}) => (
  <View style={componentStyles.wallet.card}>
    <Ionicons name="wallet-outline" size={24} color={colors.primary[500]} />
    
    <View style={componentStyles.wallet.info}>
      <Text style={componentStyles.wallet.title}>محفظتك</Text>
      <Text style={componentStyles.wallet.subtitle}>
        اجمع نقاطك واستبدلها بخصومات على الخدمات.
      </Text>
    </View>
    
    <View style={componentStyles.wallet.points}>
      {checkingWallet ? (
        <ActivityIndicator size="small" color={colors.primary[500]} />
      ) : (
        <>
          <Text style={componentStyles.wallet.pointsValue}>
            {points === null ? '—' : points}
          </Text>
          <Text style={componentStyles.wallet.pointsLabel}>نقطة</Text>
        </>
      )}
      
      <TouchableOpacity onPress={onRefresh} style={componentStyles.wallet.refreshButton}>
        <Text style={componentStyles.wallet.refreshText}>تحديث</Text>
      </TouchableOpacity>
    </View>
  </View>
));