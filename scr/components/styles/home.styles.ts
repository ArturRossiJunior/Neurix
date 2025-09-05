import { colors } from './colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    paddingVertical: 24,
  },
  
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 32,
  },
  
  header: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
  },
  
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  optionsGrid: {
    gap: 20,
  },
  
  optionCard: {
    marginVertical: 0,
  },
  
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  cardDescription: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  
  actionButton: {
    width: '80%',
    marginTop: 4,
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