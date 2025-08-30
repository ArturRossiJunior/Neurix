export const colors = {
  primary: '#3B82F6',
  primaryForeground: '#FFFFFF',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  secondary: '#E2E8F0',
  secondaryForeground: '#1E293B',
  outlineBorder: '#E2E8F0',
  linkText: '#3B82F6',
  subtleBackground: '#F8FAFC',
};

export const buttonStyles = {
  baseContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  variants: {
    default: {
      container: { backgroundColor: colors.primary },
      text: { color: colors.primaryForeground },
    },
    destructive: {
      container: { backgroundColor: colors.destructive },
      text: { color: colors.destructiveForeground },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.outlineBorder,
        elevation: 0,
        shadowOpacity: 0,
      },
      text: { color: colors.primary },
    },
    secondary: {
      container: { backgroundColor: colors.secondary, elevation: 0, shadowOpacity: 0 },
      text: { color: colors.secondaryForeground },
    },
    ghost: {
      container: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
      text: { color: colors.linkText },
    },
    link: {
      container: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, paddingHorizontal: 4 },
      text: { color: colors.linkText, textDecorationLine: 'underline', fontWeight: '500' },
    },
  },
  sizes: {
    sm: {
      container: { height: 36, paddingHorizontal: 14 },
      text: { fontSize: 13 },
    },
    default: {
      container: { height: 44, paddingHorizontal: 20 },
      text: { fontSize: 15 },
    },
    lg: {
      container: { height: 52, paddingHorizontal: 24 },
      text: { fontSize: 17 },
    },
    icon: {
      container: { height: 44, width: 44, paddingHorizontal: 0 },
      text: {},
    },
  },
  states: {
    pressed: {
      default: { container: { opacity: 0.9 } },
      destructive: { container: { opacity: 0.9 } },
      outline: { container: { backgroundColor: colors.subtleBackground } },
      secondary: { container: { backgroundColor: '#CBD5E1' } },
      ghost: { container: { backgroundColor: colors.subtleBackground } },
      link: { text: { opacity: 0.8 } },
    },
    disabled: {
      container: { opacity: 0.5 },
      text: {},
    }
  }
};