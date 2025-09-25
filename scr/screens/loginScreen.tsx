import React, { useState } from 'react';
import { Button } from '../components/Button';
import { colors } from '../components/styles/colors';
import { RootStackParamList } from '../navigation/types';
import { createLoginStyles } from '../components/styles/login.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createLoginStyles(isTablet);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de autenticação aqui
    if (email === 'teste@teste.com' && password === 'teste') {
      navigation.navigate('Home');
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button variant="default" size="default" onPress={handleLogin}>
          Entrar
        </Button>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Não tem uma conta?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Registre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
