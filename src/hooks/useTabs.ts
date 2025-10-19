import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabName } from '../types/navigation';

const TAB_STORAGE_KEY = '@last_tab';

export const useTabs = () => {
  const [initialTab, setInitialTab] = useState<TabName>('Home');
  const [isRestoring, setIsRestoring] = useState(true);

  // تحميل آخر تب تم فتحه
  const loadLastTab = useCallback(async () => {
    try {
      const savedTab = await AsyncStorage.getItem(TAB_STORAGE_KEY) as TabName | null;
      
      if (savedTab && ['Home', 'Wallet', 'Inquiry'].includes(savedTab)) {
        setInitialTab(savedTab);
      }
    } catch (error) {
      console.error('Error loading last tab:', error);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  // حفظ آخر تب تم فتحه
  const saveLastTab = useCallback(async (tabName: TabName) => {
    try {
      await AsyncStorage.setItem(TAB_STORAGE_KEY, tabName);
    } catch (error) {
      console.error('Error saving last tab:', error);
    }
  }, []);

  useEffect(() => {
    loadLastTab();
  }, [loadLastTab]);

  return {
    initialTab,
    isRestoring,
    saveLastTab,
  };
};