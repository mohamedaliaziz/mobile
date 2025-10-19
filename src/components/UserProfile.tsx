// mobile/src/components/UserProfile.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, typography } from '../styles';

interface UserProfileProps {
  user: any;
  onEditProfile: () => void;
  onLogout: () => void;
}

 const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onEditProfile,
  onLogout,
}) => {
  return (
    <View style={commonStyles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.primary[100],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="person-outline" size={24} color={colors.primary[500]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={typography.h3}>{user.username}</Text>
          <Text style={typography.mutedSmall}>{user.phone}</Text>
          {user.points && (
            <Text style={[typography.mutedSmall, { color: colors.success[500] }]}>
              {user.points} نقطة
            </Text>
          )}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity 
          onPress={onEditProfile}
          style={[commonStyles.button, commonStyles.buttonSmall, { flex: 1 }]}
        >
          <Ionicons name="create-outline" size={16} color={colors.text.inverse} />
          <Text style={commonStyles.buttonText}>تعديل</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onLogout}
          style={[commonStyles.button, commonStyles.buttonSmall, commonStyles.buttonOutline, { flex: 1 }]}
        >
          <Ionicons name="log-out-outline" size={16} color={colors.primary[500]} />
          <Text style={[commonStyles.buttonText, { color: colors.primary[500] }]}>خروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default UserProfile;