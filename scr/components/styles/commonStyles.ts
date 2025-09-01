import { colors } from './colors';
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  baseContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },

  baseText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    gap: 4,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.subtleBackground,
  },

  iconContainerLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  iconContainerMedium: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  
  iconContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});