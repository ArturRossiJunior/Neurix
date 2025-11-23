import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text, Alert, Animated } from 'react-native';
import type { TestApplicationScreenProps } from '../navigation/types';
import { Button } from '../components/Button';
import { createTestsStyles } from '../components/styles/tests.styles';
import { supabase } from '../utils/supabase';
import { useAuth } from '../../AuthContext'; // Importar o useAuth

const { width } = Dimensions.get('window');

const TestApplicationScreen = ({ navigation, route }: TestApplicationScreenProps) => {
  const { testId, testName, patientId } = route.params;
  const { professionalId } = useAuth(); // Pegar o professionalId do contexto
  const isTablet = width >= 768;
  const styles = createTestsStyles(isTablet);

  // Configurações do teste
  const TEMPO_LIMITE = 90; //Tempo em segundos
  const TOTAL_IMAGENS = 180;

  const imagens = [
    require('../../assets/ondas1.png'),
    require('../../assets/ondas2.png'),
    require('../../assets/ondas3.png'),
    require('../../assets/ondas4.png'),
    require('../../assets/ondas5.png'),
    require('../../assets/ondas6.png'),
    require('../../assets/ondav0.png'),
    require('../../assets/ondav1.png'),
    require('../../assets/ondav2.png'),
    require('../../assets/ondav3.png'),
    require('../../assets/ondav4.png'),
    require('../../assets/ondav5.png'),
    require('../../assets/ondav6.png'),
    require('../../assets/ondav7.png'),
    require('../../assets/ondav8.png'),
    require('../../assets/ondav9.png'),
    require('../../assets/ondav10.png'),
    require('../../assets/ondav11.png'),
    require('../../assets/sol1.png'),
    require('../../assets/sol2.png'),
    require('../../assets/sol3.png'),
    require('../../assets/sol4.png'),
    require('../../assets/sol5.png'),
    require('../../assets/sol6.png'),
  ];

  const [imagensRandom, setImagensRandom] = useState<{ id: string; src: any; isCorreto: boolean }[]>([]);
  const [marcadas, setMarcadas] = useState<string[]>([]);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_LIMITE);
  const [testeIniciado, setTesteIniciado] = useState(false);
  const [testeFinalizado, setTesteFinalizado] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [salvando, setSalvando] = useState(false);
  const [imagemModelo, setImagemModelo] = useState(0);

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert(
          'Não Autenticado',
          'Você precisa estar autenticado para realizar testes.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    };
    
    checkAuth();
  }, []);

  // Inicializa as imagens com sequência
  useEffect(() => {
    const gerarSequencia = () => {
      const sequencia: number[] = [];
      const totalTipos = imagens.length;
      const porTipo = Math.floor(TOTAL_IMAGENS / totalTipos);
      const resto = TOTAL_IMAGENS % totalTipos;
      
      for (let tipo = 0; tipo < totalTipos; tipo++) {
        const quantidade = tipo < resto ? porTipo + 1 : porTipo;
        for (let i = 0; i < quantidade; i++) {
          sequencia.push(tipo);
        }
      }
      
      for (let i = sequencia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequencia[i], sequencia[j]] = [sequencia[j], sequencia[i]];
      }
      
      return sequencia;
    };

    const sequenciaFixa = gerarSequencia();
    const imagensPermitidas = Array.from({ length: 18 }, (_, i) => i);
    const imagemCorreta = imagensPermitidas[Math.floor(Math.random() * imagensPermitidas.length)];

    const imagensFixas = sequenciaFixa.map((index, idx) => ({
      id: `img_${idx}`,
      src: imagens[index],
      isCorreto: index === imagemCorreta
    }));

    setImagensRandom(imagensFixas);
    setImagemModelo(imagemCorreta);
    setTesteIniciado(true);
  }, []);

  // Temporizador
  useEffect(() => {
    if (!testeIniciado || testeFinalizado) return;

    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          finalizarTeste();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testeIniciado, testeFinalizado]);

  const toggleMarcada = (id: string) => {
    if (testeFinalizado) return;
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setMarcadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calcularResultados = () => {
    const corretas = imagensRandom.filter(img => img.isCorreto);
    const incorretas = imagensRandom.filter(img => !img.isCorreto);

    const marcadasCorretamente = corretas.filter(img => marcadas.includes(img.id)).length;
    const marcadasIncorretamente = incorretas.filter(img => marcadas.includes(img.id)).length;
    const naoMarcadas = corretas.filter(img => !marcadas.includes(img.id)).length;

    const tempoGasto = TEMPO_LIMITE - tempoRestante;

    return {
      totalCorretas: corretas.length,
      marcadasCorretamente,
      marcadasIncorretamente,
      naoMarcadas,
      totalMarcadas: marcadas.length,
      acuracia: corretas.length > 0 ? ((marcadasCorretamente / corretas.length) * 100).toFixed(1) : '0',
      tempoGasto,
      tempoTotal: TEMPO_LIMITE
    };
  };

  const salvarResultadosSupabase = async (resultados: any) => {
    if (salvando) return; // Previne múltiplos salvamentos
    
    setSalvando(true);
    
    try {
      // Verificar autenticação
      console.log('🔐 Verificando autenticação...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Erro ao verificar sessão:', sessionError);
        throw new Error('Erro ao verificar autenticação');
      }
      
      if (!session) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Você precisa estar autenticado para salvar avaliações');
      }
      
      console.log('✅ Usuário autenticado:', session.user.id);
      console.log('✅ Professional ID:', professionalId);

      // Verificar se o paciente pertence ao profissional
      console.log('🔍 Verificando permissão do paciente...');
      const { data: patientData, error: patientError } = await supabase
        .from('pacientes')
        .select('id, id_profissional')
        .eq('id', patientId)
        .single();

      if (patientError) {
        console.error('❌ Erro ao buscar paciente:', patientError);
        throw new Error('Paciente não encontrado');
      }

      if (!patientData) {
        throw new Error('Paciente não encontrado');
      }

      console.log('✅ Paciente encontrado:', patientData);

      // Dados a serem enviados ao Supabase
      const dadosParaSalvar = {
        id_paciente: parseInt(patientId),
        id_tipo_teste: parseInt(testId),
        data_aplicacao: new Date().toISOString(),
        resultado_correto: resultados.marcadasCorretamente,
        resultado_incorreto: resultados.marcadasIncorretamente,
        resultado_omisso: resultados.naoMarcadas,
        tempo_realizacao: parseInt(resultados.tempoGasto.toString()),
        observacoes_clinicas: `Teste: ${testName} | Acurácia: ${resultados.acuracia}% | Total marcadas: ${resultados.totalMarcadas}/${TOTAL_IMAGENS}`,
      };

      console.log('📤 Enviando dados:', dadosParaSalvar);

      // Inserir os dados no Supabase
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert(dadosParaSalvar)
        .select();

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }

      console.log('✅ Resultados salvos com sucesso:', data);
      
      // Mostrar mensagem de sucesso
      Alert.alert(
        '✅ Sucesso',
        'Teste finalizado e resultados salvos com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home');
            }
          }
        ]
      );

      return data;
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar resultados:', error);
      
      let errorMessage = 'Erro desconhecido';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '42501') {
        errorMessage = 'Você não tem permissão para salvar esta avaliação. Verifique se o paciente pertence a você.';
      } else if (error.code === '23503') {
        errorMessage = 'Paciente ou tipo de teste inválido.';
      }
      
      Alert.alert(
        '❌ Erro ao Salvar',
        errorMessage,
        [
          { 
            text: 'Tentar Novamente', 
            onPress: () => salvarResultadosSupabase(resultados) 
          },
          { 
            text: 'Cancelar', 
            style: 'cancel',
            onPress: () => {
              setSalvando(false);
              navigation.goBack();
            }
          }
        ]
      );
      
      throw error;
    } finally {
      setSalvando(false);
    }
  };

  const finalizarTeste = async () => {
    if (testeFinalizado || salvando) return; // Previne múltiplas execuções
    
    setTesteFinalizado(true);
    
    const resultados = calcularResultados();
    console.log('Teste finalizado - Resultados:', resultados);
    
    try {
      await salvarResultadosSupabase(resultados);
    } catch (error) {
      console.error('Erro ao finalizar teste:', error);
      // O erro já é tratado dentro de salvarResultadosSupabase
    }
  };

  const handleConfirmSelection = () => {
    if (testeFinalizado || salvando) {
      return;
    }

    Alert.alert(
      '⏸️ Finalizar Teste',
      'Tem certeza que deseja finalizar o teste? Os resultados serão salvos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Finalizar', onPress: finalizarTeste, style: 'destructive' }
      ]
    );
  };

  const handleCancelTest = () => {
    Alert.alert(
      '❌ Cancelar Teste',
      'Deseja realmente cancelar? Os dados NÃO serão salvos.',
      [
        { text: 'Continuar Teste', style: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          onPress: () => navigation.goBack(),
          style: 'destructive' 
        }
      ]
    );
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9E6' }}>
      <View style={customStyles.headerContainer}>
        <Text style={customStyles.titleText}>
          {testName}
        </Text>

        {/* Contador de tempo */}
        <View style={customStyles.contadorContainer}>
          <Text style={customStyles.contadorText}>
            ⏱️ Tempo: {formatarTempo(tempoRestante)}
          </Text>
        </View>

        <View style={customStyles.modeloContainer}>
          <Text style={customStyles.modeloLabel}>
            Encontre todos iguais a este:
          </Text>
          <View style={customStyles.modeloImageWrapper}>
            <Image 
              source={imagens[imagemModelo]} 
              style={customStyles.modeloImage}
            />
            <View style={customStyles.setaIndicadora}>
              <Text style={customStyles.setaText}>⬇️</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={customStyles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={customStyles.instrucaoText}>
          Toque nas figuras que são iguais ao modelo acima!
        </Text>

        <View style={customStyles.gridContainer}>
          {imagensRandom.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleMarcada(item.id)}
              style={[
                customStyles.imageWrapper,
                marcadas.includes(item.id) && customStyles.imageWrapperMarcada
              ]}
              activeOpacity={0.7}
              disabled={testeFinalizado || salvando}
            >
              <Image source={item.src} style={customStyles.image} />
              {marcadas.includes(item.id) && (
                <View style={customStyles.marcaContainer}>
                  <Text style={customStyles.marcaText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={customStyles.buttonsContainer}>
          <Button
            variant="default"
            size="default"
            onPress={handleCancelTest}
            style={customStyles.cancelButton}
            disabled={salvando}
          >
            Cancelar
          </Button>

          <Button
            variant="game"
            size="default"
            onPress={handleConfirmSelection}
            style={customStyles.finalizarButton}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Finalizar Teste'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const customStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#F3E5F5',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#CE93D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#9C27B0',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contadorContainer: {
    backgroundColor: '#9C27B0',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B1FA2',
  },
  contadorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modeloContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#BA68C8',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modeloLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#9C27B0',
    textAlign: 'center',
  },
  modeloImageWrapper: {
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#F3E5F5',
    position: 'relative',
  },
  modeloImage: {
    width: width / 10,
    height: width / 10,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  setaIndicadora: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
  },
  setaText: {
    fontSize: 30,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
  },
  instrucaoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#9C27B0',
    paddingHorizontal: 10,
    fontWeight: 'bold',
    backgroundColor: '#F3E5F5',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CE93D8',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  imageWrapper: {
    position: 'relative',
    margin: 3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 2,
  },
  imageWrapperMarcada: {
    borderColor: '#4CAF50',
    borderWidth: 3,
    backgroundColor: '#E8F5E9',
    transform: [{ scale: 0.95 }],
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  marcaContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  marcaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 20,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  finalizarButton: {
    flex: 1,
    backgroundColor: '#BA68C8',
  },
});

export default TestApplicationScreen;