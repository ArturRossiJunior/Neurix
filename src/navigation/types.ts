import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Index: undefined;
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
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type IndexScreenProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
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
export type GuardianCreationScreenProps = NativeStackScreenProps<RootStackParamList, 'GuardianCreation'>;