import HomeScreen from '../screens/Home';
import WalletScreen from '../screens/Wallet';
import InquiryScreen from '../screens/InquiryScreen';
import { TabConfig } from '../types/navigation';

export const tabsConfig: TabConfig[] = [
  {
    name: 'Home',
    label: 'الرئيسية',
    icon: {
      focused: 'home',
      outline: 'home-outline',
    },
    component: HomeScreen,
  },
  {
    name: 'Wallet',
    label: 'المحفظة',
    icon: {
      focused: 'wallet',
      outline: 'wallet-outline',
    },
    component: WalletScreen,
  },
  {
    name: 'Inquiry',
    label: 'الاستعلام',
    icon: {
      focused: 'search',
      outline: 'search-outline',
    },
    component: InquiryScreen,
  },
];