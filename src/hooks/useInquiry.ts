import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { TransferLookupResponse, Document } from '../types';

const POLLING_INTERVAL = 4000;
const LAST_REF_KEY = '@last_ref';

export const useInquiry = () => {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState<TransferLookupResponse | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const pollingRef = useRef<NodeJS.Timeout>();

  // تحميل آخر مرجع محفوظ
  useEffect(() => {
    loadLastReference();
  }, []);

  // إيقاف البولينج عند الخروج
  useEffect(() => {
    return () => stopPolling();
  }, []);

  const loadLastReference = async () => {
    try {
      const lastRef = await AsyncStorage.getItem(LAST_REF_KEY);
      if (lastRef) {
        setReference(lastRef);
        // تحميل تلقائي لآخر مرجع
        setTimeout(() => handleLookup(lastRef), 500);
      }
    } catch (error) {
      console.error('Error loading last reference:', error);
    }
  };

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = undefined;
    }
  }, []);

  const startPolling = useCallback((ref: string) => {
    stopPolling();
    pollingRef.current = setInterval(() => {
      fetchTransferData(ref, true); // silent polling
    }, POLLING_INTERVAL);
  }, [stopPolling]);

  const fetchTransferData = async (ref: string, silent = false) => {
    if (!silent) setLoading(true);

    try {
      const { data } = await api.get<TransferLookupResponse>('/api/transfers/lookup/by-ref', {
        params: { ref, _t: Date.now() },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      setTransferData(data);
      extractDocuments(data);
      
      if (!silent) {
        await AsyncStorage.setItem(LAST_REF_KEY, ref);
        startPolling(ref);
      }
    } catch (error: any) {
      if (!silent) {
        const message = error?.response?.data?.message || error?.message || 'تعذر الاستعلام';
        Alert.alert('خطأ', message);
        setTransferData(null);
        setDocuments([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const extractDocuments = (data: TransferLookupResponse) => {
    const docs: Document[] = [];
    
    if (data.finalDoc) {
      docs.push({ ...data.finalDoc, category: 'final' });
    }
    if (data.istimara) {
      docs.push({ ...data.istimara, category: 'istimara' });
    }
    if (data.inspectionDoc) {
      docs.push({ ...data.inspectionDoc, category: 'inspection' });
    }
    if (data.insuranceDoc) {
      docs.push({ ...data.insuranceDoc, category: 'insurance' });
    }
    if (data.additionalDocs) {
      docs.push(...data.additionalDocs.map(doc => ({ ...doc, category: 'other' })));
    }

    setDocuments(docs);
  };

  const handleLookup = async (ref?: string) => {
    const searchRef = ref || reference.trim();
    
    if (!searchRef) {
      Alert.alert('تنبيه', 'أدخل مرجع المعاملة (مثل: T250817-XXXX)');
      return;
    }

    await fetchTransferData(searchRef);
  };

  const openDocument = async (document: Document) => {
    if (!document.url) return;

    const absoluteUrl = absolutizeUrl(document.url);
    
    try {
      const canOpen = await Linking.canOpenURL(absoluteUrl);
      if (!canOpen) {
        Alert.alert('تنبيه', 'لا يمكن فتح هذا النوع من الملفات');
        return;
      }
      
      await Linking.openURL(absoluteUrl);
    } catch (error) {
      Alert.alert('خطأ', 'تعذر فتح المستند');
    }
  };

  const absolutizeUrl = (url: string): string => {
    if (/^https?:\/\//i.test(url)) return url;
    const base = (api.defaults.baseURL || '').replace(/\/+$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  return {
    reference,
    setReference,
    loading,
    transferData,
    documents,
    handleLookup,
    openDocument,
    stopPolling,
  };
};