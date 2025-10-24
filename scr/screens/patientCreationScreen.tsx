import { Card } from '../components/Card';
import { useAuth } from '../../AuthContext';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import React, { useState, useEffect } from 'react';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { capitalizeName, isValidDate } from '../utils/utils';
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
  const prefillName = route?.params?.prefillName || '';
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loadingResponsibles, setLoadingResponsibles] = useState(true);

  const [formData, setFormData] = useState({
    name: prefillName,
    birthDate: '',
    cpf: '',
    gender: '',
    escolaridade: '',
    id_responsavel: -1,
    lateralidade: '',
    notes: '',
  });

  const { professionalId } = useAuth();

  useEffect(() => {
    if (!professionalId) {
      Alert.alert('Erro', 'ID do profissional não encontrado. Faça login novamente');
      navigation.goBack();
    }
    fetchResponsibles();
  }, [professionalId]);

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
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome do paciente é obrigatório');
      return;
    }
    if (!formData.name.trim().includes(' ')) {
      Alert.alert('Erro', 'Digite o nome completo do paciente (nome e sobrenome)');
      return;
    }
    if (!formData.birthDate.trim() || !isValidDate(formData.birthDate.trim())) {
      Alert.alert('Erro', 'Data de nascimento inválida');
      return;
    }
    if (!formData.gender) {
      Alert.alert('Erro', 'Gênero é obrigatório');
      return;
    }
    if (!formData.escolaridade) {
      Alert.alert('Erro', 'Escolaridade é obrigatória');
      return;
    }
    if (formData.id_responsavel === -1) {
      Alert.alert('Erro', 'Responsável é obrigatório');
      return;
    }
    if (!formData.lateralidade) {
      Alert.alert('Erro', 'Lateralidade é obrigatória');
      return;
    }
    if (!professionalId) {
      Alert.alert('Erro', 'ID do profissional não encontrado. Faça login novamente');
      return;
    }

    const capitalizedName = capitalizeName(formData.name.trim());
    const cpf = formData.cpf.replace(/[^0-9]/g, '');

    try {
      if (cpf.length === 11) {
        const { data: existingCPF, error: fetchError } = await supabase
          .from('pacientes')
          .select('id')
          .eq('cpf', cpf);

        if (fetchError) throw fetchError;

        if (existingCPF && existingCPF.length > 0) {
          Alert.alert('Erro', 'CPF já cadastrado para outro paciente');
          return;
        }

        const { data: existingResponsavel, error: fetchResponsavelError } = await supabase
          .from('responsavel')
          .select('id')
          .eq('cpf', cpf);

        if (fetchResponsavelError) throw fetchResponsavelError;

        if (existingResponsavel && existingResponsavel.length > 0) {
          Alert.alert('Erro', 'Este CPF já está cadastrado como um responsável');
          return;
        }
      }

      const { error } = await supabase
        .from('pacientes')
        .insert([
          {
            id_profissional: professionalId,
            nome_completo: capitalizedName,
            data_nascimento: new Date(
              formData.birthDate.split('/').reverse().join('-')
            ).toISOString(),
            genero: formData.gender,
            cpf: cpf.length > 0 ? cpf : null,
            escolaridade: formData.escolaridade,
            id_responsavel: formData.id_responsavel,
            lateralidade: formData.lateralidade,
            observacoes: formData.notes.trim(),
          },
        ])
        .select();

      if (error) throw error;

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar paciente', error.message);
    }
  };

  const handleCancel = () => {
    const allEmpty = Object.values(formData).every(value => {
      if (typeof value === 'string') return value.trim() === '';
      if (typeof value === 'number') return value === -1;
      return false;
    });

    const isDirty = !allEmpty || formData.name !== prefillName;

    if (!isDirty) {
      navigation.goBack();
      return;
    }

    Alert.alert('Cancelar', 'Deseja cancelar o cadastro? Os dados não serão salvos', [
      { text: 'Continuar', style: 'cancel' },
      { text: 'Sair', onPress: () => navigation.goBack() },
    ]);
  };

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
              <Text style={styles.patientName}>Informações do Paciente</Text>

              <View style={styles.patientDetails}>
                <Text
                  style={[
                    styles.patientInput,
                    { marginBottom: isTablet ? wp('2%') : wp('3%'), fontWeight: '600' },
                  ]}
                >
                  Nome do Paciente *
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

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Data de Nascimento *
                </Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="99/99/9999"
                    style={styles.searchInput}
                    placeholder="DD/MM/AAAA"
                    value={formData.birthDate}
                    onChangeText={text => handleInputChange('birthDate', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>CPF</Text>
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

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Gênero *
                </Text>
                <View style={styles.searchContainer}>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(itemValue: string) => handleInputChange('gender', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                  >
                    {formData.gender === '' && (
                      <Picker.Item
                        label="Selecione o gênero"
                        value=""
                        enabled={false}
                      />
                    )}
                    <Picker.Item label="Masculino" value="masculino" />
                    <Picker.Item label="Feminino" value="feminino" />
                    <Picker.Item label="Outro" value="outro" />
                    <Picker.Item label="Prefiro não informar" value="prefiro_nao_informar" />
                  </Picker>
                </View>

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Escolaridade *
                </Text>
                <View style={styles.searchContainer}>
                  <Picker
                    selectedValue={formData.escolaridade}
                    onValueChange={(itemValue: string) => handleInputChange('escolaridade', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                  >
                    {formData.escolaridade === '' && (
                      <Picker.Item
                        label="Selecione a escolaridade"
                        value=""
                        enabled={false}
                      />
                    )}
                    {ESCOLARIDADE_OPTIONS.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Responsável * {loadingResponsibles && '(Carregando...)'}
                </Text>
                <View style={styles.searchContainer}>
                  <Picker
                    selectedValue={formData.id_responsavel}
                    onValueChange={(itemValue: number) => handleInputChange('id_responsavel', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                    enabled={!loadingResponsibles}
                  >
                    {formData.id_responsavel === -1 && (
                      <Picker.Item
                        label={
                          responsibles.length === 0
                            ? 'Nenhum responsável encontrado'
                            : 'Selecione o responsável'
                        }
                        value={-1}
                        enabled={false}
                      />
                    )}
                    {responsibles.map(responsible => (
                      <Picker.Item
                        key={responsible.id}
                        label={responsible.nome_completo}
                        value={responsible.id}
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Lateralidade *
                </Text>
                <View style={styles.searchContainer}>
                  <Picker
                    selectedValue={formData.lateralidade}
                    onValueChange={(itemValue: string) => handleInputChange('lateralidade', itemValue)}
                    style={[styles.searchInput, { marginLeft: wp('3%') }]}
                    itemStyle={{ color: colors.text }}
                  >
                    {formData.lateralidade === '' && (
                      <Picker.Item
                        label="Selecione a lateralidade"
                        value=""
                        enabled={false}
                      />
                    )}
                    {LATERALIDADE_OPTIONS.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>

                <Text style={[styles.patientInput, styles.patientCreationMargin]}>
                  Observações
                </Text>
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

                <Text
                  style={[
                    styles.patientInput,
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
              style={styles.patientCreationButton}
              onPress={handleSave}
            >
              Salvar Paciente
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientCreationScreen;