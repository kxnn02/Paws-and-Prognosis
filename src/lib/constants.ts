// ==============================================
// DESIGN SYSTEM — Extracted from Figma
// Paws & Prognosis Veterinary Clinic
// ==============================================

// Color Palette (from Figma design tokens)
export const Colors = {
  // Backgrounds
  background: '#FEF9F4',        // Main app background (warm cream)
  backgroundLogin: 'rgba(248, 224, 196, 0.3)', // Login screen beige overlay
  card: '#FFFFFF',              // Card backgrounds
  
  // Primary (Green)
  primary: '#71924F',           // Main green — buttons, cards, CTAs
  primaryLight: 'rgba(113, 146, 79, 0.67)', // Category icons, lighter states
  primaryBorder: '#7BBD38',     // Bright green — image borders, accents
  primaryDark: '#4A6B35',       // Darker green for pressed states

  // Text
  textHeading: '#544864',       // Purple-ish dark — section headings, vet names
  textDark: '#343434',          // Primary body text, labels
  textGrey: '#808080',          // Descriptions, secondary info
  textLightGrey: '#9BA1A8',     // Date labels, tertiary info
  textPlaceholder: '#A7A7A7',   // Input placeholders
  textWhite: '#FFFFFF',         // Text on green backgrounds

  // Status
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',

  // UI
  border: '#E5E7EB',           // Input borders
  borderGreen: 'rgba(113, 146, 79, 0.67)', // Search bar border
  overlay: 'rgba(0, 0, 0, 0.38)', // Modals, overlays
  shadow: '#F3F3F3',           // Category icon shadow
  
  // Bottom Navigation
  navBg: '#FFFFFF',
  navActive: '#71924F',
  navInactive: '#B6B6B6',
};

// Spacing (4px base grid)
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
  '6xl': 56,
  '7xl': 64,
};

// Border Radius (from Figma)
export const Radius = {
  sm: 8,        // Small cards, some images
  md: 12,       // Buttons, inputs, skill tags, nav buttons
  lg: 16,       // Vet cards, main cards
  xl: 29,       // Login glassmorphism box
  '2xl': 32,    // Bottom navigation top corners
  full: 9999,   // Circular elements (avatars, category icons)
};

// Typography (Poppins throughout, Luckiest Guy for brand)
export const Typography = {
  // Headings
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 40 },   // Brand, big titles
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 36 },   // Screen titles, vet name on detail
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 32 },   // Section headings (Category, Veterinary, Schedule)
  
  // Body
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySemiBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  
  // Small
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 24 },
  smallSemiBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 24 },
  
  // Caption
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  captionMedium: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  captionSemiBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  
  // Button
  button: { fontSize: 14, fontWeight: '600' as const, lineHeight: 28 },
  buttonLarge: { fontSize: 18, fontWeight: '600' as const, lineHeight: 36 },
  
  // Schedule
  dateNumber: { fontSize: 20, fontWeight: '600' as const, lineHeight: 20 },
  dateLabel: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

// Shadows (from Figma)
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#162233',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.38,
    shadowRadius: 40,
    elevation: 8,
  },
  category: {
    shadowColor: '#F3F3F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3,
  },
};

// Categories for home screen
export const CATEGORIES = [
  { id: '1', name: 'Health', icon: 'heart-outline' },
  { id: '2', name: 'Grooming', icon: 'cut-outline' },
  { id: '3', name: 'Pet Food', icon: 'fast-food-outline' },
  { id: '4', name: 'Boarding', icon: 'home-outline' },
];

// Bottom tab icon size
export const TAB_ICON_SIZE = 30;
export const BOTTOM_NAV_HEIGHT = 94;

// Clinic Contact Info (for Contact Clinic feature)
export const CLINIC_CONTACT = {
  name: 'Paws & Prognosis Clinic',
  phone: '+639171234567',
  viber: '+639171234567',
  messenger: 'pawsandprognosis', // Facebook page username
  address: 'Manila, Philippines',
};
