import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';

export const styles = StyleSheet.create({
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
    gap: 16,
  },
  
  cardContentHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.cardForeground,
  },
  
  cardDescription: {
    ...commonStyles.cardDescription,
  },
  
  cardDescriptionSmall: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  
  textContainer: {
    ...commonStyles.textContainer,
  },
  
  centerContent: {
    ...commonStyles.centerContent,
    gap: 8,
  },
});