// Shared size mapping for both quote text and source across all components
export const SIZE_MAP = {
  small: { quote: '1.5rem', source: '1.25rem' },   // S: 24px/20px
  medium: { quote: '2rem', source: '1.5rem' },     // M: 32px/24px
  large: { quote: '2.5rem', source: '2rem' },      // L: 40px/32px
  xlarge: { quote: '4rem', source: '3rem' }        // XL: 64px/48px
};

export type SizeKey = keyof typeof SIZE_MAP;