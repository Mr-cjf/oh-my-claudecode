#!/usr/bin/env node

/**
 * i18n CLI Demo - Show actual translation effect in CLI
 */

import { t, setLanguage, getCurrentLanguage } from '../src/i18n/index.js';
import chalk from 'chalk';

console.log(chalk.blue('🌐 i18n Translation Demo\n'));

// Show current language
console.log(chalk.gray(`Current language: ${getCurrentLanguage()}\n`));

// Demo 1: Welcome message
console.log(chalk.cyan('Demo 1: Welcome Message'));
console.log(chalk.green(t('cli.demo.welcome')));
console.log();

// Demo 2: Team operations
console.log(chalk.cyan('Demo 2: Team Operations'));
console.log(`  ${chalk.green('✓')} ${t('cli.demo.teamStarted')}`);
console.log(`  ${chalk.blue('ℹ')} ${t('cli.demo.agentActive')}`);
console.log();

// Demo 3: Configuration
console.log(chalk.cyan('Demo 3: Configuration'));
console.log(`  ${chalk.green('✓')} ${t('cli.demo.configValid')}`);
console.log();

// Demo 4: Operations
console.log(chalk.cyan('Demo 4: Operations'));
console.log(`  ${chalk.green('✓')} ${t('cli.demo.operationComplete')}`);
console.log();

// Switch to English
console.log(chalk.yellow('--- Switching to English ---\n'));
setLanguage('en');

console.log(chalk.cyan('Demo in English:'));
console.log(chalk.green(t('cli.demo.welcome')));
console.log(`  ${chalk.green('✓')} ${t('cli.demo.teamStarted')}`);
console.log(`  ${chalk.green('✓')} ${t('cli.demo.configValid')}`);
console.log();

// Switch back to Chinese
console.log(chalk.yellow('--- Switching back to Chinese ---\n'));
setLanguage('zh');

console.log(chalk.cyan('Demo in Chinese:'));
console.log(chalk.green(t('cli.demo.welcome')));
console.log(`  ${chalk.green('✓')} ${t('cli.demo.teamStarted')}`);
console.log(`  ${chalk.green('✓')} ${t('cli.demo.configValid')}`);
console.log();

console.log(chalk.blue('✅ Demo completed!\n'));

console.log(chalk.gray('This demonstrates:'));
console.log('  - Automatic language detection');
console.log('  - Dynamic language switching');
console.log('  - Free translation quality');
console.log('  - Real CLI output');
console.log();