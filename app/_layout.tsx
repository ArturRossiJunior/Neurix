import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Você pode configurar telas específicas aqui se precisar */}
      {/* Por exemplo, para esconder o cabeçalho: */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'Página Inicial' }} />
    </Stack>
  );
}