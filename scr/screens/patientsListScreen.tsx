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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Switch,
  Pressable,
} from 'react-native';

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

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [onlyWithoutTests, setOnlyWithoutTests] = useState(false);
  const [sortBy, setSortBy] = useState('name_asc');

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

          const lastTest =
            lastTestData && lastTestData.length > 0
              ? new Date(lastTestData[0].data_aplicacao).toLocaleDateString(
                  'pt-BR'
                )
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

  useEffect(() => {
    let result = patients;

    if (!showInactive) {
      result = result.filter((patient) => patient.status === 'ativo');
    }

    if (searchText.trim() !== '') {
      result = result.filter((patient) =>
        patient.nome_completo.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const min = parseInt(minAge, 10);
    const max = parseInt(maxAge, 10);
    if (!isNaN(min)) {
      result = result.filter(
        (patient) =>
          patient.data_nascimento && calculateAge(patient.data_nascimento) >= min
      );
    }
    if (!isNaN(max)) {
      result = result.filter(
        (patient) =>
          patient.data_nascimento && calculateAge(patient.data_nascimento) <= max
      );
    }

    if (onlyWithoutTests) {
      result = result.filter((patient) => (patient.testsCount || 0) === 0);
    }

    result.sort((a, b) => {
      const ageA = a.data_nascimento ? calculateAge(a.data_nascimento) : Infinity;
      const ageB = b.data_nascimento ? calculateAge(b.data_nascimento) : Infinity;

      switch (sortBy) {
        case 'name_asc':
          return a.nome_completo.localeCompare(b.nome_completo);
        case 'name_desc':
          return b.nome_completo.localeCompare(a.nome_completo);
        case 'age_asc':
          return ageA - ageB;
        case 'age_desc':
          return ageB - ageA;
        case 'tests_desc':
          return (b.testsCount || 0) - (a.testsCount || 0);
        default:
          return 0;
      }
    });

    setFilteredPatients(result);
  }, [patients, searchText, showInactive, minAge, maxAge, onlyWithoutTests, sortBy]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handlePatientPress = (patientId: string) => {
    navigation.navigate('PatientDetail', { patientId });
  };

  const handlePatientCreation = () => {
    const nameToPreFill = searchText.trim();
    navigation.navigate('PatientCreation', { prefillName: nameToPreFill });
  };

  const handleFilter = () => {
    setIsFilterModalVisible(true);
  };

  const areFiltersActive = () => {
    return (
      showInactive ||
      minAge.trim() !== '' ||
      maxAge.trim() !== '' ||
      onlyWithoutTests ||
      sortBy !== 'name_asc'
    );
  };

  const getStatusColor = (status: 'ativo' | 'inativo') => {
    return status === 'ativo' ? colors.softGreen : colors.deactivated;
  };

  const renderSortButton = (
    label: string,
    sortKey: string
  ) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === sortKey && styles.sortButtonSelected,
      ]}
      onPress={() => setSortBy(sortKey)}
    >
      <Text
        style={[
          styles.sortButtonText,
          sortBy === sortKey && styles.sortButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>
          Carregando pacientes...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => {
          setIsFilterModalVisible(false);
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}> 
              <Text style={styles.modalTitle}>Filtros Avançados</Text>

              <Text style={styles.filterSectionTitle}>Filtros Gerais</Text>
              <View style={styles.filterOption}>
                <Text style={styles.filterLabel}>Mostrar pacientes inativos</Text>
                <Switch
                  trackColor={{ false: colors.deactivated, true: colors.primary }}
                  thumbColor={colors.primaryForeground}
                  onValueChange={() => setShowInactive((prev) => !prev)}
                  value={showInactive}
                />
              </View>

              <Text style={styles.filterSectionTitle}>Filtrar por Idade</Text>
              <View style={styles.filterInputContainer}>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Idade Mín."
                  placeholderTextColor={colors.deactivated}
                  keyboardType="number-pad"
                  value={minAge}
                  onChangeText={setMinAge}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Idade Máx."
                  placeholderTextColor={colors.deactivated}
                  keyboardType="number-pad"
                  value={maxAge}
                  onChangeText={setMaxAge}
                />
              </View>

              <Text style={styles.filterSectionTitle}>Filtros de Testes</Text>
              <View style={styles.filterOption}>
                <Text style={styles.filterLabel}>Mostrar somente sem testes</Text>
                <Switch
                  trackColor={{ false: colors.deactivated, true: colors.primary }}
                  thumbColor={colors.primaryForeground}
                  onValueChange={() => setOnlyWithoutTests((prev) => !prev)}
                  value={onlyWithoutTests}
                />
              </View>

              <Text style={styles.filterSectionTitle}>Ordenar por</Text>
              <View style={styles.sortContainer}>
                {renderSortButton('Nome (A-Z)', 'name_asc')}
                {renderSortButton('Nome (Z-A)', 'name_desc')}
                {renderSortButton('Mais Novos', 'age_asc')}
                {renderSortButton('Mais Velhos', 'age_desc')}
                {renderSortButton('Qtd. Testes', 'tests_desc')}
              </View>

              <Button
                variant="default"
                size="sm"
                style={{ marginTop: hp('4%') }}
                onPress={() => setIsFilterModalVisible(false)}
              >
                Fechar
              </Button>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

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
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handlePatientCreation}
        >
          <Text style={styles.filterButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterButton,
            areFiltersActive() && { backgroundColor: colors.primary }
          ]} 
          onPress={handleFilter}
        >
          <Icon 
            name="filter-variant"
            size={isTablet ? wp('4%') : wp('5%')}
            color={areFiltersActive() ? colors.primaryForeground : colors.foreground} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
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
                    <Text style={styles.patientName}>
                      {patient.nome_completo}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(patient.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {patient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientInput}>
                      Idade:{' '}
                      {patient.data_nascimento
                        ? `${calculateAge(patient.data_nascimento)} anos`
                        : 'N/A'}
                    </Text>
                    <Text style={styles.patientLastTest}>
                      Último teste: {patient.lastTest || 'Nenhum'}
                    </Text>
                    <Text style={styles.patientTestsCount}>
                      Testes realizados: {patient.testsCount}
                    </Text>
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
            {searchText.trim() !== '' || areFiltersActive()
              ? 'Tente ajustar sua busca ou filtros'
              : !showInactive
              ? 'Tente ajustar seus filtros ou adicione um novo paciente'
              : 'Nenhum paciente cadastrado'}
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