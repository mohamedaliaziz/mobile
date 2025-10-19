// mobile/src/App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

// استيراد الشاشات
import Home from './screens/Home';
import Wallet from './screens/Wallet';
import Status from './screens/Status';
import DocumentsScreen from './screens/DocumentsScreen';
import AuthModal from './components/AuthModal';
import TransferIndividuals from './screens/TransferIndividuals';
import TransferBusiness from './screens/TransferBusiness';
import { useTransferState } from './hooks/useTransferState';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

// تبسيط useTransferState
const useSimpleTransferState = () => {
  const [transferState, setTransferState] = useState<any>(null);

  useEffect(() => {
    loadTransferState();
  }, []);

  const loadTransferState = async () => {
    try {
      const saved = await AsyncStorage.getItem('@current_transfer_state');
      if (saved) {
        const state = JSON.parse(saved);
        const lastUpdated = new Date(state.lastUpdated);
        const now = new Date();
        const diffDays = (now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24);
        
        if (diffDays < 7) {
          setTransferState(state);
        } else {
          await AsyncStorage.removeItem('@current_transfer_state');
        }
      }
    } catch (error) {
      console.error('Error loading transfer state:', error);
    }
  };

  return { transferState };
};

// المكون الرئيسي مع Navigation
function MainApp() {
  const [tab, setTab] = useState('home');
  const [authMode, setAuthMode] = useState(null);
  const [route, setRoute] = useState(null);
  const { transferState } = useSimpleTransferState();

  const navToDocuments = () => {
    setRoute('documents');
  };

  const Screen = route === 'transferIndividuals'
    ? (props) => <TransferIndividuals {...props} onBack={() => setRoute(null)} onGoStatus={() => {
        setRoute(null);
        setTab('status');
      }} />
    : route === 'transferBusiness'
    ? (props) => <TransferBusiness {...props} onBack={() => setRoute(null)} onGoStatus={() => setTab('status')} />
    : route === 'documents'
    ? (props) => <DocumentsScreen {...props} onBack={() => setRoute(null)} />
    : tab === 'home'
    ? (props) => <Home 
        {...props} 
        onStartIndividuals={() => setRoute('transferIndividuals')}
        onStartBusiness={() => setRoute('transferBusiness')}
        navToStatus={() => setTab('status')}
        navToDocuments={navToDocuments}
      />
    : tab === 'wallet'
    ? Wallet
    : Status;

  const renderQuickAction = () => {
    if (transferState && route === null && tab === 'home') {
      return (
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => {
            if (transferState.type === 'individual') {
              setRoute('transferIndividuals');
            } else {
              setRoute('transferBusiness');
            }
          }}
        >
          <Ionicons name="refresh-circle" size={20} color="#0ea5e9" />
          <Text style={styles.quickActionText}>استئناف المعاملة</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, paddingBottom: 72 }}>
      <Screen
        onOpenAuth={(mode) => setAuthMode(mode)}
        onStartIndividuals={() => setRoute('transferIndividuals')}
        onStartBusiness={() => setRoute('transferBusiness')}
        navToStatus={() => setTab('status')}
        navToDocuments={navToDocuments}
      />

      {/* زر الاستئناف السريع */}
      {renderQuickAction()}

      {/* تبويبات سفلية */}
      {route == null && (
        <View style={styles.nav}>
          <TabItem icon="home-outline"   title="الرئيسية"   active={tab === 'home'}   onPress={() => setTab('home')} />
          <TabItem icon="wallet-outline" title="المحفظة"    active={tab === 'wallet'} onPress={() => setTab('wallet')} />
          <TabItem icon="reader-outline" title="الاستعلام"  active={tab === 'status'} onPress={() => setTab('status')} />
        </View>
      )}

      <AuthModal
        visible={!!authMode}
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSuccess={(user) => {
          console.log('Auth success:', user);
          setAuthMode(null);
        }}
        onLogout={() => {
          console.log('User logged out');
        }}
      />
    </View>
  );
}

function TabItem({ icon, title, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && { opacity: 1 }]}>
      <Ionicons name={icon} size={22} color={active ? '#0ea5e9' : '#6b7280'} />
      <Text style={{ color: active ? '#0ea5e9' : '#6b7280', fontSize: 12 }}>{title}</Text>
    </TouchableOpacity>
  );
}

// App الرئيسي مع NavigationContainer
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainApp} />
          <Stack.Screen name="Documents" component={DocumentsScreen} />
          <Stack.Screen name="TransferIndividuals" component={TransferIndividuals} />
          <Stack.Screen name="TransferBusiness" component={TransferBusiness} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast position="top" topOffset={48} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 72,
    backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
  },
  tab: { alignItems: 'center', paddingVertical: 8, minWidth: 100, opacity: 0.85 },
  quickAction: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: '#0ea5e9',
    fontWeight: '700',
    fontSize: 12,
  },
});