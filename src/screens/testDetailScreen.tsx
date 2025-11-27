import { Button } from '../components/Button';
import { supabase } from '../utils/supabase';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import ScreenHeader from '../components/ScreenHeader';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TestDetailScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Text, ScrollView, Alert, useWindowDimensions, ActivityIndicator } from 'react-native';

interface Patient {
  id: number;
  nome_completo: string;
  status?: string;
}

export const TestDetailScreen = ({ route, navigation }: TestDetailScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createTestsStyles(isTablet);

  const { testId, testName } = route.params;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
      Alert.alert(
        'Erro',
        `Não foi possível carregar os pacientes: ${error.message}`,
        [{ text: 'OK' }]
      );
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
    if (!selectedPatient) {
      Alert.alert(
        'Atenção', 
        'Por favor, selecione um paciente para iniciar o teste',
        [{ text: 'OK' }]
      );
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) {
      Alert.alert('Erro', 'Paciente não encontrado');
      return;
    }

    navigation.navigate('TestPreparation', {
      testId,
      testName,
      patientId: selectedPatient.toString(),
      patientName: patient.nome_completo,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => navigation.goBack()}
        isTablet={isTablet}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tipo de Teste:</Text>
          <View style={[styles.input, { backgroundColor: '#F5F5F5'}]}>
            <Text style={styles.labelTestName}>
              {testName}
            </Text>
          </View>

          <Text style={styles.label}>Selecionar Paciente:</Text>
          {loading ? (
            <View style={[styles.picker]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.mutedForeground }}>
                Carregando pacientes...
              </Text>
            </View>
          ) : (
            <Picker
              style={styles.picker}
              selectedValue={selectedPatient}
              onValueChange={(itemValue) => setSelectedPatient(itemValue)}
              enabled={patients.length > 0}
            >
              <Picker.Item 
                label={"Selecione um paciente..."} 
                value={null} 
              />
              {patients.map((patient) => (
                <Picker.Item 
                  key={patient.id} 
                  label={patient.nome_completo} 
                  value={patient.id} 
                />
              ))}
            </Picker>
          )}

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