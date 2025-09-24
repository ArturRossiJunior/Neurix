import React from 'react';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { IndexScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/index.styles';
import { View, Text, ScrollView, Alert, useWindowDimensions } from 'react-native';

const IndexScreen = ({ navigation }: IndexScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createStyles(isTablet);

  const handleNavigation = (destination: string) => {
    Alert.alert(
      `Navegando para ${destination}`,
      'Esta funcionalidade será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header />
        <View style={styles.navigationGrid}>
          <Card
            variant="default"
            style={styles.navigationCard}
            onPress={() => navigation.navigate('Home')}
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
                size="default"
                style={styles.actionButton}
                onPress={() => navigation.navigate('Home')}
              >
                Começar
              </Button>
            </View>
          </Card>
          <Card
            variant="default"
            style={styles.navigationCard}
            onPress={() => handleNavigation('Sobre o App')}
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
                size="default"
                style={styles.actionButton}
                onPress={() => handleNavigation('Sobre o App')}
              >
                Saber Mais
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default IndexScreen;