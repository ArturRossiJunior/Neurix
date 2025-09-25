import React, { useState } from 'react';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createRegisterStyles } from '../components/styles/register.styles';
import { View, Text, TextInput, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createRegisterStyles(isTablet);

  const handleRegister = () => {
    // Lógica de registro aqui
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    // Simulação de registro bem-sucedido
    Alert.alert('Sucesso', 'Registro realizado com sucesso! Faça login para continuar.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#64748B"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button variant="default" size="default" onPress={handleRegister}>
          Registrar
        </Button>
        <Text style={styles.loginText}>
          Já tem uma conta?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Faça Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};
