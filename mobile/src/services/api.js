// src/services/api.js
// Centralized Axios configuration for making HTTP requests to the backend API

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * CONFIGURATION GUIDE FOR BACKEND URL:
 * 
 * 1. Physical Phone (Expo Go via Wi-Fi):
 *    - Replace with your computer's local Wi-Fi IP address (e.g., 'http://192.168.1.50:5000')
 *    - Find your computer IP: run 'ipconfig' in Windows terminal (look for IPv4 Address)
 *    - Ensure your phone and computer are on the same Wi-Fi network!
 * 
 * 2. Android Emulator:
 *    - Use: 'http://10.0.2.2:5000' (10.0.2.2 is the special alias for host computer localhost)
 * 
 * 3. iOS Simulator / Web:
 *    - Use: 'http://localhost:5000'
 */
export const API_BASE_URL = 'http://10.0.2.2:5000';

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Automatically attach JWT Bearer token to protected requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve the saved JWT token from Expo SecureStore
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from SecureStore:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
