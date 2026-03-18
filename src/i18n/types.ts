/**
 * i18n Types for OMC
 *
 * Type definitions for internationalization support
 */

export type SupportedLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'de' | 'es' | 'fr' | 'it' | 'pt' | 'ru' | 'tr' | 'vi';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'tr', 'vi'
];

/**
 * Language detection result with source information
 */
export interface LanguageDetectionResult {
  language: SupportedLanguage;
  source: 'config' | 'env' | 'system' | 'fallback';
}

/**
 * Translation key paths for type safety
 */
export type TranslationKey = string;