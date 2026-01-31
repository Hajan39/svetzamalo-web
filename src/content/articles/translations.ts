/**
 * Article Translations
 *
 * Localized content for articles. In production, this would be
 * stored in a CMS, database, or external translation service.
 */

import type { ArticleTranslation } from './loaders'
import type { SupportedLocale } from '@/lib/i18n'

export const articleTranslations: Record<string, Record<SupportedLocale, Partial<Article>>> = {
  // Dominican Republic Complete Guide
  'dominican-complete-guide': {
    cs: {
      title: 'Kompletní průvodce Dominikánskou republikou 2026',
      intro: 'Objevte vše o Dominikánské republice - od luxusních pláží Punta Cana po koloniální poklady Santo Dominga. Kompletní průvodce pro vaše cestování.',
      seo: {
        metaTitle: 'Dominikánská republika 2026: Kompletní průvodce | Lowcost Traveling',
        metaDescription: 'Kompletní průvodce Dominikánskou republikou pro cestovatele. Pláže, města, kultura, jídlo a tipy pro levné cestování.',
        keywords: ['dominikánská republika', 'cestování', 'pláže', 'průvodce', 'levné cestování', '2026']
      }
    },
    es: {
      title: 'Guía Completa República Dominicana 2026',
      intro: 'Descubre todo sobre República Dominicana - desde las lujosas playas de Punta Cana hasta los tesoros coloniales de Santo Domingo. Guía completa para tu viaje.',
      seo: {
        metaTitle: 'República Dominicana 2026: Guía Completa | Lowcost Traveling',
        metaDescription: 'Guía completa de República Dominicana para viajeros. Playas, ciudades, cultura, comida y consejos para viajar barato.',
        keywords: ['república dominicana', 'viajes', 'playas', 'guía', 'viajes baratos', '2026']
      }
    },
    de: {
      title: 'Vollständiger Reiseführer Dominikanische Republik 2026',
      intro: 'Entdecken Sie alles über die Dominikanische Republik - von den luxuriösen Stränden Punta Canas bis zu den kolonialen Schätzen Santo Domingos. Vollständiger Reiseführer für Ihre Reise.',
      seo: {
        metaTitle: 'Dominikanische Republik 2026: Vollständiger Reiseführer | Lowcost Traveling',
        metaDescription: 'Vollständiger Reiseführer Dominikanische Republik für Reisende. Strände, Städte, Kultur, Essen und Tipps für günstiges Reisen.',
        keywords: ['dominikanische republik', 'reisen', 'strände', 'reiseführer', 'günstig reisen', '2026']
      }
    }
  },

  // Santo Domingo Colonial City Guide
  'santo-domingo-colonial': {
    cs: {
      title: 'Santo Domingo: Koloniální město a UNESCO dědictví',
      intro: 'Prozkoumejte koloniální zónu Santo Dominga, první město Nového světa zapsané na seznam UNESCO.',
      seo: {
        metaTitle: 'Santo Domingo Koloniální: Průvodce UNESCO dědictvím',
        metaDescription: 'Průvodce koloniální zónou Santo Dominga, prvním městem Nového světa.',
        keywords: ['santo domingo', 'koloniální', 'unesco', 'dominikánská republika']
      }
    },
    es: {
      title: 'Santo Domingo: Ciudad Colonial y Patrimonio UNESCO',
      intro: 'Explora la zona colonial de Santo Domingo, la primera ciudad del Nuevo Mundo inscrita en la UNESCO.',
      seo: {
        metaTitle: 'Santo Domingo Colonial: Guía del Patrimonio UNESCO',
        metaDescription: 'Guía de la zona colonial de Santo Domingo, primera ciudad del Nuevo Mundo.',
        keywords: ['santo domingo', 'colonial', 'unesco', 'república dominicana']
      }
    },
    de: {
      title: 'Santo Domingo: Kolonialstadt und UNESCO-Erbe',
      intro: 'Erkunden Sie die Kolonialzone von Santo Domingo, die erste Stadt der Neuen Welt im UNESCO-Weltkulturerbe.',
      seo: {
        metaTitle: 'Santo Domingo Kolonial: UNESCO-Weltkulturerbe Führer',
        metaDescription: 'Führer durch die Kolonialzone von Santo Domingo, erste Stadt der Neuen Welt.',
        keywords: ['santo domingo', 'kolonial', 'unesco', 'dominikanische republik']
      }
    }
  },

  // Budget Travel Tips
  'dominican-budget-tips': {
    cs: {
      title: 'Levná dovolená v Dominikánské republice: Jak ušetřit',
      intro: 'Cestování do Dominikánské republiky nemusí být drahé. S chytrým plánováním a znalostí lokálních podmínek můžete užít tuto karibskou perlu při nízkých nákladech.',
      seo: {
        metaTitle: 'Levná dovolená Dominikánská republika: Tip pro úspory',
        metaDescription: 'Jak ušetřit při cestování do Dominikánské republiky. Lokální doprava, levné jídlo a insider tipy.',
        keywords: ['levné cestování', 'dominikánská republika', 'úspory', 'tipy', 'lokální doprava']
      }
    },
    es: {
      title: 'Viajar barato en República Dominicana: Cómo ahorrar',
      intro: 'Viajar a República Dominicana no tiene por qué ser caro. Con una planificación inteligente y conocimiento de las condiciones locales, puedes disfrutar de esta joya caribeña con bajo presupuesto.',
      seo: {
        metaTitle: 'Viaje económico República Dominicana: Consejos para ahorrar',
        metaDescription: 'Cómo ahorrar dinero viajando a República Dominicana. Transporte local, comida barata y consejos internos.',
        keywords: ['viaje económico', 'república dominicana', 'ahorrar', 'consejos', 'transporte local']
      }
    },
    de: {
      title: 'Günstig in die Dominikanische Republik reisen: Spartipps',
      intro: 'Eine Reise in die Dominikanische Republik muss nicht teuer sein. Mit cleverer Planung und Kenntnis der lokalen Gegebenheiten können Sie diese karibische Perle mit geringem Budget genießen.',
      seo: {
        metaTitle: 'Günstig Dominikanische Republik: Spartipps für Reisende',
        metaDescription: 'Wie man Geld beim Reisen in die Dominikanische Republik spart. Lokaler Transport, günstiges Essen und Insider-Tipps.',
        keywords: ['günstig reisen', 'dominikanische republik', 'sparen', 'tipps', 'lokaler transport']
      }
    }
  },

  // 7-Day Itinerary
  'dominican-7-day-itinerary': {
    cs: {
      title: '7-denní itinerář Dominikánské republiky: Ideální plán cesty',
      intro: 'Kompletní 7-denní itinerář Dominikánské republiky pokrývající pláže, města a kulturu. Perfektní pro první návštěvníky.',
      seo: {
        metaTitle: '7-denní itinerář Dominikánské republiky: Perfektní plán cesty',
        metaDescription: 'Kompletní 7-denní itinerář Dominikánské republiky pokrývající pláže, města a kulturu.',
        keywords: ['dominikánská republika itinerář', '7 dní', 'plán cesty', 'první návštěvníci']
      }
    },
    es: {
      title: 'Itinerario de 7 días en República Dominicana: Plan perfecto',
      intro: 'Itinerario completo de 7 días en República Dominicana cubriendo playas, ciudades y cultura. Perfecto para primeras visitas.',
      seo: {
        metaTitle: 'Itinerario 7 días República Dominicana: Plan perfecto de viaje',
        metaDescription: 'Itinerario completo de 7 días en República Dominicana cubriendo playas, ciudades y cultura.',
        keywords: ['república dominicana itinerario', '7 días', 'plan viaje', 'primeras visitas']
      }
    },
    de: {
      title: '7-Tage-Reiseroute Dominikanische Republik: Perfekter Reiseplan',
      intro: 'Vollständige 7-Tage-Reiseroute durch die Dominikanische Republik mit Stränden, Städten und Kultur. Perfekt für Erstbesucher.',
      seo: {
        metaTitle: '7-Tage-Reiseroute Dominikanische Republik: Perfekter Reiseplan',
        metaDescription: 'Vollständige 7-Tage-Reiseroute Dominikanische Republik mit Stränden, Städten und Kultur.',
        keywords: ['dominikanische republik reiseroute', '7 tage', 'reiseplan', 'erstbesucher']
      }
    }
  }
}

/**
 * Get translated content for a specific article and locale
 */
export function getArticleTranslation(articleId: string, locale: SupportedLocale): Partial<Article> | null {
  const translations = articleTranslations[articleId]
  if (!translations || locale === 'en') return null

  return translations[locale] || null
}

/**
 * Check if an article has translations for a specific locale
 */
export function hasArticleTranslation(articleId: string, locale: SupportedLocale): boolean {
  return articleTranslations[articleId]?.[locale] !== undefined
}

/**
 * Get all available locales for an article
 */
export function getArticleLocales(articleId: string): SupportedLocale[] {
  const translations = articleTranslations[articleId]
  if (!translations) return ['en']

  return ['en', ...Object.keys(translations)] as SupportedLocale[]
}