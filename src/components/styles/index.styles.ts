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
      flexGrow: 1,
      paddingVertical: isTablet ? hp('6%') : hp('0%'),
    },
    
    content: {
      ...commonStyles.centerContent,
      width: isTablet ? wp('90%') : wp('90%'), 
      maxWidth: isTablet ? 1600 : 500,
      alignSelf: 'center',
      gap: isTablet ? hp('6%') : hp('5%'),
    },
    
    navigationGrid: {
      flexDirection: isTablet ? 'row' : 'column',
      flexWrap: isTablet ? 'wrap' : 'nowrap',
      gap: isTablet ? wp('4%') : hp('0%'),
    },
    
    navigationCard: {
      width: isTablet ? wp('43%') : '90%',
      minHeight: isTablet ? hp('30%') : hp('20%'),
      marginBottom: isTablet ? wp('4%') : hp('1%'),
    },
    
    cardContent: {
      ...commonStyles.centerContent,
      flex: 1,
      justifyContent: 'space-around',
      padding: isTablet ? wp('3%') : wp('7%'),
      gap: isTablet ? hp('2.5%') : hp('2.5%'),
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
    },
    
    cardDescription: {
      ...commonStyles.cardDescription,
      paddingHorizontal: isTablet ? wp('0%') : wp('0%'),
    },
    
    actionButton: {
      width: '90%',
      marginTop: hp('1%'),
    },
  });
};