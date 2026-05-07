import { Alert, ImageSourcePropType } from 'react-native';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { View, Text, Image, ScrollView } from 'react-native';
import type { ConcentrationTestPreparationScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';

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

export default ConcentrationTestPreparationScreen;