import CheckBox from 'expo-checkbox';
import { Button } from '../components/Button';
import React, { useState, useEffect } from 'react';
import { colors } from '../components/styles/colors';
import { LoginScreenProps } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLoginStyles } from '../components/styles/login.styles';
import { View, Text, TextInput, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';

const STORAGE_KEY = '@remember_me';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createLoginStyles(isTablet);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
          const { rememberedEmail } = JSON.parse(jsonValue);
          setEmail(rememberedEmail);
          setRememberMe(true);
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      }
    };

    loadRememberedUser();
  }, []);

  const handleLogin = async () => {
    if (rememberMe) {
      try {
        const jsonValue = JSON.stringify({ rememberedEmail: email });
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      } catch (e) {
        console.error('Failed to save user to storage.', e);
      }
    } else {
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to remove user from storage', e);
      }
    }

    if (email === 'teste@teste.com' && password === 'teste') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
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

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? colors.linkText : colors.mutedForeground}
          />
          <Text style={styles.checkboxLabel}>Lembrar de mim</Text>
        </View>

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