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
              style={styles.astronautImage}
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

        <Text style={styles.sectionTitle}>Como ajudar o Cogni</Text>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>1.</Text>
          <Text style={styles.stepText}>Olhe com atenção para o Símbolo Guia.</Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>2.</Text>
          <Text style={styles.stepText}>Procure com cuidado os símbolos que são iguais.</Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>3.</Text>
          <Text style={styles.stepText}>Sempre que encontrar um, toque nele para ajudar a nave a seguir o caminho certo.</Text>
        </View>

        <Text style={styles.sectionTitle}>Atenção para o Tempo!</Text>
        
        <Text style={styles.storyText}>
          Você terá um tempinho especial para encontrar os símbolos.
        </Text>
        
        <Text style={styles.storyText}>
          Não tem problema se não der tempo de achar todos — o importante é tentar, explorar e se divertir ajudando o Cogni!
        </Text>

        <Text style={styles.sectionTitle}>Vamos juntos?</Text>
        
        <Text style={styles.finalMessage}>
          "Com você ao lado, a viagem do Cogni fica muito mais divertida. Vamos explorar o espaço e encontrar os símbolos certos para continuar nossa aventura até o Parque Estelar!"
        </Text>

        <View style={styles.buttonAndAstronautContainer}>
          <Button
            variant="default"
            size="default"
            onPress={handleStartTest}
            style={styles.letsGoButton}
          >
            Vamos lá!
          </Button>

          <View style={styles.astronautBesideButton}>
            <Image
              source={require('../../assets/astrocogni.png')}
              style={styles.astronautSmall}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TestPreparationScreen;