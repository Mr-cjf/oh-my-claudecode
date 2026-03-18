#!/usr/bin/env tsx

/**
 * i18n Demo - Test the free translation workflow
 *
 * This script demonstrates the i18n workflow without modifying actual files.
 */

import { translateFree } from './free-translation.js';
import chalk from 'chalk';

async function demo() {
  console.log(chalk.blue('🎯 i18n Free Translation Demo\n'));

  // Sample strings to translate
  const testStrings = [
    'Configuration is valid!',
    'Team started successfully',
    'Agent spawned',
    'Context limit warning',
    'Operation failed: network error'
  ];

  console.log(chalk.cyan('Test Strings:'));
  testStrings.forEach((s, i) => console.log(`  ${i + 1}. "${s}"`));
  console.log();

  console.log(chalk.blue('Testing with MyMemory (Free)...\n'));

  for (let i = 0; i < testStrings.length; i++) {
    const text = testStrings[i];
    console.log(chalk.gray(`Translating ${i + 1}/${testStrings.length}: "${text}"`));

    const translation = await translateFree(text, 'mymemory');

    console.log(chalk.green(`  ✓ Result: "${translation}"\n`));

    // Delay to avoid rate limiting
    if (i < testStrings.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(chalk.blue('🎉 Demo completed successfully!\n'));

  console.log(chalk.cyan('Summary:'));
  console.log(`  - Tested ${testStrings.length} strings`);
  console.log('  - Used: MyMemory API (Free)');
  console.log('  - Cost: $0.00');
  console.log('  - Quality: Good');
  console.log();
  console.log(chalk.yellow('Next steps:'));
  console.log('  1. Run: npm run i18n:sync');
  console.log('  2. Run: npm run i18n:apply');
  console.log('  3. Test: npm run build && omc --help');
  console.log();
}

demo().catch(console.error);