import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
    paddingTop: 40
  },
  
  imageContainer: {
    width: 256,
    height: 144,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.shadowLarge,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  
  textContainer: {
    alignItems: 'center',
    gap: 16,
    maxWidth: 320,
  },
  
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 40,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 28,
  },
  
  description: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
});