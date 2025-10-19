// mobile/src/hooks/useTransferIndividuals.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Linking, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../api/client';

interface DocumentState {
  uri: string;
  name: string;
  mime: string;
}

interface FinalDoc {
  url: string;
  name?: string;
}

const TRANSFER_STATE_KEY = '@current_transfer_state';

export const useTransferIndividuals = (onGoStatus: () => void) => {
  // Step and loading states
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Document states
  const [sellerId, setSellerId] = useState<DocumentState | null>(null);
  const [buyerId, setBuyerId] = useState<DocumentState | null>(null);
  const [istimara, setIstimara] = useState<DocumentState | null>(null);
  const [finalDoc, setFinalDoc] = useState<FinalDoc | null>(null);

  // Form data
  const [clientRef, setClientRef] = useState<string | null>(null);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(420);
  const [userPhone, setUserPhone] = useState<string>('');

  // Vehicle status
  const [hasInsurance, setHasInsurance] = useState(false);
  const [hasInspection, setHasInspection] = useState(false);
  const [istimaraValid, setIstimaraValid] = useState(false);
  const [noFines, setNoFines] = useState(false);

  // TAM codes
  const [tamBuyer, setTamBuyer] = useState('');
  const [tamSeller, setTamSeller] = useState('');

  const pollingRef = useRef<NodeJS.Timeout>();

  // حفظ الحالة الحالية
  const saveTransferState = useCallback(async () => {
    try {
      const state = {
        step,
        clientRef,
        transferId,
        amount,
        type: 'individual' as const,
        documents: { sellerId, buyerId, istimara },
        vehicleStatus: { hasInsurance, hasInspection, istimaraValid, noFines },
        tamCodes: { tamBuyer, tamSeller },
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(TRANSFER_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving transfer state:', error);
    }
  }, [step, clientRef, transferId, amount, sellerId, buyerId, istimara, hasInsurance, hasInspection, istimaraValid, noFines, tamBuyer, tamSeller]);

  // مسح الحالة
  const clearTransferState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TRANSFER_STATE_KEY);
    } catch (error) {
      console.error('Error clearing transfer state:', error);
    }
  }, []);

  // تحميل الحالة المحفوظة
  const loadTransferState = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(TRANSFER_STATE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.type === 'individual') {
          setStep(state.step || 1);
          setClientRef(state.clientRef || null);
          setTransferId(state.transferId || null);
          setAmount(state.amount || 420);
          setSellerId(state.documents?.sellerId || null);
          setBuyerId(state.documents?.buyerId || null);
          setIstimara(state.documents?.istimara || null);
          setHasInsurance(state.vehicleStatus?.hasInsurance || false);
          setHasInspection(state.vehicleStatus?.hasInspection || false);
          setIstimaraValid(state.vehicleStatus?.istimaraValid || false);
          setNoFines(state.vehicleStatus?.noFines || false);
          setTamBuyer(state.tamCodes?.tamBuyer || '');
          setTamSeller(state.tamCodes?.tamSeller || '');
        }
      }
    } catch (error) {
      console.error('Error loading transfer state:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Load user phone and transfer state on mount
  useEffect(() => {
    loadUserPhone();
    loadTransferState();
  }, []);

  // حفظ الحالة عند أي تغيير
  useEffect(() => {
    if (step > 1) { // لا نحفظ في الخطوة الأولى
      saveTransferState();
    }
  }, [step, clientRef, amount, sellerId, buyerId, istimara, hasInsurance, hasInspection, istimaraValid, noFines, tamBuyer, tamSeller]);

  const loadUserPhone = useCallback(async () => {
    try {
      const savedPhone = await AsyncStorage.getItem('@user_phone');
      if (savedPhone) {
        setUserPhone(savedPhone);
      }
    } catch (error) {
      console.error('Error loading user phone:', error);
    }
  }, []);

  // Document upload function
  const uploadOne = useCallback(async (file: DocumentState, niceName: string) => {
    const formData = new FormData();
    formData.append('files', {
      uri: file.uri,
      name: file.name || 'file',
      type: file.mime || 'application/octet-stream',
    } as any);

    const response = await api.post('/api/uploads/public', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const uploadedFile = response.data?.files?.[0];
    if (!uploadedFile) {
      throw new Error('Upload failed');
    }

    return { ...uploadedFile, filename: niceName };
  }, []);

  // Document picker
  const handlePickDocument = useCallback(async (type: 'sellerId' | 'buyerId' | 'istimara') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        multiple: false,
        copyToCacheDirectory: true
      });

      if (result.assets?.length) {
        const asset = result.assets[0];
        const document = {
          uri: asset.uri,
          name: asset.name || 'document',
          mime: asset.mimeType || 'application/octet-stream',
        };

        switch (type) {
          case 'sellerId':
            setSellerId(document);
            break;
          case 'buyerId':
            setBuyerId(document);
            break;
          case 'istimara':
            setIstimara(document);
            break;
        }

        Toast.show({
          type: 'success',
          text1: 'تم اختيار الملف',
          text2: asset.name,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'تعذر اختيار الملف',
      });
    }
  }, []);

  // Validation
  const validateStep1 = useCallback(() => {
    const missing: string[] = [];

    if (!sellerId) missing.push('هوية البائع');
    if (!buyerId) missing.push('هوية المشتري');
    if (!istimara) missing.push('استمارة السيارة');
    if (!hasInsurance) missing.push('تأمين');
    if (!hasInspection) missing.push('فحص');
    if (!istimaraValid) missing.push('صلاحية الاستمارة');
    if (!noFines) missing.push('سداد المخالفات');

    return missing;
  }, [sellerId, buyerId, istimara, hasInsurance, hasInspection, istimaraValid, noFines]);

  // Step conversion
  const stepFromStatus = useCallback((status: string): number => {
    const statusMap: Record<string, number> = {
      submitted: 2,
      under_review: 2,
      reviewing: 2,
      awaiting_payment: 3,
      needs_payment: 3,
      payment_submitted: 3,
      payment_verified: 4,
      awaiting_tam_codes: 4,
      codes_submitted: 4,
      codes_verified: 5,
      processing: 5,
      completed: 5,
      rejected: 2,
    };

    return statusMap[status] || 1;
  }, []);

  // Polling function
