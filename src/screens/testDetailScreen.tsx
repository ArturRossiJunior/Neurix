import React, { useState, useCallback } from 'react';
import { Button } from '../components/Button';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../utils/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { TestDetailScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Text, ScrollView, TextInput, Alert, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';

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
  const [otherOption, setOtherOption] = useState('');
  const [loading, setLoading] = useState(true);

  // Buscar pacientes do Supabase
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔍 Buscando pacientes para teste...');

      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome_completo, status')
        .order('nome_completo', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar pacientes:', error);
        throw error;
      }

      console.log('📊 Pacientes encontrados:', data);
      console.log('📊 Total de pacientes:', data?.length);

      // Filtrar apenas pacientes ativos (ou todos se não houver filtro)
      const activePatients = data?.filter(p => 
        p.status === 'ativo' || !p.status
      ) || [];

      console.log('✅ Pacientes ativos:', activePatients.length);
      setPatients(activePatients);

    } catch (error: any) {
      console.error('❌ Erro ao carregar pacientes:', error);
      Alert.alert(
        'Erro',
        `Não foi possível carregar os pacientes: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarregar ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  const handleStartTest = () => {
    if (!selectedPatient) {
      Alert.alert('Erro', 'Por favor, selecione um paciente para iniciar o teste.');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) {
      Alert.alert('Erro', 'Paciente não encontrado.');
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>↩</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tipo de Teste:</Text>
          <View style={[styles.input, { backgroundColor: '#F5F5F5' }]}>
            <Text style={{ color: colors.mutedForeground, paddingVertical: 12 }}>
              {testName}
            </Text>
          </View>

          <Text style={styles.label}>Selecionar Paciente:</Text>
          {loading ? (
            <View style={[styles.picker, { justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.mutedForeground }}>
                Carregando pacientes...
              </Text>
            </View>
          ) : (
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedPatient}
                onValueChange={(itemValue) => setSelectedPatient(itemValue)}
                enabled={patients.length > 0}
              >
                <Picker.Item 
                  label={patients.length === 0 ? "Nenhum paciente encontrado" : "Selecione um paciente..."} 
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
            </View>
          )}

          {!loading && patients.length === 0 && (
            <View style={{ backgroundColor: '#FFF3CD', padding: 12, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#FFC107' }}>
              <Text style={{ color: '#856404', fontSize: 14 }}>
                ⚠️ Nenhum paciente ativo encontrado. Cadastre pacientes para realizar testes.
              </Text>
            </View>
          )}

          <Text style={styles.label}>Configuração Adicional (Opcional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Usar estímulo sonoro"
            placeholderTextColor={colors.mutedForeground}
            value={otherOption}
            onChangeText={setOtherOption}
            multiline
            numberOfLines={3}
          />

          <Button 
            variant="default" 
            size="default" 
            onPress={handleStartTest} 
            style={styles.startButton}
            disabled={loading || !selectedPatient}
          >
            {loading ? 'Carregando...' : 'Iniciar Teste'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};