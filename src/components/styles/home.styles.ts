import { colors } from './colors';
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
    
    contentContainer: {
      ...commonStyles.centerContent,
      paddingVertical: isTablet ? hp('8%') : hp('4%'),
      flexGrow: 1,
    },
    
    content: {
      ...commonStyles.centerContent,
      width: isTablet ? wp('90%') : wp('90%'), 
      maxWidth: isTablet ? 1600 : 500,
      alignSelf: 'center',
      gap: isTablet ? hp('6%') : hp('5%'),
    },
    
    header: {
      ...commonStyles.centerContent,
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
  
    navigationGrid: {
      flexDirection: isTablet ? 'row' : 'column',
      flexWrap: isTablet ? 'wrap' : 'nowrap',
      gap: isTablet ? wp('4%') : hp('0%'),
    },
    
    navigationCard: {
      width: isTablet ? wp('43%') : wp('80%'),
      minHeight: isTablet ? hp('30%') : hp('20%'),
      marginBottom: isTablet ? wp('-2%') : hp('1%'),
    },
    
    cardContent: {
      ...commonStyles.centerContent,
      flex: 1, 
      justifyContent: 'space-around',
      padding: isTablet ? wp('3%') : wp('2%'),
      gap: isTablet ? hp('2.5%') : hp('1.5%'),
    },
    
    cardTitle: {
      fontSize: isTablet ? wp('4%') : wp('5%'),
      fontWeight: '600',
      color: colors.foreground,
      textAlign: 'center',
    },
    
    cardDescription: {
      ...commonStyles.cardDescription,
      paddingHorizontal: isTablet ? wp('0%') : wp('1%'),
      fontSize: isTablet ? wp('2.7%') : wp('4%'),
      lineHeight: isTablet ? hp('2.5%') : hp('3%'),
    },
    
    actionButton: {
      width: '90%',
      marginTop: hp('1%'),
    },
  });
};