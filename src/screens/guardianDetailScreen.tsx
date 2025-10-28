import { Card } from '../components/Card';
import { supabase } from '../utils/supabase';
import { formatPhone } from '../utils/utils';
import { calculateAge, formatCPF } from '../utils/utils'; 
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { GuardianDetailScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/guardians.styles';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface GuardianDetail {
  id: number;
  nome_completo: string;
  telefone: string | null;
  email: string | null;
  cpf: string | null;
}

interface PatientAssociated {
  id: number;
  nome_completo: string;
  data_nascimento: string;
  status: 'ativo' | 'inativo';
  lastTest?: string;
  testsCount?: number;
}

const GuardianDetailScreen = ({ navigation, route }: GuardianDetailScreenProps) => {
  const { guardianId } = route.params;
  const isTablet = useIsTablet();
  const styles = useMemo(() => createStyles(isTablet), [isTablet]);

  const [guardian, setGuardian] = useState<GuardianDetail | null>(null);
  const [patients, setPatients] = useState<PatientAssociated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuardianDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: guardianData, error: guardianError } = await supabase
        .from('responsavel')
        .select('id, nome_completo, telefone, email, cpf')
        .eq('id', guardianId)
        .single();

      if (guardianError) {
        throw guardianError;
      }

      setGuardian(guardianData);

      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('id, nome_completo, data_nascimento, status')
        .eq('id_responsavel', guardianId)
        .order('nome_completo', { ascending: true });

      if (patientsError) {
        throw patientsError;
      }
      
      if (!patientsData) {
        setPatients([]);
        return;
      }

      const patientsWithDetails: PatientAssociated[] = await Promise.all(
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
      
      setPatients(patientsWithDetails || []);

    } catch (err: any) {
      console.error('Erro ao buscar detalhes do responsável:', err);
      setError('Erro ao carregar os detalhes do responsável: ' + err.message);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do responsável');
    } finally {
      setLoading(false);
    }
  }, [guardianId]);

  useFocusEffect(
    useCallback(() => {
      fetchGuardianDetails();
    }, [fetchGuardianDetails])
  );

  const handleEditGuardian = () => {
    if (!guardian) return;
    navigation.navigate('GuardianCreation', { 
      guardianId: guardian.id.toString(),
      prefillName: guardian.nome_completo,
      prefillCPF: guardian.cpf ?? undefined,
      prefillPhone: guardian.telefone ?? undefined,
      prefillEmail: guardian.email ?? undefined,
    });
  };

  const handleViewPatient = (patientId: string) => {
    navigation.replace('PatientDetail', { patientId });
  };

  const getStatusColor = (status: 'ativo' | 'inativo') => {
    return status === 'ativo' ? colors.softGreen : colors.deactivated;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centralizer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Carregando detalhes do responsável...</Text>
      </View>
    );
  }

  if (error || !guardian) {
    return (
      <View style={[styles.container, styles.centralizer]}>
        <Text style={{ color: colors.destructive, textAlign: 'center' }}>{error || 'Responsável não encontrado'}</Text>
        <Button onPress={() => navigation.goBack()} variant="default" size="default" style={{ marginTop: 20 }}>Voltar</Button>
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
        <Button 
          variant="soft"
          size="sm"
          style={styles.editGuardianButton} 
          onPress={handleEditGuardian}
        > 
          Editar
        </Button>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.guardiansList}>
          <Card variant="default" style={styles.guardianCard}>
            <View style={styles.guardianInfo}>
              <View style={styles.guardianHeader}>
                <Text style={styles.guardianName}>{guardian.nome_completo}</Text>
              </View>
              <View style={styles.guardianDetails}>
                <Text style={styles.guardianInput}>CPF: {formatCPF(guardian.cpf)}</Text>
                <Text style={styles.guardianInput}>Telefone: {formatPhone(guardian.telefone)}</Text>
                <Text style={styles.guardianInput}>Email: {guardian.email || 'N/A'}</Text>
              </View>
            </View>
          </Card>
          
          <Text style={[styles.guardianName, { marginTop: 20, marginBottom: 10 }]}>
            Pacientes Associados
          </Text>
          
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Card
                key={patient.id}
                variant="interactive"
                style={styles.guardianCard}
                onPress={() => handleViewPatient(patient.id.toString())}
              >
                <View style={styles.guardianCardContent}>
                  <View style={styles.guardianInfo}>
                    <View style={styles.guardianHeader}>
                      <Text style={styles.guardianName}>{patient.nome_completo}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                        <Text style={styles.statusText}>{patient.status === 'ativo' ? 'Ativo' : 'Inativo'}</Text>
                      </View>
                    </View>
                    <View style={styles.guardianDetails}>
                      <Text style={styles.guardianInput}>Idade: {patient.data_nascimento ? `${calculateAge(patient.data_nascimento)} anos` : 'N/A'}</Text>
                      <Text style={styles.guardianInput}>Último teste: {patient.lastTest || 'Nenhum'}</Text>
                      <Text style={styles.guardianInput}>Testes realizados: {patient.testsCount ?? 0}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Text style={{ color: colors.text, textAlign: 'center', marginTop: 10, fontSize: 24 }}>Nenhum paciente associado</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default GuardianDetailScreen;