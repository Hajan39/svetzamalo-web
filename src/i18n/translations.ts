import cs from './cs';
import en from './en';

export const translations = {
  cs,
  en,
} as const;

export type TranslationLocale = keyof typeof translations;
