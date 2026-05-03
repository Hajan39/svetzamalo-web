import type { Continent } from '@/types';
import { translations } from '@/i18n/translations';

export function getContinentLabel(continent: string, locale: 'cs' | 'en' = 'cs') {
  const labels = translations[locale].shared.continents;
  return labels[continent as Continent] ?? continent.replace(/-/g, ' ');
}