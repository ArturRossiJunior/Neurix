import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { createCommonStyles } from './common.styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => {
  const commonStyles = createCommonStyles(isTablet);
  return StyleSheet.create({
    baseContainer: {
      ...commonStyles.cardContainer,
      ...shadows.shadowMedium,
    },
    
    interactive: {
      borderWidth: 1,
      borderColor: colors.outlineBorder,
    },
    
    info: {
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.outlineBorder,
    },
    
    cardContent: {
      ...commonStyles.centerContent,
      gap: isTablet ? hp('2.5%') : hp('2%'),
    },
    
    cardContentHorizontal: {
      ...commonStyles.rowContent,
      gap: isTablet ? wp('4%') : wp('3%'),
    },

    iconContainer: {
      ...commonStyles.iconContainer,
      ...commonStyles.iconContainerMedium,
    },
    
    iconContainerSmall: {
      ...commonStyles.iconContainer,
      ...commonStyles.iconContainerSmall,
    },
    
    cardTitle: {
      ...commonStyles.cardTitle,
      color: colors.cardForeground,
    },
    
    cardTitleSmall: {
      fontSize: isTablet ? wp('3.8%') : wp('4%'),
      fontWeight: '600',
      color: colors.cardForeground,
    },
    
    cardDescription: {
      ...commonStyles.cardDescription,
    },
    
    cardDescriptionSmall: {
      fontSize: isTablet ? wp('2.8%') : wp('3.2%'),
      color: colors.mutedForeground,
      lineHeight: isTablet ? hp('2.5%') : hp('2%'),
    },
    
    textContainer: {
      ...commonStyles.textContainer,
    },
    
    centerContent: {
      ...commonStyles.centerContent,
      gap: isTablet ? hp('1.5%') : hp('1%'),
    },
  });
};
