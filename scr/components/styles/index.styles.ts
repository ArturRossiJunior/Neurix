import { colors } from './colors';
import { StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    paddingVertical: 32,
  },
  
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 48,
  },
  
  navigationGrid: {
    gap: 24,
  },
  
  navCard: {
    marginVertical: 0,
  },
  
  cardContent: {
    ...commonStyles.centerContent,
    gap: 16,
  },
  
  iconContainer: {
    ...commonStyles.iconContainer,
    ...commonStyles.iconContainerLarge,
  },
  
  textContainer: {
    ...commonStyles.centerContent,
    gap: 8,
  },
  
  cardTitle: {
    ...commonStyles.cardTitle,
    color: colors.foreground,
  },
  
  cardDescription: {
    ...commonStyles.cardDescription,
    paddingHorizontal: 16,
  },
  
  actionButton: {
    width: '100%',
    marginTop: 8,
  },
  
  resourcesSection: {
    gap: 24,
  },
  
  sectionHeader: {
    alignItems: 'center',
    gap: 8,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  sectionDescription: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  
  resourcesGrid: {
    gap: 16,
  },
  
  resourceCard: {
    marginVertical: 0,
  },
  
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  smallIconContainer: {
    ...commonStyles.iconContainer,
    ...commonStyles.iconContainerSmall,
  },
  
  resourceTextContainer: {
    ...commonStyles.textContainer,
  },
  
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  
  resourceDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  
  iconPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  
  iconText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});