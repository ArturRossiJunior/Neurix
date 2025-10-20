import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingTop: isTablet ? hp('4%') : hp('7%'),
      paddingBottom: isTablet ? hp('0.5%') : hp('3%'),
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineBorder,
    },
     backButton: {
      width: isTablet ? hp('6%') : hp('5%'),
      height: isTablet ? hp('6%') : hp('5%'),
      borderRadius: isTablet ? hp('3%') : hp('2.5%'),
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.shadowDefault,
    },
    backButtonText: {
      fontSize: isTablet ? wp('7%') : wp('5%'),
      fontWeight: '600',
      color: colors.foreground,
      marginTop: isTablet ? wp('-1.5%') : wp('5%'),
    },
    headerSpacer: {
      width: isTablet ? hp('3%') : hp('5%'),
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: isTablet ? hp('2.8%') : hp('2.2%'),
      fontWeight: '600',
      color: colors.foreground,
      marginRight: wp('10%'), 
    },
    contentContainer: {
      padding: isTablet ? wp('5%') : wp('4%'),
      paddingBottom: hp('5%'),
    },
    card: {
      marginBottom: hp('2.5%'),
      padding: isTablet ? wp('4%') : wp('5%'),
    },
    sectionTitle: {
      fontSize: isTablet ? hp('2.5%') : hp('2.2%'),
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: hp('1.5%'),
    },
    descriptionText: {
      fontSize: isTablet ? hp('2%') : hp('1.8%'),
      color: colors.text,
      lineHeight: isTablet ? hp('3%') : hp('2.7%'),
      marginBottom: hp('1.5%'),
    },
    techText: {
      fontSize: isTablet ? hp('1.8%') : hp('1.6%'),
      color: colors.mutedForeground,
      lineHeight: isTablet ? hp('2.8%') : hp('2.5%'),
      fontStyle: 'italic',
    },
    listItem: {
      fontSize: isTablet ? hp('2%') : hp('1.8%'),
      color: colors.mutedForeground,
      marginBottom: hp('0.5%'),
    },
    versionText: {
      textAlign: 'center',
      fontSize: isTablet ? hp('1.8%') : hp('1.6%'),
      color: colors.deactivated,
      marginTop: hp('2%'),
      paddingBottom: hp('2%'),
    },
  });
};