// Design System Colors
export const Colors = {
  background: '#FFF8F0',
  card: '#FFFFFF',
  primary: '#4CAF50', // Green accent
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cream: '#FFF8F0',
  beige: '#F5F0E8',
};

// Spacing scale (multiples of 4)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border radius
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Typography
export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};

// Shadow (for cards)
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Categories for home screen
export const CATEGORIES = [
  { id: '1', name: 'Health', icon: 'heart-outline' },
  { id: '2', name: 'Grooming', icon: 'cut-outline' },
  { id: '3', name: 'Pet Food', icon: 'fast-food-outline' },
  { id: '4', name: 'Boarding', icon: 'home-outline' },
];
