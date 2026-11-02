// src/store/authStore.js
// Global authentication state management using Zustand and Expo SecureStore

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const useAuthStore = create((set) => ({
  // State variables
  user: null,
  token: null,
  isLoading: true, // Used to verify existing login on app launch

  // Save authentication details (user & JWT token) to Zustand and SecureStore
  setAuth: async (user, token) => {
    try {
      // Securely persist token and user information
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      set({ user, token, isLoading: false });
    } catch (error) {
      console.error('Failed to save auth state to SecureStore:', error);
      set({ user, token, isLoading: false });
    }
  },

  // Clear authentication details on logout
  logout: async () => {
    try {
      // Remove stored credentials
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch (error) {
      console.error('Failed to clear SecureStore on logout:', error);
    } finally {
      set({ user: null, token: null, isLoading: false });
    }
  },

  // Load existing credentials when the app starts
  loadStoredAuth: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedUserData = await SecureStore.getItemAsync('userData');

      if (storedToken && storedUserData) {
        set({
          token: storedToken,
          user: JSON.parse(storedUserData),
          isLoading: false,
        });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