// في useTransferIndividuals - عدل دالة startPolling
const startPolling = (ref: string) => {
  if (pollingRef.current) clearInterval(pollingRef.current);

  let interval = 2000;
  const poll = async () => {
    try {
      const { data } = await api.get('/api/transfers/lookup/by-ref', {
        params: { ref, _t: Date.now() },
      });

      console.log('📡 Polling response:', {
        clientRef: data?.clientRef,
        status: data?.status,
        step: stepFromStatus(data?.status),
        hasFinalDoc: !!data?.finalDoc
      });

      if (typeof data?.amount === 'number') setAmount(data.amount);

      // تحديث clientRef إذا كان null
      if (data?.clientRef && !clientRef) {
        setClientRef(data.clientRef);
        console.log('🔄 Updated clientRef from polling:', data.clientRef);
      }

      if (data?.finalDoc?.url) {
        setFinalDoc({ url: data.finalDoc.url, name: data.finalDoc.name });
        setStep(5);
        saveTransferState();
        clearTransferState();
      } else {
        const nextStep = stepFromStatus(String(data?.status || ''));
        console.log('🔄 Current step:', step, 'Next step:', nextStep, 'Status:', data?.status);
        
        if (nextStep > step) {
          setStep(nextStep);
          saveTransferState();
        }
      }

      if (['awaiting_codes', 'codes_submitted', 'codes_verified', 'completed'].includes(String(data?.status))) {
        if (interval !== 5000) {
          interval = 5000;
          clearInterval(pollingRef.current);
          pollingRef.current = setInterval(poll, interval);
        }
      }

      await AsyncStorage.setItem('@last_transfer_ref', ref);
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  pollingRef.current = setInterval(poll, interval);
  poll();
};

  // Step 1 submission
  const submitStep1 = useCallback(async () => {
    const missing = validateStep1();
    if (missing.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'أكمل المستندات',
        text2: 'ناقص: ' + missing.join('، '),
      });
      return;
    }

    setLoading(true);

    try {
      // Upload documents
      const documents = await Promise.all([
        uploadOne(sellerId!, 'هوية البائع'),
        uploadOne(buyerId!, 'هوية المشتري'),
        uploadOne(istimara!, 'استمارة المركبة'),
      ]);

      // Create transfer
      const { data } = await api.post('/api/transfers', {
        type: 'individual',
        buyer: { type: 'individual', phone: userPhone || undefined },
        seller: { type: 'individual' },
        documents,
        vehicleStatus: {
          hasInsurance,
          hasInspection,
          istimaraValid,
          noFines,
        },
      });

      if (data?.id) {
        setTransferId(data.id);
      }

      if (data?.clientRef) {
        setClientRef(data.clientRef);
        await AsyncStorage.setItem('@last_transfer_ref', data.clientRef);
        startPolling(data.clientRef);
      }

      if (typeof data?.amount === 'number') {
        setAmount(data.amount);
      }

      setStep(prev => Math.max(prev, 2));
      saveTransferState(); // حفظ الحالة بعد الإرسال
      
      Toast.show({
        type: 'success',
        text1: 'تم الإرسال',
        text2: 'قيد المراجعة الآن',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'تعذر إرسال الطلب';
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: String(message).slice(0, 140),
      });
    } finally {
      setLoading(false);
    }
  }, [validateStep1, sellerId, buyerId, istimara, userPhone, hasInsurance, hasInspection, istimaraValid, noFines, uploadOne, startPolling, saveTransferState]);

  // Receipt upload
  const uploadReceipt = useCallback(async () => {
    if (!clientRef) {
      Toast.show({
        type: 'error',
        text1: 'أرسل الطلب أولًا',
      });
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const receipt = await uploadOne(
        {
          uri: asset.uri,
          name: (asset as any).fileName || 'receipt.jpg',
          mime: (asset as any).mimeType || 'image/jpeg',
        },
        'إيصال التحويل'
      );

      await api.post(`/api/transfers/${clientRef}/payment/proof`, {
        amount,
        reference: clientRef,
        proof: receipt,
      });

      Toast.show({
        type: 'success',
        text1: 'تم رفع الإيصال',
        text2: 'بانتظار تأكيد الموظف',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'تعذر رفع الإيصال';
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: String(message).slice(0, 140),
      });
    }
  }, [clientRef, amount, uploadOne]);

  // TAM codes submission
  const submitTamCodes = useCallback(async () => {
    if (!clientRef) {
      Toast.show({
        type: 'error',
        text1: 'المرجع غير معروف',
      });
      return;
    }

    if (!tamBuyer || !tamSeller) {
      Toast.show({
        type: 'error',
        text1: 'أدخل كود البائع وكود المشتري',
      });
      return;
    }

    setLoading(true);

    try {
      await api.post(`/api/transfers/${clientRef}/codes`, {
        buyerCode: tamBuyer,
        sellerCode: tamSeller,
      });

      Toast.show({
        type: 'success',
        text1: 'تم حفظ الأكواد',
      });

      setTamBuyer('');
      setTamSeller('');
      saveTransferState(); // حفظ الحالة بعد إدخال الأكواد
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'تعذر حفظ الأكواد';
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: String(message).slice(0, 140),
      });
    } finally {
      setLoading(false);
    }
  }, [clientRef, tamBuyer, tamSeller, saveTransferState]);

  // Final document download
  const downloadFinalDocument = useCallback(async () => {
    if (!finalDoc?.url) return;

    try {
      const canOpen = await Linking.canOpenURL(finalDoc.url);
      if (canOpen) {
        await Linking.openURL(finalDoc.url);
      } else {
        Alert.alert('تنبيه', 'لا يمكن فتح هذا النوع من الملفات على جهازك');
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر فتح المستند');
    }
  }, [finalDoc]);

  // Handle complete and go to status
  const handleComplete = useCallback(() => {
    clearTransferState();
    onGoStatus();
  }, [clearTransferState, onGoStatus]);

  return {
    // State
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

    // Actions
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
    hasActiveTransfer: !!clientRef,
  };
};