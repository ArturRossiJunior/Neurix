import { Alert, ImageSourcePropType } from 'react-native';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import type { ConcentrationTestPreparationScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';

const TOTAL_ROUNDS = 14;
const ROUND_TIME = 20;
const TOTAL_SECONDS = TOTAL_ROUNDS * ROUND_TIME;
const TOTAL_MIN = Math.floor(TOTAL_SECONDS / 60);
const TOTAL_SEC = TOTAL_SECONDS % 60;

const ConcentrationTestPreparationScreen = ({ navigation, route }: ConcentrationTestPreparationScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createTestsStyles(isTablet);
  const { testId, testName, patientId, patientName } = route.params;
  const [showInstructions, setShowInstructions] = useState(false);
  const CORRECT_IMAGES: ImageSourcePropType[] = [
    require('../../assets/9_uma_cima_uma_baixo.png'),
    require('../../assets/9_duas_cima.png'),
    require('../../assets/9_duas_baixo.png'),
  ];

  React.useEffect(() => {
    if (!patientId) {
      Alert.alert(
        'Erro',
        'ID do paciente não foi recebido. Por favor, volte e selecione um paciente',
        [{ text: 'OK' }]
      );
    }
  }, [patientId]);

  const handleStartTest = () => {
    navigation.navigate('ConcentrationTestApplication', {
      testId,
      testName,
      patientId,
    });
  };

  if (!showInstructions) {
    return (
      <View style={styles.preparationContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Preparado para começar?</Text>

          <Text style={styles.subtitle}>
            {patientName}
          </Text>

          <Text style={styles.testNamePreparation}>
            {testName}
          </Text>

          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/cognitive.png')}
              style={styles.cogniImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.instructions}>
            Ajude o Detetive Cogni a encontrar as pistas certas antes que a festa comece!
          </Text>

          <Button
            variant="default"
            size="default"
            onPress={() => setShowInstructions(true)}
            style={styles.startButtonPreparation}
          >
            Começar Teste
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.preparationContainer}>
      <ScrollView
        style={styles.instructionsContainer}
        contentContainerStyle={styles.instructionsContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.storyTitle}>Detetive Cogni: O Caso do Bolo Perdido</Text>

        <Text style={styles.storyText}>
          Hoje é dia de festa! O Detetive Cogni estava indo comemorar com os amigos, mas aconteceu algo inesperado: o bolo sumiu!
        </Text>

        <Text style={styles.storyText}>
          Agora ele precisa da sua ajuda para encontrar o bolo antes que a festa comece.
        </Text>

        <Text style={styles.sectionTitle}>Sua Missão</Text>

        <Text style={styles.storyText}>
          O bolo deixou várias pistas pelo caminho, mas só uma é a correta.
        </Text>

        <Text style={styles.storyText}>
          A pista certa é o número 9 com duas bolinhas. Elas podem estar em cima, embaixo ou misturadas!
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
          {CORRECT_IMAGES.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={{ width: 60, height: 60, marginHorizontal: 5 }}
              resizeMode="contain"
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Fique Atento</Text>

        <Text style={styles.storyText}>
          Existem pistas parecidas que podem te confundir: o 9 com uma bolinha, o 9 com três bolinhas e até números que parecem o 9, como o 6.
        </Text>

        <View style={durationStyles.durationBox}>
          <Text style={durationStyles.durationIcon}>⏱</Text>
          <View>
            <Text style={durationStyles.durationLabel}>Tempo total do teste</Text>
            <Text style={durationStyles.durationValue}>
              {TOTAL_ROUNDS} rodadas × {ROUND_TIME}s = {TOTAL_MIN}min {TOTAL_SEC > 0 ? `${TOTAL_SEC}s` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.buttonAndImageContainer}>
          <Button
            variant="default"
            size="default"
            onPress={handleStartTest}
            style={styles.letsGoButton}
          >
            Vamos lá!
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const durationStyles = StyleSheet.create({
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  durationIcon: {
    fontSize: 28,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
    marginTop: 2,
  },
});

export default ConcentrationTestPreparationScreen;