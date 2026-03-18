#!/usr/bin/env tsx

/**
 * i18n Sync Script
 *
 * Automatically syncs and translates new strings from upstream.
 * Detects new hardcoded strings, extracts them, and translates using AI.
 */

import { glob } from 'glob';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { translateFree, type FreeTranslationProvider } from './free-translation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

interface ExtractedString {
  file: string;
  line: number;
  text: string;
  context: string;
}

interface TranslationKey {
  key: string;
  en: string;
  zh?: string;
  autoTranslated?: boolean;
}

/**
 * Extract hardcoded strings from TypeScript files
 */
async function extractHardcodedStrings(): Promise<ExtractedString[]> {
  const files = await glob('src/**/*.ts', {
    cwd: ROOT_DIR,
    ignore: ['**/__tests__/**', '**/node_modules/**', '**/dist/**']
  });

  const strings: ExtractedString[] = [];
  const consoleRegex = /console\.(log|error|warn|info)\(\s*(['"`])([^'"`]+)\2/g;
  const chalkRegex = /chalk\.\w+\(\s*(['"`])([^'"`]+)\1\)/g;
  const descriptionRegex = /\.description\(\s*(['"`])([^'"`]+)\1\)/g;

  for (const file of files) {
    const content = readFileSync(join(ROOT_DIR, file), 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      // Extract console.log strings
      let match;
      while ((match = consoleRegex.exec(line)) !== null) {
        const text = match[3];
        if (text.length > 2 && !text.includes('${') && !text.startsWith('http')) {
          strings.push({
            file,
            line: lineNum + 1,
            text,
            context: line.trim()
          });
        }
      }

      // Extract chalk wrapped strings
      while ((match = chalkRegex.exec(line)) !== null) {
        const text = match[2];
        if (text.length > 2 && !text.includes('${') && !text.startsWith('http')) {
          strings.push({
            file,
            line: lineNum + 1,
            text,
            context: line.trim()
          });
        }
      }

      // Extract .description() strings
      while ((match = descriptionRegex.exec(line)) !== null) {
        const text = match[2];
        if (text.length > 2 && !text.includes('${')) {
          strings.push({
            file,
            line: lineNum + 1,
            text,
            context: line.trim()
          });
        }
      }
    });
  }

  return strings;
}

/**
 * Load existing translations
 */
function loadExistingTranslations(): Map<string, TranslationKey> {
  const enPath = join(ROOT_DIR, 'src/i18n/locales/en.json');
  const zhPath = join(ROOT_DIR, 'src/i18n/locales/zh.json');

  const enLocale = JSON.parse(readFileSync(enPath, 'utf-8'));
  const zhLocale = JSON.parse(readFileSync(zhPath, 'utf-8'));

  const translations = new Map<string, TranslationKey>();

  // Flatten nested keys
  function flatten(obj: any, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        translations.set(fullKey, {
          key: fullKey,
          en: value,
          zh: zhLocale[fullKey]
        });
      } else if (typeof value === 'object') {
        flatten(value, fullKey);
      }
    }
  }

  flatten(enLocale);
  return translations;
}

/**
 * Check if a string already has a translation
 */
function hasTranslation(text: string, translations: Map<string, TranslationKey>): boolean {
  for (const [, value] of translations) {
    if (value.en === text || value.zh === text) {
      return true;
    }
  }
  return false;
}

/**
 * Generate translation key from text
 */
function generateTranslationKey(text: string, file: string): string {
  // Extract module from file path
  const module = file.replace('src/', '').split('/')[0];

  // Generate key from text
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .split('.')
    .slice(0, 3)
    .join('.');

  return `${module}.${key}`;
}

/**
 * Translate text using FREE translation services
 *
 * Supported providers (all FREE, no API key required):
 * - mymemory (default): 5000 chars/day free
 * - lingva: Open source Google Translate frontend
 * - libretranslate: Open source translation
 * - google-free: Google Translate without API key
 */
async function translateWithAI(text: string): Promise<string> {
  const provider = (process.env.I18N_FREE_PROVIDER || 'mymemory') as FreeTranslationProvider;

  console.log(chalk.gray(`  Using: ${provider} (free)`));
  return await translateFree(text, provider);
}

/**
 * Main sync function
 */
async function syncTranslations() {
  console.log(chalk.blue('🔍 Scanning for hardcoded strings...\n'));

  // Extract strings
  const strings = await extractHardcodedStrings();
  console.log(chalk.gray(`Found ${strings.length} hardcoded strings\n`));

  // Load existing translations
  const translations = loadExistingTranslations();
  console.log(chalk.gray(`Loaded ${translations.size} existing translations\n`));

  // Find new strings
  const newStrings = strings.filter(s => !hasTranslation(s.text, translations));

  if (newStrings.length === 0) {
    console.log(chalk.green('✓ All strings are already translated!\n'));
    return;
  }

  console.log(chalk.yellow(`📝 Found ${newStrings.length} new strings to translate:\n`));

  // Group by file
  const byFile = new Map<string, ExtractedString[]>();
  for (const str of newStrings) {
    if (!byFile.has(str.file)) {
      byFile.set(str.file, []);
    }
    byFile.get(str.file)!.push(str);
  }

  // Display new strings
  for (const [file, strs] of byFile) {
    console.log(chalk.cyan(`${file}:`));
    for (const str of strs) {
      console.log(chalk.gray(`  Line ${str.line}: "${str.text}"`));
    }
    console.log();
  }

  // Auto-translate
  console.log(chalk.blue('🤖 Auto-translating new strings...\n'));

  const newTranslations: TranslationKey[] = [];

  for (const str of newStrings) {
    const key = generateTranslationKey(str.text, str.file);
    console.log(chalk.gray(`  Translating: "${str.text}"`));

    const zhText = await translateWithAI(str.text);

    newTranslations.push({
      key,
      en: str.text,
      zh: zhText,
      autoTranslated: true
    });

    console.log(chalk.green(`  ✓ ${key}: "${zhText}"\n`));
  }

  // Generate report
  const reportPath = join(ROOT_DIR, '.omc/i18n-sync-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    newStringsCount: newStrings.length,
    newTranslations,
    files: Array.from(byFile.keys())
  };

  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(chalk.blue(`\n📄 Report saved to: ${reportPath}\n`));

  // Ask to apply translations
  console.log(chalk.yellow('To apply these translations, run:'));
  console.log(chalk.cyan('  npm run i18n:apply\n'));
}

/**
 * Apply pending translations
 */
async function applyTranslations() {
  const reportPath = join(ROOT_DIR, '.omc/i18n-sync-report.json');

  if (!existsSync(reportPath)) {
    console.log(chalk.red('No pending translations found. Run `npm run i18n:sync` first.\n'));
    return;
  }

  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));

  // Load existing locales
  const enPath = join(ROOT_DIR, 'src/i18n/locales/en.json');
  const zhPath = join(ROOT_DIR, 'src/i18n/locales/zh.json');

  const enLocale = JSON.parse(readFileSync(enPath, 'utf-8'));
  const zhLocale = JSON.parse(readFileSync(zhPath, 'utf-8'));

  // Add new translations
  for (const trans of report.newTranslations) {
    const keys = trans.key.split('.');
    let enCurrent: any = enLocale;
    let zhCurrent: any = zhLocale;

    // Navigate to the correct nested object
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      // Check if current is an object (not a string)
      if (typeof enCurrent !== 'object' || enCurrent === null) {
        enCurrent = {};
      }
      if (typeof zhCurrent !== 'object' || zhCurrent === null) {
        zhCurrent = {};
      }
      if (!enCurrent[k]) enCurrent[k] = {};
      if (!zhCurrent[k]) zhCurrent[k] = {};
      enCurrent = enCurrent[k];
      zhCurrent = zhCurrent[k];
    }

    // Set the translation
    const finalKey = keys[keys.length - 1];
    if (typeof enCurrent === 'object' && enCurrent !== null) {
      enCurrent[finalKey] = trans.en;
    }
    if (typeof zhCurrent === 'object' && zhCurrent !== null) {
      zhCurrent[finalKey] = trans.zh;
    }
  }

  // Write back
  writeFileSync(enPath, JSON.stringify(enLocale, null, 2) + '\n');
  writeFileSync(zhPath, JSON.stringify(zhLocale, null, 2) + '\n');

  console.log(chalk.green(`✓ Applied ${report.newTranslationsCount} translations\n`));

  // Clean up report
  writeFileSync(reportPath, JSON.stringify({ ...report, applied: true }, null, 2));
}

// CLI
const command = process.argv[2];

if (command === 'apply') {
  applyTranslations();
} else {
  syncTranslations();
}