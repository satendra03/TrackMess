import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MessProvider } from './src/context/MessContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <MessProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </MessProvider>
  );
}
