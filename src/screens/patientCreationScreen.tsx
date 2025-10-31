import { Card } from '../components/Card';
import { useAuth } from '../../AuthContext';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import ScreenHeader from '../components/ScreenHeader';
import { MaskedTextInput } from 'react-native-mask-text';
import { useFocusEffect } from '@react-navigation/native';
import { PatientCreationScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/patients.styles';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ESCOLARIDADE_OPTIONS, LATERALIDADE_OPTIONS } from '../utils/constants';
import { capitalizeName, isValidDate, isValidCPF, isValidFullName } from '../utils/utils';

interface Responsible {
  id: number;
  nome_completo: string;
}

const PatientCreationScreen = ({ navigation, route }: PatientCreationScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  const isEditing = route.params?.patientId !== undefined;
  const patientId = route.params?.patientId;
  const prefillName = route?.params?.prefillName || '';
  const prefillBirthDate = route.params?.prefillBirthDate || '';
  const prefillCPF = route.params?.prefillCPF || '';
  const prefillGender = route.params?.prefillGender || '';
  const prefillEscolaridade = route.params?.prefillEscolaridade || '';
  const prefillIdResponsavel = route.params?.prefillIdResponsavel || -1;
  const prefillLateralidade = route.params?.prefillLateralidade || '';
  const prefillNotes = route.params?.prefillNotes || '';
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loadingResponsibles, setLoadingResponsibles] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [formData, setFormData] = useState({
    name: prefillName,
    birthDate: prefillBirthDate,
    cpf: prefillCPF,
    gender: prefillGender,
    escolaridade: prefillEscolaridade,
    id_responsavel: prefillIdResponsavel,
    lateralidade: prefillLateralidade,
    notes: prefillNotes,
  });

  const [errors, setErrors] = useState({
    name: '',
    birthDate: '',
    cpf: '',
    gender: '',
    escolaridade: '',
    id_responsavel: '',
    lateralidade: '',
  });

  const { professionalId } = useAuth();

  useEffect(() => {
    if (!professionalId && !isEditing) {
      Alert.alert('Erro', 'ID do profissional não encontrado. Faça login novamente');
      if (isMounted.current) {
        navigation.goBack();
      }
    }
  }, [professionalId, isEditing, navigation]);

  const fetchResponsibles = async () => {
    if (isMounted.current) {
      setLoadingResponsibles(true);
    } else {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('responsavel')
        .select('id, nome_completo')
        .order('nome_completo', { ascending: true });

      if (error) throw error;
      if (isMounted.current) {
        setResponsibles(data as Responsible[]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar responsáveis', error.message);
    } finally {
      if (isMounted.current) {
        setLoadingResponsibles(false);
      }
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      if (professionalId || isEditing) {
        fetchResponsibles();
      }
    }, [professionalId, isEditing])
  );

  const cleanupOrphanedResponsibles = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('pacientes')
        .select('id_responsavel')
        .not('id_responsavel', 'is', null);

      if (patientError) {
        console.error('Erro ao buscar responsáveis vinculados:', patientError.message);
        return;
      }
      
      const usedResponsibleIds = [...new Set(patientData.map(p => p.id_responsavel))];
      let deleteQuery = supabase.from('responsavel').delete();

      if (usedResponsibleIds.length > 0) {
        deleteQuery = deleteQuery.not('id', 'in', `(${usedResponsibleIds.join(',')})`);
      } else {
        deleteQuery = deleteQuery.not('id', 'is', null);
      }

      const { error: deleteError } = await deleteQuery;

      if (deleteError) {
        console.error('Erro ao deletar responsáveis órfãos:', deleteError.message);
      }
      
    } catch (error: any) {
      console.error('Erro na limpeza de responsáveis:', error.message);
    }
  };
  
  const navigateBackAndCleanup = async () => {
    await cleanupOrphanedResponsibles();
    navigation.goBack();
  };

  const handleNewGuardian = () => {
    navigation.navigate('GuardianCreation');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field in errors && errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateFields = () => {
    const newErrors: typeof errors = { name: '', birthDate: '', cpf: '', gender: '', escolaridade: '', id_responsavel: '', lateralidade: '' };
    let hasError = false;

    if (!isValidFullName(formData.name)) {
      newErrors.name = 'Digite o nome completo (nome e sobrenome)';
      hasError = true;
    }

    if (!formData.birthDate.trim() || !isValidDate(formData.birthDate)) {
      newErrors.birthDate = 'Data inválida';
      hasError = true;
    }

    const cpf = formData.cpf.replace(/\D/g, '');
    if (cpf.length > 0 && !isValidCPF(cpf)) {
      newErrors.cpf = 'CPF inválido';
      hasError = true;
    }

    if (!formData.gender) {
      newErrors.gender = 'Selecione o gênero';
      hasError = true;
    }

    if (!formData.escolaridade) {
      newErrors.escolaridade = 'Selecione a escolaridade';
      hasError = true;
    }

    if (formData.id_responsavel === -1) {
      newErrors.id_responsavel = 'Selecione um responsável';
      hasError = true;
    }

    if (!formData.lateralidade) {
      newErrors.lateralidade = 'Selecione a lateralidade';
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!validateFields()) {
      return;
    }

    let hasDuplicationError = false;

    setIsSaving(true);
    const capitalizedName = capitalizeName(formData.name.trim());
    const cpf = formData.cpf.replace(/\D/g, '');

    try {
      if (cpf.length === 11) {
        const { data: existingCPF, error: fetchError } = await supabase
          .from('pacientes')
          .select('id')
          .eq('cpf', cpf);

        if (fetchError) throw fetchError;

        if (existingCPF && existingCPF.length > 0) {
          const isDuplicate = existingCPF.some(p => !isEditing || p.id.toString() !== patientId);
          if (isDuplicate) {
            setErrors(prevErrors => ({
              ...prevErrors,
              cpf: 'CPF já cadastrado para outro paciente'
            }));
            hasDuplicationError = true;
          }
        }
      }

      if (hasDuplicationError) {
        setIsSaving(false);
        return;
      }
      
      const [day, month, year] = formData.birthDate.split('/');
      const correctDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      const patientData = {
        nome_completo: capitalizedName,
        data_nascimento: correctDate.toISOString(),
        genero: formData.gender,
        cpf: cpf.length > 0 ? cpf : null,
        escolaridade: formData.escolaridade,
        id_responsavel: formData.id_responsavel,
        lateralidade: formData.lateralidade,
        observacoes: formData.notes.trim(),
      };

      let error;
      
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('pacientes')
          .update(patientData)
          .eq('id', patientId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('pacientes').insert([
          {
            ...patientData,
            id_profissional: professionalId,
          },
        ]);
        error = insertError;
      }

      if (error) throw error;
      
      await navigateBackAndCleanup();

    } catch (error: any) {
      Alert.alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} paciente`, error.message);
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    const unmaskedCPF = formData.cpf.replace(/\D/g, '');
    const prefillUnmaskedCPF = prefillCPF.replace(/\D/g, '');

    const isDirty =
      formData.name.trim() !== prefillName.trim() ||
      formData.birthDate.trim() !== prefillBirthDate.trim() ||
      unmaskedCPF !== prefillUnmaskedCPF ||
      formData.gender !== prefillGender ||
      formData.escolaridade !== prefillEscolaridade ||
      formData.id_responsavel !== prefillIdResponsavel ||
      formData.lateralidade !== prefillLateralidade ||
      formData.notes.trim() !== prefillNotes.trim();

    if (!isDirty) {
      navigateBackAndCleanup();
      return;
    }

    Alert.alert(
      'Cancelar', 
      `Deseja cancelar a ${isEditing ? 'edição' : 'criação'}? Os dados não serão salvos`, 
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Sair', onPress: () => navigateBackAndCleanup() },
      ]
    );
  };

  const getInputStyle = (field: keyof typeof errors) => [
    styles.searchInput,
    errors[field] ? { borderColor: 'red', borderWidth: 1, borderRadius: styles.searchContainer.borderRadius } : {},
  ];

  const getPickerContainerStyle = (field: keyof typeof errors) => [
    styles.searchContainer,
    errors[field] ? { borderColor: 'red', borderWidth: 1, borderRadius: styles.searchContainer.borderRadius } : {},
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => handleCancel()}
        isTablet={isTablet}
      />

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                {isEditing ? 'Editar Paciente' : 'Informações do Paciente'}
              </Text>

              <View style={styles.patientDetails}>
                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Nome do Paciente *
                </Text>
                <View style={getPickerContainerStyle('name')}>
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

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>Data de Nascimento *</Text>
                <View style={getPickerContainerStyle('birthDate')}>
                  <MaskedTextInput
                    mask="99/99/9999"
                    style={getInputStyle('birthDate')}
                    placeholder="DD/MM/AAAA"
                    value={formData.birthDate}
                    onChangeText={text => handleInputChange('birthDate', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>
                {errors.birthDate ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.birthDate}</Text> : null}

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>CPF</Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="999.999.999-99"
                    style={getInputStyle('cpf')}
                    placeholder="999.999.999-99"
                    value={formData.cpf}
                    onChangeText={text => handleInputChange('cpf', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>
                {errors.cpf ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.cpf}</Text> : null}

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>Gênero *</Text>
                <View style={getPickerContainerStyle('gender')}>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(itemValue: string) => handleInputChange('gender', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                  >
                    {formData.gender === '' && <Picker.Item label="Selecione o gênero" value="" enabled={false} />}
                    <Picker.Item label="Masculino" value="masculino" />
                    <Picker.Item label="Feminino" value="feminino" />
                    <Picker.Item label="Outro" value="outro" />
                    <Picker.Item label="Prefiro não informar" value="prefiro_nao_informar" />
                  </Picker>
                </View>
                {errors.gender ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.gender}</Text> : null}

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>Escolaridade *</Text>
                <View style={getPickerContainerStyle('escolaridade')}>
                  <Picker
                    selectedValue={formData.escolaridade}
                    onValueChange={(itemValue: string) => handleInputChange('escolaridade', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                  >
                    {formData.escolaridade === '' && <Picker.Item label="Selecione a escolaridade" value="" enabled={false} />}
                    {ESCOLARIDADE_OPTIONS.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
                {errors.escolaridade ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.escolaridade}</Text> : null}

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>Responsável *</Text>
                <View style={getPickerContainerStyle('id_responsavel')}>
                  <Picker
                    selectedValue={formData.id_responsavel}
                    onValueChange={(itemValue: number) => handleInputChange('id_responsavel', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                    enabled={!loadingResponsibles}
                  >
                    {formData.id_responsavel === -1 && (
                      <Picker.Item
                        label={loadingResponsibles ? 'Carregando...' : (responsibles.length === 0 ? 'Nenhum responsável encontrado' : 'Selecione o responsável')}
                        value={-1}
                        enabled={false}
                      />
                    )}
                    {responsibles.map(responsible => (
                      <Picker.Item key={responsible.id} label={responsible.nome_completo} value={responsible.id} />
                    ))}
                  </Picker>
                </View>

                <Button
                  variant="link"
                  size="sm"
                  style={styles.patientCreationButton}
                  onPress={handleNewGuardian}
                  >
                  Novo Responsável
                </Button>

                {errors.id_responsavel ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.id_responsavel}</Text> : null}

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>Lateralidade *</Text>
                <View style={getPickerContainerStyle('lateralidade')}>
                  <Picker
                    selectedValue={formData.lateralidade}
                    onValueChange={(itemValue: string) => handleInputChange('lateralidade', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                  >
                    {formData.lateralidade === '' && <Picker.Item label="Selecione a lateralidade" value="" enabled={false} />}
                    {LATERALIDADE_OPTIONS.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
                {errors.lateralidade ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.lateralidade}</Text> : null}

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>Observações</Text>
                <View style={[styles.searchContainer, { height: 100 }]}>
                  <TextInput
                    style={[styles.searchInput, { height: '100%', textAlignVertical: 'top' }]}
                    placeholder="Observações sobre o paciente..."
                    value={formData.notes}
                    onChangeText={value => handleInputChange('notes', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <Text style={[styles.patientInput, { marginTop: isTablet ? wp('2%') : wp('3%'), fontStyle: 'italic' }]}>
                  * Campos obrigatórios
                </Text>

              </View>
            </View>
          </Card>

          <View style={{ paddingBottom: 10 }}>
            <Button
              variant="game"
              size="default"
              style={styles.patientCreationButton}
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

export default PatientCreationScreen;