import { Card } from '../components/Card';
import { useAuth } from '../../AuthContext';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import React, { useState, useEffect } from 'react';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { capitalizeName, isValidCPF, isValidDate } from '../utils/utils';
import { PatientCreationScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/patients.styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ESCOLARIDADE_OPTIONS, LATERALIDADE_OPTIONS } from '../utils/constants';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

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
      navigation.goBack();
    }
    fetchResponsibles();
  }, [professionalId, isEditing, navigation]);

  const fetchResponsibles = async () => {
    setLoadingResponsibles(true);
    try {
      const { data, error } = await supabase
        .from('responsavel')
        .select('id, nome_completo')
        .order('nome_completo', { ascending: true });

      if (error) throw error;
      if (data) setResponsibles(data as Responsible[]);
    } catch (error: any) {
      Alert.alert('Erro ao carregar responsáveis', error.message);
    } finally {
      setLoadingResponsibles(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateFields = () => {
    const newErrors: typeof errors = { name: '', birthDate: '', cpf: '', gender: '', escolaridade: '', id_responsavel: '', lateralidade: '' };
    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do paciente é obrigatório';
      hasError = true;
    } else {
      const nameParts = formData.name.trim().split(/\s+/);
      if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
        newErrors.name = 'Digite o nome completo (nome e sobrenome)';
        hasError = true;
      }
    }

    if (!formData.birthDate.trim() || !isValidDate(formData.birthDate)) {
      newErrors.birthDate = 'Data inválida';
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
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios corretamente');
      return;
    }

    setIsSaving(true);
    const capitalizedName = capitalizeName(formData.name.trim());
    const cpf = formData.cpf.replace(/\D/g, '');

    if (cpf.length > 0 && !isValidCPF(cpf)) {
      Alert.alert('Atenção', 'CPF inválido');
      setIsSaving(false);
      return;
    }

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
            Alert.alert('Atenção', 'CPF já cadastrado para outro paciente');
            setIsSaving(false);
            return;
          }
        }
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

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} paciente`, error.message);
      setIsSaving(false);
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
    errors[field] ? { borderColor: 'red', borderWidth: 1, borderRadius: styles.searchContainer.borderRadius } : {},
  ];

  const getPickerContainerStyle = (field: keyof typeof errors) => [
    styles.searchContainer,
    errors[field] ? { borderColor: 'red', borderWidth: 1, borderRadius: styles.searchContainer.borderRadius } : {},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Text style={styles.backButtonText}>↩</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                {isEditing ? 'Editar Paciente' : 'Informações do Paciente'}
              </Text>

              <View style={styles.patientDetails}>
                <Text style={[styles.patientInput, { marginBottom: isTablet ? wp('2%') : wp('3%'), fontWeight: '600' }]}>
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
                    placeholder="000.000.000-00"
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
                        label={responsibles.length === 0 ? 'Nenhum responsável encontrado' : 'Selecione o responsável'}
                        value={-1}
                        enabled={false}
                      />
                    )}
                    {responsibles.map(responsible => (
                      <Picker.Item key={responsible.id} label={responsible.nome_completo} value={responsible.id} />
                    ))}
                  </Picker>
                </View>
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