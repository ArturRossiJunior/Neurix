import React, { useState, useCallback, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../components/styles/colors';
import ScreenHeader from '../components/ScreenHeader';
import { DashboardScreenProps } from '../navigation/types';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../utils/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { createStyles } from '../components/styles/dashboard.styles';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface Patient {
  id: number;
  nome_completo: string;
}

interface TipoTeste {
  id: number;
  nome_teste: string;
  descricao?: string;
}

interface Avaliacao {
  id: number;
  data_aplicacao: string;
  resultado_correto: number;
  resultado_incorreto: number;
  resultado_omisso: number;
  tempo_realizacao: number;
}

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const isTablet = Dimensions.get('window').width >= 768;
  const styles = createStyles(isTablet);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [tiposTeste, setTiposTeste] = useState<TipoTeste[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedTipoTeste, setSelectedTipoTeste] = useState<number | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('Testando...');

  // Teste de conexão ao montar o componente
  useEffect(() => {
    const testConnection = async () => {
      console.log('=== INICIANDO TESTES DE CONEXÃO ===');
      
      // Teste 1: Internet básica
      try {
        console.log('Teste 1: Testando internet básica...');
        const googleResponse = await fetch('https://www.google.com', { 
          method: 'HEAD',
          timeout: 5000 
        });
        console.log('✅ Google acessível:', googleResponse.status);
        setConnectionStatus('Internet OK');
      } catch (error: any) {
        console.error('❌ Erro ao acessar Google:', error.message);
        setConnectionStatus('Sem internet: ' + error.message);
        Alert.alert('Erro de Internet', 'O emulador não tem acesso à internet. Verifique as configurações.');
        return;
      }

      // Teste 2: Supabase direto com fetch
      try {
        console.log('Teste 2: Testando Supabase com fetch...');
        const supabaseResponse = await fetch('https://pxvubtzhjkjrxcieahag.supabase.co/rest/v1/', {
          method: 'GET',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dnVidHpoamtqcnhjaWVhaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Njk3ODgsImV4cCI6MjA3NjE0NTc4OH0.c7FFPBukuoa_bcEFnbE3Nr21YGRxtKLvzwEXBPS1hI4',
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Supabase acessível:', supabaseResponse.status);
        setConnectionStatus('Supabase OK');
      } catch (error: any) {
        console.error('❌ Erro ao acessar Supabase:', error.message);
        setConnectionStatus('Erro Supabase: ' + error.message);
        Alert.alert('Erro Supabase', 'Não foi possível conectar ao Supabase: ' + error.message);
        return;
      }

      // Teste 3: Cliente Supabase
      try {
        console.log('Teste 3: Testando cliente Supabase...');
        const { data, error } = await supabase
          .from('pacientes')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('❌ Erro do cliente Supabase:', error);
          setConnectionStatus('Erro cliente: ' + error.message);
        } else {
          console.log('✅ Cliente Supabase funcionando!');
          setConnectionStatus('Tudo OK!');
        }
      } catch (error: any) {
        console.error('❌ Exceção no cliente Supabase:', error);
        setConnectionStatus('Exceção: ' + error.message);
      }

      console.log('=== FIM DOS TESTES ===');
    };

    testConnection();
  }, []);

  // Buscar pacientes e tipos de teste
  const fetchFilters = useCallback(async () => {
    setLoadingFilters(true);
    try {
      // Buscar pacientes - REMOVIDO O FILTRO DE STATUS TEMPORARIAMENTE
      console.log('🔍 Buscando pacientes...');
      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('id, nome_completo, status')
        .order('nome_completo', { ascending: true });

      if (patientsError) {
        console.error('❌ Erro ao buscar pacientes:', patientsError);
        throw patientsError;
      }
      
      console.log('📊 Pacientes encontrados (todos):', patientsData);
      console.log('📊 Total de pacientes:', patientsData?.length);
      
      // Filtrar apenas os ativos (se houver status)
      const activePatientsData = patientsData?.filter(p => 
        p.status === 'ativo' || !p.status
      ) || [];
      
      console.log('✅ Pacientes ativos:', activePatientsData);
      console.log('✅ Total de pacientes ativos:', activePatientsData.length);
      
      setPatients(activePatientsData);

      // Buscar tipos de teste - usando o nome correto da coluna
      console.log('🔍 Buscando tipos de teste...');
      const { data: testesData, error: testesError } = await supabase
        .from('tipos_de_teste')
        .select('id, nome_teste, descricao')
        .order('nome_teste', { ascending: true });

      if (testesError) {
        console.error('❌ Erro ao buscar tipos_de_teste:', testesError);
        throw testesError;
      }
      
      console.log('✅ Tipos de teste encontrados:', testesData);
      console.log('✅ Total de tipos de teste:', testesData?.length);
      setTiposTeste(testesData || []);

    } catch (error: any) {
      console.error('❌ Erro ao carregar filtros:', error);
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

  // Buscar avaliações quando os filtros mudarem
  const fetchAvaliacoes = useCallback(async () => {
    if (!selectedPatient || !selectedTipoTeste) {
      setAvaliacoes([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('id, data_aplicacao, resultado_correto, resultado_incorreto, resultado_omisso, tempo_realizacao')
        .eq('id_paciente', selectedPatient)
        .eq('id_tipo_teste', selectedTipoTeste)
        .order('data_aplicacao', { ascending: true });

      if (error) throw error;
      setAvaliacoes(data || []);

    } catch (error: any) {
      console.error('Erro ao buscar avaliações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as avaliações: ' + error.message);
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPatient, selectedTipoTeste]);

  // Executar busca quando filtros mudarem
  useFocusEffect(
    useCallback(() => {
      fetchAvaliacoes();
    }, [fetchAvaliacoes])
  );

  // Processar dados para o gráfico de linha
  const getLineChartData = () => {
    if (avaliacoes.length === 0) return null;

    const labels = avaliacoes.map((avaliacao) => {
      const date = new Date(avaliacao.data_aplicacao);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const scores = avaliacoes.map((avaliacao) => {
      const total = avaliacao.resultado_correto + avaliacao.resultado_incorreto + avaliacao.resultado_omisso;
      return total > 0 ? Math.round((avaliacao.resultado_correto / total) * 100) : 0;
    });

    return {
      labels: labels.length > 6 ? labels.slice(-6) : labels,
      datasets: [{ data: scores.length > 6 ? scores.slice(-6) : scores }],
    };
  };

  // Processar dados para o gráfico de pizza
  const getPieChartData = () => {
    if (avaliacoes.length === 0) return null;

    const totalCorreto = avaliacoes.reduce((sum, a) => sum + a.resultado_correto, 0);
    const totalIncorreto = avaliacoes.reduce((sum, a) => sum + a.resultado_incorreto, 0);
    const totalOmisso = avaliacoes.reduce((sum, a) => sum + a.resultado_omisso, 0);

    const total = totalCorreto + totalIncorreto + totalOmisso;
    if (total === 0) return null;

    return [
      {
        name: 'Corretos',
        population: totalCorreto,
        color: '#4CAF50',
        legendFontColor: '#000',
        legendFontSize: 15,
      },
      {
        name: 'Incorretos',
        population: totalIncorreto,
        color: '#F44336',
        legendFontColor: '#000',
        legendFontSize: 15,
      },
      {
        name: 'Omissões',
        population: totalOmisso,
        color: '#FFC107',
        legendFontColor: '#000',
        legendFontSize: 15,
      },
    ];
  };

  // Calcular estatísticas
  const getStatistics = () => {
    if (avaliacoes.length === 0) return null;

    const totalCorreto = avaliacoes.reduce((sum, a) => sum + a.resultado_correto, 0);
    const totalIncorreto = avaliacoes.reduce((sum, a) => sum + a.resultado_incorreto, 0);
    const totalOmisso = avaliacoes.reduce((sum, a) => sum + a.resultado_omisso, 0);
    const totalRespostas = totalCorreto + totalIncorreto + totalOmisso;
    const tempoMedio = Math.round(avaliacoes.reduce((sum, a) => sum + a.tempo_realizacao, 0) / avaliacoes.length);

    return {
      totalAvaliacoes: avaliacoes.length,
      acuraciaMedia: totalRespostas > 0 ? ((totalCorreto / totalRespostas) * 100).toFixed(1) : '0',
      totalCorreto,
      totalIncorreto,
      totalOmisso,
      tempoMedio,
    };
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#9C27B0',
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
        {/* Status de Conexão */}
        <View style={{ backgroundColor: '#FFF3CD', padding: 15, margin: 20, borderRadius: 8, borderWidth: 1, borderColor: '#FFC107' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>Status da Conexão:</Text>
          <Text style={{ fontSize: 12 }}>{connectionStatus}</Text>
        </View>

        {loadingFilters ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#9C27B0" />
            <Text style={{ marginTop: 10, color: '#000' }}>Carregando filtros...</Text>
          </View>
        ) : (
          <>
            {/* Filtro de Paciente */}
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

            {/* Filtro de Tipo de Teste */}
            <View style={styles.patientSelectorContainer}>
              <Text style={styles.patientSelectorLabel}>Selecionar Tipo de Teste:</Text>
              <Picker
                selectedValue={selectedTipoTeste}
                onValueChange={(itemValue) => setSelectedTipoTeste(itemValue)}
                style={styles.picker}
                enabled={tiposTeste.length > 0}
              >
                <Picker.Item 
                  label={tiposTeste.length === 0 ? "Nenhum teste encontrado" : "Selecione um tipo de teste"} 
                  value={null} 
                />
                {tiposTeste.map((teste) => (
                  <Picker.Item key={teste.id} label={teste.nome_teste} value={teste.id} />
                ))}
              </Picker>
            </View>

            {/* Loading das avaliações */}
            {loading && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#9C27B0" />
                <Text style={{ marginTop: 10, color: '#000' }}>Carregando avaliações...</Text>
              </View>
            )}

            {/* Estatísticas */}
            {!loading && statistics && (
              <View style={{ backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#000' }}>Resumo Geral</Text>
                <View style={{ padding: 15 }}>
                  <Text style={{ fontSize: 16, marginBottom: 8, color: '#000' }}>
                    📊 Total de Avaliações: <Text style={{ fontWeight: 'bold' }}>{statistics.totalAvaliacoes}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 8, color: '#000' }}>
                    🎯 Acurácia Média: <Text style={{ fontWeight: 'bold' }}>{statistics.acuraciaMedia}%</Text>
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 8, color: '#000' }}>
                    ✅ Total Correto: <Text style={{ fontWeight: 'bold' }}>{statistics.totalCorreto}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 8, color: '#000' }}>
                    ❌ Total Incorreto: <Text style={{ fontWeight: 'bold' }}>{statistics.totalIncorreto}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, marginBottom: 8, color: '#000' }}>
                    ⏭️ Total Omissões: <Text style={{ fontWeight: 'bold' }}>{statistics.totalOmisso}</Text>
                  </Text>
                  <Text style={{ fontSize: 16, color: '#000' }}>
                    ⏱️ Tempo Médio: <Text style={{ fontWeight: 'bold' }}>{statistics.tempoMedio}s</Text>
                  </Text>
                </View>
              </View>
            )}

            {/* Gráfico de Linha */}
            {!loading && lineChartData && (
              <View style={{ backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Evolução da Acurácia</Text>
                <LineChart
                  data={lineChartData}
                  width={screenWidth - 80}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            )}

            {/* Gráfico de Pizza */}
            {!loading && pieChartData && (
              <View style={{ backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Distribuição dos Resultados</Text>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 80}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            )}

            {/* Mensagens quando não há dados */}
            {!loading && !selectedPatient && !selectedTipoTeste && (
              <Text style={{ textAlign: 'center', padding: 40, fontSize: 16, color: '#666' }}>
                Selecione um paciente e um tipo de teste para visualizar os dados
              </Text>
            )}

            {!loading && selectedPatient && selectedTipoTeste && avaliacoes.length === 0 && (
              <Text style={{ textAlign: 'center', padding: 40, fontSize: 16, color: '#666' }}>
                Nenhuma avaliação encontrada para este paciente e tipo de teste
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};