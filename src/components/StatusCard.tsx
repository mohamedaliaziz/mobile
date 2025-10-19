import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransferLookupResponse, Document } from '../types';
import { componentStyles, colors, typography } from '../styles';

interface StatusCardProps {
  data: TransferLookupResponse | null;
  onDownloadPress: (documentUrl?: string) => void;
  friendlyMessage: string;
  documents: Document[];
}

export const StatusCard: React.FC<StatusCardProps> = memo(({
  data,
  onDownloadPress,
  friendlyMessage,
  documents = [],
}) => {
  // التحقق من وجود البيانات بشكل كامل
  if (!data || typeof data !== 'object') {
    return (
      <View style={componentStyles.status.container}>
        <Text style={componentStyles.status.errorText}>
          لا توجد بيانات للعرض
        </Text>
      </View>
    );
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      created: { label: 'تم الإرسال — تحت المراجعة', color: colors.primary[600] },
      under_review: { label: 'قيد المراجعة', color: colors.primary[600] },
      waiting_user_action: { label: 'بانتظار استكمال البيانات', color: colors.warning[500] },
      awaiting_payment: { label: 'بانتظار الدفع/التحويل', color: colors.warning[600] },
      payment_submitted: { label: 'تم رفع إيصال الدفع', color: colors.primary[500] },
      payment_verified: { label: 'تم تأكيد الدفع', color: colors.success[500] },
      awaiting_codes: { label: 'بانتظار أكواد تم (أفراد)', color: colors.secondary[500] },
      codes_submitted: { label: 'تم إدخال أكواد تم', color: colors.secondary[500] },
      codes_verified: { label: 'تم التحقق من أكواد تم', color: colors.success[600] },
      completed: { label: 'تم النقل بنجاح', color: colors.success[600] },
      rejected: { label: 'مرفوض — تحتاج استكمال', color: colors.error[500] },
      cancelled: { label: 'ملغية', color: colors.error[600] },
    };

    return statusMap[status] || { label: status, color: colors.neutral[500] };
  };

  const getDocumentIcon = (category?: string) => {
    switch (category) {
      case 'final': return 'document-text';
      case 'istimara': return 'car-sport';
      case 'inspection': return 'construct';
      case 'insurance': return 'shield-checkmark';
      default: return 'document';
    }
  };

  const getDocumentLabel = (category?: string) => {
    switch (category) {
      case 'final': return 'الاستمارة النهائية';
      case 'istimara': return 'استمارة السيارة';
      case 'inspection': return 'شهادة الفحص';
      case 'insurance': return 'وثيقة التأمين';
      default: return 'مستند';
    }
  };

  // التحقق من وجود status
  const statusInfo = getStatusInfo(data.status || 'created');
  
  // التحقق من وجود documents
  const hasDocuments = Array.isArray(documents) && documents.length > 0;

  return (
    <View style={componentStyles.status.container}>
      {/* العنوان */}
      <Text style={componentStyles.status.title}>معلومات المعاملة</Text>

      {/* معلومات الأساسية */}
      <View style={componentStyles.status.section}>
        <View style={componentStyles.status.row}>
          <Text style={componentStyles.status.label}>المرجع:</Text>
          <Text style={componentStyles.status.value}>
            {data.clientRef || 'غير متوفر'}
          </Text>
        </View>

        <View style={componentStyles.status.row}>
          <Text style={componentStyles.status.label}>نوع النقل:</Text>
          <Text style={componentStyles.status.value}>
            {data.type === 'individual' ? 'أفراد' : 
             data.type === 'business' ? 'مؤسسات' : 
             data.type === 'mixed' ? 'مختلط' : 'غير محدد'}
          </Text>
        </View>

        <View style={componentStyles.status.row}>
          <Text style={componentStyles.status.label}>الحالة:</Text>
          <View style={[componentStyles.status.badge, { backgroundColor: statusInfo.color }]}>
            <Text style={componentStyles.status.badgeText}>{statusInfo.label}</Text>
          </View>
        </View>

        {data.amount && (
          <View style={componentStyles.status.row}>
            <Text style={componentStyles.status.label}>قيمة الخدمة:</Text>
            <Text style={componentStyles.status.value}>{data.amount} ر.س</Text>
          </View>
        )}

        {data.updatedAt && (
          <View style={componentStyles.status.row}>
            <Text style={componentStyles.status.label}>آخر تحديث:</Text>
            <Text style={componentStyles.status.value}>
              {new Date(data.updatedAt).toLocaleString('ar-SA')}
            </Text>
          </View>
        )}
      </View>

      {/* المستندات المتاحة */}
      {hasDocuments && (
        <View style={componentStyles.status.section}>
          <Text style={componentStyles.status.sectionTitle}>المستندات المتاحة</Text>
          
          {documents.map((document, index) => {
            // التحقق من كل مستند قبل عرضه
            if (!document || typeof document !== 'object') return null;
            
            return (
              <TouchableOpacity 
                key={index}
                style={componentStyles.status.documentButton}
                onPress={() => onDownloadPress(document?.url)}
              >
                <Ionicons 
                  name={getDocumentIcon(document?.category) as any} 
                  size={20} 
                  color={colors.primary[500]} 
                />
                <View style={componentStyles.status.documentInfo}>
                  <Text style={componentStyles.status.documentName}>
                    {getDocumentLabel(document?.category)}
                  </Text>
                  {document?.filename && (
                    <Text style={componentStyles.status.documentFilename}>
                      {document.filename}
                    </Text>
                  )}
                </View>
                <Ionicons name="download-outline" size={18} color={colors.neutral[500]} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* رسالة توجيهية */}
      {friendlyMessage && !hasDocuments && (
        <View style={componentStyles.status.messageBox}>
          <Ionicons name="information-circle" size={20} color={colors.primary[500]} />
          <Text style={componentStyles.status.messageText}>{friendlyMessage}</Text>
        </View>
      )}

      {/* ملاحظات الموظف */}
      {data.notes && (
        <View style={componentStyles.status.notesBox}>
          <Ionicons name="chatbubble-ellipses" size={16} color={colors.warning[600]} />
          <Text style={componentStyles.status.notesText}>{data.notes}</Text>
        </View>
      )}
    </View>
  );
});