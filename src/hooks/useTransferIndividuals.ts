// mobile/src/hooks/useTransferIndividuals.ts
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  // State
  
  const [step, setStep] = useState(1);
  const [clientRef, setClientRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sellerId, setSellerId] = useState<DocumentState | null>(null);
  const [buyerId, setBuyerId] = useState<DocumentState | null>(null);
  const [istimara, setIstimara] = useState<DocumentState | null>(null);
  const [finalDoc, setFinalDoc] = useState<FinalDoc | null>(null);
  const [amount, setAmount] = useState<number>(420);
  const [userPhone, setUserPhone] = useState<string>('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [hasInspection, setHasInspection] = useState(false);
  const [istimaraValid, setIstimaraValid] = useState(false);
  const [noFines, setNoFines] = useState(false);
  const [tamBuyer, setTamBuyer] = useState('');
  const [tamSeller, setTamSeller] = useState('');

  const pollingRef = useRef<NodeJS.Timeout>();

  // حفظ واستعادة الحالة
  const clientRefRef = useRef<string | null>(null);
  // أضف هذا في بداية الملف للتحقق من القيم

   const stateRef = useRef({
    step: 1,
    clientRef: null as string | null,
    amount: 420
  });
    useEffect(() => {
    stateRef.current.step = step;
  }, [step]);
    useEffect(() => {
    stateRef.current.clientRef = clientRef;
  }, [clientRef]);
  
  useEffect(() => {
    stateRef.current.amount = amount;
  }, [amount]);
  // في useTransferIndividuals - عدل دالة saveTransferState
useEffect(() => {
    clientRefRef.current = clientRef;
  }, [clientRef]);

// في بداية useTransferIndividuals - أضف هذا

// في دالة saveTransferState - أضف logging مفصل
const saveTransferState = React.useCallback(async () => {
  try {
    const currentStep = stateRef.current.step;
    const currentClientRef = stateRef.current.clientRef;
    
    const state = {
      step: currentStep,
      clientRef: currentClientRef,
      amount: stateRef.current.amount,
      type: 'individual' as const,
      documents: { sellerId, buyerId, istimara },
      vehicleStatus: { hasInsurance, hasInspection, istimaraValid, noFines },
      tamCodes: { tamBuyer, tamSeller },
      lastUpdated: new Date().toISOString(),
    };
    
    console.log('💾 Saving TRANSFER state:', {
      step: state.step,
      clientRef: state.clientRef,
      progress: Math.round((state.step / 5) * 100) + '%',
      timestamp: new Date().toLocaleTimeString()
    });
    
    await AsyncStorage.setItem(TRANSFER_STATE_KEY, JSON.stringify(state));
    console.log('✅ Transfer state saved successfully');
  } catch (error) {
    console.error('🚨 Error saving transfer state:', error);
  }
}, [sellerId, buyerId, istimara, hasInsurance, hasInspection, istimaraValid, noFines, tamBuyer, tamSeller]);

  const clearTransferState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TRANSFER_STATE_KEY);
    } catch (error) {
      console.error('Error clearing transfer state:', error);
    }
  }, []);

const loadTransferState = useCallback(async () => {
  try {
    const saved = await AsyncStorage.getItem(TRANSFER_STATE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      if (state.type === 'individual') {
        console.log('📥 Loading saved transfer state:', {
          step: state.step,
          clientRef: state.clientRef
        });
        
        setStep(state.step || 1);
        setClientRef(state.clientRef || null);
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
        
        // ✅ تحديث الـ stateRef أيضاً
        stateRef.current.step = state.step || 1;
        stateRef.current.clientRef = state.clientRef || null;
        stateRef.current.amount = state.amount || 420;
        
        // ✅ إذا كان فيه clientRef، ابدأ البولينج فوراً
        if (state.clientRef) {
          console.log('🔄 Resuming polling for:', state.clientRef);
          startPolling(state.clientRef);
        }
      }
    } else {
      console.log('📥 No saved transfer state found');
    }
  } catch (error) {
    console.error('Error loading transfer state:', error);
  }
}, []);
  // Effects
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    loadUserPhone();
    loadTransferState();
  }, []);

  useEffect(() => {
    if (step > 1) saveTransferState();
  }, [step, clientRef, amount, sellerId, buyerId, istimara, hasInsurance, hasInspection, istimaraValid, noFines, tamBuyer, tamSeller]);

  // Core Functions
  const loadUserPhone = async () => {
    try {
      const savedPhone = await AsyncStorage.getItem('@user_phone');
      if (savedPhone) setUserPhone(savedPhone);
    } catch (error) {
      console.error('Error loading user phone:', error);
    }
  };

  const uploadOne = async (file: DocumentState, niceName: string) => {
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
    if (!uploadedFile) throw new Error('Upload failed');
    return { ...uploadedFile, filename: niceName };
  };

  const handlePickDocument = async (type: 'sellerId' | 'buyerId' | 'istimara') => {
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
          case 'sellerId': setSellerId(document); break;
          case 'buyerId': setBuyerId(document); break;
          case 'istimara': setIstimara(document); break;
        }

        Toast.show({ type: 'success', text1: 'تم اختيار الملف', text2: asset.name });
        saveTransferState();
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'تعذر اختيار الملف' });
    }
  };

  const validateStep1 = () => {
    const missing: string[] = [];
    if (!sellerId) missing.push('هوية البائع');
    if (!buyerId) missing.push('هوية المشتري');
    if (!istimara) missing.push('استمارة السيارة');
    if (!hasInsurance) missing.push('تأمين');
    if (!hasInspection) missing.push('فحص');
    if (!istimaraValid) missing.push('صلاحية الاستمارة');
    if (!noFines) missing.push('سداد المخالفات');
    return missing;
  };

  // في useTransferIndividuals - عدل دالة stepFromStatus
