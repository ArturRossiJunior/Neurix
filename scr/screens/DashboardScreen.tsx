import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { dashboardStyles } from '../components/styles/dashboard.styles';
import { colors } from '../components/styles/colors';

// Mock data for demonstration
const mockPatients = [
  { id: '1', name: 'Paciente A' },
  { id: '2', name: 'Paciente B' },
  { id: '3', name: 'Paciente C' },
];

const mockPatientData = {
  '1': {
    testResults: [
      { month: 'Jan', score: 60 },
      { month: 'Fev', score: 65 },
      { month: 'Mar', score: 70 },
      { month: 'Abr', score: 75 },
      { month: 'Mai', score: 80 },
    ],
    symptomFrequency: [
      { name: 'Desatenção', population: 40, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Hiperatividade', population: 30, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Impulsividade', population: 20, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
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
      { name: 'Desatenção', population: 50, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Hiperatividade', population: 20, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Impulsividade', population: 10, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
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
      { name: 'Desatenção', population: 30, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Hiperatividade', population: 40, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Impulsividade', population: 30, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ],
  },
};

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    if (selectedPatient) {
      setPatientData(mockPatientData[selectedPatient]);
    } else {
      setPatientData(null);
    }
  }, [selectedPatient]);

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0, // optional, defaults to 2dp
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
    <View style={dashboardStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={dashboardStyles.header}>Análise de Pacientes</Text>

        <View style={dashboardStyles.patientSelectorContainer}>
          <Text style={dashboardStyles.patientSelectorLabel}>Selecionar Paciente:</Text>
          <Picker
            selectedValue={selectedPatient}
            onValueChange={(itemValue) => setSelectedPatient(itemValue)}
            style={dashboardStyles.picker}
          >
            <Picker.Item label="Selecione um paciente" value={null} />
            {mockPatients.map((patient) => (
              <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
            ))}
          </Picker>
        </View>

        {patientData ? (
          <>
            <View style={dashboardStyles.chartContainer}>
              <Text style={dashboardStyles.chartTitle}>Resultados dos Testes ao Longo do Tempo</Text>
              <LineChart
                data={{
                  labels: patientData.testResults.map((data: any) => data.month),
                  datasets: [
                    {
                      data: patientData.testResults.map((data: any) => data.score),
                    },
                  ],
                }}
                width={screenWidth - 60} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>

            <View style={dashboardStyles.chartContainer}>
              <Text style={dashboardStyles.chartTitle}>Frequência de Sintomas</Text>
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
          <Text style={dashboardStyles.noDataText}>Selecione um paciente para visualizar os dados.</Text>
        )}
      </ScrollView>
    </View>
  );
};

