import React from 'react';
import { AuthProvider } from './AuthContext';
import AppNavigator from '../Neurix/scr/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}