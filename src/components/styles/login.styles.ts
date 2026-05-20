import { colors } from './colors';
import { StyleSheet } from 'react-native';
import { createCommonStyles } from './common.styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    infoButtonContainer: {
      position: 'absolute',
      top: isTablet ? 32 : 40,
      right: isTablet ? 32 : 24,
      zIndex: 10,
    },
    card: {
      width: isTablet ? '50%' : '90%',
      maxWidth: 500,
      backgroundColor: colors.card,
      borderRadius: isTablet ? 12 : 8,
      padding: isTablet ? 32 : 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: isTablet ? 32 : 24,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: isTablet ? 24 : 16,
      textAlign: 'center',
    },
    input: {
      height: isTablet ? 56 : 48,
      borderColor: colors.outlineBorder,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      color: colors.foreground,
      backgroundColor: colors.muted,
      fontSize: isTablet ? 18 : 16,
    },
    buttonContainer: {
      marginTop: isTablet ? 24 : 16,
    },
    registerText: {
      color: colors.text,
      fontSize: isTablet ? 16 : 14,
      marginRight: 5,
    },
    registerLink: {
      color: colors.linkText,
      fontWeight: 'bold',
      fontSize: isTablet ? 16 : 14,
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'baseline',
      marginTop: isTablet ? 24 : 16,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isTablet ? 24 : 20,
      alignSelf: 'flex-start',
    },
    checkboxLabel: {
      marginLeft: 8,
      color: colors.foreground,
      fontSize: isTablet ? 16 : 14,
    },
  });
};