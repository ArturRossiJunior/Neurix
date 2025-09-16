import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { createCommonStyles } from './common.styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => {
  const commonStyles = createCommonStyles(isTablet);
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
      paddingBottom: isTablet ? hp('2%') : hp('3%'),
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

    headerTitle: {
      fontSize: isTablet ? wp('8%') : wp('6%'),
      fontWeight: '700',
      color: colors.foreground,
      textAlign: 'center',
    },

    headerSpacer: {
      width: isTablet ? hp('3%') : hp('5%'),
    },

    // Search and Filter Section
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

    newPatientSection: {
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingBottom: isTablet ? hp('2%') : hp('2.5%'),
    },

    listContainer: {
      flex: 1,
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
    },

    patientsList: {
      gap: isTablet ? hp('1.5%') : hp('2%'),
      paddingBottom: isTablet ? hp('3%') : hp('4%'),
    },

    // Patient Card Styles
    patientCard: {
      marginVertical: 0,
      padding: isTablet ? wp('4%') : wp('4%'),
      borderRadius: isTablet ? 20 : 16,
      ...shadows.shadowMedium,
    },

    patientCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    patientInfo: {
      flex: 1,
      gap: isTablet ? hp('1%') : hp('1.2%'),
    },

    patientHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isTablet ? hp('0.5%') : hp('0.8%'),
    },

    patientName: {
      fontSize: isTablet ? wp('4%') : wp('4.5%'),
      fontWeight: '600',
      color: colors.foreground,
      flex: 1,
    },

    statusBadge: {
      paddingHorizontal: isTablet ? wp('2.5%') : wp('3%'),
      paddingVertical: isTablet ? hp('0.5%') : hp('0.6%'),
      borderRadius: isTablet ? 12 : 10,
      marginLeft: isTablet ? wp('2%') : wp('2%'),
    },

    statusText: {
      fontSize: isTablet ? wp('2.5%') : wp('3%'),
      fontWeight: '600',
      color: colors.primaryForeground,
    },

    patientDetails: {
      gap: isTablet ? hp('0.3%') : hp('0.5%'),
    },

    patientAge: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },

    patientLastTest: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },

    patientTestsCount: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },

    // Empty State
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

    emptyStateButton: {
      marginTop: isTablet ? hp('1%') : hp('1.5%'),
      paddingHorizontal: isTablet ? wp('8%') : wp('10%'),
    },
  });
};