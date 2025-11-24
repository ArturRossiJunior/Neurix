import { Card } from '../components/Card';
import { supabase } from '../utils/supabase';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import React, { useState, useCallback } from 'react';
import ScreenHeader from '../components/ScreenHeader';
import { TestsScreenProps } from '../navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

interface TestType {
  id: number;
  nome_teste: string;
  descricao: string;
}

export const TestsListScreen = ({ navigation }: TestsScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createTestsStyles(isTablet);
  
  const [searchText, setSearchText] = useState('');
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [filteredTests, setFilteredTests] = useState<TestType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestTypes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tipos_de_teste')
        .select('id, nome_teste, descricao')
        .order('nome_teste', { ascending: true });

      if (error) {
        throw error;
      }

      setTestTypes(data || []);
      setFilteredTests(data || []);

    } catch (error: any) {
      Alert.alert(
        'Erro',
        `Não foi possível carregar os tipos de teste: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTestTypes();
    }, [fetchTestTypes])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredTests(testTypes);
    } else {
      const filtered = testTypes.filter(test =>
        test.nome_teste.toLowerCase().includes(text.toLowerCase()) ||
        (test.descricao && test.descricao.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredTests(filtered);
    }
  };

  const handleTestPress = (testId: number, testName: string) => {
    navigation.navigate('TestDetail', { 
      testId: testId.toString(), 
      testName 
    });
  };
  
  const handleFilter = () => {
    Alert.alert(
      'Filtros',
      'Funcionalidade de filtros será implementada em breve!',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          onBackPress={() => navigation.goBack()}
          isTablet={isTablet}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.text }}>Carregando testes...</Text>
        </View>
      </View>
    );
  }

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
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.testsList}>
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              variant="interactive"
              style={styles.testCard}
              onPress={() => handleTestPress(test.id, test.nome_teste)}
            >
              <View style={styles.testCardContent}>
                <View style={styles.testInfo}>
                  <View style={styles.testHeader}>
                    <Text style={styles.testName}>{test.nome_teste}</Text>
                  </View>
                  <Text style={styles.testDescription}>
                    {test.descricao || 'Sem descrição disponível'}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {!loading && filteredTests.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>
            {searchText ? 'Nenhum teste encontrado' : 'Nenhum teste cadastrado'}
          </Text>
          <Text style={styles.emptyStateDescription}>
            {searchText 
              ? 'Tente ajustar sua busca para encontrar o teste que procura'
              : 'Cadastre tipos de teste no Supabase para começar'
            }
          </Text>
        </View>
      )}
    </View>
  );
};