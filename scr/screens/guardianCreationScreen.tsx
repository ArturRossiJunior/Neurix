import React, { useState } from 'react';
import { Card } from '../components/Card';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { MaskedTextInput } from 'react-native-mask-text';
import { capitalizeName, validateEmail } from '../utils/utils';
import { GuardianCreationScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/guardians.styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

const GuardianCreationScreen = ({ navigation, route }: GuardianCreationScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  const prefillName = route?.params?.prefillName || '';

  const [formData, setFormData] = useState({
    name: prefillName,
    cpf: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSave = async () => {
    const unmaskedPhone = formData.phone.replace(/\D/g, '');
    const unmaskedCPF = formData.cpf.replace(/\D/g, '');

    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome do responsável é obrigatório');
      return;
    }
    if (!formData.name.trim().includes(' ')) {
      Alert.alert('Erro', 'Digite o nome completo do responsável (nome e sobrenome)');
      return;
    }
    if (!unmaskedCPF || unmaskedCPF.length !== 11) {
      Alert.alert('Erro', 'CPF inválido. Deve conter 11 dígitos');
      return;
    }
    if (/^(\d)\1+$/.test(unmaskedCPF)) {
      Alert.alert('Erro', 'CPF inválido (dígitos repetidos)');
      return;
    }
    if (!unmaskedPhone || (unmaskedPhone.length !== 10 && unmaskedPhone.length !== 11)) {
      Alert.alert('Erro', 'Telefone inválido. Deve conter 10 ou 11 dígitos.');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return;
    }
    if (!validateEmail(formData.email.trim())) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    const capitalizedName = capitalizeName(formData.name.trim());

    try {
      const { data: existingPaciente, error: fetchPacienteError } = await supabase
        .from('pacientes')
        .select('id')
        .eq('cpf', unmaskedCPF);

      if (fetchPacienteError) throw fetchPacienteError;

      if (existingPaciente && existingPaciente.length > 0) {
        Alert.alert('Erro', 'Este CPF já está cadastrado como um paciente. Um responsável não pode ter o mesmo CPF de um paciente');
        return;
      }

      const { data: existing, error: fetchError } = await supabase
        .from('responsavel')
        .select('cpf, telefone, email')
        .or(`cpf.eq.${unmaskedCPF},telefone.eq.${unmaskedPhone},email.eq.${formData.email.trim()}`);

      if (fetchError) throw fetchError;

      if (existing && existing.length > 0) {
        const duplicateMessages: string[] = [];

        const hasCPF = existing.some(item => item.cpf === unmaskedCPF);
        const hasPhone = existing.some(item => item.telefone === unmaskedPhone);
        const hasEmail = existing.some(item => item.email === formData.email.trim());

        if (hasCPF) duplicateMessages.push('CPF já cadastrado');
        if (hasPhone) duplicateMessages.push('Telefone já cadastrado');
        if (hasEmail) duplicateMessages.push('Email já cadastrado');

        Alert.alert('Duplicação detectada', duplicateMessages.join('\n'));
        return;
      }

      const { error } = await supabase
        .from('responsavel')
        .insert([
          {
            nome_completo: capitalizedName,
            cpf: unmaskedCPF,
            telefone: unmaskedPhone,
            email: formData.email.trim(),
          },
        ]);

      if (error) throw error;

      Alert.alert('Sucesso', 'Responsável cadastrado com sucesso!');
      navigation.goBack();

    } catch (error: any) {
      Alert.alert('Erro ao cadastrar responsável', error.message);
    }
  };

  const handleCancel = () => {
    const isDirty =
      formData.name.trim() !== '' ||
      formData.cpf.trim() !== '' ||
      formData.phone.trim() !== '' ||
      formData.email.trim() !== '';

    if (!isDirty) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Cancelar',
      'Tem certeza que deseja sair? Os dados não serão salvos',
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Text style={styles.backButtonText}>↩</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.guardiansList}>
          <Card variant="default" style={styles.guardianCard}>
            <View style={styles.guardianInfo}>
              <Text style={styles.guardianName}>Informações do Responsável</Text>

              <View style={styles.guardianDetails}>
                <Text
                  style={[
                    styles.guardianInput,
                    { marginBottom: isTablet ? wp('2%') : wp('3%'), fontWeight: '600' },
                  ]}
                >
                  Nome do Responsável *
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    autoCapitalize="words"
                    onChangeText={value => handleInputChange('name', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.guardianInput, styles.guardianCreationMargin]}>
                  CPF *
                </Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="999.999.999-99"
                    style={styles.searchInput}
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChangeText={text => handleInputChange('cpf', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.guardianInput, styles.guardianCreationMargin]}>
                  Telefone *
                </Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="(99) 99999-9999"
                    style={styles.searchInput}
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChangeText={text => handleInputChange('phone', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.guardianInput, styles.guardianCreationMargin]}>
                  E-mail *
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Text
                  style={[
                    styles.guardianInput,
                    { marginTop: isTablet ? wp('2%') : wp('3%'), fontStyle: 'italic' },
                  ]}
                >
                  * Campos obrigatórios
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ paddingBottom: 10 }}>
            <Button
              variant="game"
              size="default"
              style={styles.guardianCreationButton}
              onPress={handleSave}
            >
              Salvar Responsável
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuardianCreationScreen;