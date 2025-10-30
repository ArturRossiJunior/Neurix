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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Switch,
  Pressable,
} from 'react-native';

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
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [onlyWithoutPatients, setOnlyWithoutPatients] = useState(false);
  const [sortBy, setSortBy] = useState('name_asc');

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
            const allNames = associatedPatients.map((p) => p.nome_completo);
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

  useEffect(() => {
    let result = guardians;

    if (searchText.trim() !== '') {
      const lowerText = searchText.toLowerCase().trim();
      result = result.filter((guardian) =>
        guardian.nome_completo.toLowerCase().includes(lowerText)
      );
    }

    if (onlyWithoutPatients) {
      result = result.filter((guardian) => guardian.patientsCount === 0);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.nome_completo.localeCompare(b.nome_completo);
        case 'name_desc':
          return b.nome_completo.localeCompare(a.nome_completo);
        case 'patients_desc':
          return b.patientsCount - a.patientsCount;
        case 'patients_asc':
          return a.patientsCount - b.patientsCount;
        default:
          return 0;
      }
    });

    setFilteredGuardians(result);
  }, [
    guardians,
    searchText,
    onlyWithoutPatients,
    sortBy,
  ]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleGuardianPress = (guardianId: string) => {
    navigation.navigate('GuardianDetail', { guardianId });
  };

  const handleFilter = () => {
    setIsFilterModalVisible(true);
  };

  const areFiltersActive = () => {
    return (
      onlyWithoutPatients ||
      sortBy !== 'name_asc'
    );
  };

  const renderSortButton = (label: string, sortKey: string) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === sortKey && styles.sortButtonSelected,
      ]}
      onPress={() => setSortBy(sortKey)}
    >
      <Text
        style={[
          styles.sortButtonText,
          sortBy === sortKey && styles.sortButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centralizer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>
          Carregando responsáveis...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => {
          setIsFilterModalVisible(false);
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Filtros Avançados</Text>

              <Text style={styles.filterSectionTitle}>Filtros Gerais</Text>
              <View style={styles.filterOption}>
                <Text style={styles.filterLabel}>Mostrar somente sem pacientes</Text>
                <Switch
                  trackColor={{ false: colors.deactivated, true: colors.primary }}
                  thumbColor={colors.primaryForeground}
                  onValueChange={() => setOnlyWithoutPatients((prev) => !prev)}
                  value={onlyWithoutPatients}
                />
              </View>
              
              <Text style={styles.filterSectionTitle}>Ordenar por</Text>
              <View style={styles.sortContainer}>
                {renderSortButton('Nome (A-Z)', 'name_asc')}
                {renderSortButton('Nome (Z-A)', 'name_desc')}
                {renderSortButton('Qtd. Pacientes (Mais)', 'patients_desc')}
                {renderSortButton('Qtd. Pacientes (Menos)', 'patients_asc')}
              </View>

              <Button
                variant="default"
                size="sm"
                style={{ marginTop: hp('4%') }}
                onPress={() => setIsFilterModalVisible(false)}
              >
                Fechar
              </Button>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

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
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            areFiltersActive() && { backgroundColor: colors.primary },
          ]}
          onPress={handleFilter}
        >
          <Icon
            name="filter-variant"
            size={isTablet ? wp('4%') : wp('5%')}
            color={
              areFiltersActive()
                ? colors.primaryForeground
                : colors.foreground
            }
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
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
                    <Text style={styles.guardianName}>
                      {guardian.nome_completo}
                    </Text>
                  </View>
                  <View style={styles.guardianDetails}>
                    <Text style={styles.guardianInput}>
                      Telefone: {formatPhone(guardian.telefone)}
                    </Text>
                    <Text style={styles.guardianInput}>
                      E-mail: {guardian.email || 'N/A'}
                    </Text>
                    <Text style={styles.guardianTestsCount}>
                      Pacientes: {guardian.patientsNames || 'Nenhum'}
                    </Text>
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
            {searchText.trim() !== '' || areFiltersActive()
              ? 'Tente ajustar seus filtros ou adicione um novo responsável'
              : 'Adicione responsáveis para gerenciar os pacientes associados'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default GuardiansScreen;