import { Alert } from 'react-native';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { View, Text, Image, ScrollView } from 'react-native';
import type { TestPreparationScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';

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

export default TestPreparationScreen;