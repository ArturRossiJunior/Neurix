import { supabase } from '../utils/supabase';
import { useIsTablet } from '../utils/useIsTablet';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useCallback } from 'react';
import { colors } from '../components/styles/colors';
import ScreenHeader from '../components/ScreenHeader';
import { useFocusEffect } from '@react-navigation/native';
import { DashboardScreenProps } from '../navigation/types';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { createStyles } from '../components/styles/dashboard.styles';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface Patient {
  id: number;
  nome_completo: string;
}

interface TestType {
  id: number;
  nome_teste: string;
  descricao?: string;
}

interface Assessment {
  id: number;
  data_aplicacao: string;
  resultado_correto: number;
  resultado_incorreto: number;
  resultado_omisso: number;
  tempo_realizacao: number;
}

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const fetchFilters = useCallback(async () => {
    setLoadingFilters(true);
    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('id, nome_completo, status')
        .order('nome_completo', { ascending: true });

      if (patientsError) {
        throw patientsError;
      }
      
      const activePatientsData = patientsData?.filter(p => 
        p.status === 'ativo' || !p.status
      ) || [];
      
      setPatients(activePatientsData);

      const { data: testsData, error: testsError } = await supabase
        .from('tipos_de_teste')
        .select('id, nome_teste, descricao')
        .order('nome_teste', { ascending: true });

      if (testsError) {
        throw testsError;
      }
      
      setTestTypes(testsData || []);

    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os filtros: ' + error.message);
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFilters();
    }, [fetchFilters])
  );

  const fetchAssessments = useCallback(async () => {
    if (!selectedPatient || !selectedTestType) {
      setAssessments([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('id, data_aplicacao, resultado_correto, resultado_incorreto, resultado_omisso, tempo_realizacao')
        .eq('id_paciente', selectedPatient)
        .eq('id_tipo_teste', selectedTestType)
        .order('data_aplicacao', { ascending: true });

      if (error) throw error;
      setAssessments(data || []);

    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar as avaliações: ' + error.message);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPatient, selectedTestType]);

  useFocusEffect(
    useCallback(() => {
      fetchAssessments();
    }, [fetchAssessments])
  );

  const getLineChartData = () => {
    if (assessments.length === 0) return null;

    const labels = assessments.map((assessment) => {
      const date = new Date(assessment.data_aplicacao);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const scores = assessments.map((assessment) => {
      const total = assessment.resultado_correto + assessment.resultado_incorreto + assessment.resultado_omisso;
      return total > 0 ? Math.round((assessment.resultado_correto / total) * 100) : 0;
    });

    return {
      labels: labels.length > 6 ? labels.slice(-6) : labels,
      datasets: [{ data: scores.length > 6 ? scores.slice(-6) : scores }],
    };
  };

  const getPieChartData = () => {
    if (assessments.length === 0) return null;

    const totalCorrect = assessments.reduce((sum, a) => sum + a.resultado_correto, 0);
    const totalIncorrect = assessments.reduce((sum, a) => sum + a.resultado_incorreto, 0);
    const totalOmission = assessments.reduce((sum, a) => sum + a.resultado_omisso, 0);

    const total = totalCorrect + totalIncorrect + totalOmission;
    if (total === 0) return null;

    return [
      {
        name: 'Corretos',
        population: totalCorrect,
        color: colors.chartCorrect,
        legendFontColor: colors.chartLegend,
        legendFontSize: 15,
      },
      {
        name: 'Incorretos',
        population: totalIncorrect,
        color: colors.chartIncorrect,
        legendFontColor: colors.chartLegend,
        legendFontSize: 15,
      },
      {
        name: 'Omissões',
        population: totalOmission,
        color: colors.chartOmission,
        legendFontColor: colors.chartLegend,
        legendFontSize: 15,
      },
    ];
  };

  const getStatistics = () => {
    if (assessments.length === 0) return null;

    const totalCorrect = assessments.reduce((sum, a) => sum + a.resultado_correto, 0);
    const totalIncorrect = assessments.reduce((sum, a) => sum + a.resultado_incorreto, 0);
    const totalOmission = assessments.reduce((sum, a) => sum + a.resultado_omisso, 0);
    const totalAnswers = totalCorrect + totalIncorrect + totalOmission;
    const averageTime = Math.round(assessments.reduce((sum, a) => sum + a.tempo_realizacao, 0) / assessments.length);

    return {
      totalAssessments: assessments.length,
      averageAccuracy: totalAnswers > 0 ? ((totalCorrect / totalAnswers) * 100).toFixed(1) : '0',
      totalCorrect,
      totalIncorrect,
      totalOmission,
      averageTime,
    };
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.purpleButton,
    },
  };

  const lineChartData = getLineChartData();
  const pieChartData = getPieChartData();
  const statistics = getStatistics();

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => navigation.goBack()}
        isTablet={isTablet}
      />

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {loadingFilters ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.dashboardLoadingIndicator} />
            <Text style={styles.loadingText}>Carregando filtros...</Text>
          </View>
        ) : (
          <>
            <View style={styles.patientSelectorContainer}>
              <Text style={styles.patientSelectorLabel}>Selecionar Paciente:</Text>
              <Picker
                selectedValue={selectedPatient}
                onValueChange={(itemValue) => setSelectedPatient(itemValue)}
                style={styles.picker}
                enabled={patients.length > 0}
              >
                <Picker.Item 
                  label={patients.length === 0 ? "Nenhum paciente encontrado" : "Selecione um paciente"} 
                  value={null} 
                />
                {patients.map((patient) => (
                  <Picker.Item key={patient.id} label={patient.nome_completo} value={patient.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.patientSelectorContainer}>
              <Text style={styles.patientSelectorLabel}>Selecionar Tipo de Teste:</Text>
              <Picker
                selectedValue={selectedTestType}
                onValueChange={(itemValue) => setSelectedTestType(itemValue)}
                style={styles.picker}
                enabled={testTypes.length > 0}
              >
                <Picker.Item 
                  label={testTypes.length === 0 ? "Nenhum teste encontrado" : "Selecione um tipo de teste"} 
                  value={null} 
                />
                {testTypes.map((testType) => (
                  <Picker.Item key={testType.id} label={testType.nome_teste} value={testType.id} />
                ))}
              </Picker>
            </View>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.dashboardLoadingIndicator} />
                <Text style={styles.loadingText}>Carregando avaliações...</Text>
              </View>
            )}

            {!loading && statistics && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumo Geral</Text>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryText}>
                    Total de Avaliações: <Text style={styles.summaryBold}>{statistics.totalAssessments}</Text>
                  </Text>
                  <Text style={styles.summaryText}>
                    Acurácia Média: <Text style={styles.summaryBold}>{statistics.averageAccuracy}%</Text>
                  </Text>
                  <Text style={styles.summaryText}>
                    Total Correto: <Text style={styles.summaryBold}>{statistics.totalCorrect}</Text>
                  </Text>
                  <Text style={styles.summaryText}>
                    Total Incorreto: <Text style={styles.summaryBold}>{statistics.totalIncorrect}</Text>
                  </Text>
                  <Text style={styles.summaryText}>
                    Total Omissões: <Text style={styles.summaryBold}>{statistics.totalOmission}</Text>
                  </Text>
                  <Text style={styles.summaryTextLast}>
                    Tempo Médio: <Text style={styles.summaryBold}>{statistics.averageTime}s</Text>
                  </Text>
                </View>
              </View>
            )}

            {!loading && lineChartData && (
              <View style={styles.lineChartCard}>
                <Text style={styles.lineChartTitle}>Evolução da Acurácia</Text>
                <LineChart
                  data={lineChartData}
                  width={screenWidth - 80}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.lineChartStyle}
                />
              </View>
            )}

            {!loading && pieChartData && (
              <View style={styles.pieChartCard}>
                <Text style={styles.pieChartTitle}>Distribuição dos Resultados</Text>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 80}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={styles.pieChartStyle}
                />
              </View>
            )}

            {!loading && !selectedPatient && !selectedTestType && (
              <Text style={styles.noSelectionText}>
                Selecione um paciente e um tipo de teste para visualizar os dados
              </Text>
            )}

            {!loading && selectedPatient && selectedTestType && assessments.length === 0 && (
              <Text style={styles.noAvaliacoesText}>
                Nenhuma avaliação encontrada para este paciente e tipo de teste
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};