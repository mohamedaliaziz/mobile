// mobile/src/hooks/useHome.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../api/client';
import { Service } from '../types';

// Constants
const WA_SUPPORT = "966543008768";
const WELCOME_TEXT = "هلا فيك! تم حفظ رقمك في تطبيق مِلكيتك. نورتنا 🤍";
const SLIDER_ITEM_SIZE = 116;
const SLIDER_GAP = 16;
const SLIDER_SNAP = SLIDER_ITEM_SIZE + SLIDER_GAP;

interface UseHomeProps {
  onStartIndividuals: () => void;
  onStartBusiness: () => void;
}

export const useHome = ({ onStartIndividuals, onStartBusiness }: UseHomeProps) => {
  const [phone, setPhone] = useState('');
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const [checkingWallet, setCheckingWallet] = useState(false);
  const [transferState, setTransferState] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(true);

  const scRef = useRef<any>(null);
  const idxRef = useRef(0);

  // Load saved phone number and check active transfers
  useEffect(() => {
    loadSavedPhone();
    loadTransferState();
  }, []);

  // Auto slider effect
  useEffect(() => {
    const intervalId = setInterval(handleAutoScroll, 2500);
    return () => clearInterval(intervalId);
  }, [services.length]);

  // Load services from API
  useEffect(() => {
    loadServices();
  }, []);
  // ✅ تحديث الحالة تلقائياً عند فتح التطبيق أو الرجوع للهوم
  useEffect(() => {
    const refreshState = async () => {
      try {
        const saved = await AsyncStorage.getItem('@current_transfer_state');
        if (saved) {
          const state = JSON.parse(saved);
          setTransferState(state);
          
        }
      } catch (error) {
        console.error('Error auto-refreshing transfer state:', error);
      }
    };

    // تحديث فوري عند تحميل الهوك
    refreshState();

    // ✅ تحديث كل 5 ثواني للتأكد من المزامنة
    const interval = setInterval(refreshState, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSavedPhone = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('@user_phone');
      if (saved) {
        setPhone(saved);
        setPhoneSaved(true);
      }
    } catch (error) {
      console.error('Error loading saved phone:', error);
    }
  }, []);

  const loadTransferState = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('@current_transfer_state');
      
      if (saved) {
        const state = JSON.parse(saved);
        // التحقق من أن الحالة ليست قديمة (أكثر من 7 أيام)
        const lastUpdated = new Date(state.lastUpdated);
        const now = new Date();
        const diffDays = (now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24);
        
        if (diffDays < 7) {
          setTransferState(state);
       
        } else {
          await AsyncStorage.removeItem('@current_transfer_state');
          setTransferState(null);
        }
      } else {
        setTransferState(null);
      }
    } catch (error) {
      console.error('Error loading transfer state:', error);
      setTransferState(null);
    }
  }, []);
  useEffect(() => {
    if (transferState) {
     
    }
  }, [transferState]);

  const clearTransferState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@current_transfer_state');
      setTransferState(null);
      setShowBanner(true);
    } catch (error) {
      console.error('Error clearing transfer state:', error);
    }
  }, []);

  const handleResumeTransfer = useCallback(() => {
    if (transferState?.type === 'individual') {
      onStartIndividuals();
    } else if (transferState?.type === 'business') {
      onStartBusiness();
    }
  }, [transferState, onStartIndividuals, onStartBusiness]);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const getStepLabel = useCallback((step: number) => {
    const labels = ['المستندات', 'المراجعة', 'الدفع', 'أكواد تم', 'مكتمل'];
    return labels[step - 1] || 'غير معروف';
  }, []);
   const getProgressPercentage = useCallback((step: number) => {
    const totalSteps = 5;
    return Math.round((step / totalSteps) * 100);
  }, []);

  const handleAutoScroll = useCallback(() => {
    if (!services.length) return;
    idxRef.current = (idxRef.current + 1) % services.length;
    scRef.current?.scrollTo({ x: idxRef.current * SLIDER_SNAP, animated: true });
  }, [services.length]);

  const loadServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      const { data } = await api.get<Service[]>('/api/services');
      
      if (Array.isArray(data) && data.length) {
        const formattedServices = data.map(service => ({
          key: service.key,
          name: (service as any).name || service.key,
          price: typeof service.price === 'number' ? service.price : -1,
          icon: guessIcon(service.key),
          link: (service as any).link,
        }));
        setServices(formattedServices);
      } else {
        // Fallback services
        setServices(getFallbackServices());
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices(getFallbackServices());
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const refreshWallet = useCallback(async () => {
    try {
      setCheckingWallet(true);
      const [token, phoneStored] = await Promise.all([
        AsyncStorage.getItem('@token'),
        AsyncStorage.getItem('@user_phone'),
      ]);

      if (!token || !phoneStored) {
        setPoints(null);
        Toast.show({ 
          type: 'info', 
          text1: 'سجّل الدخول واحفظ رقمك لعرض النقاط' 
        });
        return;
      }

      const { data } = await api.get('/api/wallet', { 
        params: { phone: phoneStored } 
      });
      
      if (typeof data?.points === 'number') {
        setPoints(data.points);
      }
    } catch (error: any) {
      setPoints(null);
      console.error('Wallet refresh error:', error);
    } finally {
      setCheckingWallet(false);
    }
  }, []);

  const validateSaudiPhone = useCallback((phoneNumber: string): boolean => {
    const clean = phoneNumber.replace(/\D/g, '');
    return /^(\+?966|966)?5\d{8}$/.test(clean) || /^05\d{8}$/.test(phoneNumber);
  }, []);

  const savePhone = useCallback(async () => {
    if (!validateSaudiPhone(phone)) {
      Toast.show({ 
        type: 'error', 
        text1: 'تنبيه', 
        text2: 'أدخل رقم جوال صحيح يبدأ بـ 05…' 
      });
      return;
    }

    try {
      await AsyncStorage.setItem('@user_phone', phone);
      setPhoneSaved(true);
      Toast.show({ 
        type: 'success', 
        text1: 'تم الحفظ', 
        text2: 'رقم جوالك اتحفظ بنجاح ✅' 
      });
      sendWelcomeMessage();
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'خطأ', 
        text2: 'تعذر حفظ رقم الجوال' 
      });
    }
  }, [phone]);

  const sendWelcomeMessage = useCallback(async () => {
    const message = `${WELCOME_TEXT}\nرقمك: ${phone}`;
    const whatsappDeep = `whatsapp://send?phone=${WA_SUPPORT}&text=${encodeURIComponent(message)}`;
    const whatsappWeb = `https://wa.me/${WA_SUPPORT}?text=${encodeURIComponent(message)}`;

    try {
      const canOpenWhatsApp = await Linking.canOpenURL('whatsapp://send?text=hi');
      if (canOpenWhatsApp) {
        await Linking.openURL(whatsappDeep);
      } else {
        await Linking.openURL(whatsappWeb);
      }
    } catch {
      try {
        await Linking.openURL(`sms:${WA_SUPPORT}?body=${encodeURIComponent(message)}`);
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }
    }
  }, [phone]);

  const openSupportWhatsApp = useCallback(() => {
    const message = "مرحبًا، أبغى أبدأ في نقل الملكية عبر تطبيق مِلكيتك.";
    Linking.openURL(`https://wa.me/${WA_SUPPORT}?text=${encodeURIComponent(message)}`);
  }, []);

  const handleServicePress = useCallback((service: Service) => {
    if (service.key === 'transfer') {
      Toast.show({ 
        type: 'info', 
        text1: 'اختَر نوع الخدمة بالأسفل', 
        text2: 'أفراد أو مؤسسات' 
      });
      return;
    }

    const message = `أبغى خدمة: ${service.name} — رقمي: ${phone || 'غير مذكور'}`;
    if (service.link) {
      Linking.openURL(service.link);
    } else {
      Linking.openURL(`https://wa.me/${WA_SUPPORT}?text=${encodeURIComponent(message)}`);
    }
  }, [phone]);

  return {
    // State
    phone,
    phoneSaved,
    services,
    loadingServices,
    points,
    checkingWallet,
    hasActiveTransfer: !!transferState,
    transferState,
    showBanner,
    
    
    // Refs
    scRef,
    
    // Constants
    SLIDER_SNAP,
    
    // Actions
    setPhone,
    refreshWallet,
    savePhone,
    openSupportWhatsApp,
    handleServicePress,
    handleResumeTransfer,
    dismissBanner,
    getStepLabel,
    clearTransferState,
    getProgressPercentage,
  };
};

