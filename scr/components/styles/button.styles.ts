import { colors } from './colors';
import { commonStyles } from './commonStyles';
import { shadows } from './shadows';

export const styles = {
  baseContainer: {
    ...commonStyles.baseContainer,
    ...commonStyles.centerContent,
    flexDirection: 'row' as const,
    ...shadows.shadowDefault,
  },

  baseText: {
    ...commonStyles.baseText,
  },

  variants: {
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
  },
  sizes: {
    sm: {
      container: { height: 36, paddingHorizontal: 14, borderRadius: 10 },
      text: { fontSize: 13 },
    },
    
    default: {
      container: { height: 44, paddingHorizontal: 20, borderRadius: 12 },
      text: { fontSize: 15 },
    },

    lg: {
      container: { height: 52, paddingHorizontal: 24, borderRadius: 14 },
      text: { fontSize: 17 },
    },

    xl: {
      container: { height: 60, paddingHorizontal: 28, borderRadius: 16 },
      text: { fontSize: 18 },
    },

    icon: {
      container: { height: 44, width: 44, paddingHorizontal: 0, borderRadius: 12 },
      text: {},
    },
  },

  states: {
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
};