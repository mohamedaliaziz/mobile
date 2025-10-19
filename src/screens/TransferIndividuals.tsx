// mobile/src/screens/TransferIndividuals.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Hooks
import { useTransferIndividuals } from '../hooks/useTransferIndividuals';

// Styles
import { commonStyles, componentStyles, colors, typography } from '../styles';

interface TransferIndividualsProps {
  onBack: () => void;
  onGoStatus: () => void;
}

const STEPS = ['المستندات', 'مراجعة الموظف', 'الدفع/التحويل', 'أكواد تم', 'تم النقل'];

// Sub Components
const Upload: React.FC<{ label: string; file: any; onPick: () => void; required?: boolean }> = ({ 
  label, file, onPick, required = false 
}) => (
  <View style={{ gap: 6, marginTop: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Text style={{ fontWeight: '700', color: colors.text.primary }}>{label}</Text>
      <View style={[commonStyles.badge, !required && commonStyles.badgeMuted]}>
        <Text style={[commonStyles.badgeText, !required && commonStyles.badgeMutedText]}>
          {required ? 'مطلوب' : 'اختياري'}
        </Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {file?.name && <Ionicons name="checkmark-done-circle-outline" size={20} color={colors.success[500]} />}
      <TouchableOpacity onPress={onPick} style={componentStyles.upload.button}>
        <Ionicons name="cloud-upload-outline" size={16} color={colors.text.inverse} />
        <Text style={componentStyles.upload.buttonText}>{file?.name ? 'تغيير الملف' : 'رفع الملف'}</Text>
      </TouchableOpacity>
    </View>
    {file?.name && <Text style={componentStyles.upload.fileName}>{file.name}</Text>}
  </View>
);

const ToggleRow: React.FC<{ label: string; value: boolean; onToggle: () => void }> = ({ 
  label, value, onToggle 
}) => (
  <TouchableOpacity onPress={onToggle} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
    <Text style={{ color: colors.text.primary, fontWeight: '700' }}>{label}</Text>
    <View style={[
      { width: 44, height: 26, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 3 }, 
      value ? { backgroundColor: colors.success[500] } : { backgroundColor: colors.neutral[300] }
    ]}>
      <View style={{ 
        width: 20, 
        height: 20, 
        borderRadius: 10, 
        backgroundColor: colors.background.primary,
        alignSelf: value ? 'flex-end' : 'flex-start' 
      }} />
    </View>
  </TouchableOpacity>
);

const Timeline: React.FC<{ steps: string[]; currentStep: number }> = ({ steps, currentStep }) => (
  <View style={componentStyles.timeline.container}>
    {steps.map((step, index) => (
      <View key={index} style={componentStyles.timeline.item}>
        <View style={[
          componentStyles.timeline.dot, 
          index + 1 <= currentStep && componentStyles.timeline.dotActive
        ]} />
        <Text style={[
          componentStyles.timeline.label, 
          index + 1 <= currentStep && componentStyles.timeline.labelActive
        ]}>
          {step}
        </Text>
        {index < steps.length - 1 && (
          <View style={[
            componentStyles.timeline.bar, 
            index + 1 < currentStep && componentStyles.timeline.barActive
          ]} />
        )}
      </View>
    ))}
  </View>
);

// Step Components
const Step1: React.FC<any> = ({
  sellerId,
  buyerId,
  istimara,
  userPhone,
  hasInsurance,
  hasInspection,
  istimaraValid,
  noFines,
  onUserPhoneChange,
  onToggleInsurance,
  onToggleInspection,
  onToggleIstimara,
  onToggleNoFines,
  onPickDocument,
  onSubmit,
}) => (
  <View style={commonStyles.card}>
    <Text style={typography.h2}>المستندات المطلوبة</Text>
    
    <Upload label="هوية البائع" file={sellerId} onPick={() => onPickDocument('sellerId')} required />
    <Upload label="هوية المشتري" file={buyerId} onPick={() => onPickDocument('buyerId')} required />
    <Upload label="استمارة السيارة" file={istimara} onPick={() => onPickDocument('istimara')} required />

    <View style={commonStyles.separator} />
    <Text style={typography.h2}>حالة المركبة</Text>
    
    <ToggleRow label="تأمين ساري" value={hasInsurance} onToggle={onToggleInsurance} />
    <ToggleRow label="فحص ساري" value={hasInspection} onToggle={onToggleInspection} />
    <ToggleRow label="الاستمارة سارية" value={istimaraValid} onToggle={onToggleIstimara} />
    <ToggleRow label="لا توجد مخالفات" value={noFines} onToggle={onToggleNoFines} />

    <View style={commonStyles.separator} />
    <Text style={typography.h2}>رقم جوالك (اختياري)</Text>
    
    <TextInput
      placeholder="05xxxxxxxx"
      value={userPhone}
      onChangeText={onUserPhoneChange}
      keyboardType="phone-pad"
      style={commonStyles.input}
      placeholderTextColor={colors.neutral[400]}
    />

    <TouchableOpacity onPress={onSubmit} style={commonStyles.button}>
      <Text style={commonStyles.buttonText}>إرسال الطلب للمراجعة</Text>
    </TouchableOpacity>
  </View>
);

const Step2: React.FC<{ clientRef: string | null }> = ({ clientRef }) => (
  <View style={commonStyles.card}>
    <Text style={typography.h2}>جاري المراجعة من الموظف</Text>
    <Text style={typography.muted}>
      مرجعك: <Text style={{ fontWeight: '900' }}>{clientRef || '—'}</Text>
    </Text>
    <Text style={[typography.muted, { marginTop: 6 }]}>
      بعد الموافقة تنتقل تلقائيًا للدفع.
    </Text>
  </View>
);

const Step3: React.FC<{ amount: number; onUploadReceipt: () => void }> = ({
  amount,
  onUploadReceipt,
}) => (
  <View style={commonStyles.card}>
    <Text style={typography.h2}>الدفع/التحويل</Text>
    <Text style={typography.muted}>
      المبلغ المستحق: <Text style={{ fontWeight: '900' }}>{amount} ر.س</Text>
    </Text>
    
    <TouchableOpacity onPress={onUploadReceipt} style={[commonStyles.button, { marginTop: 8 }]}>
      <Text style={commonStyles.buttonText}>رفع إيصال التحويل</Text>
    </TouchableOpacity>
    
    <Text style={[typography.muted, { marginTop: 6 }]}>
      بعد تأكيد الدفع ستُطلب منك أكواد تم من الطرفين.
    </Text>
  </View>
);

const Step4: React.FC<any> = ({
  tamBuyer,
  tamSeller,
  onTamBuyerChange,
  onTamSellerChange,
  onSubmit,
}) => (
  <View style={commonStyles.card}>
    <Text style={typography.h2}>أكواد منصة تم</Text>
    
    <View style={{ marginTop: 8 }}>
      <Text style={{ fontWeight: '700', color: colors.text.primary, marginBottom: 4 }}>
        كود المشتري
      </Text>
      <TextInput 
        value={tamBuyer} 
        onChangeText={onTamBuyerChange} 
        placeholder="xxxxxx" 
        style={commonStyles.input} 
      />
    </View>
    
    <View style={{ marginTop: 8 }}>
      <Text style={{ fontWeight: '700', color: colors.text.primary, marginBottom: 4 }}>
        كود البائع
      </Text>
      <TextInput 
        value={tamSeller} 
        onChangeText={onTamSellerChange} 
        placeholder="xxxxxx" 
        style={commonStyles.input} 
      />
    </View>
    
    <TouchableOpacity 
      onPress={onSubmit} 
      style={[commonStyles.button, commonStyles.buttonSuccess, { marginTop: 12 }]}
    >
      <Text style={commonStyles.buttonText}>إرسال الأكواد</Text>
    </TouchableOpacity>
    
    <Text style={[typography.muted, { marginTop: 6 }]}>
      سيتحقق الموظف ثم نكمل التنفيذ.
    </Text>
  </View>
);

const Step5: React.FC<{ 
  onGoStatus: () => void; 
  onDownloadFinal: () => void;
  finalDoc: any;
}> = ({ onGoStatus, onDownloadFinal, finalDoc }) => (
  <View style={commonStyles.card}>
    <View style={commonStyles.center}>
      <Ionicons name="checkmark-circle-outline" size={42} color={colors.success[500]} />
      <Text style={[typography.h2, { marginTop: 8 }]}>تم نقل الملكية</Text>
      <Text style={[typography.muted, { marginTop: 4, textAlign: 'center' }]}>
        خلال ~30 دقيقة تقدر تستلم الاستمارة الجديدة.
      </Text>
    </View>

    {finalDoc && (
      <TouchableOpacity 
        onPress={onDownloadFinal}
        style={[commonStyles.button, commonStyles.buttonSuccess, { marginTop: 12 }]}
      >
        <Ionicons name="download-outline" size={20} color={colors.text.inverse} />
        <Text style={commonStyles.buttonText}>تحميل الاستمارة النهائية</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity 
      onPress={onGoStatus} 
      style={[commonStyles.button, { marginTop: 8 }]}
    >
      <Text style={commonStyles.buttonText}>الانتقال لصفحة الاستعلام</Text>
    </TouchableOpacity>
  </View>
);

// Main Component
const TransferIndividuals: React.FC<TransferIndividualsProps> = ({ onBack, onGoStatus }) => {
  const {
    step,
    loading,
    sellerId,
    buyerId,
    istimara,
    clientRef,
    amount,
    userPhone,
    hasInsurance,
    hasInspection,
    istimaraValid,
    noFines,
    tamBuyer,
    tamSeller,
    finalDoc,
    setUserPhone,
    setTamBuyer,
    setTamSeller,
    setHasInsurance,
    setHasInspection,
    setIstimaraValid,
    setNoFines,
    handlePickDocument,
    submitStep1,
    uploadReceipt,
    submitTamCodes,
    downloadFinalDocument,
    handleComplete,
  } = useTransferIndividuals(onGoStatus);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            sellerId={sellerId}
            buyerId={buyerId}
            istimara={istimara}
            userPhone={userPhone}
            hasInsurance={hasInsurance}
            hasInspection={hasInspection}
            istimaraValid={istimaraValid}
            noFines={noFines}
            onUserPhoneChange={setUserPhone}
            onToggleInsurance={() => setHasInsurance(v => !v)}
            onToggleInspection={() => setHasInspection(v => !v)}
            onToggleIstimara={() => setIstimaraValid(v => !v)}
            onToggleNoFines={() => setNoFines(v => !v)}
            onPickDocument={handlePickDocument}
            onSubmit={submitStep1}
          />
        );
      
      case 2:
        return <Step2 clientRef={clientRef} />;
      
      case 3:
        return <Step3 amount={amount} onUploadReceipt={uploadReceipt} />;
      
      case 4:
        return (
          <Step4
            tamBuyer={tamBuyer}
            tamSeller={tamSeller}
            onTamBuyerChange={setTamBuyer}
            onTamSellerChange={setTamSeller}
            onSubmit={submitTamCodes}
          />
        );
      
      case 5:
        return (
          <Step5
            onGoStatus={handleComplete}
            onDownloadFinal={downloadFinalDocument}
            finalDoc={finalDoc}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={colors.background.gradient} style={commonStyles.flex1}>
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={componentStyles.header.container}>
          <TouchableOpacity onPress={onBack} style={componentStyles.header.backButton}>
            <Ionicons name="arrow-back-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text style={componentStyles.header.title}>نقل ملكية — أفراد</Text>
          <View style={componentStyles.header.spacer} />
        </View>

        {/* Timeline */}
        <Timeline steps={STEPS} currentStep={step} />

        {/* Dynamic Content */}
        {renderStepContent()}
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={commonStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={[typography.muted, { marginTop: 8 }]}>جارٍ المعالجة…</Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default React.memo(TransferIndividuals);