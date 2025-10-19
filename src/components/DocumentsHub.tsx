import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { componentStyles } from '../styles';
import { colors } from '../styles/colors';
import api from '../api/client';

interface Document {
  id: string;
  name: string;
  type: 'istimara';
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'verified';
  uploadDate: string;
  expiryDate?: string;
  fileUrl?: string;
  fileSize?: string;
  uploadedBy: 'user' | 'employee';
  category: 'vehicle';
  description?: string;
  transferRef?: string;
}

interface DocumentsStats {
  total: number;
  approved: number;
  pending: number;
  expired: number;
  verified: number;
}

const DocumentsHub: React.FC = () => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) {
        Alert.alert(
          'تسجيل الدخول مطلوب',
          'يجب تسجيل الدخول لعرض المستندات',
          [{ text: 'حسناً', style: 'cancel' }]
        );
        loadMockDocuments();
        return;
      }

      console.log('🔄 جاري تحميل الاستمارات...');
      
      const response = await api.get('/api/documents/my-documents');
      
      if (response.data.success) {
        // تصفية الاستمارات فقط
        const istimaraDocuments = response.data.documents.filter(
          (doc: any) => doc.type === 'istimara' || doc.name?.includes('استمارة')
        );
        setDocuments(istimaraDocuments);
        console.log('✅ تم تحميل الاستمارات بنجاح:', istimaraDocuments.length);
      } else {
        throw new Error('فشل في تحميل الاستمارات');
      }
      
    } catch (error: any) {
      console.error('❌ خطأ في تحميل الاستمارات:', error);
      loadMockDocuments();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMockDocuments = () => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'استمارة المركبة - تويوتا كامري 2023',
        type: 'istimara',
        status: 'approved',
        uploadDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: '2.4 MB',
        uploadedBy: 'employee',
        category: 'vehicle',
        description: 'استمارة المركبة بعد نقل الملكية',
        transferRef: 'T240115001'
      },
      {
        id: '2',
        name: 'استمارة المركبة - هونداي النترا 2022',
        type: 'istimara',
        status: 'verified',
        uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: '2.1 MB',
        uploadedBy: 'employee',
        category: 'vehicle',
        description: 'استمارة المركبة - نقل ملكية',
        transferRef: 'T240118002'
      }
    ];
    
    setDocuments(mockDocuments);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const handleDocumentPress = async (document: Document) => {
    if (document.fileUrl) {
      try {
        const canOpen = await Linking.canOpenURL(document.fileUrl);
        if (canOpen) {
          await Linking.openURL(document.fileUrl);
        } else {
          Alert.alert('خطأ', 'لا يمكن فتح هذا الملف');
        }
      } catch (error) {
        console.error('Error opening document:', error);
        Alert.alert('خطأ', 'تعذر فتح الملف');
      }
    } else {
      Alert.alert('معلومة', 'الملف غير متاح للتحميل حالياً');
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return colors.success[500];
      case 'pending':
        return colors.warning[500];
      case 'rejected':
      case 'expired':
        return colors.error[500];
      default:
        return colors.neutral[500];
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'مقبول';
      case 'verified': return 'متحقق';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      case 'expired': return 'منتهي';
      default: return 'غير معروف';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // مكون بطاقة الاستمارة
  const DocumentCard: React.FC<{ document: Document }> = ({ document }) => {
    const expiringSoon = isExpiringSoon(document.expiryDate);
    const expired = isExpired(document.expiryDate);

    return (
      <TouchableOpacity
        style={styles.documentCard}
        onPress={() => handleDocumentPress(document)}
      >
        <View style={styles.documentHeader}>
          <View style={[styles.documentIcon, { backgroundColor: getStatusColor(document.status) + '20' }]}>
            <Ionicons name="document-text" size={24} color={getStatusColor(document.status)} />
          </View>
          
          <View style={styles.documentInfo}>
            <Text style={styles.documentName} numberOfLines={2}>
              {document.name}
            </Text>
            
            {document.description && (
              <Text style={styles.documentDescription}>
                {document.description}
              </Text>
            )}

            <View style={styles.documentMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="car-sport" size={12} color={colors.neutral[500]} />
                <Text style={styles.metaText}>مركبة</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons 
                  name={document.uploadedBy === 'user' ? 'person-outline' : 'people-outline'} 
                  size={12} 
                  color={colors.neutral[500]} 
                />
                <Text style={styles.metaText}>
                  {document.uploadedBy === 'user' ? 'رفعت بواسطتك' : 'رفع من قبل الموظف'}
                </Text>
              </View>

              {document.transferRef && (
                <View style={styles.metaItem}>
                  <Ionicons name="receipt-outline" size={12} color={colors.neutral[500]} />
                  <Text style={styles.metaText}>{document.transferRef}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.documentFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.uploadDate}>
              {formatDate(document.uploadDate)}
            </Text>
            {document.fileSize && (
              <Text style={styles.fileSize}>• {document.fileSize}</Text>
            )}
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
              {getStatusText(document.status)}
            </Text>
          </View>
        </View>

        {document.expiryDate && (
          <View style={[
            styles.expirySection,
            expired && { backgroundColor: colors.error[50], borderLeftColor: colors.error[500] },
            expiringSoon && !expired && { backgroundColor: colors.warning[50], borderLeftColor: colors.warning[500] }
          ]}>
            <Ionicons 
              name={expired ? "alert-circle" : "calendar-outline"} 
              size={14} 
              color={expired ? colors.error[500] : colors.warning[500]} 
            />
            <Text style={[
              styles.expiryText,
              expired && { color: colors.error[700] },
              expiringSoon && !expired && { color: colors.warning[700] }
            ]}>
              {expired ? 'منتهي الصلاحية' : `ينتهي في: ${formatDate(document.expiryDate)}`}
              {expiringSoon && !expired && ' ⚠️'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>جاري تحميل الاستمارات...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* الهيدر */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Ionicons name="document-text" size={24} color={colors.primary[500]} />
          <View>
            <Text style={styles.title}>الاستمارات</Text>
            <Text style={styles.subtitle}>إدارة استمارات مركباتك</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh-outline" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* قائمة الاستمارات */}
      <ScrollView
        style={styles.documentsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {documents.length > 0 ? (
          documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.neutral[400]} />
            <Text style={styles.emptyTitle}>لا توجد استمارات</Text>
            <Text style={styles.emptyText}>
              لم يتم رفع أي استمارات حتى الآن
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// الأنماط الجديدة المبسطة
const styles = {
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
};

export default DocumentsHub;