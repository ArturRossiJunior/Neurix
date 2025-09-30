import React from 'react';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/homeScreen';
import IndexScreen from '../screens/indexScreen';
import { LoginScreen } from '../screens/loginScreen';
import PatientsScreen from '../screens/patientsListScreen';
import { RegisterScreen } from '../screens/registerScreen';
import { DashboardScreen } from '../screens/dashboardScreen';
import { NavigationContainer } from '@react-navigation/native';
import PatientDetailScreen from '../screens/patientDetailScreen';
import PatientCreationScreen from '../screens/patientCreationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Index"
          component={IndexScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Patients"
          component={PatientsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientDetail"
          component={PatientDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientCreation"
          component={PatientCreationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}