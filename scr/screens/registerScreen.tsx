import React, { useState } from 'react';
import { Button } from '../components/Button';
import { colors } from '../components/styles/colors';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createRegisterStyles } from '../components/styles/register.styles';
import { View, Text, TextInput, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createRegisterStyles(isTablet);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    if (!name.trim().includes(' ')) {
      Alert.alert('Erro', 'Informe seu nome completo (nome e sobrenome)');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Informe um email válido');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    Alert.alert('Sucesso', 'Registro realizado com sucesso! Faça login para continuar');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button variant="default" size="default" onPress={handleRegister}>
          Registrar
        </Button>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Já tem uma conta?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};