import { supabase } from '../utils/supabase';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIsTablet } from '../utils/useIsTablet';
import type { ConcentrationTestApplicationScreenProps } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Modal,
} from 'react-native';

const TOTAL_ROUNDS      = 14;
const IMAGES_PER_ROUND  = 47;
const CORRECT_PER_ROUND = 21;
const ROUND_TIME        = 20;

interface ImageItem {
  id: string;
  src: any;
  isCorrect: boolean;
}

interface RoundResult {
  round: number;
  correctlyMarked: number;
  incorrectlyMarked: number;
  notMarked: number;
  timeSpent: number;
  timeRemaining: number;
}

const ALL_IMAGES = [
  require('../../assets/9_zero.png'),
  require('../../assets/9_uma_cima.png'),
  require('../../assets/9_uma_baixo.png'),
  require('../../assets/9_uma_cima_uma_baixo.png'),
  require('../../assets/9_duas_cima.png'),
  require('../../assets/9_duas_baixo.png'),
  require('../../assets/9_duas_cima_uma_baixo.png'),
  require('../../assets/9_uma_cima_duas_baixo.png'),
  require('../../assets/9_duas_cima_duas_baixo.png'),
  require('../../assets/6_zero.png'),
  require('../../assets/6_uma_cima.png'),
  require('../../assets/6_uma_baixo.png'),
  require('../../assets/6_uma_cima_uma_baixo.png'),
  require('../../assets/6_duas_cima.png'),
  require('../../assets/6_duas_baixo.png'),
  require('../../assets/6_duas_cima_uma_baixo.png'),
  require('../../assets/6_uma_cima_duas_baixo.png'),
  require('../../assets/6_duas_cima_duas_baixo.png'),
];

const CORRECT_IMAGES = [
  require('../../assets/9_uma_cima_uma_baixo.png'),
  require('../../assets/9_duas_cima.png'),
  require('../../assets/9_duas_baixo.png'),
];

const randomIndex = (max: number) => Math.floor(Math.random() * max);

