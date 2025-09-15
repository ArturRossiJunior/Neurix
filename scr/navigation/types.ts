import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Index: undefined;
  Home: undefined;
  Patients: undefined;
  PatientDetail: { patientId: string };
  NewPatient: undefined;
};

export type IndexScreenProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PatientsScreenProps = NativeStackScreenProps<RootStackParamList, 'Patients'>;
