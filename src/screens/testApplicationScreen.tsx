import { useAuth } from '../../AuthContext';
import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import React, { useState, useEffect } from 'react';
import type { TestApplicationScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text, Alert, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const TestApplicationScreen = ({ navigation, route }: TestApplicationScreenProps) => {
  const { testId, testName, patientId } = route.params;
  const { professionalId } = useAuth();
  const isTablet = width >= 768;
  const styles = createTestsStyles(isTablet);

  const TIME_LIMIT = 90;
  const TOTAL_IMAGES = 180;

  const images = [
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

  const [randomImages, setRandomImages] = useState<{ id: string; src: any; isCorrect: boolean }[]>([]);
  const [markedImages, setMarkedImages] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState(TIME_LIMIT);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [saving, setSaving] = useState(false);
  const [modelImage, setModelImage] = useState(0);

  useEffect(() => {
    const checkAuthentication = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert(
          'Não Autenticado',
          'Você precisa estar autenticado para realizar testes',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    };
    
    checkAuthentication();
  }, []);

  useEffect(() => {
    const generateSequence = () => {
      const sequence: number[] = [];
      const totalTypes = images.length;
      const perType = Math.floor(TOTAL_IMAGES / totalTypes);
      const remainder = TOTAL_IMAGES % totalTypes;
      
      for (let type = 0; type < totalTypes; type++) {
        const quantity = type < remainder ? perType + 1 : perType;
        for (let i = 0; i < quantity; i++) {
          sequence.push(type);
        }
      }
      
      for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
      }
      
      return sequence;
    };

    const fixedSequence = generateSequence();
    const allowedImages = Array.from({ length: 18 }, (_, i) => i);
    const correctImage = allowedImages[Math.floor(Math.random() * allowedImages.length)];

    const fixedImages = fixedSequence.map((index, idx) => ({
      id: `img_${idx}`,
      src: images[index],
      isCorrect: index === correctImage
    }));

    setRandomImages(fixedImages);
    setModelImage(correctImage);
    setTestStarted(true);
  }, []);

  useEffect(() => {
    if (!testStarted || testFinished) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testStarted, testFinished]);

  const toggleMarked = (id: string) => {
    if (testFinished) return;
    
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
    
    setMarkedImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calculateResults = () => {
    const correctImages = randomImages.filter(img => img.isCorrect);
    const incorrectImages = randomImages.filter(img => !img.isCorrect);

    const correctlyMarked = correctImages.filter(img => markedImages.includes(img.id)).length;
    const incorrectlyMarked = incorrectImages.filter(img => markedImages.includes(img.id)).length;
    const notMarked = correctImages.filter(img => !markedImages.includes(img.id)).length;

    const timeSpent = TIME_LIMIT - remainingTime;

    return {
      totalCorrect: correctImages.length,
      correctlyMarked,
      incorrectlyMarked,
      notMarked,
      totalMarked: markedImages.length,
      accuracy: correctImages.length > 0 ? ((correctlyMarked / correctImages.length) * 100).toFixed(1) : '0',
      timeSpent,
      totalTime: TIME_LIMIT
    };
  };

  const saveResultsToSupabase = async (results: any) => {
    if (saving) return;
    setSaving(true);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Erro ao verificar autenticação');
      }
      
      if (!session) {
        throw new Error('Você precisa estar autenticado para salvar avaliações');
      }
      
      const { data: patientData, error: patientError } = await supabase
        .from('pacientes')
        .select('id, id_profissional')
        .eq('id', patientId)
        .single();

      if (patientError) {
        throw new Error('Paciente não encontrado');
      }

      if (!patientData) {
        throw new Error('Paciente não encontrado');
      }

      const dataToSave = {
        id_paciente: parseInt(patientId),
        id_tipo_teste: parseInt(testId),
        data_aplicacao: new Date().toISOString(),
        resultado_correto: results.correctlyMarked,
        resultado_incorreto: results.incorrectlyMarked,
        resultado_omisso: results.notMarked,
        tempo_realizacao: parseInt(results.timeSpent.toString()),
        observacoes_clinicas: `Teste: ${testName} | Acurácia: ${results.accuracy}% | Total marcadas: ${results.totalMarked}/${TOTAL_IMAGES}`,
      };

      const { data, error } = await supabase
        .from('avaliacoes')
        .insert(dataToSave)
        .select();

      if (error) {
        throw error;
      }

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
      let errorMessage = 'Erro desconhecido';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '42501') {
        errorMessage = 'Você não tem permissão para salvar esta avaliação. Verifique se o paciente pertence a você';
      } else if (error.code === '23503') {
        errorMessage = 'Paciente ou tipo de teste inválido';
      }
      
      Alert.alert(
        'Erro ao Salvar',
        errorMessage,
        [
          { 
            text: 'Tentar Novamente', 
            onPress: () => saveResultsToSupabase(results) 
          },
          { 
            text: 'Cancelar', 
            style: 'cancel',
            onPress: () => {
              setSaving(false);
              navigation.goBack();
            }
          }
        ]
      );
      
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const finishTest = async () => {
    if (testFinished || saving) return;
    setTestFinished(true);
    const results = calculateResults();
    
    try {
      await saveResultsToSupabase(results);
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmSelection = () => {
    if (testFinished || saving) {
      return;
    }

    Alert.alert(
      '⏸️ Finalizar Teste',
      'Tem certeza que deseja finalizar o teste? Os resultados serão salvos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Finalizar', onPress: finishTest, style: 'destructive' }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9E6' }}>
      <View style={customStyles.headerContainer}>
        <Text style={customStyles.titleText}>
          {testName}
        </Text>

        <View style={customStyles.timerContainer}>
          <Text style={customStyles.timerText}>
            ⏱️ Tempo: {formatTime(remainingTime)}
          </Text>
        </View>

        <View style={customStyles.modelContainer}>
          <Text style={customStyles.modelLabel}>
            Encontre todos iguais a este:
          </Text>
          <View style={customStyles.modelImageWrapper}>
            <Image 
              source={images[modelImage]} 
              style={customStyles.modelImage}
            />
            <View style={customStyles.arrowIndicator}>
              <Text style={customStyles.arrowText}>⬇️</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={customStyles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={customStyles.instructionText}>
          Toque nas figuras que são iguais ao modelo acima!
        </Text>

        <View style={customStyles.gridContainer}>
          {randomImages.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleMarked(item.id)}
              style={[
                customStyles.imageWrapper,
                markedImages.includes(item.id) && customStyles.imageWrapperMarked
              ]}
              activeOpacity={0.7}
              disabled={testFinished || saving}
            >
              <Image source={item.src} style={customStyles.image} />
              {markedImages.includes(item.id) && (
                <View style={customStyles.markContainer}>
                  <Text style={customStyles.markText}>✓</Text>
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
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            variant="game"
            size="default"
            onPress={handleConfirmSelection}
            style={customStyles.finishButton}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Finalizar Teste'}
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
  timerContainer: {
    backgroundColor: '#9C27B0',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B1FA2',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modelContainer: {
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
  modelLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#9C27B0',
    textAlign: 'center',
  },
  modelImageWrapper: {
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#F3E5F5',
    position: 'relative',
  },
  modelImage: {
    width: width / 10,
    height: width / 10,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  arrowIndicator: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
  },
  arrowText: {
    fontSize: 30,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
  },
  instructionText: {
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
  imageWrapperMarked: {
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
  markContainer: {
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
  markText: {
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
  finishButton: {
    flex: 1,
    backgroundColor: '#BA68C8',
  },
});

export default TestApplicationScreen;