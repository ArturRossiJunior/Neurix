import React from 'react';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { IndexScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/index.styles';
import { View, Text, ScrollView, Alert } from 'react-native';

const IndexScreen = ({ navigation }: IndexScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header />
        <View style={styles.navigationGrid}>
          <Card
            variant="default"
            style={styles.navigationCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Início</Text>
                <Text style={styles.cardDescription}>
                  Acesse os jogos educativos e atividades interativas
                </Text>
              </View>
              <Button
                variant="calm"
                size="default"
                style={styles.actionButton}
                onPress={() => navigation.navigate('Login')}
              >
                Começar
              </Button>
            </View>
          </Card>
          <Card
            variant="default"
            style={styles.navigationCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Sobre</Text>
                <Text style={styles.cardDescription}>
                  Conheça mais sobre nossa ferramenta e metodologia
                </Text>
              </View>
              <Button
                variant="soft"
                size="default"
                style={styles.actionButton}
                onPress={() => navigation.navigate('About')}
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