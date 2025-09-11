import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Index: undefined;
  Home: undefined;
};

export type IndexScreenProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;