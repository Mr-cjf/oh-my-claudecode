# i18n 免费翻译 - 5 分钟上手

## 🎉 完全免费！无需 API Key！

### 快速测试

```bash
# 测试所有免费服务
npm run i18n:test-translation

# 测试结果示例：
# 1. MyMemory API: ✅ 配置有效！
# 2. Lingva Translate: ✅ 配置有效！
# 3. LibreTranslate: ⚠ [待翻译]
# 4. Google-Free: ⚠ [待翻译]
```

### 立即使用

```bash
# 1. 检测新字符串
npm run i18n:sync

# 2. 应用翻译（默认使用 MyMemory）
npm run i18n:apply

# 3. 测试中文
npm run build
omc --help
```

### 推荐服务

**MyMemory（推荐）**：
```bash
export I18N_FREE_PROVIDER=mymemory
npm run i18n:apply
```
- ✅ 每天 5000 字免费
- ✅ 稳定可靠
- ✅ 无需注册

**Lingva（高质量）**：
```bash
export I18N_FREE_PROVIDER=lingva
npm run i18n:apply
```
- ✅ 无限制
- ✅ Google 翻译质量
- ✅ 开源免费

### GitHub Actions 自动化

在 workflow 中添加：

```yaml
- name: Auto-translate
  run: npm run i18n:apply
  env:
    I18N_FREE_PROVIDER: mymemory
```

**无需配置任何 Secret！**

### 命令速查

```bash
npm run i18n:sync              # 检测新字符串
npm run i18n:apply             # 应用翻译
npm run i18n:test-translation  # 测试所有服务
npm run i18n:test-provider mymemory "Hello"  # 测试特定服务
```

### 对比

| 服务 | 免费 | 无需注册 | 质量 | 限制 |
|------|------|----------|------|------|
| **MyMemory** | ✅ | ✅ | ⭐⭐⭐⭐ | 5000字/天 |
| **Lingva** | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 无限制 |
| **LibreTranslate** | ✅ | ✅ | ⭐⭐⭐ | 不稳定 |
| **Google-Free** | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 可能限流 |

### 常见问题

**Q: 完全免费吗？**
A: 是的！所有服务都免费，无需付费 API

**Q: 需要注册吗？**
A: 不需要！开箱即用

**Q: 推荐哪个？**
A: 日常用 MyMemory（稳定），高质量用 Lingva

**Q: GitHub Actions 能用吗？**
A: 能！无需配置 Secret

### 示例

```bash
# 完整流程
git pull upstream main        # 同步上游
npm run i18n:sync            # 检测新字符串
npm run i18n:apply           # 应用翻译
npm run build                # 构建
omc --help                   # 测试中文
git add . && git commit      # 提交
```

### 文档

- 📖 [详细文档](./i18n-free-translation.md)
- 📚 [自动化系统](./i18n-automation.md)
- 🔧 [迁移指南](./i18n-migration-guide.md)

### 成功案例

```bash
$ npm run i18n:test-translation

Testing free translation services:

1. MyMemory API:
   Result: 配置有效！  ✅

2. Lingva Translate:
   Result: 配置有效！  ✅
```

---

## 开始使用

```bash
# 立即开始！
npm run i18n:sync
npm run i18n:apply
```

完全免费，无需任何配置！🚀