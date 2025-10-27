import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../components/styles/colors';
import { DashboardScreenProps } from '../navigation/types';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { createStyles } from '../components/styles/dashboard.styles';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

// Mock data for demonstration
const mockPatients = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'João Santos' },
  { id: '3', name: 'Maria Oliveira' },
];

interface PatientData {
  testResults: { month: string; score: number; }[];
  symptomFrequency: { name: string; population: number; color: string; legendFontColor: string; legendFontSize: number; }[];
}

const mockPatientData: { [key: string]: PatientData } = {
  '1': {
    testResults: [
      { month: 'Jan', score: 60 },
      { month: 'Fev', score: 65 },
      { month: 'Mar', score: 70 },
      { month: 'Abr', score: 75 },
      { month: 'Mai', score: 80 },
    ],
    symptomFrequency: [
      { name: 'Desatenção', population: 50, color: colors.graph1, legendFontColor: colors.legend, legendFontSize: 15 },
      { name: 'Hiperatividade', population: 30, color: colors.graph2, legendFontColor: colors.legend, legendFontSize: 15 },
      { name: 'Impulsividade', population: 20, color: colors.graph3, legendFontColor: colors.legend, legendFontSize: 15 },
    ],
  },
  '2': {
    testResults: [
      { month: 'Jan', score: 50 },
      { month: 'Fev', score: 55 },
      { month: 'Mar', score: 52 },
      { month: 'Abr', score: 58 },
      { month: 'Mai', score: 60 },
    ],
    symptomFrequency: [
      { name: 'Desatenção', population: 50, color: colors.graph1, legendFontColor: colors.legend, legendFontSize: 15 },
      { name: 'Hiperatividade', population: 40, color: colors.graph2, legendFontColor: colors.legend, legendFontSize: 15 },
      { name: 'Impulsividade', population: 10, color: colors.graph3, legendFontColor: colors.legend, legendFontSize: 15 },
    ],
  },
  '3': {
    testResults: [
      { month: 'Jan', score: 70 },
      { month: 'Fev', score: 72 },
      { month: 'Mar', score: 75 },
      { month: 'Abr', score: 78 },
      { month: 'Mai', score: 82 },
    ],
    symptomFrequency: [
      { name: 'Desatenção', population: 30, color: colors.graph1, legendFontColor: colors.legend, legendFontSize: 15 },
      { name: 'Hiperatividade', population: 40, color: colors.graph2, legendFontColor: colors.legend, legendFontSize: 15 },
      { name: 'Impulsividade', population: 30, color: colors.graph3, legendFontColor: colors.legend, legendFontSize: 15 },
    ],
  },
};

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createStyles(isTablet);

  const [patientData, setPatientData] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPatient) {
      setPatientData(mockPatientData[selectedPatient]);
    } else {
      setPatientData(null);
    }
  }, [selectedPatient]);

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
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

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.patientSelectorContainer}>
          <Text style={styles.patientSelectorLabel}>Selecionar Paciente:</Text>
          <Picker
            selectedValue={selectedPatient}
            onValueChange={(itemValue) => setSelectedPatient(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um paciente" value={null} />
            {mockPatients.map((patient) => (
              <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
            ))}
          </Picker>
        </View>

        {patientData ? (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Resultados dos Testes ao Longo do Tempo</Text>
              <LineChart
                data={{
                  labels: patientData.testResults.map((data: any) => data.month),
                  datasets: [
                    {
                      data: patientData.testResults.map((data: any) => data.score),
                    },
                  ],
                }}
                width={screenWidth - 60}
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Frequência de Sintomas</Text>
              <PieChart
                data={patientData.symptomFrequency}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}></Text>
        )}
      </ScrollView>
    </View>
  );
};