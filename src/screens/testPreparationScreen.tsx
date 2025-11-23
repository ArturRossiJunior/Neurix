import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import type { TestPreparationScreenProps } from '../navigation/types';

const { width, height } = Dimensions.get('window');

const TestPreparationScreen = ({ navigation, route }: TestPreparationScreenProps) => {
  const { testId, testName, patientId, patientName } = route.params; // ✅ Adicionar patientId
  const [showInstructions, setShowInstructions] = useState(false);

  // Validar se recebeu os parâmetros necessários
  React.useEffect(() => {
    console.log('📋 TestPreparation - Parâmetros recebidos:', {
      testId,
      testName,
      patientId,
      patientName
    });

    if (!patientId) {
      console.error('❌ patientId não foi recebido em TestPreparation!');
    }
  }, [testId, testName, patientId, patientName]);

  const handleStartTest = () => {
    console.log('🚀 Navegando para TestApplication com:', {
      testId,
      testName,
      patientId
    });

    navigation.navigate('TestApplication', {
      testId,
      testName,
      patientId, // ✅ PASSAR O patientId
    });
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  if (!showInstructions) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Preparado para começar?</Text>
          
          <Text style={styles.subtitle}>
            Paciente: {patientName}
          </Text>
          
          <Text style={styles.testName}>
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
            style={styles.startButton}
          >
            Começar Teste
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        {/* Container para o botão e astronauta lado a lado */}
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

        {/* Espaçamento extra no final */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#7B1FA2',
    marginBottom: 5,
    textAlign: 'center',
  },
  testName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8E24AA',
    marginBottom: 30,
    textAlign: 'center',
  },
  imageContainer: {
    width: width * 0.6,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  astronautImage: {
    width: '100%',
    height: '100%',
  },
  instructions: {
    fontSize: 18,
    color: '#6A1B9A',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 30,
    lineHeight: 26,
  },
  startButton: {
    marginTop: 20,
    minWidth: 200,
    backgroundColor: '#9C27B0',
  },
  instructionsContainer: {
    flex: 1,
  },
  instructionsContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 30,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginTop: 25,
    marginBottom: 15,
  },
  storyText: {
    fontSize: 18,
    color: '#4A148C',
    lineHeight: 28,
    marginBottom: 15,
    textAlign: 'justify',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginRight: 10,
    minWidth: 25,
  },
  stepText: {
    fontSize: 18,
    color: '#4A148C',
    lineHeight: 26,
    flex: 1,
  },
  finalMessage: {
    fontSize: 18,
    color: '#4A148C',
    lineHeight: 28,
    marginTop: 10,
    marginBottom: 30,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  letsGoButton: {
    minWidth: 200,
    backgroundColor: '#9C27B0',
    marginTop: 20,
  },
  buttonAndAstronautContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 20,
  },
  astronautBesideButton: {
    width: 120,
    height: 120,
  },
  astronautSmall: {
    width: '100%',
    height: '100%',
  },
});

export default TestPreparationScreen;