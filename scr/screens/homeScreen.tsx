import React from 'react';
import { Button } from '../components/Button';
import { GameCard } from '../components/GameCard';
import { styles } from '../components/styles/home.styles';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';

const Home = () => {
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
        
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Escolha uma das opções abaixo para começar
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          
          <GameCard 
            variant="interactive" 
            style={styles.optionCard}
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
          </GameCard>

          <GameCard 
            variant="interactive" 
            style={styles.optionCard}
            onPress={() => handleNavigation('Pacientes')}
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
                onPress={() => handleNavigation('Pacientes')}
              >
                Acessar
              </Button>
            </View>
          </GameCard>

          <GameCard 
            variant="interactive" 
            style={styles.optionCard}
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
          </GameCard>

          <GameCard 
            variant="interactive" 
            style={styles.optionCard}
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
          </GameCard>

        </View>

      </View>
    </ScrollView>
  );
};

export default Home;