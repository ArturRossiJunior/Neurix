import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Patients: undefined;
  PatientDetail: { patientId: string };
  PatientCreation: { 
    patientId?: string;
    prefillName?: string; 
    prefillBirthDate?: string;
    prefillCPF?: string;
    prefillGender?: string;
    prefillEscolaridade?: string;
    prefillIdResponsavel?: number;
    prefillLateralidade?: string;
    prefillNotes?: string;
  } | undefined;
  Dashboard: undefined;
  Login: undefined;
  Register: undefined;
  Tests: undefined;
  TestDetail: { testId: string; testName: string; };
  Guardians: undefined;
  GuardianDetail: { guardianId: string };
  GuardianCreation: { 
    guardianId?: string; 
    prefillName?: string; 
    prefillCPF?: string; 
    prefillPhone?: string; 
    prefillEmail?: string; 
  } | undefined;
  About: undefined;
  TestApplication: { testId: string; testName: string; patientId: string };
  TestPreparation: { testId: string; testName: string; patientId: string; patientName: string; };
  ConcentrationTestPreparation: { testId: string; testName: string; patientId: string; patientName: string; };
  ConcentrationTestApplication: { testId: string; testName: string; patientId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type TestsScreenProps = NativeStackScreenProps<RootStackParamList, 'Tests'>;
export type AboutScreenProps = NativeStackScreenProps<RootStackParamList, 'About'>;
export type PatientsScreenProps = NativeStackScreenProps<RootStackParamList, 'Patients'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type GuardiansScreenProps = NativeStackScreenProps<RootStackParamList, 'Guardians'>;
export type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
export type TestDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TestDetail'>;
export type PatientDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PatientDetail'>;
export type GuardianDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'GuardianDetail'>;
export type PatientCreationScreenProps = NativeStackScreenProps<RootStackParamList, 'PatientCreation'>;
export type TestApplicationScreenProps = NativeStackScreenProps<RootStackParamList, 'TestApplication'>;
export type TestPreparationScreenProps = NativeStackScreenProps<RootStackParamList, 'TestPreparation'>;
export type GuardianCreationScreenProps = NativeStackScreenProps<RootStackParamList, 'GuardianCreation'>;
export type ConcentrationTestPreparationScreenProps = NativeStackScreenProps<RootStackParamList, 'ConcentrationTestPreparation'>;
export type ConcentrationTestApplicationScreenProps = NativeStackScreenProps<RootStackParamList, 'ConcentrationTestApplication'>;