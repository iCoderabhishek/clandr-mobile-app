import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Create token cache for Clerk
const createTokenCache = () => {
  return {
    async getToken(key: string) {
      try {
        if (Platform.OS === 'web') {
          return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    },
    async saveToken(key: string, token: string) {
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem(key, token);
          return;
        }
        await SecureStore.setItemAsync(key, token);
      } catch (error) {
        console.error('Error saving token:', error);
      }
    },
  };
};

export const tokenCache = createTokenCache();