import { Card } from '../components/Card';
import { useAuth } from '../../AuthContext';
import { supabase } from '../utils/supabase';
import { formatPhone } from '../utils/utils';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import { GuardiansScreenProps } from '../navigation/types'; 
import React, { useState, useEffect, useCallback } from 'react';
import { createStyles } from '../components/styles/guardians.styles'; 
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

interface Guardian {
  id: number; 
  nome_completo: string;
  telefone: string | null;
  email: string | null;
  patientsNames: string;
  patientsCount: number;
}

const GuardiansScreen = ({ navigation }: GuardiansScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet); 
  const [searchText, setSearchText] = useState('');
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const { professionalId } = useAuth();

  const fetchGuardians = useCallback(async () => {
    if (!professionalId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: guardiansData, error: guardiansError } = await supabase
        .from('responsavel')
        .select('id, nome_completo, telefone, email');

      if (guardiansError) {
        throw guardiansError;
      }

      if (!guardiansData || guardiansData.length === 0) {
        setGuardians([]);
        setFilteredGuardians([]);
        setLoading(false);
        return;
      }

      const guardiansWithDetails: Guardian[] = await Promise.all(
        guardiansData.map(async (guardian) => {
          
          const { data: associatedPatients, error: countError } = await supabase
            .from('pacientes')
            .select('nome_completo')
            .eq('id_responsavel', guardian.id)
            .eq('id_profissional', professionalId);

          if (countError) {
            console.error('Erro ao buscar pacientes associados:', countError);
          }

          const patientsCount = associatedPatients?.length || 0;
          let patientsNames: string;

          if (!associatedPatients || associatedPatients.length === 0) {
            patientsNames = 'Nenhum';
          } else {
            const allNames = associatedPatients.map(p => p.nome_completo);
            if (allNames.length > 2) {
              patientsNames = `${allNames.slice(0, 2).join(', ')}, ...`;
            } else {
              patientsNames = allNames.join(', ');
            }
          }

          return {
            ...guardian,
            patientsNames,
            patientsCount,
          };
        })
      );

      setGuardians(guardiansWithDetails);
      setFilteredGuardians(guardiansWithDetails);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar responsáveis: ' + error.message);
      console.error('Erro ao carregar responsáveis:', error);
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useFocusEffect(
    useCallback(() => {
      fetchGuardians();
    }, [fetchGuardians])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    const lowerText = text.toLowerCase().trim();
    if (lowerText === '') {
     setFilteredGuardians(guardians);
    } else {
        const filtered = guardians.filter(guardian =>
        guardian.nome_completo.toLowerCase().includes(lowerText)
    );
        setFilteredGuardians(filtered);
    }
  };

  const handleGuardianPress = (guardianId: string) => {
    navigation.navigate('GuardianDetail', { guardianId }); 
  };

  const handleGuardianCreation = () => {
    const nameToPreFill = searchText.trim();
    navigation.navigate('GuardianCreation', { prefillName: nameToPreFill });
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
      <View style={[styles.container, styles.centralizer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Carregando responsáveis...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
        <Text style={styles.backButtonText}>↩</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar responsável..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor={colors.deactivated}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleGuardianCreation}>
          <Text style={styles.filterButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.guardiansList}>
          {filteredGuardians.map((guardian) => (
            <Card
              key={guardian.id}
              variant="interactive"
              style={styles.guardianCard} 
              onPress={() => handleGuardianPress(guardian.id.toString())}
            >
              <View style={styles.guardianCardContent}>
                <View style={styles.guardianInfo}>
                  <View style={styles.guardianHeader}>
                    <Text style={styles.guardianName}>{guardian.nome_completo}</Text>
                  </View>
                  <View style={styles.guardianDetails}>
                    <Text style={styles.guardianInput}>Telefone: {formatPhone(guardian.telefone)}</Text>
                    <Text style={styles.guardianInput}>E-mail: {guardian.email || 'N/A'}</Text>
                    <Text style={styles.guardianTestsCount}>Pacientes: {guardian.patientsNames || 'Nenhum'}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {filteredGuardians.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhum responsável encontrado</Text>
          <Text style={styles.emptyStateDescription}>
            {searchText.trim() !== '' 
              ? 'Tente ajustar sua busca ou adicione um novo responsável'
              : 'Comece adicionando seu primeiro responsável'
            }
          </Text>
          <Button
            variant="secondary"
            size="default"
            style={styles.emptyStateButton}
            onPress={handleGuardianCreation}
          >
            + Adicionar Responsável
          </Button>
        </View>
      )}
    </View>
  );
};

export default GuardiansScreen;