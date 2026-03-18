# 免费翻译服务配置指南

## 概述

i18n 系统现在支持**完全免费**的翻译服务，无需任何 API Key！

## 支持的免费服务

### 1. MyMemory API（推荐）

**特点**：
- ✅ 完全免费
- ✅ 无需注册
- ✅ 每天 5000 字符
- ✅ 稳定可靠

**使用**：
```bash
export I18N_FREE_PROVIDER=mymemory
npm run i18n:apply
```

**限制**：
- 每天 5000 字符
- 超过后会被拒绝服务

---

### 2. Lingva Translate

**特点**：
- ✅ 开源免费
- ✅ 无需注册
- ✅ 无限制
- ✅ 基于 Google Translate

**使用**：
```bash
export I18N_FREE_PROVIDER=lingva
npm run i18n:apply
```

**公共实例**：
- https://lingva.ml
- https://translate.plausibility.cloud
- https://lingva.lunar.icu

---

### 3. LibreTranslate

**特点**：
- ✅ 开源免费
- ✅ 自托管可选
- ✅ 无需注册
- ✅ 隐私友好

**使用**：
```bash
export I18N_FREE_PROVIDER=libretranslate
npm run i18n:apply
```

**公共实例**：
- https://libretranslate.de
- https://translate.argosopentech.com
- https://translate.terraprint.co

---

### 4. Google Translate（免费版）

**特点**：
- ✅ 完全免费
- ✅ 无需 API Key
- ✅ 高质量翻译
- ⚠️ 可能被限流

**使用**：
```bash
export I18N_FREE_PROVIDER=google-free
npm run i18n:apply
```

**注意**：
- 使用非官方接口
- 大量请求可能被限制
- 建议配合延迟使用

---

## 快速开始

### 测试翻译服务

```bash
# 测试所有免费服务
npm run i18n:test-translation

# 测试特定服务
npm run i18n:test-provider mymemory "Hello world"
npm run i18n:test-provider lingva "Configuration is valid"
npm run i18n:test-provider libretranslate "Team started"
npm run i18n:test-provider google-free "Error occurred"
```

### 使用默认服务（MyMemory）

```bash
# 检测新字符串
npm run i18n:sync

# 应用翻译（使用 MyMemory）
npm run i18n:apply
```

### 切换翻译服务

```bash
# 方式 1: 环境变量
export I18N_FREE_PROVIDER=lingva
npm run i18n:apply

# 方式 2: 临时使用
I18N_FREE_PROVIDER=google-free npm run i18n:apply

# 方式 3: 写入 .env 文件
echo "I18N_FREE_PROVIDER=mymemory" >> .env
npm run i18n:apply
```

---

## 服务对比

| 服务 | 免费 | 无需注册 | 质量 | 限制 | 推荐度 |
|------|------|----------|------|------|--------|
| **MyMemory** | ✅ | ✅ | ⭐⭐⭐⭐ | 5000字/天 | ⭐⭐⭐⭐⭐ |
| **Lingva** | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 无限制 | ⭐⭐⭐⭐ |
| **LibreTranslate** | ✅ | ✅ | ⭐⭐⭐ | 取决于实例 | ⭐⭐⭐ |
| **Google-Free** | ✅ | ✅ | ⭐⭐⭐⭐⭐ | 可能限流 | ⭐⭐⭐ |

---

## 推荐配置

### 日常使用（推荐）

```bash
# 使用 MyMemory（稳定可靠）
export I18N_FREE_PROVIDER=mymemory
```

### 大量翻译

```bash
# 使用 Lingva（无限制）
export I18N_FREE_PROVIDER=lingva
```

### 最高质量

```bash
# 使用 Google-Free（可能限流）
export I18N_FREE_PROVIDER=google-free
```

---

## 批量翻译优化

对于大量字符串，脚本会自动添加延迟避免被限流：

```typescript
// 自动延迟 500ms
await new Promise(resolve => setTimeout(resolve, 500));
```

翻译 100 个字符串大约需要：
- MyMemory: ~50 秒
- Lingva: ~50 秒
- Google-Free: ~50 秒

---

## GitHub Actions 配置

在 `.github/workflows/i18n-auto-sync.yml` 中：

```yaml
- name: Auto-translate new strings
  run: npm run i18n:apply
  env:
    I18N_FREE_PROVIDER: mymemory  # 使用免费服务
```

**无需配置任何 Secret！**

---

## 本地使用

### Git Hook 自动翻译

