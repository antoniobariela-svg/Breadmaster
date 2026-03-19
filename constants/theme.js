export const COLORS = {
  cream: '#FDF6EC',
  warmWhite: '#FFF9F2',
  brownDark: '#3B1F0A',
  brownMid: '#7C4A1E',
  brownLight: '#C17F3E',
  orange: '#E8622A',
  orangeLight: '#F4A461',
  tan: '#E8D5B0',
  tanDark: '#D4B896',
  textDark: '#2C1A0E',
  textMid: '#6B4226',
  textLight: '#A07850',
  white: '#FFFFFF',
  successGreen: '#4CAF50',
  warningOrange: '#FF9800',
  errorRed: '#F44336',
};

// Gunakan setelah font dimuat via useFonts di App.js
export const FONTS = {
  display: 'PlayfairDisplay_700Bold',
  displayBlack: 'PlayfairDisplay_900Black',
  body: 'System',
};

export const SHADOWS = {
  card: {
    shadowColor: '#3B1F0A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  soft: {
    shadowColor: '#3B1F0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

// Gradients untuk card — lebih kaya & berlapis
export const GRADIENTS = {
  featured: ['#3B1F0A', '#7C4A1E', '#C17F3E'],
  orange: ['#C04A15', '#E8622A', '#F4A461'],
  tan: ['#A06030', '#C17F3E', '#E8C87A'],
  brown: ['#5A2E0A', '#A05C2A', '#D4956A'],
  dark: ['#1a0a3e', '#3B1F0A', '#7C4A1E'],
};
