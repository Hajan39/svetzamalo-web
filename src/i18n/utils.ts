import type { APIContext } from 'astro';
import type { SupportedLocale } from '@/types';
import { defaultLang, languages, showDefaultLang, ui, type UiKey, type UiLanguage } from './ui';

export function getLangFromUrl(url: URL): UiLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in ui) return lang as UiLanguage;
  return defaultLang;
}

export function useTranslations(lang: UiLanguage) {
  return function t(key: UiKey): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLocaleFromAstro(context: Pick<APIContext, 'url'>): SupportedLocale {
  const lang = getLangFromUrl(context.url);
  return lang === 'en' ? 'en' : defaultLang;
}

export function useTranslatedPath(lang: UiLanguage) {
  return function translatePath(path: string, targetLang: UiLanguage = lang): string {
    if (!path.startsWith('/')) return path;
    if (!showDefaultLang && targetLang === defaultLang) return path;
    return path === '/' ? `/${targetLang}` : `/${targetLang}${path}`;
  };
}

export function stripLocalePrefix(pathname: string): string {
  const [, maybeLocale, ...rest] = pathname.split('/');
  if (maybeLocale && maybeLocale in languages) {
    const normalized = `/${rest.join('/')}`.replace(/\/+/g, '/');
    return normalized === '/' ? '/' : normalized.replace(/\/$/, '');
  }
  return pathname;
}

export function switchLocalePath(pathnameWithSearch: string, targetLocale: UiLanguage): string {
  const [pathWithQuery, hash = ''] = pathnameWithSearch.split('#');
  const [pathname, query = ''] = pathWithQuery.split('?');
  const normalizedPath = stripLocalePrefix(pathname || '/');
  const translatePath = useTranslatedPath(targetLocale);
  const localizedPath = translatePath(normalizedPath || '/');
  const queryPart = query ? `?${query}` : '';
  const hashPart = hash ? `#${hash}` : '';
  return `${localizedPath}${queryPart}${hashPart}`;
}

export function withLocalePath(path: string, locale: SupportedLocale): string {
  const translatePath = useTranslatedPath(locale);
  return translatePath(path);
}
