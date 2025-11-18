import React, { useState } from 'react';
import { Button } from '../components/Button';
import { colors } from '../components/styles/colors';
import { Picker } from '@react-native-picker/picker';
import { TestDetailScreenProps } from '../navigation/types';
import { createTestsStyles } from '../components/styles/tests.styles';
import { View, Text, ScrollView, TextInput, Alert, useWindowDimensions, TouchableOpacity } from 'react-native';

const mockPatients = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'João Santos' },
  { id: '3', name: 'Maria Oliveira' },
  { id: '4', name: 'Pedro Costa' },
];

export const TestDetailScreen = ({ route, navigation }: TestDetailScreenProps) => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const styles = createTestsStyles(isTablet);

    const { testId, testName } = route.params;
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [otherOption, setOtherOption] = useState('');

  const handleStartTest = () => {
  if (!selectedPatient) {
    Alert.alert('Erro', 'Por favor, selecione um paciente para iniciar o teste.');
    return;
  }
  
  const patientName = mockPatients.find(p => p.id === selectedPatient)?.name || '';
  
  navigation.navigate('TestPreparation', {
    testId,
    testName,
    patientId: selectedPatient,
    patientName,
  });
};

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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tipo de Teste:</Text>
          <TextInput
            style={styles.input}
            value={testName}
            editable={false}
          />

          <Text style={styles.label}>Selecionar Paciente:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(itemValue) => setSelectedPatient(itemValue)}
            >
              <Picker.Item label="Selecione um paciente..." value={null} />
              {mockPatients.map((patient) => (
                <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Configuração Adicional (Opcional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Usar estímulo sonoro"
            placeholderTextColor={colors.mutedForeground}
            value={otherOption}
            onChangeText={setOtherOption}
          />

          <Button variant="default" size="default" onPress={handleStartTest} style={styles.startButton}>
            Iniciar Teste
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};