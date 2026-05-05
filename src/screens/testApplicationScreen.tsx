import { supabase } from '../utils/supabase';
import { Button } from '../components/Button';
import React, { useState, useEffect } from 'react';
import { useIsTablet } from '../utils/useIsTablet';
import type { TestApplicationScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Image, TouchableOpacity, ScrollView, Text, Alert, Animated, Modal, useWindowDimensions } from 'react-native';

const TestApplicationScreen = ({ navigation, route }: TestApplicationScreenProps) => {
  const { testId, testName, patientId } = route.params;
  const isTablet = useIsTablet();
  const styles = createTestsStyles(isTablet);
  const { width: winWidth, height: winHeight } = useWindowDimensions();

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
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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

      setShowCompletionModal(true);

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
      'Finalizar Teste',
      'Tem certeza que deseja finalizar o teste? Os resultados serão salvos',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Finalizar', onPress: finishTest, style: 'destructive' }
      ]
    );
  };

  const handleCancelTest = () => {
    Alert.alert(
      'Cancelar Teste',
      'Deseja realmente cancelar? Os dados NÃO serão salvos',
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Cancelar',
          onPress: () => navigation.goBack(),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.applicationContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>
          {testName}
        </Text>

        <View style={styles.modelContainer}>
          <Text style={styles.modelLabel}>
            Encontre todos iguais a este:
          </Text>
          <View style={styles.modelImageWrapper}>
            <Image
              source={images[modelImage]}
              style={styles.modelImage}
            />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.instructionText}>
          Toque nas figuras que são iguais ao modelo acima!
        </Text>

        <View style={styles.gridContainer}>
          {randomImages.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleMarked(item.id)}
              style={[
                styles.imageWrapper,
                markedImages.includes(item.id) && styles.imageWrapperMarked
              ]}
              activeOpacity={0.7}
              disabled={testFinished || saving}
            >
              <Image source={item.src} style={styles.image} />
              {markedImages.includes(item.id) && (
                <View style={styles.markContainer}>
                  <Text style={styles.markText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            variant="default"
            size="default"
            onPress={handleCancelTest}
            style={styles.cancelButton}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            variant="game"
            size="default"
            onPress={handleConfirmSelection}
            style={styles.finishButton}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Finalizar Teste'}
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            width: '100%',
            maxWidth: isTablet ? 500 : 380,
          }}>
            <Image
              source={require('../../assets/astrocogni_end.png')}
              style={{
                width: winWidth * 0.8,
                height: winHeight * 0.6,
                resizeMode: 'contain',
                marginBottom: 20,
              }}
            />
            <Button
              variant="game"
              size="default"
              onPress={() => {
                setShowCompletionModal(false);
                navigation.navigate('Home');
              }}
              style={{ width: '100%' }}
            >
              Concluir
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TestApplicationScreen;