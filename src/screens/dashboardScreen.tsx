import { supabase } from '../utils/supabase';
import { useIsTablet } from '../utils/useIsTablet';
import { Picker } from '@react-native-picker/picker';
import PickerInput from '../components/PickerInput';
import React, { useState, useCallback } from 'react';
import { colors } from '../components/styles/colors';
import ScreenHeader from '../components/ScreenHeader';
import { useFocusEffect } from '@react-navigation/native';
import { DashboardScreenProps } from '../navigation/types';
import { LineChart } from 'react-native-chart-kit';
import { createStyles } from '../components/styles/dashboard.styles';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, useWindowDimensions } from 'react-native';

const TEST_ID_WITH_ROUNDS = 2;

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

interface AssessmentRound {
  id: number;
  id_avaliacao: number;
  rodada: number;
  resultado_correto: number;
  resultado_incorreto: number;
  resultado_omisso: number;
  tempo_restante: number;
}

type RoundsMap = Record<number, AssessmentRound[]>;

interface MetricCardsProps {
  c: number;
  i: number;
  o: number;
}

const MetricCards = ({ c, i, o }: MetricCardsProps) => {
  const total = c + i + o;
  const pct = (val: number) => total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';

  const items = [
    { label: 'Corretos',   value: c, pct: pct(c), color: '#22C55E', bg: '#F0FDF4', icon: '✓' },
    { label: 'Incorretos', value: i, pct: pct(i), color: '#EF4444', bg: '#FEF2F2', icon: '✗' },
    { label: 'Omissões',   value: o, pct: pct(o), color: '#F97316', bg: '#FFF7ED', icon: '○' },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
      {items.map(item => (
        <View
          key={item.label}
          style={{
            flex: 1,
            backgroundColor: item.bg,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: item.color + '40',
            padding: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: item.color, fontWeight: '700', marginBottom: 2 }}>
            {item.icon}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '900', color: item.color }}>
            {item.value}
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 2, textAlign: 'center' }}>
            {item.label}
          </Text>
          <Text style={{ fontSize: 11, color: item.color, fontWeight: '700', marginTop: 2 }}>
            {item.pct}%
          </Text>
        </View>
      ))}
    </View>
  );
};

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);
  const { width: screenWidth } = useWindowDimensions();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [roundsMap, setRoundsMap] = useState<RoundsMap>({});
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const isRoundBasedTest = selectedTestType === TEST_ID_WITH_ROUNDS;

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchFilters = useCallback(async () => {
    setLoadingFilters(true);
    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('id, nome_completo, status')
        .order('nome_completo', { ascending: true });

      if (patientsError) throw patientsError;

      setPatients(patientsData?.filter(p => p.status === 'ativo' || !p.status) || []);

      const { data: testsData, error: testsError } = await supabase
        .from('tipos_de_teste')
        .select('id, nome_teste, descricao')
        .order('nome_teste', { ascending: true });

      if (testsError) throw testsError;

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
      setRoundsMap({});
      return;
    }

    setLoading(true);
    try {
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from('avaliacoes')
        .select('id, data_aplicacao, resultado_correto, resultado_incorreto, resultado_omisso, tempo_realizacao')
        .eq('id_paciente', selectedPatient)
        .eq('id_tipo_teste', selectedTestType)
        .order('data_aplicacao', { ascending: true });

      if (avaliacoesError) throw avaliacoesError;

      const avaliacoes = avaliacoesData || [];
      setAssessments(avaliacoes);
      setExpandedIds(new Set());

      if (selectedTestType === TEST_ID_WITH_ROUNDS && avaliacoes.length > 0) {
        const ids = avaliacoes.map(a => a.id);

        const { data: roundsData, error: roundsError } = await supabase
          .from('avaliacoes_rodadas')
          .select('id, id_avaliacao, rodada, resultado_correto, resultado_incorreto, resultado_omisso, tempo_restante')
          .in('id_avaliacao', ids)
          .order('rodada', { ascending: true });

        if (roundsError) throw roundsError;

        const map: RoundsMap = {};
        for (const round of roundsData || []) {
          if (!map[round.id_avaliacao]) map[round.id_avaliacao] = [];
          map[round.id_avaliacao].push(round);
        }
        setRoundsMap(map);
      } else {
        setRoundsMap({});
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar as avaliações: ' + error.message);
      setAssessments([]);
      setRoundsMap({});
    } finally {
      setLoading(false);
    }
  }, [selectedPatient, selectedTestType]);

  useFocusEffect(
    useCallback(() => {
      fetchAssessments();
    }, [fetchAssessments])
  );

  const getLineDataFromRounds = (rounds: AssessmentRound[]) => {
    if (rounds.length === 0) return null;
    return {
      labels: rounds.map(r => `R${r.rodada}(${20 - r.tempo_restante}s)`),
      datasets: [
        { data: rounds.map(r => r.resultado_correto),   color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,  strokeWidth: 2 },
        { data: rounds.map(r => r.resultado_incorreto), color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,  strokeWidth: 2 },
        { data: rounds.map(r => r.resultado_omisso),    color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,  strokeWidth: 2 },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#EDE9FE',
    backgroundGradientFrom: '#EDE9FE',
    backgroundGradientTo: '#EDE9FE',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
    style: { borderRadius: 12 },
    propsForDots: { r: '5', strokeWidth: '2', stroke: colors.purpleButton },
    propsForBackgroundLines: { stroke: '#D8B4FE' },
    fillShadowGradientFrom: '#EDE9FE',
    fillShadowGradientTo: '#EDE9FE',
    fillShadowGradientFromOpacity: 0,
    fillShadowGradientToOpacity: 0,
    fillShadowGradientOpacity: 0,
  };

  const renderAssessmentCard = (assessment: Assessment) => {
    const dateLabel = new Date(assessment.data_aplicacao).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isExpanded = expandedIds.has(assessment.id);

    const renderContent = () => {
      if (isRoundBasedTest) {
        const rounds = roundsMap[assessment.id] || [];
        const lineData = getLineDataFromRounds(rounds);
        const totalCorrect   = rounds.reduce((s, r) => s + r.resultado_correto, 0);
        const totalIncorrect = rounds.reduce((s, r) => s + r.resultado_incorreto, 0);
        const totalOmission  = rounds.reduce((s, r) => s + r.resultado_omisso, 0);
        const totalTime      = rounds.reduce((s, r) => s + (20 - r.tempo_restante), 0);
        const avgTime        = rounds.length > 0 ? (totalTime / rounds.length).toFixed(1) : '0';

        return (
          <>
            <Text style={styles.summaryText}>
              Rodadas registradas: <Text style={styles.summaryBold}>{rounds.length}</Text>
            </Text>
            <Text style={styles.summaryText}>
              Tempo total de realização: <Text style={styles.summaryBold}>{totalTime}s</Text>
            </Text>
            <Text style={styles.summaryText}>
              Tempo médio por rodada: <Text style={styles.summaryBold}>{avgTime}s</Text>
            </Text>

            <Text style={[styles.pieChartTitle, { marginTop: 12 }]}>
              Distribuição dos Resultados
            </Text>
            <MetricCards c={totalCorrect} i={totalIncorrect} o={totalOmission} />

            {lineData && (
              <View style={[styles.lineChartCard, { marginTop: 16 }]}>
                <Text style={styles.lineChartTitle}>Evolução por Rodada</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.lineChartScrollContent}
                >
                  <LineChart
                    data={lineData}
                    width={Math.max(screenWidth * 0.90, rounds.length * 100)}
                    height={500}
                    chartConfig={chartConfig}
                    bezier
                    fromZero
                    segments={22}
                    yAxisInterval={1}
                    withShadow={false}
                    style={styles.lineChartStyle}
                  />
                </ScrollView>
                <View style={styles.lineLegendContainer}>
                  <View style={styles.lineLegendItem}>
                    <View style={[styles.lineLegendDot, { backgroundColor: 'rgba(76, 175, 80, 1)' }]} />
                    <Text style={styles.lineLegendText}>Corretos</Text>
                  </View>
                  <View style={styles.lineLegendItem}>
                    <View style={[styles.lineLegendDot, { backgroundColor: 'rgba(244, 67, 54, 1)' }]} />
                    <Text style={styles.lineLegendText}>Incorretos</Text>
                  </View>
                  <View style={styles.lineLegendItem}>
                    <View style={[styles.lineLegendDot, { backgroundColor: 'rgba(255, 152, 0, 1)' }]} />
                    <Text style={styles.lineLegendText}>Omissões</Text>
                  </View>
                </View>
              </View>
            )}

            {rounds.length === 0 && (
              <Text style={styles.noAvaliacoesText}>Nenhuma rodada registrada para esta avaliação.</Text>
            )}
          </>
        );
      }

      const total = assessment.resultado_correto + assessment.resultado_incorreto + assessment.resultado_omisso;

      return (
        <>
          {assessment.tempo_realizacao > 0 && (
            <Text style={styles.summaryText}>
              Tempo de realização: <Text style={styles.summaryBold}>{assessment.tempo_realizacao}s</Text>
            </Text>
          )}

          <Text style={[styles.pieChartTitle, { marginTop: 12 }]}>
            Distribuição dos Resultados
          </Text>
          <MetricCards
            c={assessment.resultado_correto}
            i={assessment.resultado_incorreto}
            o={assessment.resultado_omisso}
          />

          {total === 0 && (
            <Text style={styles.noAvaliacoesText}>Sem respostas registradas nesta avaliação.</Text>
          )}
        </>
      );
    };

    return (
      <View key={assessment.id} style={styles.summaryCard}>
        <TouchableOpacity
          onPress={() => toggleExpanded(assessment.id)}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={[styles.summaryTitle, { marginBottom: 0 }]}>
            Avaliação — {dateLabel}
          </Text>
          <Text style={{ fontSize: 18, color: '#64748B', marginLeft: 8 }}>
            {isExpanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={{ marginTop: 12 }}>
            {renderContent()}
          </View>
        )}
      </View>
    );
  };

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
              <PickerInput
                selectedValue={selectedPatient}
                onValueChange={(itemValue) => setSelectedPatient(itemValue)}
                enabled={patients.length > 0}
                containerStyle={styles.pickerContainer}
              >
                <Picker.Item
                  label={patients.length === 0 ? 'Nenhum paciente encontrado' : 'Selecione um paciente'}
                  value={null}
                />
                {patients.map((patient) => (
                  <Picker.Item key={patient.id} label={patient.nome_completo} value={patient.id} />
                ))}
              </PickerInput>
            </View>

            <View style={styles.patientSelectorContainer}>
              <Text style={styles.patientSelectorLabel}>Selecionar Tipo de Teste:</Text>
              <PickerInput
                selectedValue={selectedTestType}
                onValueChange={(itemValue) => setSelectedTestType(itemValue)}
                enabled={testTypes.length > 0}
                containerStyle={styles.pickerContainer}
              >
                <Picker.Item
                  label={testTypes.length === 0 ? 'Nenhum teste encontrado' : 'Selecione um tipo de teste'}
                  value={null}
                />
                {testTypes.map((testType) => (
                  <Picker.Item key={testType.id} label={testType.nome_teste} value={testType.id} />
                ))}
              </PickerInput>
            </View>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.dashboardLoadingIndicator} />
                <Text style={styles.loadingText}>Carregando avaliações...</Text>
              </View>
            )}

            {!loading && [...assessments].reverse().map(renderAssessmentCard)}

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