const buildRoundImages = (): ImageItem[] => {
  const items: ImageItem[] = [];

  for (let i = 0; i < CORRECT_PER_ROUND; i++) {
    items.push({
      id: `c_${i}`,
      src: CORRECT_IMAGES[randomIndex(CORRECT_IMAGES.length)],
      isCorrect: true,
    });
  }

  const incorrectPool = ALL_IMAGES.filter(img => !CORRECT_IMAGES.includes(img));
  const incorrectCount = IMAGES_PER_ROUND - CORRECT_PER_ROUND;
  for (let i = 0; i < incorrectCount; i++) {
    items.push({ id: `w_${i}`, src: incorrectPool[randomIndex(incorrectPool.length)], isCorrect: false });
  }

  for (let i = items.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
};

const ConcentrationTestApplicationScreen = ({ navigation, route }: ConcentrationTestApplicationScreenProps) => {
  const { testId, testName, patientId } = route.params;
  const isTablet = useIsTablet();
  const insets = useSafeAreaInsets();

  const [currentRound, setCurrentRound]         = useState(1);
  const [roundImages, setRoundImages]           = useState<ImageItem[]>([]);
  const [markedIds, setMarkedIds]               = useState<string[]>([]);
  const [remainingTime, setRemainingTime]       = useState(ROUND_TIME);
  const [roundResults, setRoundResults]         = useState<RoundResult[]>([]);
  const [saving, setSaving]                     = useState(false);
  const [testFinished, setTestFinished]         = useState(false);
  const [idAvaliacao, setIdAvaliacao]           = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const scaleAnim        = useRef(new Animated.Value(1)).current;
  const processingRef    = useRef(false);
  const markedIdsRef     = useRef<string[]>([]);
  const roundImagesRef   = useRef<ImageItem[]>([]);
  const remainingTimeRef = useRef(ROUND_TIME);
  const idAvaliacaoRef   = useRef<number | null>(null);
  const roundResultsRef  = useRef<RoundResult[]>([]);
  const currentRoundRef  = useRef(1);
  const testFinishedRef  = useRef(false);
  const savingRef        = useRef(false);

  useEffect(() => { markedIdsRef.current     = markedIds; },      [markedIds]);
  useEffect(() => { roundImagesRef.current   = roundImages; },    [roundImages]);
  useEffect(() => { remainingTimeRef.current = remainingTime; },  [remainingTime]);
  useEffect(() => { idAvaliacaoRef.current   = idAvaliacao; },    [idAvaliacao]);
  useEffect(() => { roundResultsRef.current  = roundResults; },   [roundResults]);
  useEffect(() => { currentRoundRef.current  = currentRound; },   [currentRound]);
  useEffect(() => { testFinishedRef.current  = testFinished; },   [testFinished]);
  useEffect(() => { savingRef.current        = saving; },         [saving]);

  useEffect(() => {
    const createAvaliacao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Não Autenticado', 'Você precisa estar autenticado para realizar testes', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('avaliacoes')
        .insert({
          id_paciente:          parseInt(patientId),
          id_tipo_teste:        parseInt(testId),
          data_aplicacao:       new Date().toISOString(),
          resultado_correto:    0,
          resultado_incorreto:  0,
          resultado_omisso:     0,
          tempo_realizacao:     0,
          observacoes_clinicas: `Teste: ${testName} | ${TOTAL_ROUNDS} rodadas`,
        })
        .select('id')
        .single();

      if (error || !data) {
        Alert.alert('Erro', 'Não foi possível iniciar o teste. Tente novamente.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }

      setIdAvaliacao(data.id);
      idAvaliacaoRef.current = data.id;
    };

    createAvaliacao();
  }, []);

  useEffect(() => {
    const images = buildRoundImages();
    setRoundImages(images);
    roundImagesRef.current = images;
    setMarkedIds([]);
    markedIdsRef.current = [];
    setRemainingTime(ROUND_TIME);
    remainingTimeRef.current = ROUND_TIME;
    processingRef.current = false;
  }, [currentRound]);

  useEffect(() => {
    if (testFinished || saving) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        const next = prev - 1;
        remainingTimeRef.current = next;
        if (next <= 0) {
          clearInterval(interval);
          handleRoundEndRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRound, testFinished, saving]);

  const toggleMarked = (id: string) => {
    if (testFinished || saving) return;

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();

    setMarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      markedIdsRef.current = next;
      return next;
    });
  };

  const calcResult = useCallback(
    (images: ImageItem[], marked: string[], timeRemaining: number, round: number): RoundResult => {
      const corrects   = images.filter(i => i.isCorrect);
      const incorrects = images.filter(i => !i.isCorrect);
      return {
        round,
        correctlyMarked:   corrects.filter(i => marked.includes(i.id)).length,
        incorrectlyMarked: incorrects.filter(i => marked.includes(i.id)).length,
        notMarked:         corrects.filter(i => !marked.includes(i.id)).length,
        timeSpent:         ROUND_TIME - timeRemaining,
        timeRemaining,
      };
    },
    [],
  );

  const saveRodada = useCallback(async (result: RoundResult, avaliacaoId: number) => {
    const { error } = await supabase.from('avaliacoes_rodadas').insert({
      id_avaliacao:        avaliacaoId,
      rodada:              result.round,
      resultado_correto:   result.correctlyMarked,
      resultado_incorreto: result.incorrectlyMarked,
      resultado_omisso:    result.notMarked,
      tempo_restante:      result.timeRemaining,
    });
    if (error) console.warn(`Erro ao salvar rodada ${result.round}:`, error);
  }, []);

  const finalizarTeste = useCallback(async (results: RoundResult[]) => {
    if (savingRef.current) return;
    setSaving(true);
    savingRef.current = true;
    setTestFinished(true);
    testFinishedRef.current = true;

    try {
      const { error } = await supabase
        .from('avaliacoes')
        .update({
          resultado_correto:   results.reduce((s, r) => s + r.correctlyMarked,   0),
          resultado_incorreto: results.reduce((s, r) => s + r.incorrectlyMarked, 0),
          resultado_omisso:    results.reduce((s, r) => s + r.notMarked,         0),
          tempo_realizacao:    results.reduce((s, r) => s + r.timeSpent,         0),
        })
        .eq('id', idAvaliacaoRef.current);

      if (error) throw error;

      setShowCompletionModal(true);
    } catch (error: any) {
      const msg = error?.message ?? (error?.code === '42501' ? 'Sem permissão para salvar esta avaliação.' : 'Erro desconhecido');
      Alert.alert('Erro ao Finalizar', msg, [
        { text: 'Tentar Novamente', onPress: () => finalizarTeste(results) },
        { text: 'Cancelar', style: 'cancel', onPress: () => { setSaving(false); savingRef.current = false; navigation.goBack(); } },
      ]);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, []);

  const handleRoundEnd = useCallback(() => {
    if (processingRef.current || testFinishedRef.current || savingRef.current) return;
    processingRef.current = true;

    const time   = remainingTimeRef.current;
    const marked = markedIdsRef.current;
    const images = roundImagesRef.current;
    const round  = currentRoundRef.current;

    const result  = calcResult(images, marked, time, round);
    const updated = [...roundResultsRef.current, result];

    setRoundResults(updated);
    roundResultsRef.current = updated;

    if (idAvaliacaoRef.current) {
      saveRodada(result, idAvaliacaoRef.current);
    }

    if (round >= TOTAL_ROUNDS) {
      finalizarTeste(updated);
    } else {
      setCurrentRound(r => r + 1);
      currentRoundRef.current = round + 1;
    }
  }, [calcResult, saveRodada, finalizarTeste]);

  const handleRoundEndRef = useRef(handleRoundEnd);
  useEffect(() => { handleRoundEndRef.current = handleRoundEnd; }, [handleRoundEnd]);

  const handleNext = () => {
    if (testFinished || saving) return;
    handleRoundEnd();
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Teste',
      'Deseja realmente cancelar? Os dados NÃO serão salvos.',
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Cancelar', style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  };

  const isLastRound = currentRound >= TOTAL_ROUNDS;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.testTitle} numberOfLines={1}>{testName}</Text>
        <View style={styles.roundBadge}>
          <Text style={styles.roundLabel}>RODADA</Text>
          <Text style={styles.roundValue}>{currentRound} / {TOTAL_ROUNDS}</Text>
        </View>
      </View>

      <View style={styles.dotsRow}>
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i + 1 < currentRound  && styles.dotDone,
              i + 1 === currentRound && styles.dotCurrent,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.gridArea}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {roundImages.map(item => {
            const marked = markedIds.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleMarked(item.id)}
                style={[styles.cell, marked && styles.cellMarked]}
                activeOpacity={0.75}
                disabled={testFinished || saving}
              >
                <Image source={item.src} style={styles.cellImage} resizeMode="contain" />
                {marked && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.btnCancel, saving && styles.btnDisabled]}
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.btnCancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnNext, isLastRound && styles.btnConclude, saving && styles.btnDisabled]}
          onPress={handleNext}
          disabled={saving || testFinished}
          activeOpacity={0.8}
        >
          <Text style={styles.btnNextText}>
            {saving ? 'Salvando...' : isLastRound ? 'Concluir ✓' : 'Próximo →'}
          </Text>
        </TouchableOpacity>
      </View>

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
            padding: 32,
            alignItems: 'center',
            width: '100%',
            maxWidth: 340,
          }}>
            <Image
              source={require('../../assets/cognitive_end.png')}
              style={{ width: 220, height: 220, resizeMode: 'contain', marginBottom: 24 }}
            />
            <TouchableOpacity
              style={[styles.btnNext, styles.btnConclude, { width: '100%', paddingVertical: 14 }]}
              onPress={() => {
                setShowCompletionModal(false);
                navigation.navigate('Home');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnNextText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight ?? 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  testTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
  },
  roundBadge: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  roundLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
  },
  roundValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
  },
  dotDone: {
    backgroundColor: '#34D399',
  },
  dotCurrent: {
    backgroundColor: '#A78BFA',
    transform: [{ scale: 1.3 }],
  },
  gridArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gridContent: {
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 6,
  },
  cell: {
    width: 62,
    height: 62,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cellMarked: {
    borderColor: '#34D399',
    backgroundColor: '#F0FDF4',
  },
  cellImage: {
    width: 52,
    height: 52,
  },
  checkBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  btnNext: {
    flex: 2,
    backgroundColor: '#A78BFA',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnConclude: {
    backgroundColor: '#34D399',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnNextText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default ConcentrationTestApplicationScreen;