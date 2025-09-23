import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { createStyles } from '../components/styles/home.styles';
import { View, Text, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: HomeScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createStyles(isTablet);

  const handleNavigation = (destination: string) => {
    if (destination === 'Pacientes') {
      navigation.navigate('Patients');
    } else {
      Alert.alert(
        `Navegando para ${destination}`,
        'Esta funcionalidade será implementada em breve!',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Escolha uma das opções abaixo para começar
          </Text>
        </View>
        <View style={styles.navigationGrid}>
          <Card 
            variant="default" 
            style={styles.navigationCard}
            onPress={() => handleNavigation('Novo Teste')}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Novo Teste</Text>
              <Text style={styles.cardDescription}>
                Iniciar um novo teste ou atividade interativa
              </Text>
              <Button 
                variant="game" 
                size="default" 
                style={styles.actionButton}
                onPress={() => handleNavigation('Novo Teste')}
              >
                Começar
              </Button>
            </View>
          </Card>

          <Card 
            variant="default" 
            style={styles.navigationCard}
            onPress={() => navigation.navigate('Patients')}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Pacientes</Text>
              <Text style={styles.cardDescription}>
                Gerenciar e visualizar informações dos pacientes
              </Text>
              <Button 
                variant="calm" 
                size="default" 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Patients')}
              >
                Acessar
              </Button>
            </View>
          </Card>

          <Card 
            variant="default" 
            style={styles.navigationCard}
            onPress={() => handleNavigation('Dashboard')}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Dashboard</Text>
              <Text style={styles.cardDescription}>
                Análises e relatórios dos resultados
              </Text>
              <Button 
                variant="soft" 
                size="default" 
                style={styles.actionButton}
                onPress={() => handleNavigation('Dashboard')}
              >
                Ver Dados
              </Button>
            </View>
          </Card>

          <Card 
            variant="default" 
            style={styles.navigationCard}
            onPress={() => handleNavigation('Configurações')}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Configurações</Text>
              <Text style={styles.cardDescription}>
                Ajustes e preferências do aplicativo
              </Text>
              <Button 
                variant="outline" 
                size="default" 
                style={styles.actionButton}
                onPress={() => handleNavigation('Configurações')}
              >
                Ajustar
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;