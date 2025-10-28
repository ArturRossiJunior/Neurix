import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 768;

export const useIsTablet = (): boolean => {
  const { width, height } = useWindowDimensions();
  return Math.min(width, height) >= TABLET_BREAKPOINT;
};