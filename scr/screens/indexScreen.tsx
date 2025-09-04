import React from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { GameCard } from '../components/GameCard';
import { IndexScreenProps } from '../navigation/types';
import { styles } from '../components/styles/index.styles';
import { View, Text, ScrollView, Alert } from 'react-native';

const IndexScreen = ({ navigation }: IndexScreenProps) => {
  const handleNavigation = (destination: string) => {
    Alert.alert(
      `Navegando para ${destination}`,
      'Esta funcionalidade será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <Header />
        <View style={styles.navigationGrid}>
          <GameCard
            variant="default"
            style={styles.navCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Início</Text>
                <Text style={styles.cardDescription}>
                  Acesse os jogos educativos e atividades interativas
                </Text>
              </View>
              <Button
                variant="game"
                size="lg"
                style={styles.actionButton}
                onPress={() => navigation.navigate('Home')}
              >
                🎮 Começar
              </Button>
            </View>
          </GameCard>

          <GameCard
            variant="default"
            style={styles.navCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Sobre o App</Text>
                <Text style={styles.cardDescription}>
                  Conheça mais sobre nossa ferramenta e metodologia
                </Text>
              </View>
              <Button
                variant="soft"
                size="lg"
                style={styles.actionButton}
                onPress={() => handleNavigation('Sobre o App')}
              >
                📚 Saber Mais
              </Button>
            </View>
          </GameCard>
        </View>
      </View>
    </ScrollView>
  );
};

export default IndexScreen;