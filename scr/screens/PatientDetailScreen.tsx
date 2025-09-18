import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { PatientDetailScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/patients.styles';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../components/styles/colors';

// Mock data para demonstração
const mockPatientDetail = {
  id: '1',
  name: 'Ana Silva',
  age: 8,
  birthDate: '15/05/2015',
  guardian: 'Maria Silva',
  phone: '(11) 99999-9999',
  email: 'maria.silva@email.com',
  status: 'Ativo',
  registrationDate: '01/02/2024',
  lastTest: '15/03/2024',
  testsCount: 3,
  notes: 'Paciente demonstra boa colaboração durante os testes. Apresenta dificuldades de concentração em atividades prolongadas.',
  tests: [
    {
      id: '1',
      name: 'Teste A - Atenção',
      date: '15/03/2024',
      score: 75,
      status: 'Concluído',
    },
    {
      id: '2',
      name: 'Teste B - Hiperatividade',
      date: '10/03/2024',
      score: 68,
      status: 'Concluído',
    },
    {
      id: '3',
      name: 'Teste C - Impulsividade',
      date: '05/03/2024',
      score: 82,
      status: 'Concluído',
    },
  ],
};

const PatientDetailScreen = ({ navigation, route }: PatientDetailScreenProps) => {
  const { patientId } = route.params;
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);
  
  // Buscar os dados do paciente usando o patientId
  const patient = mockPatientDetail;

  const handleEditPatient = () => {
    Alert.alert(
      'Editar Paciente',
      'Funcionalidade de edição será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  const handleNewTest = () => {
    Alert.alert(
      'Novo Teste',
      'Funcionalidade de novo teste será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  const handleViewTest = (testId: string) => {
    Alert.alert(
      'Ver Teste',
      `Visualizando teste ${testId}. Esta funcionalidade será implementada em breve!`,
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? colors.softGreen : colors.deactivated;
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
        <Button 
          variant="soft"
          size="sm"
          style={styles.editPatientButton}
          onPress={handleNewTest}
        > 
        Editar
        </Button>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <View style={styles.patientHeader}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                  <Text style={styles.statusText}>{patient.status}</Text>
                </View>
              </View>
              <View style={styles.patientDetails}>
                <Text style={styles.patientAge}>Idade: {patient.age} anos</Text>
                <Text style={styles.patientAge}>Data de nascimento: {patient.birthDate}</Text>
                <Text style={styles.patientAge}>Responsável: {patient.guardian}</Text>
                <Text style={styles.patientAge}>Telefone: {patient.phone}</Text>
                <Text style={styles.patientAge}>Email: {patient.email}</Text>
                <Text style={styles.patientAge}>Data de cadastro: {patient.registrationDate}</Text>
                <Text style={styles.patientAge}>Último teste: {patient.lastTest}</Text>
                <Text style={styles.patientAge}>Total de testes: {patient.testsCount}</Text>
              </View>
            </View>
          </Card>

          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Observações</Text>
              <Text style={styles.patientAge}>{patient.notes}</Text>
            </View>
          </Card>

          <Button
            variant="game"
            size="default"
            style={styles.patientCreationButton}
            onPress={handleNewTest}
          >
            + Novo Teste
          </Button>

          <Text style={[styles.patientName, { marginTop: 20, marginBottom: 10 }]}>
            Histórico de Testes
          </Text>
          
          {patient.tests.map((test) => (
            <Card
              key={test.id}
              variant="default"
              style={styles.patientCard}
              onPress={() => handleViewTest(test.id)}
            >
              <View style={styles.patientCardContent}>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{test.name}</Text>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientAge}>Data: {test.date}</Text>
                    <Text style={styles.patientAge}>Status: {test.status}</Text>
                  </View>
                </View>
                <View style={styles.patientActions}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handleViewTest(test.id)}
                  >
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientDetailScreen;