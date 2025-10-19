// mobile/src/api/client.ts
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FALLBACK = "http://192.168.100.32:4000";
const API_URL = (Constants.expoConfig?.extra && Constants.expoConfig.extra.apiUrl) || FALLBACK;

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""),
  timeout: 20000,
  headers: { 
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
});

// Add request interceptor with better logging
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    console.log('🔐 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found');
    }
  } catch (error) {
    console.error('❌ Error setting auth token:', error);
  }
  return config;
});

// Add response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.log('🔄 Token expired, clearing storage...');
      await AsyncStorage.multiRemove(['@auth_token', '@current_user']);
      // يمكن إضافة redirect لشاشة Login هنا إذا تريد
    }
    
    return Promise.reject(error);
  }
);

export default api;
export const API_BASE = api.defaults.baseURL!;