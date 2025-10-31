import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import ScreenHeader from '../components/ScreenHeader';
import { TestsScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

const mockTestTypes = [
  { id: '1', name: 'Teste de Atenção Sustentada', description: 'Avalia a capacidade de manter o foco em uma tarefa repetitiva.' },
  { id: '2', name: 'Teste de Impulsividade', description: 'Mede a tendência a agir sem pensar nas consequências.' },
  { id: '3', name: 'Teste de Memória Operacional', description: 'Verifica a habilidade de reter e manipular informações temporariamente.' },
  { id: '4', name: 'Questionário de Sintomas', description: 'Coleta informações sobre a frequência e intensidade dos sintomas de TDAH.' },
];

export const TestsListScreen = ({ navigation }: TestsScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createTestsStyles(isTablet);
  const [searchText, setSearchText] = useState('');
  const [filteredTests, setFilteredTests] = useState(mockTestTypes);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredTests(mockTestTypes);
    } else {
      const filtered = mockTestTypes.filter(test =>
        test.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTests(filtered);
    }
  };

  const handleTestPress = (testId: string, testName: string) => {
    navigation.navigate('TestDetail', { testId, testName });
  };
  
  const handleFilter = () => {
    Alert.alert(
      'Filtros',
      'Funcionalidade de filtros será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBackPress={() => navigation.goBack()}
        isTablet={isTablet}
      />

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar teste..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor={colors.deactivated}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.testsList}>
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              variant="interactive"
              style={styles.testCard}
              onPress={() => handleTestPress(test.id, test.name)}
            >
              <View style={styles.testCardContent}>
                <View style={styles.testInfo}>
                  <View style={styles.testHeader}>
                    <Text style={styles.testName}>{test.name}</Text>
                  </View>
                  <Text style={styles.testDescription}>{test.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {filteredTests.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhum teste encontrado</Text>
          <Text style={styles.emptyStateDescription}>
            Tente ajustar sua busca para encontrar o teste que procura
          </Text>
        </View>
      )}
    </View>
  );
};