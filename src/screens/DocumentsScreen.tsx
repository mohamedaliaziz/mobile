// في DocumentsScreen.tsx - استخدم هذا الكود
import React from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import DocumentsHub from '../components/DocumentsHub';
import { colors } from '../styles/colors';

const DocumentsScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    console.log('Back button pressed');
    
    // جرب كل الطرق الممكنة
    if (onBack) {
      // الطريقة 1: إذا في onBack prop
      onBack();
    } else if (navigation.canGoBack()) {
      // الطريقة 2: إذا في شاشة قبلها في الـ stack
      navigation.goBack();
    } else {
      // الطريقة 3: الانتقال لشاشة Main
      navigation.navigate('Main' as never);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
      }}>
        <TouchableOpacity 
          onPress={handleBack}
          style={{
            padding: 8,
            borderRadius: 8,
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text.primary,
        }}>
          الاستمارات
        </Text>
      </View>

      <DocumentsHub />
    </View>
  );
};

export default DocumentsScreen;