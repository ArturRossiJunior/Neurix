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
    card: {
      width: isTablet ? '50%' : '90%',
      maxWidth: 500,
      backgroundColor: colors.card,
      borderRadius: isTablet ? 12 : 8,
      padding: isTablet ? wp('4%') : wp('5%'), 
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: isTablet ? wp('4%') : wp('4.5%'),
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: isTablet ? hp('2%') : hp('2%'),
      textAlign: 'center',
    },
    input: {
      height: isTablet ? hp('5%') : hp('5%'),
      borderColor: colors.outlineBorder,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: wp('2%'),
      marginBottom: isTablet ? hp('2%') : hp('2%'),
      color: colors.foreground,
      backgroundColor: colors.muted,
      fontSize: isTablet ? wp('2%') : wp('4%'),
    },
    buttonContainer: {
      marginTop: isTablet ? hp('2%') : hp('2%'),
    },
    registerText: {
      color: colors.text,
      fontSize: isTablet ? wp('2%') : wp('4%'),
      marginRight: 5,
    },
    registerLink: {
      color: colors.linkText,
      fontWeight: 'bold',
      fontSize: isTablet ? wp('2%') : wp('4%'),
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'baseline',
      marginTop: isTablet ? hp('2%') : hp('2%'),
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isTablet ? hp('2.5%') : hp('3%'),
      alignSelf: 'flex-start',
    },
    checkboxLabel: {
      marginLeft: 8,
      color: colors.foreground,
      fontSize: isTablet ? wp('2%') : wp('4%'),
    },
  });
};