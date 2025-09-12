import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: isTablet ? hp('1%') : hp('3%'),
    paddingHorizontal: isTablet ? wp('0%') : wp('0%'),
    paddingTop: isTablet ? hp('0%') : hp('0%'),
  },
  
  imageContainer: {
    width: isTablet ? wp('60%') : wp('68%'),
    height: isTablet ? hp('20%') : hp('18%'),
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.shadowLarge,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  
  textContainer: {
    alignItems: 'center',
    gap: isTablet ? hp('1%') : hp('2%'),
    maxWidth: isTablet ? wp('90%') : wp('100%'),
  },
  
  title: {
    fontSize: isTablet ? wp('7%') : wp('8.5%'),
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: isTablet ? hp('7%') : hp('5%'),
  },
  
  subtitle: {
    fontSize: isTablet ? wp('3.5%') : wp('5.3%'),
    fontWeight: '600',
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: isTablet ? hp('3.5%') : hp('3.5%'),
  },
  
  description: {
    fontSize: isTablet ? wp('2.5%') : wp('4.2%'),
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: isTablet ? hp('2.5%') : hp('3%'),
    paddingHorizontal: isTablet ? 16 : wp('4%'),
  },
});