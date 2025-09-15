import { colors } from './colors';
import { shadows } from './shadows';
import { createCommonStyles } from './common.styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const buttonVariants = {
  default: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.primaryForeground },
  },
  destructive: {
    container: { backgroundColor: colors.destructive },
    text: { color: colors.destructiveForeground },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.outlineBorder,
      elevation: 0,
      shadowOpacity: 0,
    },
    text: { color: colors.primary },
  },
  secondary: {
    container: { backgroundColor: colors.secondary, elevation: 0, shadowOpacity: 0 },
    text: { color: colors.secondaryForeground },
  },
  ghost: {
    container: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
    text: { color: colors.linkText },
  },
  link: {
    container: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, paddingHorizontal: 4 },
    text: { color: colors.linkText, textDecorationLine: 'underline', fontWeight: '500' },
  },
  game: {
    container: { 
      backgroundColor: colors.calmBlue,
      borderRadius: 16,
      elevation: 4,
      shadowOpacity: 0.2,
    },
    text: { color: colors.primaryForeground, fontWeight: '700' },
  },
  calm: {
    container: { 
      backgroundColor: colors.softGreen,
      borderRadius: 12,
      elevation: 3,
      shadowOpacity: 0.15,
    },
    text: { color: colors.primaryForeground, fontWeight: '600' },
  },
  soft: {
    container: { 
      backgroundColor: colors.gentlePurple,
      borderRadius: 12,
      elevation: 3,
      shadowOpacity: 0.15,
    },
    text: { color: colors.primaryForeground, fontWeight: '600' },
  },
}

const buttonSizes = (isTablet: boolean) => ({
  sm: {
    container: { 
      paddingVertical: isTablet ? hp('1.5%') : hp('1.2%'),
      paddingHorizontal: isTablet ? wp('4%') : wp('3.5%'), 
      borderRadius: isTablet ? 14 : 10 
    },
    text: { fontSize: isTablet ? wp('3%') : wp('3.5%') },
  },
  default: {
    container: { 
      paddingVertical: isTablet ? hp('1.5%') : hp('1.8%'),
      paddingHorizontal: isTablet ? wp('5%') : wp('5%'), 
      borderRadius: isTablet ? 16 : 12 
    },
    text: { fontSize: isTablet ? wp('2.8%') : wp('4%') },
  },
  lg: {
    container: { 
      paddingVertical: isTablet ? hp('2.2%') : hp('2%'),
      paddingHorizontal: isTablet ? wp('6%') : wp('6%'), 
      borderRadius: isTablet ? 18 : 14 
    },
    text: { fontSize: isTablet ? wp('4%') : wp('4.5%') },
  },
  xl: {
    container: { 
      paddingVertical: isTablet ? hp('2.5%') : hp('2.2%'),
      paddingHorizontal: isTablet ? wp('7%') : wp('7%'), 
      borderRadius: isTablet ? 20 : 16 
    },
    text: { fontSize: isTablet ? wp('4.5%') : wp('5%') },
  },
  icon: {
    container: { 
      height: isTablet ? hp('7%') : hp('5.5%'), 
      width: isTablet ? hp('7%') : hp('5.5%'),
      paddingHorizontal: 0, 
      borderRadius: isTablet ? 16 : 12 
    },
    text: {},
  },
})

const buttonStates = {
  pressed: {
    default: { container: { opacity: 0.8, transform: [{ scale: 0.98 }] } },
    destructive: { container: { opacity: 0.8, transform: [{ scale: 0.98 }] } },
    outline: { container: { backgroundColor: colors.subtleBackground, transform: [{ scale: 0.98 }] } },
    secondary: { container: { backgroundColor: '#CBD5E1', transform: [{ scale: 0.98 }] } },
    ghost: { container: { backgroundColor: colors.subtleBackground, transform: [{ scale: 0.98 }] } },
    link: { text: { opacity: 0.8 } },
    game: { container: { opacity: 0.8, transform: [{ scale: 0.98 }] } },
    calm: { container: { opacity: 0.8, transform: [{ scale: 0.98 }] } },
    soft: { container: { opacity: 0.8, transform: [{ scale: 0.98 }] } },
  },
  disabled: {
    container: { opacity: 0.5 },
    text: {},
  }
}

export const createButtonStyles = (isTablet: boolean) => {
  const commonStyles = createCommonStyles(isTablet);
  return {
    baseContainer: {
      ...commonStyles.baseContainer,
      ...commonStyles.centerContent,
      flexDirection: 'row' as const,
      ...shadows.shadowDefault,
    },

    baseText: {
      ...commonStyles.baseText,
    },

    variants: buttonVariants,
    sizes: buttonSizes(isTablet),
    states: buttonStates,
  };
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof ReturnType<typeof buttonSizes>;