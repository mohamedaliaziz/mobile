import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { TransferLookupResponse } from '../types';
import { componentStyles, colors } from '../styles';

interface TransferStatusProps {
  data: TransferLookupResponse;
}

export const TransferStatus: React.FC<TransferStatusProps> = memo(({ data }) => {
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; description: string }> = {
      created: { 
        label: 'تم الإرسال', 
        color: colors.primary[500],
        description: 'تم استلام طلبك وجاري المراجعة' 
      },
      under_review: { 
        label: 'قيد المراجعة', 
        color: colors.primary[600],
        description: 'جاري مراجعة المستندات من قبل الموظف' 
      },
      waiting_user_action: { 
        label: 'بانتظار استكمال البيانات', 
        color: colors.warning[500],
        description: 'يجب استكمال بعض البيانات المطلوبة' 
      },
      awaiting_payment: { 
        label: 'بانتظار الدفع', 
        color: colors.warning[600],
        description: 'بانتظار سداد المبلغ المستحق' 
      },
      payment_submitted: { 
        label: 'تم رفع إيصال الدفع', 
        color: colors.primary[500],
        description: 'تم استلام إيصال الدفع وجاري التحقق' 
      },
      payment_verified: { 
        label: 'تم تأكيد الدفع', 
        color: colors.success[500],
        description: 'تم التحقق من الدفع والمتابعة للإجراءات' 
      },
      awaiting_codes: { 
        label: 'بانتظار أكواد تم', 
        color: colors.warning[500],
        description: 'بانتظار إدخال أكواد تم من الطرفين' 
      },
      codes_submitted: { 
        label: 'تم إدخال أكواد تم', 
        color: colors.primary[500],
        description: 'تم استلام الأكواد وجاري التحقق' 
      },
      codes_verified: { 
        label: 'تم التحقق من أكواد تم', 
        color: colors.success[500],
        description: 'تم التحقق من الأكواد والمتابعة للنقل' 
      },
      completed: { 
        label: 'تم النقل', 
        color: colors.success[600],
        description: 'تم انتهاء عملية نقل الملكية بنجاح' 
      },
      rejected: { 
        label: 'مرفوضة', 
        color: colors.error[500],
        description: 'تم رفض الطلب - يرجى مراجعة البيانات' 
      },
    };

    return statusMap[status] || { 
      label: status, 
      color: colors.neutral[500],
      description: 'حالة غير معروفة' 
    };
  };

  const statusInfo = getStatusInfo(data.status);

  return (
    <View style={componentStyles.status.container}>
      <Text style={componentStyles.status.title}>معلومات المعاملة</Text>
      
      <View style={componentStyles.status.row}>
        <Text style={componentStyles.status.label}>المرجع:</Text>
        <Text style={componentStyles.status.value}>{data.clientRef}</Text>
      </View>
      
      <View style={componentStyles.status.row}>
        <Text style={componentStyles.status.label}>الحالة:</Text>
        <View style={[componentStyles.status.badge, { backgroundColor: statusInfo.color }]}>
          <Text style={componentStyles.status.badgeText}>{statusInfo.label}</Text>
        </View>
      </View>
      
      <Text style={componentStyles.status.description}>
        {statusInfo.description}
      </Text>
      
      {data.amount && (
        <View style={componentStyles.status.row}>
          <Text style={componentStyles.status.label}>المبلغ:</Text>
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
      
      {data.notes && (
        <View style={componentStyles.status.notes}>
          <Text style={componentStyles.status.notesTitle}>ملاحظات الموظف:</Text>
          <Text style={componentStyles.status.notesText}>{data.notes}</Text>
        </View>
      )}
    </View>
  );
});