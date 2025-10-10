import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createTestsStyles = (isTablet: boolean) => {
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
    searchSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingVertical: isTablet ? hp('2%') : hp('2.5%'),
      gap: isTablet ? wp('3%') : wp('3%'),
    },
    searchContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: isTablet ? 16 : 12,
      borderWidth: 1,
      borderColor: colors.outlineBorder,
      ...shadows.shadowDefault,
    },
    searchInput: {
      paddingHorizontal: isTablet ? wp('4%') : wp('4%'),
      paddingVertical: isTablet ? hp('1.8%') : hp('2%'),
      fontSize: isTablet ? wp('3.5%') : wp('4%'),
      color: colors.foreground,
    },
    filterButton: {
      width: isTablet ? hp('6%') : hp('5.5%'),
      height: isTablet ? hp('6%') : hp('5.5%'),
      borderRadius: isTablet ? 16 : 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.shadowDefault,
    },
    filterButtonText: {
      fontSize: isTablet ? wp('4%') : wp('4.5%'),
      color: colors.primaryForeground,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingTop: isTablet ? wp('3%') : wp('0%')
    },
    testsList: {
      gap: isTablet ? hp('1.5%') : hp('2%'),
      paddingBottom: isTablet ? hp('3%') : hp('4%'),
    },
    testCard: {
      marginVertical: 0,
      padding: isTablet ? wp('4%') : wp('4%'),
      borderRadius: isTablet ? 20 : 16,
      ...shadows.shadowMedium,
    },
    testCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    testInfo: {
      flex: 1,
      gap: isTablet ? hp('1%') : hp('1.2%'),
    },
    testHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isTablet ? hp('0.5%') : hp('0.8%'),
    },
    testName: {
      fontSize: isTablet ? wp('4%') : wp('4.5%'),
      fontWeight: '600',
      color: colors.foreground,
      flex: 1,
    },
    testDescription: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: isTablet ? wp('10%') : wp('8%'),
      gap: isTablet ? hp('2%') : hp('2.5%'),
    },
    emptyStateTitle: {
      fontSize: isTablet ? wp('4.5%') : wp('5%'),
      fontWeight: '600',
      color: colors.foreground,
      textAlign: 'center',
    },
    emptyStateDescription: {
      fontSize: isTablet ? wp('3%') : wp('4%'),
      color: colors.mutedForeground,
      textAlign: 'center',
      lineHeight: isTablet ? hp('2.5%') : hp('3%'),
    },
    formContainer: {
      marginTop: isTablet ? hp('3%') : hp('4%'),
      backgroundColor: colors.card,
      borderRadius: isTablet ? wp('3%') : wp('2%'),
      padding: isTablet ? wp('5%') : wp('4%'),
      marginHorizontal: isTablet ? wp('4%') : wp('5%'),
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: hp('0.2%') },
      shadowOpacity: 0.1,
      shadowRadius: wp('1%'),
      elevation: 3,
      marginBottom: isTablet ? hp('2.5%') : hp('2%'),
    },
    label: {
      fontSize: isTablet ? wp('3.5%') : wp('4%'),
      color: colors.foreground,
      marginBottom: isTablet ? hp('1.5%') : hp('1%'),
      fontWeight: '500',
    },
    input: {
      height: isTablet ? hp('7%') : hp('6%'),
      borderColor: colors.outlineBorder,
      borderWidth: 1,
      borderRadius: isTablet ? 12 : 10,
      paddingHorizontal: wp('3.5%'),
      marginBottom: isTablet ? hp('2.5%') : hp('2%'),
      color: colors.foreground,
      backgroundColor: colors.card,
      fontSize: isTablet ? wp('3.5%') : wp('4%'),
    },
    picker: {
      height: isTablet ? hp('7%') : hp('6%'),
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: isTablet ? 12 : 10,
      borderWidth: 1,
      borderColor: colors.outlineBorder,
      justifyContent: 'center',
      paddingHorizontal: wp('1%'),
      marginBottom: isTablet ? hp('2.5%') : hp('2%'),
    },
    startButton: {
      marginTop: isTablet ? hp('2%') : hp('3%'),
    },
  });
};