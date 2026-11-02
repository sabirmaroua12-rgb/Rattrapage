// src/navigation/AppNavigator.js
// Navigation configuration using React Navigation Native Stack

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuthStore from '../store/authStore';

// Screen imports
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth);

  // Check if a saved JWT token exists in SecureStore on app launch
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Show a simple loading indicator while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0066cc',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {token ? (
          // Authenticated Stack: Only accessible when a valid token is present
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home Dashboard' }}
            />
            <Stack.Screen
              name="Users"
              component={UsersScreen}
              options={{ title: 'All Registered Users' }}
            />
          </>
        ) : (
          // Unauthenticated Stack: Login and Registration screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default AppNavigator;