// Helper functions
const getFallbackServices = (): Service[] => [
  { key: 'transfer', name: 'نقل ملكية', price: 420, icon: 'swap-horizontal-outline' },
  { key: 'insurance', name: 'تأمين', price: -1, icon: 'shield-checkmark-outline' },
  { key: 'inspection', name: 'فحص', price: 10, icon: 'construct-outline' },
  { key: 'istimara', name: 'تجديد استمارة', price: -1, icon: 'document-text-outline' },
  { key: 'plates', name: 'إسقاط لوحات', price: -1, icon: 'albums-outline' },
  { key: 'operation_cards', name: 'كروت تشغيل', price: -1, icon: 'card-outline' },
  { key: 'public_private', name: 'من عام لخاص', price: -1, icon: 'repeat-outline' },
  { key: 'customs', name: 'بطاقة جمركية', price: -1, icon: 'pricetags-outline' },
  { key: 'traffic_letter', name: 'خطاب المرور', price: -1, icon: 'newspaper-outline' },
];

const guessIcon = (key: string): any => {
  const iconMap: Record<string, string> = {
    transfer: 'swap-horizontal-outline',
    insurance: 'shield-checkmark-outline',
    inspection: 'construct-outline',
    istimara: 'document-text-outline',
    plates: 'albums-outline',
    operation_cards: 'card-outline',
    public_private: 'repeat-outline',
    customs: 'pricetags-outline',
    traffic_letter: 'newspaper-outline',
  };
  
  return iconMap[key] || 'document-text-outline';
};