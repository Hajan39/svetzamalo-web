import type { SupportedLocale } from '@/types';
import { translations } from './translations';

export const languages = {
  cs: 'Čeština',
  en: 'English',
} as const;

export const defaultLang: SupportedLocale = 'cs';
export const showDefaultLang = false;
export const languageSwitcherEnabled = false;

export const ui = {
  cs: translations.cs.ui,
  en: translations.en.ui,
} as const;

export type UiLanguage = keyof typeof ui;
export type UiKey = keyof typeof ui[typeof defaultLang];