```bash
# 安装 hook
cp hooks/post-merge .git/hooks/
chmod +x .git/hooks/post-merge

# 配置默认服务
echo "I18N_FREE_PROVIDER=mymemory" >> .env

# 每次 pull 后自动翻译
git pull upstream main
```

### 手动翻译

```bash
# 1. 检测新字符串
npm run i18n:sync

# 2. 查看报告
cat .omc/i18n-sync-report.json

# 3. 应用翻译
npm run i18n:apply

# 4. 测试翻译
npm run build
LANG=zh_CN.UTF-8 omc --help
```

---

## 故障排除

### 问题 1: 翻译失败

**症状**：
```
⚠ MyMemory translation failed: Network error
```

**解决**：
1. 检查网络连接
2. 切换到其他服务：
   ```bash
   export I18N_FREE_PROVIDER=lingva
   ```

### 问题 2: 服务被限流

**症状**：
```
⚠ Google Translate failed: HTTP 429
```

**解决**：
1. 等待几分钟后重试
2. 切换到其他服务
3. 增加请求延迟

### 问题 3: 翻译质量不佳

**解决**：
```bash
# 手动编辑翻译
vim src/i18n/locales/zh.json

# 或使用高质量服务
export I18N_FREE_PROVIDER=google-free
```

### 问题 4: 所有服务都不可用

**解决**：
1. 检查网络连接
2. 使用代理（如需要）
3. 稍后重试

---

## 成本对比

| 方案 | 成本 | 限制 |
|------|------|------|
| **免费方案** | **$0** | 每天 5000 字 |
| Claude API | ~$0.30/1000 字 | 无限制 |
| DeepL API | ~$25/50 万字 | 无限制 |
| Google API | ~$20/100 万字 | 无限制 |

**结论**：免费方案完全够用！

---

## 性能对比

翻译 100 个字符串：

| 服务 | 时间 | 质量 |
|------|------|------|
| MyMemory | ~50s | ⭐⭐⭐⭐ |
| Lingva | ~50s | ⭐⭐⭐⭐⭐ |
| LibreTranslate | ~60s | ⭐⭐⭐ |
| Google-Free | ~50s | ⭐⭐⭐⭐⭐ |

---

## 最佳实践

### 1. 定期翻译

```bash
# 每周翻译一次，避免一次性大量请求
git pull upstream main
npm run i18n:apply
```

### 2. 分批翻译

```bash
# 如果有很多新字符串，可以分批处理
npm run i18n:sync
# 编辑 .omc/i18n-sync-report.json，保留部分字符串
npm run i18n:apply
```

### 3. 质量检查

```bash
# 翻译后检查质量
npm run build
LANG=zh_CN.UTF-8 omc --help
LANG=zh_CN.UTF-8 omc config --validate
```

### 4. 手动修正

```bash
# 自动翻译可能不准确，手动修正
vim src/i18n/locales/zh.json
```

---

## 测试命令

```bash
# 测试所有服务
npm run i18n:test-translation

# 输出示例：
# Testing free translation services:
#
# 1. MyMemory API:
#    Result: 配置有效！
#
# 2. Lingva Translate:
#    Result: 配置有效！
#
# 3. LibreTranslate:
#    Result: 配置有效！
#
# 4. Google Translate (Free):
#    Result: 配置有效！
```

---

## 常见问题

**Q: 哪个服务最好？**
A: 推荐 MyMemory（稳定）或 Lingva（高质量）

**Q: 需要注册吗？**
A: 不需要！所有服务都无需注册

**Q: 有使用限制吗？**
A: MyMemory 每天 5000 字，其他服务基本无限制

**Q: 翻译质量如何？**
A: Google-Free 和 Lingva 质量最高，接近专业翻译

**Q: GitHub Actions 能用吗？**
A: 能！完全免费，无需配置 Secret

---

## 完整示例

```bash
# 1. 设置翻译服务（可选，默认 MyMemory）
export I18N_FREE_PROVIDER=mymemory

# 2. 同步上游
git pull upstream main

# 3. 检测新字符串
npm run i18n:sync

# 4. 应用翻译
npm run i18n:apply

# 5. 测试翻译
npm run build
omc --help  # 中文输出

# 6. 提交
git add src/i18n/locales/
git commit -m "chore(i18n): add new translations"
```

---

## 总结

✅ **完全免费** - 无需任何付费 API
✅ **无需注册** - 开箱即用
✅ **多种选择** - 4 个免费服务可选
✅ **高质量** - 接近专业翻译质量
✅ **易于使用** - 一条命令搞定

现在就开始使用吧！🚀

```bash
npm run i18n:test-translation  # 测试所有服务
npm run i18n:apply              # 开始翻译
```