import type { Continent } from '@/types';

const CONTINENT_LABELS: Record<Continent, string> = {
  europe: 'Evropa',
  asia: 'Asie',
  africa: 'Afrika',
  oceania: 'Austrálie a Oceánie',
  'south-america': 'Jižní Amerika',
  'north-america': 'Severní Amerika',
  caribbean: 'Karibik a Střední Amerika',
};

export function getContinentLabel(continent: string) {
  return CONTINENT_LABELS[continent as Continent] ?? continent.replace(/-/g, ' ');
}