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
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

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

interface PieLegendProps {
  c: number;
  i: number;
  o: number;
}

const PieLegend = ({ c, i, o }: PieLegendProps) => {
  const total = c + i + o;
  if (total === 0) return null;

  const pct = (val: number) => ((val / total) * 100).toFixed(1);

  const items = [
    { label: 'Corretos',   value: c, color: colors.chartCorrect },
    { label: 'Incorretos', value: i, color: colors.chartIncorrect },
    { label: 'Omissões',   value: o, color: colors.chartOmission },
  ];

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: 12, paddingHorizontal: 4 }}>
      {items.map(item => (
        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 6, marginVertical: 4 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 5 }} />
          <Text style={{ fontSize: 13, color: colors.chartLegend }}>
            {item.label}: {item.value} ({pct(item.value)}%)
          </Text>
        </View>
      ))}
    </View>
  );
};

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [roundsMap, setRoundsMap] = useState<RoundsMap>({});
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [tooltip, setTooltip] = useState<{ roundIndex: number; c: number; i: number; o: number } | null>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<number | null>(null);

  const isRoundBasedTest = selectedTestType === TEST_ID_WITH_ROUNDS;

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const chartConfig = {
    backgroundColor: '#EDE9FE',
    backgroundGradientFrom: '#EDE9FE',
    backgroundGradientTo: '#EDE9FE',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '5', strokeWidth: '2', stroke: colors.purpleButton },
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
      setTooltip(null);
      setActiveAssessmentId(null);

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

  const buildPieSlices = (c: number, i: number, o: number) => {
    const total = c + i + o;
    if (total === 0) return null;
    return [
      { name: ' ', population: c, color: colors.chartCorrect,   legendFontColor: 'transparent', legendFontSize: 1 },
      { name: ' ', population: i, color: colors.chartIncorrect, legendFontColor: 'transparent', legendFontSize: 1 },
      { name: ' ', population: o, color: colors.chartOmission,  legendFontColor: 'transparent', legendFontSize: 1 },
    ];
  };

  const getPieDataDirect = (assessment: Assessment) =>
    buildPieSlices(assessment.resultado_correto, assessment.resultado_incorreto, assessment.resultado_omisso);

  const getPieDataFromRounds = (rounds: AssessmentRound[]) =>
    buildPieSlices(
      rounds.reduce((s, r) => s + r.resultado_correto, 0),
      rounds.reduce((s, r) => s + r.resultado_incorreto, 0),
      rounds.reduce((s, r) => s + r.resultado_omisso, 0),
    );

  const getLineDataFromRounds = (rounds: AssessmentRound[]) => {
    if (rounds.length === 0) return null;
    return {
      labels: rounds.map(r => `R${r.rodada}\n(${20 - r.tempo_restante}s)`),
      datasets: [
        { data: rounds.map(r => r.resultado_correto),   color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,  strokeWidth: 2 },
        { data: rounds.map(r => r.resultado_incorreto), color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,  strokeWidth: 2 },
        { data: rounds.map(r => r.resultado_omisso),    color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,  strokeWidth: 2 },
      ],
    };
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
    const activeTooltip = activeAssessmentId === assessment.id ? tooltip : null;

    const renderContent = () => {
      if (isRoundBasedTest) {
        const rounds = roundsMap[assessment.id] || [];
        const pieData = getPieDataFromRounds(rounds);
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

            {lineData && (() => {
              const allValues = rounds.flatMap(r => [r.resultado_correto, r.resultado_incorreto, r.resultado_omisso]);
              const maxVal = Math.max(...allValues, 1);
              const ySteps = 5;
              const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
                String(Math.round((maxVal / ySteps) * (ySteps - i)))
              );

              return (
                <View style={styles.lineChartCard}>
                  <Text style={styles.lineChartTitle}>Evolução por Rodada</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {/* Eixo Y fixo */}
                    <View style={{ justifyContent: 'space-between', paddingVertical: 8, paddingRight: 4, height: 220 }}>
                      {yLabels.map((label, idx) => (
                        <Text key={idx} style={{ fontSize: 10, color: '#555', textAlign: 'right', width: 28 }}>
                          {label}
                        </Text>
                      ))}
                    </View>

                    {/* Gráfico rolável */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lineChartScrollContent}>
                      <View>
                        <LineChart
                          data={lineData}
                          width={Math.max(screenWidth * 0.75, rounds.length * 72)}
                          height={220}
                          chartConfig={{ ...chartConfig, propsForVerticalLabels: { fill: 'transparent' } }}
                          withHorizontalLabels={false}
                          bezier
                          style={styles.lineChartStyle}
                          onDataPointClick={({ index }) => {
                            const round = rounds[index];
                            if (!round) return;
                            setActiveAssessmentId(assessment.id);
                            setTooltip({
                              roundIndex: index,
                              c: round.resultado_correto,
                              i: round.resultado_incorreto,
                              o: round.resultado_omisso,
                            });
                          }}
                        />
                        {activeTooltip && (
                          <View style={{
                            position: 'absolute',
                            top: 4,
                            left: 8,
                            backgroundColor: 'rgba(0,0,0,0.78)',
                            borderRadius: 8,
                            padding: 8,
                            minWidth: 140,
                          }}>
                            {/* Botão X */}
                            <TouchableOpacity
                              onPress={() => setTooltip(null)}
                              style={{ position: 'absolute', top: 6, right: 6 }}
                              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            >
                              <Text style={{ color: '#aaa', fontSize: 12, fontWeight: '700' }}>✕</Text>
                            </TouchableOpacity>

                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12, marginBottom: 4, paddingRight: 16 }}>
                              Rodada {rounds[activeTooltip.roundIndex]?.rodada}
                            </Text>
                            <Text style={{ color: 'rgba(76,175,80,1)', fontSize: 12 }}>✓ Corretos: {activeTooltip.c}</Text>
                            <Text style={{ color: 'rgba(244,67,54,1)', fontSize: 12 }}>✗ Incorretos: {activeTooltip.i}</Text>
                            <Text style={{ color: 'rgba(255,152,0,1)', fontSize: 12 }}>○ Omissões: {activeTooltip.o}</Text>
                          </View>
                        )}
                      </View>
                    </ScrollView>
                  </View>

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
              );
            })()}

            {pieData && (
              <View style={styles.pieChartCard}>
                <Text style={styles.pieChartTitle}>Distribuição dos Resultados</Text>
                <PieChart
                  data={pieData}
                  width={screenWidth * 0.82}
                  height={180}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  hasLegend={false}
                  absolute
                  style={styles.pieChartStyle}
                />
                <PieLegend c={totalCorrect} i={totalIncorrect} o={totalOmission} />
              </View>
            )}

            {rounds.length === 0 && (
              <Text style={styles.noAvaliacoesText}>Nenhuma rodada registrada para esta avaliação.</Text>
            )}
          </>
        );
      }

      const pieData = getPieDataDirect(assessment);
      const total = assessment.resultado_correto + assessment.resultado_incorreto + assessment.resultado_omisso;

      return (
        <>
          {assessment.tempo_realizacao > 0 && (
            <Text style={styles.summaryText}>
              Tempo de realização: <Text style={styles.summaryBold}>{assessment.tempo_realizacao}s</Text>
            </Text>
          )}
          {pieData && (
            <View style={styles.pieChartCard}>
              <Text style={styles.pieChartTitle}>Distribuição dos Resultados</Text>
              <PieChart
                data={pieData}
                width={screenWidth * 0.82}
                height={180}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                absolute
                style={styles.pieChartStyle}
              />
              <PieLegend
                c={assessment.resultado_correto}
                i={assessment.resultado_incorreto}
                o={assessment.resultado_omisso}
              />
            </View>
          )}
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
              <Picker
                selectedValue={selectedPatient}
                onValueChange={(itemValue) => setSelectedPatient(itemValue)}
                style={styles.picker}
                enabled={patients.length > 0}
              >
                <Picker.Item
                  label={patients.length === 0 ? 'Nenhum paciente encontrado' : 'Selecione um paciente'}
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
                  label={testTypes.length === 0 ? 'Nenhum teste encontrado' : 'Selecione um tipo de teste'}
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

            {!loading && assessments.map(renderAssessmentCard)}

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