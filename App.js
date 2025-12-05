import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MessProvider } from './src/context/MessContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <MessProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </MessProvider>
    </SafeAreaProvider>
  );
}
