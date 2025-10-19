// Status.tsx - مع إضافة بولينج آمن
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../api/client';

export default function Status() {
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const pollingRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadLastRef();
    return () => stopPolling(); // تنظيف عند الخروج
  }, []);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = undefined;
      setIsPolling(false);
    }
  };

  const loadLastRef = async () => {
    try {
      const last = await AsyncStorage.getItem('@last_ref');
      if (last) {
        setRef(last);
        // تحميل تلقائي لآخر بحث
        setTimeout(() => handleLookup(last), 1000);
      }
    } catch (error) {
      console.error('Error loading last ref:', error);
    }
  };

  const startPolling = (searchRef: string) => {
    stopPolling(); // أوقف أي بولينج سابق
    setIsPolling(true);
    
    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await api.get('/api/transfers/lookup/by-ref', {
          params: { ref: searchRef, _t: Date.now() } // إضافة timestamp لمنع caching
        });
        
        if (data && data.clientRef) {
          setTransferData(data);
          
          // إذا اكتملت المعاملة، أوقف البولينج
          if (data.status === 'completed' || data.status === 'rejected') {
            stopPolling();
            Toast.show({ 
              type: 'success', 
              text1: 'تم تحديث الحالة',
              text2: `الحالة النهائية: ${getStatusText(data.status)}`
            });
          }
        }
      } catch (error) {
        // تجاهل الأخطاء في البولينج الصامت
      }
    }, 4000); // كل 4 ثواني
  };

  const handleLookup = async (customRef?: string) => {
    const searchRef = customRef || ref.trim();
    if (!searchRef) {
      Toast.show({ type: 'error', text1: 'أدخل المرجع' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get('/api/transfers/lookup/by-ref', {
        params: { ref: searchRef }
      });
      
      if (data && data.clientRef) {
        setTransferData(data);
        await AsyncStorage.setItem('@last_ref', searchRef);
        
        // ابدأ البولينج إذا لم تكن الحالة نهائية
        if (data.status !== 'completed' && data.status !== 'rejected') {
          startPolling(searchRef);
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'تعذر الاستعلام' });
      setTransferData(null);
      stopPolling();
    } finally {
      setLoading(false);
    }
  };

  // باقي الدوال كما هي...
  const openDocument = async (url: string) => {
    if (!url) {
      Toast.show({ type: 'error', text1: 'لا يوجد مستند' });
      return;
    }
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Toast.show({ type: 'error', text1: 'لا يمكن فتح الرابط' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'تعذر فتح المستند' });
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'created': 'تم الإرسال',
      'under_review': 'قيد المراجعة', 
      'waiting_user_action': 'بانتظار استكمال البيانات',
      'awaiting_payment': 'بانتظار الدفع',
      'payment_submitted': 'تم رفع الإيصال',
      'payment_verified': 'تم تأكيد الدفع',
      'awaiting_codes': 'بانتظار أكواد تم',
      'codes_submitted': 'تم إدخال الأكواد',
      'codes_verified': 'تم التحقق من الأكواد', 
      'completed': 'مكتمل',
      'rejected': 'مرفوض'
    };
    
    return statusMap[status] || status;
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Ionicons name="search" size={32} color="#0ea5e9" />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>
          تتبع حالة المعاملة
        </Text>
        <Text style={{ color: '#666', marginTop: 4 }}>
          ادخل رقم المرجع لمتابعة حالة نقل الملكية
        </Text>
      </View>

      <TextInput
        placeholder="اكتب المرجع مثل T250816-AB12CD"
        value={ref}
        onChangeText={setRef}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 12,
          padding: 16,
          fontSize: 16,
          marginBottom: 12,
        }}
        onSubmitEditing={() => handleLookup()}
      />

      <TouchableOpacity
        onPress={() => handleLookup()}
        style={{
          backgroundColor: '#0ea5e9',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          opacity: loading ? 0.7 : 1,
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              تتبع المعاملة
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* مؤشر البولينج */}
      {isPolling && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, gap: 8 }}>
          <Ionicons name="sync" size={16} color="#0ea5e9" />
          <Text style={{ color: '#0ea5e9', fontSize: 14 }}>
            جاري التحديث التلقائي...
          </Text>
        </View>
      )}

      {transferData && (
        <View style={{ 
          marginTop: 24, 
          padding: 20, 
          backgroundColor: '#f8fafc', 
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#e2e8f0'
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            معلومات المعاملة
          </Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: '#666' }}>المرجع:</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {transferData.clientRef}
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: '#666' }}>الحالة:</Text>
            <Text style={{ 
              fontWeight: 'bold', 
              fontSize: 16,
              color: transferData.status === 'completed' ? '#10b981' : 
                     transferData.status === 'rejected' ? '#ef4444' : '#0ea5e9'
            }}>
              {getStatusText(transferData.status)}
            </Text>
          </View>

          {transferData.amount && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#666' }}>المبلغ:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {transferData.amount} ر.س
              </Text>
            </View>
          )}

          {/* استخدم istimara بدل finalDoc */}
          {(transferData.istimara?.url || transferData.finalDoc?.url) && (
            <TouchableOpacity
              onPress={() => openDocument(transferData.istimara?.url || transferData.finalDoc?.url)}
              style={{
                backgroundColor: '#2563eb',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 16,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                تحميل الاستمارة
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!transferData && !loading && (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
          <Text style={{ fontSize: 18, color: '#64748b', marginTop: 16 }}>
            ابدأ بتتبع معاملتك
          </Text>
          <Text style={{ color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
            أدخل رقم المرجع الخاص بنقل الملكية{"\n"}
            لمشاهدة حالتها والمستندات المتاحة
          </Text>
        </View>
      )}
    </ScrollView>
  );
}