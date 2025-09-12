import { colors } from './colors';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    paddingVertical: isTablet ? hp('8%') : hp('4%'),
    flexGrow: 1,
    justifyContent: 'center',
  },
  
  content: {
    width: isTablet ? wp('90%') : wp('90%'), 
    maxWidth: isTablet ? 1600 : 500,
    alignSelf: 'center',
    gap: isTablet ? hp('6%') : hp('5%'),
  },
  
  header: {
    alignItems: 'center',
    gap: isTablet ? hp('2%') : hp('1.5%'),
  },
  
  welcomeText: {
    fontSize: isTablet ? wp('8%') : wp('7%'),
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: isTablet ? wp('2.5%') : wp('4%'),
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: isTablet ? hp('4%') : hp('3%'),
  },

  optionsGrid: {
    flexDirection: isTablet ? 'row' : 'column',
    flexWrap: isTablet ? 'wrap' : 'nowrap',
    justifyContent: 'center',
    gap: isTablet ? wp('3%') : hp('2.5%'),
  },
  
  optionCard: {
    width: isTablet ? '48%' : '100%', 
    minHeight: isTablet ? hp('30%') : undefined,
  },
  
  cardContent: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: isTablet ? wp('3%') : wp('4%'),
  },
  
  cardTitle: {
    fontSize: isTablet ? wp('4%') : wp('5%'),
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  cardDescription: {
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'),
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: isTablet ? hp('2%') : hp('2.5%'),
    paddingHorizontal: wp('1%'),
  },
  
  actionButton: {
    width: '85%',
    //paddingVertical: isTablet ? hp('2%') : hp('1.5%')
    marginTop: hp('1%'),
  },
});