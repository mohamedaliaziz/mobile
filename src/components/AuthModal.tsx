// mobile/src/components/AuthModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { authStyles } from '../styles/authStyles';
import { colors, typography } from '../styles';

interface User {
  id: string;
  username: string;
  phone: string;
  email?: string;
  points: number;
  role: string;
  createdAt: string;
}

interface AuthModalProps {
  visible: boolean;
  mode: 'login' | 'register' | 'profile';
  onClose: () => void;
  onSuccess: (user?: User) => void;
  onLogout?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  mode = 'login',
  onClose,
  onSuccess,
  onLogout,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isProfile = mode === 'profile';

  // تحميل بيانات المستخدم الحالي
  React.useEffect(() => {
    if (visible) {
      if (isProfile) {
        loadCurrentUser();
      }
      clearErrors();
    }
  }, [visible, isProfile]);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@current_user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setFormData({
          username: user.username || '',
          phone: user.phone || '',
          password: '',
          confirmPassword: '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };
  

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // تنظيف رقم الجوال من المسافات
    const cleanPhone = formData.phone.replace(/\s/g, '');

    if (isRegister || isLogin) {
      if (!cleanPhone.trim()) {
        newErrors.phone = 'رقم الجوال مطلوب';
      } else if (!/^05\d{8}$/.test(cleanPhone)) {
        newErrors.phone = 'رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام';
      }

      if (!formData.password) {
        newErrors.password = 'كلمة المرور مطلوبة';
      } else if (isRegister && formData.password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }
    }

    if (isRegister) {
      if (!formData.username.trim()) {
        newErrors.username = 'اسم المستخدم مطلوب';
      } else if (formData.username.length < 3) {
        newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
      }
    }

    if (isProfile) {
      if (!formData.username.trim()) {
        newErrors.username = 'اسم المستخدم مطلوب';
      } else if (formData.username.length < 3) {
        newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = formData.phone.replace(/\s/g, '');

      if (isLogin) {
        // تسجيل الدخول
        const { data } = await api.post('/api/auth/login', {
          phone: cleanPhone,
          password: formData.password,
        });

        if (data?.success && data?.user && data?.token) {
          await AsyncStorage.multiSet([
            ['@current_user', JSON.stringify(data.user)],
            ['@auth_token', data.token],
          ]);

          // إضافة التوكن لجميع الطلبات المستقبلية
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          
          Toast.show({ 
            type: 'success', 
            text1: 'تم تسجيل الدخول',
            text2: `مرحباً ${data.user.username}!` 
          });
          
          setCurrentUser(data.user);
          onSuccess(data.user);
          handleClose();
        } else {
          throw new Error(data?.message || 'فشل في تسجيل الدخول');
        }
      } else if (isRegister) {
        // تسجيل جديد
        const { data } = await api.post('/api/auth/register', {
          username: formData.username.trim(),
          phone: cleanPhone,
          password: formData.password,
          email: formData.email.trim() || undefined,
        });

        if (data?.success && data?.user && data?.token) {
          await AsyncStorage.multiSet([
            ['@current_user', JSON.stringify(data.user)],
            ['@auth_token', data.token],
          ]);

          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          
          Toast.show({ 
            type: 'success', 
            text1: 'تم إنشاء الحساب',
            text2: `أهلاً بك ${data.user.username}!` 
          });
          
          setCurrentUser(data.user);
          onSuccess(data.user);
          handleClose();
        } else {
          throw new Error(data?.message || 'فشل في إنشاء الحساب');
        }
      } else if (isProfile) {
        // تحديث الملف الشخصي
        const { data } = await api.put('/api/auth/profile', {
          username: formData.username.trim(),
          email: formData.email.trim() || undefined,
        });

        if (data?.success && data?.user) {
          await AsyncStorage.setItem('@current_user', JSON.stringify(data.user));
          setCurrentUser(data.user);
          
          Toast.show({ 
            type: 'success', 
            text1: 'تم تحديث البيانات',
            text2: 'تم حفظ التغييرات بنجاح' 
          });
          
          onSuccess(data.user);
        } else {
          throw new Error(data?.message || 'فشل في تحديث البيانات');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'حدث خطأ غير متوقع';
      
      if (error.response) {
        // خطأ من السيرفر
        const serverError = error.response.data;
        if (serverError.message) {
          errorMessage = serverError.message;
        } else if (serverError.errors && Array.isArray(serverError.errors)) {
          errorMessage = serverError.errors[0]?.msg || serverError.errors[0] || errorMessage;
        }
      } else if (error.request) {
        // لا يوجد اتصال بالسيرفر
        errorMessage = 'تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت';
      } else if (error.message) {
        // خطأ في الكود
        errorMessage = error.message;
      }

      // معالجة أخطاء محددة
      if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        errorMessage = 'تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'انتهت مهلة الاتصال. حاول مرة أخرى';
      } else if (errorMessage.includes('401') || errorMessage.includes('مصادقة')) {
        errorMessage = 'بيانات الدخول غير صحيحة';
      } else if (errorMessage.includes('مسجل مسبقاً') || errorMessage.includes('موجود')) {
        errorMessage = 'رقم الجوال أو اسم المستخدم مسجل مسبقاً';
      }
      
      Toast.show({ 
        type: 'error', 
        text1: 'فشل', 
        text2: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل خروج',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@current_user', 
                '@auth_token'
              ]);
              
              // إزالة التوكن من الـ headers
              if (api.defaults.headers.common['Authorization']) {
                delete api.defaults.headers.common['Authorization'];
              }
              
              setCurrentUser(null);
              
              Toast.show({ 
                type: 'success', 
                text1: 'تم تسجيل الخروج' 
              });
              
              onLogout?.();
              handleClose();
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({ 
                type: 'error', 
                text1: 'خطأ', 
                text2: 'تعذر تسجيل الخروج' 
              });
            }
          },
        },
      ]
    );
  };

  const clearForm = () => {
    setFormData({
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      email: '',
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleClose = () => {
    clearForm();
    clearErrors();
    onClose();
  };

  const formatPhone = (text: string) => {
    // تنظيف الرقم من أي أحرف غير رقمية
    const cleaned = text.replace(/\D/g, '');
    
    // إضافة مسافات للقراءة
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.substring(0, 4) + ' ' + cleaned.substring(4);
    }
    if (cleaned.length > 8) {
      formatted = formatted.substring(0, 8) + ' ' + formatted.substring(8);
    }
    
    return formatted.substring(0, 12); // 05x xxx xxxx
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    // مسح خطأ رقم الجوال إذا تم تصحيحه
    if (errors.phone && /^05\d\s\d{3}\s\d{4}$/.test(formatted)) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // مسح الخطأ عند البدء بالكتابة
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      onRequestClose={handleClose}
    >
      <View style={authStyles.modalOverlay}>
        <View style={authStyles.modalContainer}>
          {/* الهيدر */}
          <View style={authStyles.modalHeader}>
            <View style={authStyles.headerRow}>
              <Ionicons 
                name={
                  isProfile ? "person-outline" : 
                  isLogin ? "log-in-outline" : "person-add-outline"
                } 
                size={24} 
                color={colors.primary[500]} 
              />
              <Text style={typography.h2}>
                {isProfile ? 'الملف الشخصي' : isLogin ? 'تسجيل الدخول' : 'تسجيل جديد'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={authStyles.iconButton}>
              <Ionicons name="close-outline" size={24} color={colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={authStyles.scrollContent}
          >
            {/* عرض بيانات المستخدم في الملف الشخصي */}
            {isProfile && currentUser && (
              <View style={authStyles.profileCard}>
                <View style={authStyles.profileHeader}>
                  <View style={authStyles.avatarContainer}>
                    <Ionicons name="person-circle-outline" size={40} color={colors.primary[500]} />
                  </View>
                  <View style={authStyles.profileInfo}>
                    <Text style={authStyles.username}>
                      {currentUser.username}
                    </Text>
                    <Text style={authStyles.userPhone}>
                      {currentUser.phone}
                    </Text>
                    <Text style={authStyles.userPoints}>
                      {currentUser.points} نقطة
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* حقول الإدخال */}
            <View style={authStyles.formContainer}>
              {/* اسم المستخدم - للتسجيل والملف الشخصي */}
              {(isRegister || isProfile) && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>
                    اسم المستخدم {isRegister && '*'}
                  </Text>
                  <TextInput
                    value={formData.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    placeholder="أدخل اسم المستخدم"
                    style={[
                      authStyles.input,
                      errors.username && authStyles.inputError
                    ]}
                    editable={!loading}
                  />
                  {errors.username && (
                    <Text style={authStyles.errorText}>{errors.username}</Text>
                  )}
                </View>
              )}

              {/* رقم الجوال - للتسجيل والدخول */}
              {(isRegister || isLogin) && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>رقم الجوال *</Text>
                  <TextInput
                    value={formData.phone}
                    onChangeText={handlePhoneChange}
                    placeholder="05x xxx xxxx"
                    keyboardType="phone-pad"
                    style={[
                      authStyles.input,
                      errors.phone && authStyles.inputError
                    ]}
                    editable={!loading}
                    maxLength={12} // 05x xxx xxxx
                  />
                  {errors.phone && (
                    <Text style={authStyles.errorText}>{errors.phone}</Text>
                  )}
                </View>
              )}

              {/* البريد الإلكتروني - اختياري */}
              {(isRegister || isProfile) && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>البريد الإلكتروني (اختياري)</Text>
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      authStyles.input,
                      errors.email && authStyles.inputError
                    ]}
                    editable={!loading}
                  />
                  {errors.email && (
                    <Text style={authStyles.errorText}>{errors.email}</Text>
                  )}
                </View>
              )}

              {/* كلمة المرور - للتسجيل والدخول */}
              {(isLogin || isRegister) && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>كلمة المرور *</Text>
                  <View style={authStyles.passwordContainer}>
                    <TextInput
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      placeholder="أدخل كلمة المرور"
                      secureTextEntry={secureText}
                      style={[
                        authStyles.input,
                        authStyles.passwordInput,
                        errors.password && authStyles.inputError
                      ]}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setSecureText(!secureText)}
                      style={authStyles.passwordToggle}
                      disabled={loading}
                    >
                      <Ionicons 
                        name={secureText ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={colors.neutral[500]} 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={authStyles.errorText}>{errors.password}</Text>
                  )}
                </View>
              )}

              {/* تأكيد كلمة المرور - للتسجيل فقط */}
              {isRegister && (
                <View style={authStyles.inputContainer}>
                  <Text style={authStyles.inputLabel}>تأكيد كلمة المرور *</Text>
                  <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    placeholder="أعد إدخال كلمة المرور"
                    secureTextEntry={secureText}
                    style={[
                      authStyles.input,
                      errors.confirmPassword && authStyles.inputError
                    ]}
                    editable={!loading}
                  />
                  {errors.confirmPassword && (
                    <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>
              )}

              {/* زر الإرسال */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  authStyles.submitButton,
                  loading && authStyles.submitButtonDisabled
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={authStyles.buttonText}>
                    {isProfile ? 'حفظ التغييرات' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* زر تسجيل الخروج - للملف الشخصي فقط */}
              {isProfile && (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={[authStyles.logoutButton, loading && { opacity: 0.5 }]}
                  disabled={loading}
                >
                  <Ionicons name="log-out-outline" size={18} color={colors.error[500]} />
                  <Text style={authStyles.logoutButtonText}>
                    تسجيل الخروج
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AuthModal;