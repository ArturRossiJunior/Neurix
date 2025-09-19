import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useIsTablet } from '../utils/useIsTablet';
import { colors } from '../components/styles/colors';
import { MaskedTextInput } from 'react-native-mask-text';
import { patientCreationScreenProps } from '../navigation/types';
import { createStyles } from '../components/styles/patients.styles';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

const PatientCreationScreen = ({ navigation }: patientCreationScreenProps) => {
  const isTablet = useIsTablet();
  const styles = createStyles(isTablet);
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    guardian: '',
    phone: '',
    email: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome do paciente é obrigatório');
      return;
    }

    if (!formData.name.trim().includes(' ')) {
      Alert.alert('Erro', 'Digite o nome completo do paciente (nome e sobrenome)');
      return;
    }

    if (!formData.guardian.trim()) {
      Alert.alert('Erro', 'Nome do responsável é obrigatório');
      return;
    }

    Alert.alert(
      'Sucesso',
      'Paciente cadastrado com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleCancel = () => {
    const allEmpty = Object.values(formData).every(value => value.trim() === '');

    if (allEmpty) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Cancelar',
      'Deseja cancelar o cadastro? Os dados não serão salvos.',
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Sair', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCancel}
        >
          <Text style={styles.backButtonText}>↩</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          <Card variant="default" style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Informações do Paciente</Text>
              
              <View style={styles.patientDetails}>
                <Text style={[styles.patientAge, { marginBottom: 8, fontWeight: '600' }]}>
                  Nome do Paciente *
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Data de Nascimento
                </Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="99/99/9999"
                    style={styles.searchInput}
                    placeholder="DD/MM/AAAA"
                    value={formData.birthDate}
                    onChangeText={(text, rawText) => handleInputChange('birthDate', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Nome do Responsável *
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Digite o nome do responsável"
                    value={formData.guardian}
                    onChangeText={(value) => handleInputChange('guardian', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Telefone
                </Text>
                <View style={styles.searchContainer}>
                  <MaskedTextInput
                    mask="(99) 99999-9999"
                    style={styles.searchInput}
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChangeText={(text, rawText) => handleInputChange('phone', text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.secondaryMutedForeground}
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Email
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Observações
                </Text>
                <View style={[styles.searchContainer, { height: 100 }]}>
                  <TextInput
                    style={[styles.searchInput, { height: '100%', textAlignVertical: 'top' }]}
                    placeholder="Observações sobre o paciente..."
                    value={formData.notes}
                    onChangeText={(value) => handleInputChange('notes', value)}
                    placeholderTextColor={colors.secondaryMutedForeground}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <Text style={[styles.patientAge, { marginTop: 16, fontStyle: 'italic' }]}>
                  * Campos obrigatórios
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ paddingBottom: 10 }}>
            <Button
              variant="game"
              size="default"
              style={styles.patientCreationButton}
              onPress={handleSave}
            >
              Salvar Paciente
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientCreationScreen;