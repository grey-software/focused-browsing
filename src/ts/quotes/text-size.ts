export const SIZE_MAP = {
  small: { quote: '1.5rem', source: '1.25rem' },
  medium: { quote: '2rem', source: '1.5rem' },
  large: { quote: '2.5rem', source: '2rem' },
  xlarge: { quote: '4rem', source: '3rem' }
}

export type SizeKey = keyof typeof SIZE_MAP