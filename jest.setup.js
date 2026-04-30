import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('./src/utils/useIsTablet', () => ({
  useIsTablet: jest.fn(() => false),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    width: 390,
    height: 844,
    fontScale: 1,
    scale: 3,
  })),
}));