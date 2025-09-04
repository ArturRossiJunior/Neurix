import React from 'react';
import { Button } from '../components/Button';
import { GameCard } from '../components/GameCard';
import { colors } from '../components/styles/colors';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    paddingVertical: 24,
  },
  
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 32,
  },
  
  // Header
  header: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
  },
  
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Grid de opções
  optionsGrid: {
    gap: 20,
  },
  
  optionCard: {
    marginVertical: 0,
  },
  
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  cardDescription: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  
  actionButton: {
    width: '80%',
    marginTop: 4,
  },
  
  // Icon placeholder styles
  iconPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  
  iconText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Home;