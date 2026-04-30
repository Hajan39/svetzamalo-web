import type { ImageAsset } from '@/types';

export const ARTICLE_COVER_FALLBACKS: Record<string, ImageAsset> = {
  'doprava-americke-panenske-ostrovy': {
    src: '/images/articles/usvi/doprava.jpg',
    alt: 'Letiště na St. Thomas, Americké Panenské ostrovy',
  },
  'plaze-americke-panenske-ostrovy': {
    src: '/images/articles/usvi/plaze.jpg',
    alt: 'Výhled na Magens Bay na Amerických Panenských ostrovech',
  },
  'prakticky-pruvodce-americke-panenske-ostrovy': {
    src: '/images/articles/usvi/prakticky.jpg',
    alt: 'Charlotte Amalie na Amerických Panenských ostrovech',
  },
  'pruvodce-americke-panenske-ostrovy': {
    src: '/images/articles/usvi/pruvodce.jpg',
    alt: 'Ostrov St. Thomas z ptačí perspektivy',
  },
};
