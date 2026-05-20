import { colors } from './colors';
import { StyleSheet, Dimensions } from 'react-native';

export const createCommonStyles = (isTablet: boolean) => {
  const { width, height } = Dimensions.get('window');
  const vmin = Math.min(width, height);
  const vmax = Math.max(width, height);
  const wp = (p: string) => (vmin * parseFloat(p)) / 100;
  const hp = (p: string) => (vmax * parseFloat(p)) / 100;

  return StyleSheet.create({
  baseContainer: {
    borderRadius: isTablet ? 18 : 12,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },

  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: isTablet ? 24 : 16,
    padding: isTablet ? wp('5%') : wp('5%'),
    marginVertical: hp('1%'),
  },

  baseText: {
    fontSize: isTablet ? wp('3.5%') : wp('4%'),
    fontWeight: '600',
    textAlign: 'center',
  },

  cardTitle: {
    fontSize: isTablet ? wp('4%') : wp('5%'),
    fontWeight: '600',
    textAlign: 'center',
  },

  cardDescription: {
    color: colors.mutedForeground,
    textAlign: 'center',
    fontSize: isTablet ? wp('2.7%') : wp('4%'),
    lineHeight: isTablet ? hp('2.5%') : hp('3%'),
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    gap: isTablet ? hp('1%') : hp('0.5%'),
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.subtleBackground,
  },

  iconContainerLarge: {
    width: isTablet ? hp('9%') : hp('8%'),
    height: isTablet ? hp('9%') : hp('8%'),
    borderRadius: isTablet ? hp('4.5%') : hp('4%'),
  },

  iconContainerMedium: {
    width: isTablet ? hp('8%') : hp('7%'),
    height: isTablet ? hp('8%') : hp('7%'),
    borderRadius: isTablet ? hp('4%') : hp('3.5%'),
  },

  iconContainerSmall: {
    width: isTablet ? hp('6%') : hp('5%'),
    height: isTablet ? hp('6%') : hp('5%'),
    borderRadius: isTablet ? hp('3%') : hp('2.5%'),
  },
});
};