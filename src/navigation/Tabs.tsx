import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationState } from '@react-navigation/native';

// Hooks and Config
import { useTabs } from '../hooks/useTabs';
import { tabsConfig } from '../config/tabs';

// Components
import { TabIcon } from '../components/TabIcon';
import { TabLabel } from '../components/TabLabel';

// Styles
import { tabStyles } from '../styles/components/tabs';

// Types
import { TabName, TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppTabs() {
  const { initialTab, isRestoring, saveLastTab } = useTabs();

  // معالجة تغيير الحالة وحفظ آخر تب
  const handleStateChange = async (state: NavigationState | undefined) => {
    if (!state) return;

    const currentRoute = state.routes[state.index];
    const tabName = currentRoute.name as TabName;

    if (['Home', 'Wallet', 'Inquiry'].includes(tabName)) {
      await saveLastTab(tabName);
    }
  };

  // إذا كان لا يزال يتم استعادة الحالة، يمكنك عرض شاشة تحميل
  if (isRestoring) {
    return null; // أو عرض ActivityIndicator
  }

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={tabStyles.navigator}
      screenListeners={{
        state: (e) => {
          handleStateChange(e.data.state as NavigationState);
        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon
                focused={focused}
                icon={tab.icon}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabLabel
                focused={focused}
                label={tab.label}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}