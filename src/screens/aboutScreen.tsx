import React from 'react';
import { Card } from '../components/Card';
import { useIsTablet } from '../utils/useIsTablet';
import { View, Text, ScrollView } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { AboutScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/about.styles';

const AboutScreen = ({ navigation }: AboutScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);

  const appDescription = "Esta é uma ferramenta de suporte clínico dedicada a auxiliar profissionais da saúde mental na avaliação e identificação de sinais de TDAH (Transtorno do Déficit de Atenção e Hiperatividade) em crianças. O aplicativo utiliza atividades interativas e questionários baseados em evidências para coletar dados que auxiliam no processo diagnóstico.";
  const techDescription = "Desenvolvido com React Native (Expo) e TypeScript, utilizando Supabase como backend para gerenciamento de dados em tempo real.";

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => navigation.goBack()}
        isTablet={isTablet}
      />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        <Card variant="default" style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre o Projeto</Text>
          <Text style={styles.descriptionText}>{appDescription}</Text>
          <Text style={styles.techText}>{techDescription}</Text>
        </Card>

        <Card variant="default" style={styles.card}>
          <Text style={styles.sectionTitle}>Equipe de Desenvolvimento</Text>
          <Text style={styles.listItem}>Artur Rossi Junior</Text>
          <Text style={styles.listItem}>Gustavo Correia Scarabeli</Text>
          <Text style={styles.listItem}>Gustavo Correa Pedro Carvalho</Text>
          <Text style={styles.listItem}>Matheus Andrade de Oliveira</Text>
        </Card>

        <Card variant="default" style={styles.card}>
          <Text style={styles.sectionTitle}>Orientação</Text>
          <Text style={styles.listItem}>Prof. Dr. Carlos Enrique Lopez Noriega</Text>
        </Card>

        <Text style={styles.versionText}>Versão: 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;