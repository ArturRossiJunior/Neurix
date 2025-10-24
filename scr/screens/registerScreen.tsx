import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import { colors } from '../components/styles/colors';
import { RegisterScreenProps } from '../navigation/types';
import { createRegisterStyles } from '../components/styles/register.styles';
import { formatCRPForDB, validateCRP, validateEmail } from '../utils/utils';
import { View, Text, TextInput, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createRegisterStyles(isTablet);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registroProfissional, setRegistroProfissional] = useState('');
  const [loading, setLoading] = useState(false);

  

  const handleRegister = async () => {
    setLoading(true);

    if (!name.trim().includes(' ')) {
      Alert.alert('Atenção', 'Informe seu nome completo (nome e sobrenome)');
      setLoading(false);
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Atenção', 'Informe um email válido');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (!validateCRP(registroProfissional)) {
      Alert.alert(
        'CRP Inválido',
        'Informe um CRP válido (ex: 06/123456)',
      );
      setLoading(false);
      return;
    }

    const crpFormatado = formatCRPForDB(registroProfissional);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nome_completo: name,
            registro_profissional: crpFormatado, 
          },
        },
      });

      if (error) {
        Alert.alert('Erro no Cadastro', error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        Alert.alert(
          'Sucesso',
          'Registro realizado com sucesso! Faça login para continuar',
        );
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Alert.alert('Erro Inesperado', error.message);
    } finally {
      setLoading(false);
    }
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
          placeholder="CRP (ex: 06/123456)" 
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          value={registroProfissional}
          onChangeText={setRegistroProfissional}
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
        <Button variant="default" size="default" onPress={handleRegister} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </Button>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};