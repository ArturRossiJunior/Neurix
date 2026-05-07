import React from 'react';
import { AuthProvider } from './AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/utils/ToastContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppNavigator />
      </ToastProvider>
    </AuthProvider>
  );
}