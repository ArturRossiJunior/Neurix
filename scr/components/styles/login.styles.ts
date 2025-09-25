import { colors } from './colors';
import { StyleSheet } from 'react-native';
import { createCommonStyles } from './common.styles';

export const createLoginStyles = (isTablet: boolean) => {
  const commonStyles = createCommonStyles(isTablet);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: commonStyles.cardContainer.padding,
    },
    card: {
      width: isTablet ? '50%' : '90%',
      maxWidth: 500,
      backgroundColor: colors.card,
      borderRadius: isTablet ? 12 : 8,
      padding: isTablet ? 30 : 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: isTablet ? 28 : 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: isTablet ? 25 : 15,
      textAlign: 'center',
    },
    input: {
      height: isTablet ? 50 : 40,
      borderColor: colors.outlineBorder,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: isTablet ? 20 : 15,
      color: colors.foreground,
      backgroundColor: colors.muted,
    },
    buttonContainer: {
      marginTop: isTablet ? 20 : 15,
    },
    registerText: {
      marginTop: isTablet ? 20 : 15,
      textAlign: 'center',
      color: colors.text,
      fontSize: isTablet ? 16 : 14,
    },
    registerLink: {
      color: colors.linkText,
      fontWeight: 'bold',
    },
  });
};