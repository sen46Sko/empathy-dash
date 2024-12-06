import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { Inter } from 'next/font/google';

export const ptSans = Inter({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const typography = {
  fontFamily: ptSans.style.fontFamily,
  // fontFamily:
  //   `${ptSans.style.fontFamily} "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.57 },
  button: { fontWeight: 500 },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 },
  subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.25 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: 2.5,
    textTransform: 'uppercase',
  },
  h1: { fontSize: '3.5rem', fontWeight: 500, lineHeight: 1.2 },
  h2: { fontSize: '3rem', fontWeight: 500, lineHeight: 1.2 },
  h3: { fontSize: '2.25rem', fontWeight: 500, lineHeight: 1.2 },
  h4: { fontSize: '2rem', fontWeight: 500, lineHeight: 1.2 },
  h5: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.2 },
  h6: { fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.2 },
} satisfies TypographyOptions;
