import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useIsTablet } from '../utils/useIsTablet';
import { createStyles } from '../components/styles/patients.styles';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NewPatientScreenProps = NativeStackScreenProps<RootStackParamList, 'NewPatient'>;

const NewPatientScreen = ({ navigation }: NewPatientScreenProps) => {
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
    // Validação básica
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome do paciente é obrigatório');
      return;
    }
    
    if (!formData.guardian.trim()) {
      Alert.alert('Erro', 'Nome do responsável é obrigatório');
      return;
    }

    // Em um app real, você salvaria os dados aqui
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
    Alert.alert(
      'Cancelar',
      'Deseja cancelar o cadastro? Os dados não serão salvos.',
      [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Cancelar', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCancel}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Paciente</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          {/* Form Card */}
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
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Data de Nascimento
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="DD/MM/AAAA"
                    value={formData.birthDate}
                    onChangeText={(value) => handleInputChange('birthDate', value)}
                    placeholderTextColor="#94A3B8"
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
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <Text style={[styles.patientAge, { marginBottom: 8, marginTop: 16, fontWeight: '600' }]}>
                  Telefone
                </Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
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
                    placeholderTextColor="#94A3B8"
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
                    placeholderTextColor="#94A3B8"
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

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            <Button
              variant="game"
              size="default"
              style={styles.newPatientButton}
              onPress={handleSave}
            >
              Salvar Paciente
            </Button>
            
            <Button
              variant="outline"
              size="default"
              style={styles.newPatientButton}
              onPress={handleCancel}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NewPatientScreen;