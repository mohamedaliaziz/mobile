// mobile/src/screens/Home.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Hooks and Components
import { useHome } from '../hooks/useHome';
import { ServiceSlider } from '../components/ServiceSlider';
import { WalletCard } from '../components/WalletCard';
import { ActiveTransferBanner } from '../components/ActiveTransferBanner';
import AuthModal from '../components/AuthModal';
import AIAssistant from '../components/AIAssistant';

// Styles
import { 
  commonStyles, 
  componentStyles, 
  colors, 
  typography 
} from '../styles';

// Types
interface HomeProps {
  onStartIndividuals: () => void;
  onStartBusiness: () => void;
  navToStatus: () => void;
   navToDocuments: () => void;
}

// دالة للرسالة الترحيبية
const getWelcomeMessage = (user: any): string => {
  const hour = new Date().getHours();
  const username = user?.username || 'عزيزي';
  
  if (hour < 12) {
    return `صباح الخير 🌞 ${username}`;
  } else if (hour < 18) {
    return `مساء الخير 🌅 ${username}`;
  } else {
    return `مساء النور 🌙 ${username}`;
  }
};

// Sub-Components
const PhoneSection: React.FC<{
  phone: string;
  phoneSaved: boolean;
  onPhoneChange: (phone: string) => void;
  onSavePhone: () => void;
}> = ({ phone, phoneSaved, onPhoneChange, onSavePhone }) => (
  <View style={componentStyles.phoneSection.container}>
    <View style={componentStyles.phoneSection.header}>
      <Ionicons name="call-outline" size={20} color={colors.primary[500]} />
      <Text style={typography.h3}>رقم جوالك</Text>
    </View>
    
    <Text style={typography.muted}>
      اكتب رقمك عشان ننجز كل شيء عن طريقه.
    </Text>
    
    <TextInput
      placeholder="مثلًا: 05xxxxxxxx"
      value={phone}
      onChangeText={onPhoneChange}
      keyboardType="phone-pad"
      style={commonStyles.input}
      placeholderTextColor={colors.neutral[400]}
    />
    
    <TouchableOpacity 
      onPress={onSavePhone} 
      style={commonStyles.button}
    >
      <Text style={commonStyles.buttonText}>
        {phoneSaved ? 'تحديث الرقم' : 'حفظ الرقم'}
      </Text>
    </TouchableOpacity>
  </View>
);

const WhatsAppButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={componentStyles.whatsapp.button}
    activeOpacity={0.9}
  >
    <Ionicons name="logo-whatsapp" size={22} color={colors.text.inverse} />
    <Text style={componentStyles.whatsapp.text}>
      تواصل عبر واتساب مع أحد موظفينا — نسهلها عليك
    </Text>
  </TouchableOpacity>
);

const ServicesSection: React.FC<{
  services: any[];
  loadingServices: boolean;
  onServicePress: (service: any) => void;
  scrollRef: React.RefObject<any>;
  snapInterval: number;
}> = ({ services, loadingServices, onServicePress, scrollRef, snapInterval }) => (
  <View style={{ marginTop: 24 }}>
    <View style={commonStyles.row}>
      <Text style={typography.h3}>الخدمات</Text>
      {loadingServices && <ActivityIndicator size="small" color={colors.primary[500]} />}
    </View>
    
    <ServiceSlider
      services={services}
      loading={loadingServices}
      onServicePress={onServicePress}
      scrollRef={scrollRef}
      snapInterval={snapInterval}
    />
  </View>
);

const CTASection: React.FC<{
  onStartIndividuals: () => void;
  onStartBusiness: () => void;
}> = ({ onStartIndividuals, onStartBusiness }) => (
  <View style={componentStyles.ctaSection.container}>
    <View style={componentStyles.ctaSection.header}>
      <Ionicons name="flash-outline" size={20} color={colors.primary[500]} />
      <Text style={typography.h3}>ابدأ الخدمة</Text>
    </View>

    <TouchableOpacity 
      onPress={onStartIndividuals} 
      style={commonStyles.button}
    >
      <Text style={commonStyles.buttonText}>نقل ملكية — أفراد</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={onStartBusiness} 
      style={[commonStyles.button, { backgroundColor: colors.primary[700] }]}
    >
      <Text style={commonStyles.buttonText}>نقل ملكية — مؤسسات</Text>
    </TouchableOpacity>
  </View>
);

// مكون بسيط لعرض المستخدم
const UserWelcomeSection: React.FC<{
  currentUser: any;
  onOpenProfile: () => void;
}> = ({ currentUser, onOpenProfile }) => (
  <TouchableOpacity 
    onPress={onOpenProfile}
    style={[commonStyles.card, { backgroundColor: colors.primary[50] }]}
  >
    <View style={commonStyles.rowBetween}>
      <View style={commonStyles.row}>
        <Ionicons name="person-circle-outline" size={24} color={colors.primary[500]} />
        <View style={{ marginLeft: 12 }}>
          <Text style={[typography.h3, { color: colors.primary[700] }]}>
            {getWelcomeMessage(currentUser)}
          </Text>
          <Text style={[typography.mutedSmall, { color: colors.primary[600] }]}>
            اضغط لعرض الملف الشخصي والإحصائيات
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.primary[500]} />
    </View>
    
    {/* نقاط سريعة */}
    <View style={[commonStyles.rowBetween, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.primary[200] }]}>
      <View style={{ alignItems: 'center' }}>
        <Ionicons name="trophy-outline" size={16} color={colors.warning[500]} />
        <Text style={[typography.mutedXSmall, { marginTop: 2 }]}>النقاط</Text>
        <Text style={[typography.body, { fontWeight: '800', color: colors.warning[600] }]}>
          {currentUser.points || 0}
        </Text>
      </View>
      
      <View style={{ alignItems: 'center' }}>
        <Ionicons name="star-outline" size={16} color={colors.success[500]} />
        <Text style={[typography.mutedXSmall, { marginTop: 2 }]}>المستوى</Text>
        <Text style={[typography.body, { fontWeight: '800', color: colors.success[600] }]}>
          {currentUser.points >= 100 ? 'ماسي' : currentUser.points >= 50 ? 'ذهبي' : currentUser.points >= 20 ? 'فضي' : 'برونزي'}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Main Component
