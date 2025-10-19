import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Document } from '../types';
import { componentStyles, colors } from '../styles';

interface DocumentListProps {
  documents: Document[];
  onDocumentPress: (document: Document) => void;
}

export const DocumentList: React.FC<DocumentListProps> = memo(({ 
  documents, 
  onDocumentPress 
}) => {
  if (documents.length === 0) {
    return null;
  }

  const getDocumentIcon = (category?: string) => {
    switch (category) {
      case 'final':
        return 'document-text';
      case 'istimara':
        return 'car-sport';
      case 'inspection':
        return 'construct';
      case 'insurance':
        return 'shield-checkmark';
      default:
        return 'document';
    }
  };

  const getDocumentLabel = (category?: string) => {
    switch (category) {
      case 'final':
        return 'الاستمارة النهائية';
      case 'istimara':
        return 'استمارة السيارة';
      case 'inspection':
        return 'شهادة الفحص';
      case 'insurance':
        return 'وثيقة التأمين';
      default:
        return 'مستند';
    }
  };

  return (
    <View style={componentStyles.documents.container}>
      <Text style={componentStyles.documents.title}>المستندات المتاحة</Text>
      
      {documents.map((document, index) => (
        <TouchableOpacity
          key={index}
          style={componentStyles.documents.item}
          onPress={() => onDocumentPress(document)}
        >
          <Ionicons 
            name={getDocumentIcon(document.category) as any} 
            size={24} 
            color={colors.primary[500]} 
          />
          
          <View style={componentStyles.documents.info}>
            <Text style={componentStyles.documents.name}>
              {getDocumentLabel(document.category)}
            </Text>
            {document.filename && (
              <Text style={componentStyles.documents.filename}>
                {document.filename}
              </Text>
            )}
          </View>
          
          <Ionicons 
            name="download-outline" 
            size={20} 
            color={colors.neutral[500]} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
});