import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Index: undefined;
  Home: undefined;
  Patients: undefined;
  PatientDetail: { patientId: string };
  PatientCreation: { prefillName?: string };
};

export type IndexScreenProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PatientsScreenProps = NativeStackScreenProps<RootStackParamList, 'Patients'>;
export type PatientDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PatientDetail'>;
export type patientCreationScreenProps = NativeStackScreenProps<RootStackParamList, 'PatientCreation'>;