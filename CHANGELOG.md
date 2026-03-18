# Changelog

## [4.9.0] - 2026-03-18

### 🌐 Added - Internationalization (i18n)

**Full i18n Support!**

Complete internationalization system with **completely FREE translation** - no API keys required!

**Features:**
- ✅ Automatic language detection (Chinese, English, Japanese, Korean, etc.)
- ✅ Dynamic language switching at runtime
- ✅ Free translation services (MyMemory, Lingva, LibreTranslate)
- ✅ Auto-sync from upstream updates via Git hooks & GitHub Actions
- ✅ TypeScript support with type-safe translation keys
- ✅ Simple API: `t('key.path')`

**Quick Start:**
```bash
# Chinese (automatic)
omc --help

# English
LANG=en_US.UTF-8 omc --help

# Test
npm run i18n:demo
```

**For Fork Maintainers:**
```bash
npm run i18n:sync    # Detect new strings
npm run i18n:apply   # Apply free translations
```

**Documentation:**
- [i18n Quick Start](docs/i18n-free-quickstart.md)
- [Free Translation Guide](docs/i18n-free-translation.md)
- [Demo Results](docs/i18n-demo-results.md)

**New Scripts:**
- `npm run i18n:sync` - Detect new strings
- `npm run i18n:apply` - Apply translations
- `npm run i18n:demo` - Run demo
- `npm run i18n:test-translation` - Test free services

**Dependencies:**
- `i18next` - i18n framework
- `glob` - File pattern matching

**Cost:** $0.00 - Completely free! 🎉

---

## [4.8.2] - Previous Release

# oh-my-claudecode v4.8.2: Major Hotfixes

## Release Notes

Hotfix release addressing **CCG skill nesting**, **team runtime enhancements**, **ralph/ralplan hook reliability**, **dead code cleanup**, and **deep-interview convergence tracking**.

### Hotfixes

- **fix(ccg): use CLI-first path for ask advisors** — Skill nesting is unsupported in Claude Code; CCG now routes advisor calls through the CLI path instead. (#1662)
- **fix(hooks): fix ralph/ralplan stop hook not auto-continuing** — Stop hooks now correctly resume ralph/ralplan iterations instead of halting. (#1660)
- **fix: remove dead code from deprecated features** — Cleaned up unused code paths from previously deprecated functionality. (#1659)

### Enhancements

- **feat(team): backport 6 OMX team runtime enhancements** — Brings team worker stability, mailbox handling, shell affinity, and allocation improvements from OMX upstream. (#1658, #1540)
- **feat(deep-interview): add ontology convergence tracking** — Inspired by Q00/ouroboros, adds mathematical convergence metrics to deep-interview sessions. (#1657)

### Install / Update

```bash
npm install -g oh-my-claude-sisyphus@4.8.2
```

Or reinstall the plugin:

```bash
claude /install-plugin oh-my-claudecode
```

**Full Changelog**: https://github.com/Yeachan-Heo/oh-my-claudecode/compare/v4.8.1...v4.8.2