const stepFromStatus = (status: string): number => {
  const statusMap: Record<string, number> = {
    // الخطوة 2: المراجعة
    'created': 2,
    'submitted': 2, 
    'under_review': 2, 
    'reviewing': 2,
    'waiting_user_action': 2,
    'rejected': 2,

    // الخطوة 3: الدفع
    'awaiting_payment': 3, 
    'needs_payment': 3, 
    'payment_submitted': 3, 

    // الخطوة 4: أكواد تم
    'payment_verified': 4,
    'awaiting_tam_codes': 4, 
    'awaiting_codes': 4,
    'codes_submitted': 4, 

    // الخطوة 5: مكتمل
    'codes_verified': 5, 
    'processing': 5,
    'completed': 5,
  };

  const step = statusMap[status] || 1;
  console.log('Status:', status, 'Mapped to step:', step);
  return step;
};

const startPolling = (ref: string) => {
  if (pollingRef.current) clearInterval(pollingRef.current);

  let interval = 2000;
  const poll = async () => {
    try {
      const { data } = await api.get('/api/transfers/lookup/by-ref', {
        params: { ref, _t: Date.now() },
      });

      console.log('📡 Polling response:', {
        status: data?.status,
        serverStep: stepFromStatus(data?.status),
        currentStep: stateRef.current.step,
        stateStep: step // ✅ أضف هذا للمقارنة
      });

      if (typeof data?.amount === 'number') {
        setAmount(data.amount);
        stateRef.current.amount = data.amount;
      }

      // تحديث clientRef
      if (data?.clientRef && stateRef.current.clientRef !== data.clientRef) {
        setClientRef(data.clientRef);
        stateRef.current.clientRef = data.clientRef;
      }

      if (data?.finalDoc?.url) {
        setFinalDoc({ url: data.finalDoc.url, name: data.finalDoc.name });
        setStep(5);
        stateRef.current.step = 5; // ✅ تحديث مباشر
        saveTransferState();
        clearTransferState();
      } else {
        const nextStep = stepFromStatus(String(data?.status || ''));
        console.log('🔄 Step comparison - Current:', stateRef.current.step, 'Next:', nextStep, 'Status:', data?.status);
        
        // ✅ التحديث الصحيح مع التأكد من الفرق
        if (nextStep > stateRef.current.step) {
          console.log('🎯 Updating step from', stateRef.current.step, 'to', nextStep);
          setStep(nextStep);
          stateRef.current.step = nextStep; // ✅ تحديث مباشر
          
          // ✅ حفظ فوري مع تأكيد
          setTimeout(() => {
            saveTransferState();
            console.log('💾 Confirmed step update to:', nextStep);
          }, 200);
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
const submitStep1 = async () => {
  const missing = validateStep1();
  if (missing.length > 0) {
    Toast.show({ type: 'error', text1: 'أكمل المستندات', text2: 'ناقص: ' + missing.join('، ') });
    return;
  }

  setLoading(true);
  try {
    const documents = await Promise.all([
      uploadOne(sellerId!, 'هوية البائع'),
      uploadOne(buyerId!, 'هوية المشتري'),
      uploadOne(istimara!, 'استمارة المركبة'),
    ]);

    const { data } = await api.post('/api/transfers', {
      type: 'individual',
      buyer: { type: 'individual', phone: userPhone || undefined },
      seller: { type: 'individual' },
      documents,
      vehicleStatus: { hasInsurance, hasInspection, istimaraValid, noFines },
    });

    console.log('📡 Server response after submission:', data);

    // ✅ تحديث clientRef في الـ state والـ ref
    if (data?.clientRef) {
      setClientRef(data.clientRef);
      stateRef.current.clientRef = data.clientRef; // ✅ تحديث الـ ref أيضاً
      await AsyncStorage.setItem('@last_transfer_ref', data.clientRef);
      
      // ✅ حفظ الحالة فوراً
      setTimeout(() => {
        saveTransferState();
        console.log('💾 Saved state with clientRef:', data.clientRef);
      }, 100);
      
      startPolling(data.clientRef);
    }

    if (typeof data?.amount === 'number') {
      setAmount(data.amount);
      stateRef.current.amount = data.amount; // ✅ تحديث الـ ref
    }

    // ✅ التحديث للخطوة 2 مع تحديث الـ ref
    setStep(2);
    stateRef.current.step = 2; // ✅ تحديث الـ ref مباشرة
    setTimeout(() => {
      saveTransferState();
    }, 150);
    
    Toast.show({ type: 'success', text1: 'تم الإرسال', text2: 'قيد المراجعة الآن' });
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'تعذر إرسال الطلب';
    Toast.show({ type: 'error', text1: 'خطأ', text2: String(message).slice(0, 140) });
  } finally {
    setLoading(false);
  }
};

  const uploadReceipt = async () => {
    if (!clientRef) {
      Toast.show({ type: 'error', text1: 'أرسل الطلب أولًا' });
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
        { uri: asset.uri, name: (asset as any).fileName || 'receipt.jpg', mime: (asset as any).mimeType || 'image/jpeg' },
        'إيصال التحويل'
      );

      await api.post(`/api/transfers/${clientRef}/payment/proof`, {
        amount, reference: clientRef, proof: receipt,
      });

      Toast.show({ type: 'success', text1: 'تم رفع الإيصال', text2: 'بانتظار تأكيد الموظف' });
      saveTransferState();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'تعذر رفع الإيصال';
      Toast.show({ type: 'error', text1: 'خطأ', text2: String(message).slice(0, 140) });
    }
  };

  const submitTamCodes = async () => {
    if (!clientRef) {
      Toast.show({ type: 'error', text1: 'المرجع غير معروف' });
      return;
    }

    if (!tamBuyer || !tamSeller) {
      Toast.show({ type: 'error', text1: 'أدخل كود البائع وكود المشتري' });
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/transfers/${clientRef}/codes`, { buyerCode: tamBuyer, sellerCode: tamSeller });
      Toast.show({ type: 'success', text1: 'تم حفظ الأكواد' });
      setTamBuyer(''); setTamSeller('');
      saveTransferState();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'تعذر حفظ الأكواد';
      Toast.show({ type: 'error', text1: 'خطأ', text2: String(message).slice(0, 140) });
    } finally {
      setLoading(false);
    }
  };

  const downloadFinalDocument = async () => {
    if (!finalDoc?.url) return;
    try {
      const canOpen = await Linking.canOpenURL(finalDoc.url);
      if (canOpen) await Linking.openURL(finalDoc.url);
      else Alert.alert('تنبيه', 'لا يمكن فتح هذا النوع من الملفات على جهازك');
    } catch (error) {
      Alert.alert('خطأ', 'تعذر فتح المستند');
    }
  };

 const handleComplete = async () => {
  // ✅ تأكد من حفظ الـ ref في المكان الصحيح
  if (clientRef) {
    await AsyncStorage.setItem('@last_ref', clientRef);
    console.log('💾 Saved last_ref for auto-inquiry:', clientRef);
    
    // ✅ احفظ أيضاً في LAST_REF_KEY المستخدم في useStatus
    await AsyncStorage.setItem('@last_transfer_ref', clientRef);
  }
  
  await clearTransferState();
  onGoStatus(); // ✅ هذا راح يودي للتبويب اللي فيه الاستعلام
};

  return {
    step, loading, sellerId, buyerId, istimara, finalDoc, clientRef, amount, userPhone,
    hasInsurance, hasInspection, istimaraValid, noFines, tamBuyer, tamSeller,
    setUserPhone, setTamBuyer, setTamSeller, setHasInsurance, setHasInspection,
    setIstimaraValid, setNoFines, handlePickDocument, submitStep1, uploadReceipt,
    submitTamCodes, downloadFinalDocument, handleComplete,
  };
};