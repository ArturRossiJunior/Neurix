import { Card } from '../components/Card';
import { supabase } from '../utils/supabase';
import { calculateAge } from '../utils/utils';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { PatientDetailScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/patients.styles';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

interface PatientDetail {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  genero: string;
  nome_responsavel: string;
  telefone_responsavel: string;
  email_responsavel: string;
  status: 'ativo' | 'inativo';
  criado_em: string;
  observacoes: string;
}

interface TestDetail {
  id: string;
  nome_teste: string;
  data_aplicacao: string;
  resultado_pontuacao: number;
  // status: string; // No seu schema, o status do teste não está explícito, usando 'Concluído' como padrão
}

const PatientDetailScreen = ({ navigation, route }: PatientDetailScreenProps) => {
  const { patientId } = route.params;
  const isTablet = useIsTablet();
  const styles = useMemo(() => createStyles(isTablet), [isTablet]);

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [tests, setTests] = useState<TestDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) {
        throw patientError;
      }

      setPatient(patientData);

      const { data: testsData, error: testsError } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          data_aplicacao,
          resultado_pontuacao,
          tipos_de_teste(nome_teste)
        `)
        .eq('id_paciente', patientId)
        .order('data_aplicacao', { ascending: false });

      if (testsError) {
        throw testsError;
      }

      const formattedTests: TestDetail[] = testsData.map((test: any) => ({
        id: test.id,
        nome_teste: test.tipos_de_teste.nome_teste,
        data_aplicacao: new Date(test.data_aplicacao).toLocaleDateString('pt-BR'),
        resultado_pontuacao: test.resultado_pontuacao,
      }));
      setTests(formattedTests);

    } catch (err: any) {
      console.error('Erro ao buscar detalhes do paciente:', err);
      setError('Erro ao carregar os detalhes do paciente: ' + err.message);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do paciente');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatientDetails();
  }, [fetchPatientDetails]);

  const handleEditPatient = () => {
    Alert.alert(
      'Editar Paciente',
      'Funcionalidade de edição será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  const handleNewTest = () => {
    // Integrar passando o paciente como parametro para tela de testes
    // navigation.navigate('Tests', { patientId: patient?.id });
    navigation.navigate('Tests');
  };

  const handleViewTest = (testId: string) => {
    Alert.alert(
      'Ver Teste',
      `Visualizando teste ${testId}. Esta funcionalidade será implementada em breve!`,
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: 'ativo' | 'inativo') => {
    return status === 'ativo' ? colors.softGreen : colors.deactivated;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centralizer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Carregando detalhes do paciente...</Text>
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={[styles.container, styles.centralizer]}>
        <Text style={{ color: colors.destructive, textAlign: 'center' }}>{error || 'Paciente não encontrado'}</Text>
        <Button onPress={() => navigation.goBack()} variant="default" size="default" style={{ marginTop: 20 }}>Voltar</Button>
      </View>
    );
  }

  const registrationDate = new Date(patient.criado_em).toLocaleDateString('pt-BR');
  const lastTestDate = tests.length > 0 ? tests[0].data_aplicacao : 'Nenhum';

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
          onPress={handleEditPatient}
        > 
        Editar
        </Button>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <View style={styles.patientHeader}>
                <Text style={styles.patientName}>{patient.nome_completo}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                  <Text style={styles.statusText}>{patient.status === 'ativo' ? 'Ativo' : 'Inativo'}</Text>
                </View>
              </View>
              <View style={styles.patientDetails}>
                <Text style={styles.patientInput}>Idade: {calculateAge(patient.data_nascimento)} anos</Text>
                <Text style={styles.patientInput}>Data de nascimento: {new Date(patient.data_nascimento).toLocaleDateString('pt-BR')}</Text>
                <Text style={styles.patientInput}>Gênero: {patient.genero}</Text>
                <Text style={styles.patientInput}>Responsável: {patient.nome_responsavel}</Text>
                <Text style={styles.patientInput}>Telefone: {patient.telefone_responsavel}</Text>
                <Text style={styles.patientInput}>Email: {patient.email_responsavel}</Text>
                <Text style={styles.patientInput}>Data de cadastro: {registrationDate}</Text>
                <Text style={styles.patientInput}>Último teste: {lastTestDate}</Text>
                <Text style={styles.patientInput}>Total de testes: {tests.length}</Text>
              </View>
            </View>
          </Card>

          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Observações</Text>
              <Text style={styles.patientInput}>{patient.observacoes || 'Nenhuma observação.'}</Text>
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
          
          {tests.length > 0 ? (
            tests.map((test) => (
              <Card
                key={test.id}
                variant="default"
                style={styles.patientCard}
                onPress={() => handleViewTest(test.id)}
              >
                <View style={styles.patientCardContent}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{test.nome_teste}</Text>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientInput}>Data: {test.data_aplicacao}</Text>
                      <Text style={styles.patientInput}>Pontuação: {test.resultado_pontuacao}</Text>
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
            ))
          ) : (
            <Text style={{ color: colors.text, textAlign: 'center', marginTop: 10, fontSize: 24 }}>Nenhum teste registrado para este paciente</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientDetailScreen;