/**
 * OMC i18n - Internationalization Module
 *
 * Provides multi-language support for OMC CLI output.
 * Automatically detects system language and falls back to English.
 */

import i18next from 'i18next';
import type { SupportedLanguage, LanguageDetectionResult } from './types.js';
import { SUPPORTED_LANGUAGES } from './types.js';

// Re-export types and constants
export { SUPPORTED_LANGUAGES } from './types.js';
export type { SupportedLanguage, LanguageDetectionResult } from './types.js';

// Import locale files
import enLocale from './locales/en.json' with { type: 'json' };
import zhLocale from './locales/zh.json' with { type: 'json' };

/**
 * Detect system language from environment variables
 */
function detectSystemLanguage(): SupportedLanguage {
  const envLang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || '';

  // Extract language code (e.g., 'zh_CN.UTF-8' -> 'zh', 'en_US' -> 'en')
  const langCode = envLang.split('.')[0].split('_')[0].toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
    return langCode as SupportedLanguage;
  }

  // Default to English
  return 'en';
}

/**
 * Detect language with source information
 * Priority: OMC_LANG env > LANG env > system detection > fallback to 'en'
 */
export function detectLanguage(): LanguageDetectionResult {
  // Check OMC_LANG environment variable
  const omcLang = process.env.OMC_LANG;
  if (omcLang) {
    const langCode = omcLang.split('.')[0].split('_')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
      return { language: langCode as SupportedLanguage, source: 'env' };
    }
  }

  // Check standard LANG environment variables
  const systemLang = detectSystemLanguage();
  if (systemLang !== 'en') {
    return { language: systemLang, source: 'system' };
  }

  // Fallback to English
  return { language: 'en', source: 'fallback' };
}

/**
 * Initialize i18next with locale resources
 */
i18next.init({
  lng: detectLanguage().language,
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  initImmediate: false, // Synchronous loading for CLI
  debug: false, // Disable debug output
  showSupportNotice: false, // Suppress promotional message
  resources: {
    en: { translation: enLocale },
    zh: { translation: zhLocale },
    // Other languages will be added as locale files are created
  },
  interpolation: {
    escapeValue: false, // CLI output doesn't need HTML escaping
  },
  returnEmptyString: false, // Return key if translation is empty
  returnNull: false, // Return key if translation is null
});

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return i18next.language as SupportedLanguage;
}

/**
 * Change language dynamically
 */
export function setLanguage(lang: SupportedLanguage): void {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    i18next.changeLanguage(lang);
  } else {
    console.warn(`Unsupported language: ${lang}. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
}

/**
 * Translation function
 * Usage: t('cli.config.valid') or t('cli.errors.invalid', { message: 'test' })
 */
export const t = i18next.t.bind(i18next);

/**
 * Check if a translation key exists
 */
export function hasTranslation(key: string): boolean {
  return i18next.exists(key);
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): SupportedLanguage[] {
  return [...SUPPORTED_LANGUAGES];
}

export default i18next;