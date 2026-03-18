# i18n 功能说明

## 概述

oh-my-claudecode 现已支持完整的国际化（i18n）功能！

### ✨ 特性

- 🌐 **自动语言检测**：根据系统语言自动切换
- 🔄 **动态切换**：支持运行时切换语言
- 🤖 **自动翻译**：AI 驱动的自动翻译系统
- 📝 **易于维护**：简单的 JSON 格式翻译文件
- 🧪 **完整测试**：22 个测试确保翻译质量

### 🎯 支持的语言

- ✅ 简体中文 (zh) - 完整支持
- ✅ English (en) - 完整支持
- 📋 日本語、한국어 等 - 框架就绪

## 快速开始

### 使用中文

```bash
# 自动检测系统语言
omc --help
# 输出：多代理编排系统，让 Claude Code 更强大

omc config --validate
# 输出：正在验证配置...
```

### 切换到英文

```bash
# 通过环境变量
LANG=en_US.UTF-8 omc --help
# Output: Multi-agent orchestration system for Claude Agent SDK

# 或使用 OMC_LANG
OMC_LANG=en omc config --paths
```

## 自动化翻译

### 对于 Fork 项目

本项目提供完整的自动化翻译系统，自动同步上游更新：

```bash
# 1. 安装 Git Hook（一次性）
cp hooks/post-merge .git/hooks/
chmod +x .git/hooks/post-merge

# 2. 配置 API Key
export ANTHROPIC_API_KEY=your_key_here

# 3. 同步上游
git pull upstream main
# 自动检测新字符串！

# 4. 应用翻译
npm run i18n:apply
```

### GitHub Actions 自动化

设置 GitHub Actions 后，系统会：
- 每天自动检测上游更新
- 自动翻译新字符串
- 创建 Pull Request 供审核

详见：[自动化翻译文档](./docs/i18n-automation.md)

## 开发者指南

### 添加新翻译

```typescript
// 1. 导入翻译函数
import { t } from '../i18n/index.js';

// 2. 使用翻译
console.log(t('cli.config.valid'));
// 输出：配置有效！ (中文) / Configuration is valid! (英文)

// 3. 带变量的翻译
console.log(t('cli.errors.general', { message: 'test' }));
// 输出：错误: test / Error: test
```

### 翻译文件位置

```
src/i18n/
├── index.ts          # i18n 配置
├── types.ts          # 类型定义
└── locales/
    ├── en.json       # 英文翻译
    └── zh.json       # 中文翻译
```

## 文档

- 📖 [快速开始](./docs/i18n-quickstart.md) - 5 分钟上手
- 📚 [完整文档](./docs/i18n-automation.md) - 详细说明
- 🔧 [迁移指南](./docs/i18n-migration-guide.md) - 开发者指南
- 📊 [实施状态](./docs/i18n-status.md) - 当前进度

## 测试

```bash
# 运行 i18n 测试
npm test -- i18n.test.ts --run

# 测试中文输出
LANG=zh_CN.UTF-8 npm run build && node bridge/cli.cjs --help

# 测试英文输出
LANG=en_US.UTF-8 npm run build && node bridge/cli.cjs --help
```

## 命令

```bash
# 检测新字符串
npm run i18n:sync

# 应用翻译
npm run i18n:apply

# 检查完整性
npm run i18n:check
```

## 贡献翻译

欢迎贡献翻译！

1. Fork 项目
2. 编辑 `src/i18n/locales/zh.json`
3. 提交 Pull Request

## 常见问题

**Q: 如何切换语言？**
A: 设置 `LANG` 或 `OMC_LANG` 环境变量

**Q: 翻译不准确怎么办？**
A: 直接编辑 `src/i18n/locales/zh.json` 文件

**Q: 如何添加新语言？**
A: 复制 `en.json` 为新语言文件，翻译后提交 PR

**Q: 自动翻译需要付费吗？**
A: 使用 Claude API，翻译 1000 个字符串约 $0.30

## 路线图

- [x] 基础 i18n 基础设施
- [x] 中英文翻译
- [x] 自动化翻译系统
- [ ] 配置文件语言设置
- [ ] 日语、韩语支持
- [ ] 翻译管理界面

## 许可

MIT License