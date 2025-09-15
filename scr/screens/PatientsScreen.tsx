import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { PatientsScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/patients.styles';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../components/styles/colors'

// Mock data para demonstração
const mockPatients = [
  {
    id: '1',
    name: 'Ana Silva',
    age: 8,
    lastTest: '15/03/2024',
    status: 'Ativo',
    testsCount: 3,
  },
  {
    id: '2',
    name: 'João Santos',
    age: 7,
    lastTest: '12/03/2024',
    status: 'Ativo',
    testsCount: 2,
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    age: 9,
    lastTest: '10/03/2024',
    status: 'Inativo',
    testsCount: 5,
  },
  {
    id: '4',
    name: 'Pedro Costa',
    age: 6,
    lastTest: '08/03/2024',
    status: 'Ativo',
    testsCount: 1,
  },
  {
    id: '5',
    name: 'Sofia Ferreira',
    age: 8,
    lastTest: '05/03/2024',
    status: 'Ativo',
    testsCount: 4,
  },
];

const PatientsScreen = ({ navigation }: PatientsScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPatients(mockPatients);
    } else {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const handlePatientPress = (patientId: string) => {
    navigation.navigate('PatientDetail', { patientId });
  };

  const handleNewPatient = () => {
    navigation.navigate('NewPatient');
  };

  const handleFilter = () => {
    Alert.alert(
      'Filtros',
      'Funcionalidade de filtros será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? colors.active : colors.deactivated;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pacientes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar paciente..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* New Patient Button */}
      <View style={styles.newPatientSection}>
        <Button
          variant="game"
          size="default"
          style={styles.newPatientButton}
          onPress={handleNewPatient}
        >
          + Novo Paciente
        </Button>
      </View>

      {/* Patients List */}
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
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                      <Text style={styles.statusText}>{patient.status}</Text>
                    </View>
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientAge}>Idade: {patient.age} anos</Text>
                    <Text style={styles.patientLastTest}>Último teste: {patient.lastTest}</Text>
                    <Text style={styles.patientTestsCount}>Testes realizados: {patient.testsCount}</Text>
                  </View>
                </View>
                <View style={styles.patientActions}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handlePatientPress(patient.id)}
                  >
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhum paciente encontrado</Text>
          <Text style={styles.emptyStateDescription}>
            {searchText.trim() !== '' 
              ? 'Tente ajustar sua busca ou adicione um novo paciente.'
              : 'Comece adicionando seu primeiro paciente.'
            }
          </Text>
          <Button
            variant="outline"
            size="default"
            style={styles.emptyStateButton}
            onPress={handleNewPatient}
          >
            + Adicionar Paciente
          </Button>
        </View>
      )}
    </View>
  );
};

export default PatientsScreen;