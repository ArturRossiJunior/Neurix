import { Button } from '../components/Button';
import { supabase } from '../utils/supabase';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import PickerInput from '../components/PickerInput';
import { useIsTablet } from '../utils/useIsTablet';
import { useToast } from '../utils/ToastContext';
import ScreenHeader from '../components/ScreenHeader';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TestDetailScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Patient {
  id: number;
  nome_completo: string;
  status?: string;
}

export const TestDetailScreen = ({ route, navigation }: TestDetailScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createTestsStyles(isTablet);
  const { showToast, clearToasts } = useToast();

  const { testId, testName } = route.params;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | -1>(-1);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    patient: '',
  });

  React.useEffect(() => {
    if (!isTablet) {
      showToast(
        '📱 Para melhor experiência, realize os testes em um tablet',
        'warning',
        6000
      );
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome_completo, status')
        .order('nome_completo', { ascending: true });

      if (error) {
        throw error;
      }

      const activePatients = data?.filter(p =>
        p.status === 'ativo' || !p.status
      ) || [];

      setPatients(activePatients);

    } catch (error: any) {
      console.error('Erro ao carregar pacientes:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  const handleStartTest = () => {
    if (selectedPatient === -1) {
      setErrors({ patient: 'Selecione um paciente para iniciar o teste' });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) {
      setErrors({ patient: 'Paciente não encontrado' });
      return;
    }

    const params = {
      testId,
      testName,
      patientId: selectedPatient.toString(),
      patientName: patient.nome_completo,
    };

    clearToasts();

    switch (testId) {
      case '1':
        navigation.navigate('TestPreparation', params);
        break;
      case '2':
        navigation.navigate('ConcentrationTestPreparation', params);
        break;
      default:
        navigation.navigate('TestPreparation', params);
        break;
    }
  };

  const getPickerContainerStyle = (field: keyof typeof errors) => [
    styles.pickerContainer,
    errors[field] ? { borderColor: 'red', borderWidth: 1 } : {},
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => navigation.goBack()}
        isTablet={isTablet}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tipo de Teste:</Text>
          <View style={[styles.input, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.labelTestName}>
              {testName}
            </Text>
          </View>

          <Text style={styles.label}>Selecionar Paciente:</Text>
          {loading ? (
            <View style={styles.searchContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.mutedForeground }}>
                Carregando pacientes...
              </Text>
            </View>
          ) : (
            <PickerInput
              selectedValue={selectedPatient}
              onValueChange={(itemValue) => {
                setSelectedPatient(itemValue);
                if (errors.patient) setErrors({ patient: '' });
              }}
              enabled={patients.length > 0}
              containerStyle={getPickerContainerStyle('patient')}
            >
              {selectedPatient === -1 && (
                <Picker.Item
                  label={patients.length === 0 ? 'Nenhum paciente encontrado' : 'Selecione um paciente...'}
                  value={-1}
                  enabled={false}
                />
              )}
              {patients.map((patient) => (
                <Picker.Item
                  key={patient.id}
                  label={patient.nome_completo}
                  value={patient.id}
                />
              ))}
            </PickerInput>
          )}
          {errors.patient ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.patient}</Text> : null}

          <Button
            variant="default"
            size="default"
            onPress={handleStartTest}
            style={styles.startButton}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Iniciar Teste'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
