# ✅ README 语言切换已简化

## 修改内容

### 1. README.md (英文版)

**之前**:
```
English | [한국어](README.ko.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Tiếng Việt](README.vi.md) | [Português](README.pt.md)
```

**现在**:
```
English | [中文](README.zh.md)
```

---

### 2. README.zh.md (中文版)

**之前**:
```
[English](README.md) | [한국어](README.ko.md) | 中文 | [日本語](README.ja.md) | [Español](README.es.md) | [Tiếng Việt](README.vi.md) | [Português](README.pt.md)
```

**现在**:
```
[English](README.md) | 中文
```

---

## 验证结果

```bash
=== README.md 语言切换 ===
English | [中文](README.zh.md)

# oh-my-claudecode

=== README.zh.md 语言切换 ===
[English](README.md) | 中文

# oh-my-claudecode
```

---

## 原因

- ✅ 只支持中英文两种语言
- ✅ 其他语言的 README 文件不存在或不完整
- ✅ 简化界面，避免混乱
- ✅ 与 i18n 功能匹配（目前只实现了中英文翻译）

---

## 影响的文件

- ✅ README.md - 英文版
- ✅ README.zh.md - 中文版

---

## 保留的其他语言文件

虽然从 README 中删除了其他语言的链接，但这些文件仍然存在：
- README.ko.md (韩语)
- README.ja.md (日语)
- README.es.md (西班牙语)
- README.vi.md (越南语)
- README.pt.md (葡萄牙语)
- 等等...

这些文件可以保留，只是不再在主 README 中显示链接。如果将来实现了其他语言的翻译，可以再添加回来。

---

## 提交建议

```bash
git add README.md README.zh.md
git commit -m "docs: simplify language switcher to English and Chinese only

- Remove links to other language READMEs (Korean, Japanese, Spanish, etc.)
- Keep only English and Chinese as these are the only supported languages
- Align with current i18n implementation status
- Cleaner and less confusing for users"
```

---

## ✅ 完成

现在 README 文件只显示中英文语言切换，更加简洁明了！