const Home: React.FC<HomeProps> = ({
  onStartIndividuals,
  onStartBusiness,
  navToStatus,
    navToDocuments
}) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'profile'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const {
    phone,
    phoneSaved,
    services,
    loadingServices,
    points,
    checkingWallet,
    hasActiveTransfer,
    transferState,
    showBanner,
    scRef,
    SLIDER_SNAP,
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
  } = useHome({ onStartIndividuals, onStartBusiness });

  // تحميل المستخدم الحالي
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@current_user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleAuthSuccess = (user?: any) => {
    if (user) {
      setCurrentUser(user);
    }
    setAuthModalVisible(false);
    loadCurrentUser();
  };

  const handleLogout = async () => {
    setCurrentUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' | 'profile') => {
    setAuthMode(mode);
    setAuthModalVisible(true);
  };

  // Header Component مع زر المساعد الذكي
  const Header = () => (
    <View style={componentStyles.headerWithLogo.container}>
      {/* Logo */}
      <View style={commonStyles.row}>
        <Ionicons name="car-sport-outline" size={30} color={colors.primary[500]} />
        <Text style={componentStyles.headerWithLogo.logo}>مِلكيتك</Text>
      </View>

      {/* Auth Buttons or User Profile + AI Assistant Button */}
      <View style={commonStyles.row}>
        {/* زر المساعد الذكي - يظهر للجميع */}
        <TouchableOpacity 
          onPress={() => setShowAIAssistant(true)}
          style={[componentStyles.headerWithLogo.authButton, { borderColor: colors.warning[500] }]}
        >
          <Ionicons name="sparkles-outline" size={18} color={colors.warning[500]} />
          <Text style={[componentStyles.headerWithLogo.authButtonText, { color: colors.warning[500] }]}>
            المساعد
          </Text>
        </TouchableOpacity>

        {currentUser ? (
          <TouchableOpacity 
            onPress={() => openAuthModal('profile')}
            style={componentStyles.headerWithLogo.authButton}
          >
            <Ionicons name="person-outline" size={18} color={colors.primary[500]} />
            <Text style={componentStyles.headerWithLogo.authButtonText}>
              {currentUser.username}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              onPress={() => openAuthModal('login')} 
              style={componentStyles.headerWithLogo.authButton}
            >
              <Ionicons name="log-in-outline" size={18} color={colors.primary[500]} />
              <Text style={componentStyles.headerWithLogo.authButtonText}>دخول</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => openAuthModal('register')} 
              style={[componentStyles.headerWithLogo.authButton, componentStyles.headerWithLogo.authButtonRegister]}
            >
              <Ionicons name="person-add-outline" size={18} color={colors.success[500]} />
              <Text style={componentStyles.headerWithLogo.authButtonRegisterText}>تسجيل</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient 
      colors={colors.background.gradient} 
      style={commonStyles.flex1}
    >
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header />
     {/* زر مركز المستندات - في المكان الصحيح */}
        <TouchableOpacity 
          onPress={navToDocuments}
          style={[commonStyles.card, { backgroundColor: colors.success[50], marginBottom: 16 }]}
        >
          <View style={commonStyles.row}>
            <Ionicons name="archive-outline" size={24} color={colors.success[500]} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[typography.h3, { color: colors.success[700] }]}>
                مركز المستندات 📁
              </Text>
              <Text style={[typography.mutedSmall, { color: colors.success[600] }]}>
                إدارة جميع مستنداتك في مكان واحد
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.success[500]} />
          </View>
        </TouchableOpacity>
        {/* ترحيب سريع للمستخدم */}
        {currentUser && (
          <UserWelcomeSection 
            currentUser={currentUser}
            onOpenProfile={() => openAuthModal('profile')}
          />
        )}

        {/* Active Transfer Banner */}
        {transferState && showBanner && (
          <ActiveTransferBanner
            clientRef={transferState.clientRef || 'غير معروف'}
            currentStep={transferState.step}
            currentStepLabel={getStepLabel(transferState.step)}
            progressPercentage={getProgressPercentage(transferState.step)}
            onResume={handleResumeTransfer}
            onDismiss={dismissBanner}
          />
        )}

        {/* Wallet Card */}
        <WalletCard
          points={points}
          checkingWallet={checkingWallet}
          onRefresh={refreshWallet}
        />

        {/* Phone Input Section */}
        <PhoneSection
          phone={phone}
          phoneSaved={phoneSaved}
          onPhoneChange={setPhone}
          onSavePhone={savePhone}
        />

        {/* WhatsApp Support Button */}
        <WhatsAppButton onPress={openSupportWhatsApp} />

        {/* Services Section */}
        <ServicesSection
          services={services}
          loadingServices={loadingServices}
          onServicePress={handleServicePress}
          scrollRef={scRef}
          snapInterval={SLIDER_SNAP}
        />

        {/* CTA Buttons */}
        <CTASection
          onStartIndividuals={onStartIndividuals}
          onStartBusiness={onStartBusiness}
        />

        {/* دعوة للتسجيل للمستخدمين الغير مسجلين */}
        {!currentUser && (
          <View style={[
            commonStyles.card, 
            {   
              backgroundColor: colors.primary[50],
              alignItems: 'center', 
              padding: 20 
            }
          ]}>
            <Ionicons name="rocket-outline" size={40} color={colors.primary[500]} />
            <Text style={[typography.h3, { marginTop: 12, color: colors.primary[700], textAlign: 'center' }]}>
              سجل الآن واحصل على مزايا حصرية! 🎁
            </Text>
            <Text style={[typography.muted, { marginTop: 8, textAlign: 'center', color: colors.primary[600] }]}>
              تتبع معاملاتك، اكسب النقاط، واستفد من العروض الخاصة
            </Text>
            <TouchableOpacity 
              onPress={() => openAuthModal('register')}
              style={[commonStyles.button, { marginTop: 16 }]}
            >
              <Text style={commonStyles.buttonText}>إنشاء حساب مجاني</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        mode={authMode}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={handleAuthSuccess}
        onLogout={handleLogout}
      />

      {/* AI Assistant Modal */}
      <AIAssistant 
        visible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </LinearGradient>
  );
};

export default React.memo(Home);