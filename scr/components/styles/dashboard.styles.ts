import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => StyleSheet.create({
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

  listContainer: {
    flex: 1,
    paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
    paddingTop: isTablet ? wp('3%') : wp('0%')
  },

  patientSelectorContainer: {
    marginBottom: isTablet ? hp('2%') : hp('2%'),
  },

  patientSelectorLabel: {
    fontSize: isTablet ? wp('4%') : wp('4.5%'),
    fontWeight: '600',
    color: colors.foreground,
    flex: 1,
    paddingBottom: isTablet ? wp('2%') : wp('0%'),
  },

  picker: {
    height: isTablet ? hp('7%') : hp('6%'),
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: isTablet ? 12 : 10,
    borderWidth: 1,
    borderColor: colors.outlineBorder,
    paddingHorizontal: isTablet ? wp('4%') : wp('3%'),
  },

  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? wp('5%') : wp('4%'),
    marginBottom: isTablet ? hp('3%') : hp('2%'),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  chartTitle: {
    fontSize: isTablet ? wp('4%') : wp('4.5%'),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: isTablet ? hp('2%') : hp('1.5%'),
  },

  noDataText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: isTablet ? wp('4%') : wp('4.5%'),
    marginTop: isTablet ? hp('4%') : hp('3%'),
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
});