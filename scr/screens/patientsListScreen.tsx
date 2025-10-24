import { Card } from '../components/Card';
import { useAuth } from '../../AuthContext';
import { supabase } from '../utils/supabase';
import { calculateAge } from '../utils/utils';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { PatientsScreenProps } from '../navigation/types';
import React, { useState, useCallback, useEffect } from 'react';
import { createStyles } from '../components/styles/patients.styles';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

interface Patient {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  status: 'ativo' | 'inativo';
  lastTest?: string;
  testsCount?: number;
}

const PatientsScreen = ({ navigation }: PatientsScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);
  const [searchText, setSearchText] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { professionalId } = useAuth();

  const fetchPatients = useCallback(async () => {
    if (!professionalId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('id, nome_completo, data_nascimento, status')
        .eq('id_profissional', professionalId);

      if (patientsError) {
        throw patientsError;
      }

      const patientsWithDetails: Patient[] = await Promise.all(
        patientsData.map(async (patient) => {
          const { data: lastTestData, error: lastTestError } = await supabase
            .from('avaliacoes')
            .select('data_aplicacao')
            .eq('id_paciente', patient.id)
            .order('data_aplicacao', { ascending: false })
            .limit(1);

          if (lastTestError) {
            console.error('Erro ao buscar último teste:', lastTestError);
          }

          const lastTest = lastTestData && lastTestData.length > 0
            ? new Date(lastTestData[0].data_aplicacao).toLocaleDateString('pt-BR')
            : undefined;

          const { count: testsCount, error: countError } = await supabase
            .from('avaliacoes')
            .select('*', { count: 'exact' })
            .eq('id_paciente', patient.id);

          if (countError) {
            console.error('Erro ao contar testes:', countError);
          }

          return {
            ...patient,
            lastTest,
            testsCount: testsCount || 0,
          };
        })
      );

      setPatients(patientsWithDetails);
      setFilteredPatients(patientsWithDetails);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar pacientes: ' + error.message);
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPatients();
    });
    return unsubscribe;
  }, [navigation, fetchPatients]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.nome_completo.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const handlePatientPress = (patientId: string) => {
    navigation.navigate('PatientDetail', { patientId });
  };

  const handlePatientCreation = () => {
    const nameToPreFill = searchText.trim();
    navigation.navigate('PatientCreation', { prefillName: nameToPreFill });
  };

  const handleFilter = () => {
    Alert.alert(
      'Filtros',
      'Funcionalidade de filtros será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: 'ativo' | 'inativo') => {
    return status === 'ativo' ? colors.softGreen : colors.deactivated;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Carregando pacientes...</Text>
      </View>
    );
  }

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

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar paciente..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor={colors.deactivated}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handlePatientCreation}>
          <Text style={styles.filterButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              variant="interactive"
              style={styles.patientCard}
              onPress={() => handlePatientPress(patient.id)}
            >
              <View style={styles.patientCardContent}>
                <View style={styles.patientInfo}>
                  <View style={styles.patientHeader}>
                    <Text style={styles.patientName}>{patient.nome_completo}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                      <Text style={styles.statusText}>{patient.status === 'ativo' ? 'Ativo' : 'Inativo'}</Text>
                    </View>
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientInput}>Idade: {patient.data_nascimento ? `${calculateAge(patient.data_nascimento)} anos` : 'N/A'}</Text>
                    <Text style={styles.patientLastTest}>Último teste: {patient.lastTest || 'Nenhum'}</Text>
                    <Text style={styles.patientTestsCount}>Testes realizados: {patient.testsCount}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {filteredPatients.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhum paciente encontrado</Text>
          <Text style={styles.emptyStateDescription}>
            {searchText.trim() !== '' 
              ? 'Tente ajustar sua busca ou adicione um novo paciente'
              : 'Comece adicionando seu primeiro paciente'
            }
          </Text>
          <Button
            variant="secondary"
            size="default"
            style={styles.emptyStateButton}
            onPress={handlePatientCreation}
          >
            + Adicionar Paciente
          </Button>
        </View>
      )}
    </View>
  );
};

export default PatientsScreen;