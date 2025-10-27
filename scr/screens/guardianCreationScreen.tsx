import React, { useState } from 'react';
import { Card } from '../components/Card';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { MaskedTextInput } from 'react-native-mask-text';
import { GuardianCreationScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/guardians.styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { capitalizeName, validateEmail, isValidCPF } from '../utils/utils';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

const GuardianCreationScreen = ({ navigation, route }: GuardianCreationScreenProps) => {
  const isEditing = route.params?.guardianId !== undefined;
  const guardianId = route.params?.guardianId;
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);
  const prefillName = route.params?.prefillName || '';
  const prefillCPF = route.params?.prefillCPF || '';
  const prefillPhone = route.params?.prefillPhone || '';
  const prefillEmail = route.params?.prefillEmail || '';

  const [formData, setFormData] = useState({
    name: prefillName,
    cpf: prefillCPF,
    phone: prefillPhone,
    email: prefillEmail,
  });

  const [errors, setErrors] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    if (isSaving) return;

    const unmaskedPhone = formData.phone.replace(/\D/g, '');
    const unmaskedCPF = formData.cpf.replace(/\D/g, '');
    const newErrors = { name: '', cpf: '', phone: '', email: '' };
    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do responsável é obrigatório';
      hasError = true;
    } else {
      const nameParts = formData.name.trim().split(/\s+/);
      if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
        newErrors.name = 'Digite o nome completo (nome e sobrenome)';
        hasError = true;
      }
    }

    if (!isValidCPF(unmaskedCPF)) {
      newErrors.cpf = 'CPF inválido';
      hasError = true;
    }

    if (!unmaskedPhone || (unmaskedPhone.length !== 10 && unmaskedPhone.length !== 11)) {
      newErrors.phone = 'Telefone inválido';
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      hasError = true;
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Email inválido';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const capitalizedName = capitalizeName(formData.name.trim());
    setIsSaving(true);

    try {      
      const { data: existingPaciente, error: fetchPacienteError } = await supabase
        .from('pacientes')
        .select('id')
        .eq('cpf', unmaskedCPF);

      if (fetchPacienteError) throw fetchPacienteError;

      if (existingPaciente && existingPaciente.length > 0) {
        Alert.alert(
          'Atenção',
          'Este CPF já está cadastrado como um paciente'
        );
        setIsSaving(false);
        return;
      }

      const { data: existing, error: fetchError } = await supabase
        .from('responsavel')
        .select('id, cpf, telefone, email')
        .or(`cpf.eq.${unmaskedCPF},telefone.eq.${unmaskedPhone},email.eq.${formData.email.trim()}`);

      if (fetchError) throw fetchError;

      if (existing && existing.length > 0) {
        const duplicateMessages: string[] = [];
        let isDuplicate = false;

        const hasCPF = existing.some(item => item.cpf === unmaskedCPF && (!isEditing || item.id != guardianId));
        const hasPhone = existing.some(item => item.telefone === unmaskedPhone && (!isEditing || item.id != guardianId));
        const hasEmail = existing.some(item => item.email === formData.email.trim() && (!isEditing || item.id != guardianId));

        if (hasCPF) {
          duplicateMessages.push('CPF já cadastrado');
          isDuplicate = true;
        }
        if (hasPhone) {
          duplicateMessages.push('Telefone já cadastrado');
          isDuplicate = true;
        }
        if (hasEmail) {
          duplicateMessages.push('Email já cadastrado');
          isDuplicate = true;
        }

        if (isDuplicate) {
          Alert.alert('Atenção', duplicateMessages.join('\n'));
          setIsSaving(false);
          return;
        }
      }

      let error;
      if (isEditing) {
        const { error: updateError } = await supabase.from('responsavel').update({
          nome_completo: capitalizedName,
          cpf: unmaskedCPF,
          telefone: unmaskedPhone,
          email: formData.email.trim(),
        }).eq('id', guardianId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('responsavel').insert([
          {
            nome_completo: capitalizedName,
            cpf: unmaskedCPF,
            telefone: unmaskedPhone,
            email: formData.email.trim(),
          },
        ]);
        error = insertError;
      }

      if (error) throw error;

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} responsável`, error.message);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const unmaskedCPF = formData.cpf.replace(/\D/g, '');
    const unmaskedPhone = formData.phone.replace(/\D/g, '');

    const isDirty =
      formData.name.trim() !== prefillName.trim() ||
      unmaskedCPF !== prefillCPF.replace(/\D/g, '') ||
      unmaskedPhone !== prefillPhone.replace(/\D/g, '') ||
      formData.email.trim() !== prefillEmail.trim();

    if (!isDirty) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Cancelar',
      `Deseja cancelar a ${isEditing ? 'edição' : 'criação'}? Os dados não serão salvos`,
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Sair', onPress: () => navigation.goBack() },
      ]
    );
  };

  const getInputStyle = (field: keyof typeof errors) => [
    styles.searchInput,
    errors[field] ? styles.errorBorder : {},
  ];

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
              <Text style={styles.guardianName}>
                {isEditing ? 'Editar Responsável' : 'Informações do Responsável'}
              </Text>

              <View style={styles.guardianDetails}>
                <Text style={[styles.guardianInput, { marginBottom: isTablet ? wp('2%') : wp('3%') }]}>
                  Nome do Responsável *
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={getInputStyle('name')}
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    autoCapitalize="words"
                    onChangeText={value => handleInputChange('name', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>
                {errors.name ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.name}</Text> : null}

                <Text style={[styles.guardianInput, styles.guardianCreationMargin]}>CPF *</Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="999.999.999-99"
                    style={getInputStyle('cpf')}
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChangeText={text => handleInputChange('cpf', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>
                {errors.cpf ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.cpf}</Text> : null}

                <Text style={[styles.guardianInput, styles.guardianCreationMargin]}>Telefone *</Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask={
                      formData.phone.replace(/\D/g, '').length === 11
                        ? '(99) 99999-9999'
                        : '(99) 9999-9999'
                    }
                    style={getInputStyle('phone')}
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChangeText={text => handleInputChange('phone', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>
                {errors.phone ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.phone}</Text> : null}

                <Text style={[styles.guardianInput, styles.guardianCreationMargin]}>E-mail *</Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={getInputStyle('email')}
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.email}</Text> : null}

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
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuardianCreationScreen;