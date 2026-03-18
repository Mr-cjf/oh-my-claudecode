#!/usr/bin/env tsx

/**
 * i18n Quick Demo - Apply a few translations to see immediate effect
 */

import { glob } from 'glob';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { translateFree } from './free-translation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

async function quickDemo() {
  console.log(chalk.blue('🎯 Quick Demo - Translating 5 CLI strings\n'));

  // Key CLI strings to translate
  const demoTranslations = {
    'cli.demo.welcome': {
      en: 'Welcome to OMC!',
      zh: ''
    },
    'cli.demo.teamStarted': {
      en: 'Team started successfully',
      zh: ''
    },
    'cli.demo.agentActive': {
      en: 'Agent is now active',
      zh: ''
    },
    'cli.demo.configValid': {
      en: 'Configuration validated successfully',
      zh: ''
    },
    'cli.demo.operationComplete': {
      en: 'Operation completed',
      zh: ''
    }
  };

  // Translate each string
  console.log(chalk.cyan('Translating with MyMemory (Free)...\n'));

  for (const [key, value] of Object.entries(demoTranslations)) {
    console.log(chalk.gray(`  Translating: "${value.en}"`));

    const translation = await translateFree(value.en, 'mymemory');
    value.zh = translation;

    console.log(chalk.green(`  ✓ ${key}: "${translation}"\n`));

    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Load existing locale files
  const enPath = join(ROOT_DIR, 'src/i18n/locales/en.json');
  const zhPath = join(ROOT_DIR, 'src/i18n/locales/zh.json');

  const enLocale = JSON.parse(readFileSync(enPath, 'utf-8'));
  const zhLocale = JSON.parse(readFileSync(zhPath, 'utf-8'));

  // Add demo section
  enLocale.cli.demo = {};
  zhLocale.cli.demo = {};

  for (const [key, value] of Object.entries(demoTranslations)) {
    const parts = key.split('.');
    enLocale.cli.demo[parts[2]] = value.en;
    zhLocale.cli.demo[parts[2]] = value.zh;
  }

  // Write back
  writeFileSync(enPath, JSON.stringify(enLocale, null, 2) + '\n');
  writeFileSync(zhPath, JSON.stringify(zhLocale, null, 2) + '\n');

  console.log(chalk.green('✓ Translations added to locale files!\n'));

  // Show the changes
  console.log(chalk.cyan('Added to en.json:'));
  console.log(JSON.stringify(enLocale.cli.demo, null, 2));
  console.log();

  console.log(chalk.cyan('Added to zh.json:'));
  console.log(JSON.stringify(zhLocale.cli.demo, null, 2));
  console.log();

  console.log(chalk.yellow('Next: Test the translations'));
  console.log('  1. Run: npm run build');
  console.log('  2. Test: node -e "const {t} = require(\'./dist/i18n/index.js\'); console.log(t(\'cli.demo.welcome\'))"');
  console.log();
}

quickDemo().catch(console.error);