/**
 * i18n Module Tests
 *
 * Tests for internationalization functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  t,
  setLanguage,
  getCurrentLanguage,
  detectLanguage,
  hasTranslation,
  getSupportedLanguages,
  SUPPORTED_LANGUAGES
} from '../i18n/index.js';

describe('i18n Module', () => {
  describe('Language Detection', () => {
    it('should return supported languages array', () => {
      const languages = getSupportedLanguages();
      expect(languages).toBeInstanceOf(Array);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages).toContain('en');
      expect(languages).toContain('zh');
    });

    it('should detect language from environment', () => {
      const result = detectLanguage();
      console.log('Detection result:', result);
      expect(result).toBeDefined();
      expect(result.language).toBeDefined();
      expect(result.source).toBeDefined();
      expect(typeof result.language).toBe('string');
      expect(SUPPORTED_LANGUAGES.includes(result.language)).toBe(true);
    });

    it('should fallback to English when no language detected', () => {
      // Save original env
      const originalLang = process.env.LANG;
      const originalOmcLang = process.env.OMC_LANG;

      // Clear language env vars
      delete process.env.LANG;
      delete process.env.LC_ALL;
      delete process.env.LC_MESSAGES;
      delete process.env.OMC_LANG;

      const result = detectLanguage();
      expect(result.language).toBe('en');
      expect(result.source).toBe('fallback');

      // Restore env
      if (originalLang) process.env.LANG = originalLang;
      if (originalOmcLang) process.env.OMC_LANG = originalOmcLang;
    });

    it('should detect Chinese from LANG environment variable', () => {
      const originalLang = process.env.LANG;
      process.env.LANG = 'zh_CN.UTF-8';

      const result = detectLanguage();
      expect(result.language).toBe('zh');
      expect(result.source).toBe('system');

      if (originalLang) process.env.LANG = originalLang;
    });

    it('should prioritize OMC_LANG over LANG', () => {
      const originalOmcLang = process.env.OMC_LANG;
      const originalLang = process.env.LANG;

      process.env.LANG = 'en_US.UTF-8';
      process.env.OMC_LANG = 'zh_CN.UTF-8';

      const result = detectLanguage();
      expect(result.language).toBe('zh');
      expect(result.source).toBe('env');

      if (originalOmcLang) process.env.OMC_LANG = originalOmcLang;
      else delete process.env.OMC_LANG;
      if (originalLang) process.env.LANG = originalLang;
    });
  });

  describe('Language Switching', () => {
    it('should get current language', () => {
      const currentLang = getCurrentLanguage();
      console.log('Current language:', currentLang);
      expect(currentLang).toBeDefined();
      expect(typeof currentLang).toBe('string');
      expect(SUPPORTED_LANGUAGES.includes(currentLang)).toBe(true);
    });

    it('should change language to Chinese', () => {
      setLanguage('zh');
      expect(getCurrentLanguage()).toBe('zh');
    });

    it('should change language to English', () => {
      setLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
    });

    it('should warn when setting unsupported language', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      setLanguage('invalid' as any);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Translation', () => {
    beforeEach(() => {
      setLanguage('en');
    });

    it('should translate simple key to English', () => {
      const text = t('cli.config.valid');
      expect(text).toBe('Configuration is valid!');
    });

    it('should translate simple key to Chinese', () => {
      setLanguage('zh');
      const text = t('cli.config.valid');
      expect(text).toBe('配置有效！');
    });

    it('should handle interpolation in English', () => {
      setLanguage('en');
      const text = t('cli.errors.configInvalid', { message: 'test error' });
      expect(text).toBe('Configuration invalid: test error');
    });

    it('should handle interpolation in Chinese', () => {
      setLanguage('zh');
      const text = t('cli.errors.configInvalid', { message: '测试错误' });
      expect(text).toBe('配置无效: 测试错误');
    });

    it('should return key for missing translation', () => {
      const text = t('nonexistent.key');
      expect(text).toBe('nonexistent.key');
    });

    it('should check if translation exists', () => {
      expect(hasTranslation('cli.config.valid')).toBe(true);
      expect(hasTranslation('nonexistent.key')).toBe(false);
    });

    it('should translate nested keys', () => {
      setLanguage('en');
      expect(t('cli.config.pathsHeader')).toBe('Configuration file paths:');
      expect(t('cli.launch.description')).toBe('Launch Claude Code with native tmux shell integration');
    });

    it('should translate HUD status labels', () => {
      setLanguage('zh');
      expect(t('hud.status.running')).toBe('运行中');
      expect(t('hud.status.idle')).toBe('空闲');
      expect(t('hud.status.error')).toBe('错误');
    });

    it('should translate with multiple interpolation variables', () => {
      setLanguage('en');
      const text = t('hud.agents.active', { count: 5 });
      expect(text).toBe('Active agents: 5');
    });

    it('should handle plural forms (English)', () => {
      setLanguage('en');
      // Note: i18next handles plurals automatically with _one/_other suffixes
      // For now, we're using simple interpolation for Chinese
      const text = t('hud.agents.active', { count: 1 });
      expect(text).toContain('1');
    });
  });

  describe('Locale File Completeness', () => {
    it('should have all required keys in English locale', () => {
      const requiredKeys = [
        'cli.name',
        'cli.description',
        'cli.help.usage',
        'cli.config.description',
        'cli.errors.general',
        'hud.status.running',
        'hud.status.idle',
        'notifications.success',
        'notifications.failed',
        'common.enabled',
        'common.disabled'
      ];

      requiredKeys.forEach(key => {
        expect(hasTranslation(key)).toBe(true);
      });
    });

    it('should have all required keys in Chinese locale', () => {
      setLanguage('zh');
      const requiredKeys = [
        'cli.name',
        'cli.description',
        'cli.help.usage',
        'cli.config.description',
        'cli.errors.general',
        'hud.status.running',
        'hud.status.idle',
        'notifications.success',
        'notifications.failed',
        'common.enabled',
        'common.disabled'
      ];

      requiredKeys.forEach(key => {
        expect(hasTranslation(key)).toBe(true);
      });
    });

    it('should have matching keys in English and Chinese', () => {
      setLanguage('en');
      const enKeys = Object.keys(enLocale);

      setLanguage('zh');
      const zhKeys = Object.keys(zhLocale);

      // Both should have the same top-level keys
      expect(enKeys.sort()).toEqual(zhKeys.sort());
    });
  });
});

// Import locale files for testing
import enLocale from '../i18n/locales/en.json' with { type: 'json' };
import zhLocale from '../i18n/locales/zh.json' with { type: 'json' };