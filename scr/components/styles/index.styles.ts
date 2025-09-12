import { colors } from './colors';
import { StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    paddingVertical: isTablet ? hp('6%') : hp('0%'),
    flexGrow: 1,
    justifyContent: 'center',
  },
  
  content: {
    maxWidth: isTablet ? wp('100%') : wp('100%'),
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isTablet ? wp('5%') : wp('5%'),
    gap: isTablet ? hp('8%') : hp('3%'),
  },
  
  navigationGrid: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: isTablet ? wp('4%') : hp('3%'),
    justifyContent: 'center',
  },
  
  navCard: {
    marginVertical: 0,
    width: isTablet ? wp('40%') : wp('90%'),
    minHeight: isTablet ? hp('35%') : hp('0%'),
  },
  
  cardContent: {
    ...commonStyles.centerContent,
    flex: 1,
    justifyContent: 'space-between',
    gap: isTablet ? hp('0%') : hp('1%'),
    paddingVertical: isTablet ? hp('5%') : hp('0%'),
  },
  
  iconContainer: {
    ...commonStyles.iconContainer,
    ...commonStyles.iconContainerLarge,
  },
  
  textContainer: {
    ...commonStyles.centerContent,
    gap: isTablet ? hp('1%') : hp('2%'),
  },
  
  cardTitle: {
    ...commonStyles.cardTitle,
    color: colors.foreground,
    fontSize: isTablet ? wp('5%') : wp('7%'),
  },
  
  cardDescription: {
    ...commonStyles.cardDescription,
    paddingHorizontal: isTablet ? wp('1%') : wp('1%'),
    fontSize: isTablet ? wp('3%') : wp('4%'),
    lineHeight: isTablet ? hp('3%') : hp('3.5%'),
  },
  
  actionButton: {
    width: '100%',
    marginTop: isTablet ? hp('1%') : hp('1%'),
  },
});