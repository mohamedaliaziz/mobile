import { useState, useEffect, useRef, useCallback } from 'react';
import { Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import api from '../api/client';
import { TransferLookupResponse, Document } from '../types';

const POLLING_INTERVAL = 4000;
const LAST_REF_KEY = '@last_transfer_ref';

export const useStatus = () => {
  const [reference, setReference] = useState('');
  const [transferInfo, setTransferInfo] = useState<TransferLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  
  const pollingRef = useRef<NodeJS.Timeout>();

  // تحميل آخر مرجع محفوظ
  useEffect(() => {
    loadLastReference();
  }, []);

  // تنظيف البولينج عند الخروج
  useEffect(() => {
    return () => stopPolling();
  }, []);

 const loadLastReference = async () => {
  try {
    const lastRef = await AsyncStorage.getItem(LAST_REF_KEY) || await AsyncStorage.getItem('@last_ref');
    if (lastRef) {
      setReference(lastRef);
      // ✅ تحميل تلقائي بعد فترة قصيرة
      setTimeout(() => {
        handleLookup(lastRef);
      }, 1000);
    }
  } catch (error) {
    console.error('Error loading last reference:', error);
  }
};
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = undefined;
      setIsPolling(false);
    }
  }, []);

  const startPolling = useCallback((ref: string) => {
    stopPolling();
    setIsPolling(true);
    
    pollingRef.current = setInterval(async () => {
      try {
        await fetchTransferData(ref, true);
      } catch (error) {
        // تجاهل الأخطاء أثناء البولينج
      }
    }, POLLING_INTERVAL);
  }, [stopPolling]);

  const fetchTransferData = async (ref: string, silent = false) => {
    if (!silent) setLoading(true);

    try {
      const { data } = await api.get<TransferLookupResponse>('/api/transfers/lookup/by-ref', {
        params: { ref, _t: Date.now() },
        headers: { 
          'Cache-Control': 'no-cache', 
          'Pragma': 'no-cache' 
        },
      });

      // تأكد من أن البيانات موجودة قبل تعيينها
      if (data) {
        setTransferInfo(data);
        
        if (!silent) {
          await AsyncStorage.setItem(LAST_REF_KEY, ref);
          startPolling(ref);
        }
      }

      return data;
    } catch (error: any) {
      if (!silent) {
        const message = error?.response?.data?.message || 
                       error?.message || 
                       'تعذر الاستعلام - تحقق من المرجع والاتصال';
        
        Toast.show({ 
          type: 'error', 
          text1: 'خطأ في الاستعلام',
          text2: message 
        });
        
        setTransferInfo(null);
        stopPolling();
      }
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLookup = async (customRef?: string) => {
    const searchRef = customRef || reference.trim();
    
    if (!searchRef) {
      Toast.show({ 
        type: 'error', 
        text1: 'مرجع مطلوب',
        text2: 'أدخل مرجع المعاملة للاستعلام' 
      });
      return;
    }

    try {
      await fetchTransferData(searchRef);
    } catch (error) {
      // تم معالجة الخطأ في fetchTransferData
    }
  };

  const copyReference = async () => {
    const refToCopy = reference.trim();
    if (!refToCopy) return;

    try {
      await Clipboard.setStringAsync(refToCopy);
      Toast.show({ 
        type: 'success', 
        text1: 'تم النسخ',
        text2: 'تم نسخ المرجع إلى الحافظة' 
      });
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'خطأ',
        text2: 'تعذر نسخ المرجع' 
      });
    }
  };

  const openDocument = async (documentUrl?: string) => {
    if (!documentUrl) return;

    const absoluteUrl = absolutizeUrl(documentUrl);
    
    try {
      const canOpen = await Linking.canOpenURL(absoluteUrl);
      if (!canOpen) {
        Alert.alert('تنبيه', 'لا يمكن فتح هذا النوع من الملفات على جهازك');
        return;
      }
      
      await Linking.openURL(absoluteUrl);
    } catch (error) {
      Alert.alert('خطأ', 'تعذر فتح المستند - يرجى المحاولة لاحقاً');
    }
  };

  const absolutizeUrl = (url: string): string => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const base = (api.defaults?.baseURL || '').replace(/\/+$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  const getFriendlyMessage = (): string => {
    if (!transferInfo) return '';
    
    // إذا كان هناك مستند نهائي، لا نحتاج لرسالة توجيهية
    if (transferInfo.finalDoc?.url) return '';

    switch (transferInfo.status) {
      case 'created':
      case 'under_review':
        return 'الموظف يراجع بياناتك حاليًا. بنخلّصك بسرعة ⚡';
      
      case 'waiting_user_action':
        return 'يجب استكمال بعض البيانات المطلوبة لإتمام المعاملة';
      
      case 'awaiting_payment':
        return 'بانتظار التأكيد المالي. بعد التأكيد بنكمل الإجراءات فورًا.';
      
      case 'payment_submitted':
        return 'تم استلام إيصال الدفع، جاري التحقق منه مع الفريق المالي';
      
      case 'payment_verified':
        return 'تم تأكيد الدفع بنجاح، نكمل بقية الخطوات قريبًا';
      
      case 'awaiting_codes':
        return 'بانتظار أكواد تم من الطرفين لإتمام عملية النقل';
      
      case 'codes_submitted':
        return 'تم إدخال الأكواد، جاري التحقق منها مع منصة تم';
      
      case 'codes_verified':
        return 'تم التحقق من الأكواد، الاستمارة تتجهّز للرفع الآن ✨';
      
      case 'completed':
        return 'تم النقل بنجاح 👌 الاستمارة جاهزة للتحميل';
      
      default:
        return '';
    }
  };

  // دالة getAllDocuments المصححة مع التحقق الكامل
  const getAllDocuments = useCallback((): Document[] => {
    if (!transferInfo) return [];
    
    const documents: Document[] = [];
    
    // التحقق من كل خاصية قبل استخدامها
    try {
      // إضافة المستندات الأساسية مع التحقق الكامل
      if (transferInfo.finalDoc && typeof transferInfo.finalDoc === 'object' && transferInfo.finalDoc.url) {
        documents.push({ 
          ...transferInfo.finalDoc, 
          category: 'final' 
        });
      }
      
      if (transferInfo.istimara && typeof transferInfo.istimara === 'object' && transferInfo.istimara.url) {
        documents.push({ 
          ...transferInfo.istimara, 
          category: 'istimara' 
        });
      }
      
      if (transferInfo.inspectionDoc && typeof transferInfo.inspectionDoc === 'object' && transferInfo.inspectionDoc.url) {
        documents.push({ 
          ...transferInfo.inspectionDoc, 
          category: 'inspection' 
        });
      }
      
      if (transferInfo.insuranceDoc && typeof transferInfo.insuranceDoc === 'object' && transferInfo.insuranceDoc.url) {
        documents.push({ 
          ...transferInfo.insuranceDoc, 
          category: 'insurance' 
        });
      }
      
      // إضافة المستندات الإضافية مع التحقق
      if (transferInfo.additionalDocs && Array.isArray(transferInfo.additionalDocs)) {
        transferInfo.additionalDocs.forEach(doc => {
          if (doc && typeof doc === 'object' && doc.url) {
            documents.push({ 
              ...doc, 
              category: doc.category || 'other' 
            });
          }
        });
      }
      
      // إضافة المستندات العامة مع التحقق
      if (transferInfo.documents && Array.isArray(transferInfo.documents)) {
        transferInfo.documents.forEach(doc => {
          if (doc && typeof doc === 'object' && doc.url) {
            documents.push(doc);
          }
        });
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      return [];
    }

    return documents;
  }, [transferInfo]);

  return {
    // State
    reference,
    setReference,
    transferInfo,
    loading,
    isPolling,
    
    // Actions
    handleLookup,
    copyReference,
    openDocument,
    stopPolling,
    getFriendlyMessage,
    getAllDocuments,
  };
};