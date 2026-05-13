import { Alert } from 'react-native';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import type { TestPreparationScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';

const TASI_TIME_LIMIT = 90; // segundos
const TASI_MIN = Math.floor(TASI_TIME_LIMIT / 60);
const TASI_SEC = TASI_TIME_LIMIT % 60;

const TestPreparationScreen = ({ navigation, route }: TestPreparationScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createTestsStyles(isTablet);
  const { testId, testName, patientId, patientName } = route.params;
  const [showInstructions, setShowInstructions] = useState(false);

  React.useEffect(() => {
    if (!patientId) {
      Alert.alert(
        'Erro',
        'ID do paciente não foi recebido. Por favor, volte e selecione um paciente',
        [
          { text: 'OK', onPress: () => console.log('Erro de patientId confirmado') }
        ]
      );
    }
  }, [testId, testName, patientId, patientName]);

  const handleStartTest = () => {
    navigation.navigate('TestApplication', {
      testId,
      testName,
      patientId,
    });
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
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
              source={require('../../assets/astrocogni.png')}
              style={styles.cogniImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.instructions}>
            Encontre todas as figuras iguais ao modelo que será mostrado.
            Toque nas figuras para marcá-las!
          </Text>

          <Button
            variant="default"
            size="default"
            onPress={handleShowInstructions}
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
        <Text style={styles.storyTitle}>O Caminho para o Parque Estelar</Text>

        <Text style={styles.storyText}>
          O astronauta Cogni está viajando pelo espaço para chegar ao Parque Estelar, um lugar cheio de brincadeiras e aventuras.
        </Text>

        <Text style={styles.storyText}>
          E ele quer muito que você seja o copiloto nessa jornada!
        </Text>

        <Text style={styles.sectionTitle}>Sua Missão Especial</Text>

        <Text style={styles.storyText}>
          No painel da nave aparece o <Text style={styles.highlight}>Símbolo Guia</Text>.
        </Text>

        <Text style={styles.storyText}>
          Esse símbolo mostra o caminho seguro para continuar a viagem.
        </Text>

        <Text style={styles.storyText}>
          Pelo espaço, existem vários outros símbolos. Alguns parecem iguais, outros são bem diferentes.
        </Text>

        <Text style={styles.storyText}>
          Seu trabalho é observar com calma e descobrir quais símbolos são iguais ao Símbolo Guia.
        </Text>

        <View style={durationStyles.durationBox}>
          <Text style={durationStyles.durationIcon}>⏱</Text>
          <View>
            <Text style={durationStyles.durationLabel}>Tempo total do teste</Text>
            <Text style={durationStyles.durationValue}>
              {TASI_MIN}min{TASI_SEC > 0 ? ` ${TASI_SEC}s` : ''}
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

export default TestPreparationScreen;