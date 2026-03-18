# i18n Migration Guide

This guide explains how to migrate hardcoded strings to use the i18n system in oh-my-claudecode.

## Quick Start

### 1. Import the translation function

```typescript
import { t } from '../i18n/index.js';
```

### 2. Replace hardcoded strings

**Simple strings**:
```typescript
// Before
console.log('Configuration is valid!');

// After
console.log(t('cli.config.valid'));
```

**Strings with variables**:
```typescript
// Before
console.log(`Error: ${message}`);

// After
console.log(t('cli.errors.general', { message }));
```

**Colored output**:
```typescript
// Before
console.log(chalk.blue('Configuration file paths:'));

// After
console.log(chalk.blue(t('cli.config.pathsHeader')));
```

## Step-by-Step Migration

### Step 1: Identify strings to translate

**DO translate**:
- User-facing messages (console.log, console.error, console.warn)
- Help text and descriptions
- Error messages
- Status labels
- Command descriptions

**DO NOT translate**:
- Command names (e.g., `team`, `config`)
- Option names (e.g., `--validate`, `--paths`)
- Debug/log messages (intended for developers)
- File paths
- URLs
- Code identifiers

### Step 2: Add translation keys

Add keys to both locale files:

**`src/i18n/locales/en.json`**:
```json
{
  "cli": {
    "myCommand": {
      "description": "My command description",
      "success": "Operation completed successfully",
      "error": "Operation failed: {{reason}}"
    }
  }
}
```

**`src/i18n/locales/zh.json`**:
```json
{
  "cli": {
    "myCommand": {
      "description": "我的命令描述",
      "success": "操作成功完成",
      "error": "操作失败: {{reason}}"
    }
  }
}
```

### Step 3: Update the code

```typescript
// Before
program
  .command('my-command')
  .description('My command description')
  .action(() => {
    console.log('Operation completed successfully');
  });

// After
import { t } from '../i18n/index.js';

program
  .command('my-command')
  .description(t('cli.myCommand.description'))
  .action(() => {
    console.log(t('cli.myCommand.success'));
  });
```

## Common Patterns

### Interpolation

Use `{{variable}}` in locale files:

```json
{
  "hud": {
    "agents": {
      "active": "Active agents: {{count}}"
    }
  }
}
```

Use in code:
```typescript
t('hud.agents.active', { count: 5 })
```

### Chalk integration

```typescript
// Combine chalk with t()
console.log(chalk.green(t('cli.config.valid')));
console.log(chalk.red(t('cli.errors.general', { message })));
console.log(chalk.blue(t('cli.config.pathsHeader')));
```

### Commander descriptions

```typescript
program
  .command('example')
  .description(t('cli.example.description'))
  .option('-v, --verbose', t('cli.example.verboseOption'))
  .action(() => {
    console.log(t('cli.example.success'));
  });
```

### Error handling

```typescript
try {
  // ... operation
  console.log(t('cli.operation.success'));
} catch (error) {
  console.error(chalk.red(t('cli.errors.operationFailed', {
    reason: error.message
  })));
  process.exit(1);
}
```

## Translation Key Naming Convention

Use hierarchical, descriptive keys:

```
<module>.<component>.<message>
```

Examples:
- `cli.config.valid` - CLI module, config component, valid message
- `hud.status.running` - HUD module, status component, running label
- `notifications.success` - Notifications module, success message
- `common.enabled` - Common strings, enabled label

## Testing

### Verify translations exist

```typescript
import { hasTranslation } from '../i18n/index.js';

if (hasTranslation('cli.myCommand.success')) {
  console.log(t('cli.myCommand.success'));
}
```

### Test language switching

```bash
# Test English
LANG=en_US.UTF-8 npm run build && node bridge/cli.cjs --help

# Test Chinese
LANG=zh_CN.UTF-8 npm run build && node bridge/cli.cjs --help
```

### Run i18n tests

```bash
npm test -- i18n.test.ts --run
```

## Checklist for PRs

When adding new user-facing text:

- [ ] Import `t` function from `../i18n/index.js`
- [ ] Add translation keys to `en.json` and `zh.json`
- [ ] Replace hardcoded strings with `t('key')`
- [ ] Use interpolation for dynamic values
- [ ] Test with both English and Chinese
- [ ] Run `npm test -- i18n.test.ts --run`
- [ ] Build succeeds: `npm run build`

## Troubleshooting

### Translation not showing?

1. Check the key exists in both `en.json` and `zh.json`
2. Verify the import: `import { t } from '../i18n/index.js'`
3. Check your current language: `console.log(process.env.LANG)`
4. Try explicit language: `LANG=en_US.UTF-8 node bridge/cli.cjs`

### Seeing the key instead of translation?

The key might not exist. Check:
- Spelling matches exactly
- Key exists in locale file
- JSON is valid (no syntax errors)

### Build fails with type errors?

Make sure:
- Import path is correct
- Using `import { t }` not `import t`
- Type definitions in `src/i18n/types.ts` are correct

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [Project i18n Status](./i18n-status.md)
- [Translation Files](../src/i18n/locales/)

## Getting Help

- Check existing migrations in `src/cli/index.ts` for examples
- Run tests to verify your changes
- Ask in GitHub issues if you have questions

## Note on i18next Promotional Message

You may see this message at startup:
```
🌐 i18next is made possible by our own product, Locize...
```

This is normal and comes from the i18next library. It can be suppressed in production builds if desired.