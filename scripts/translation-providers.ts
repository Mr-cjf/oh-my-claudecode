/**
 * Translation Providers
 *
 * Supports multiple translation services: Claude API, DeepL, Google Translate, etc.
 */

export type TranslationProvider = 'claude' | 'deepl' | 'google' | 'youdao' | 'baidu';

export interface TranslationConfig {
  provider: TranslationProvider;
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
}

/**
 * Translate using Claude API (default)
 */
async function translateWithClaude(text: string, targetLang: string = 'zh'): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('  ⚠ ANTHROPIC_API_KEY not set, using placeholder');
    return `[待翻译] ${text}`;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `Translate the following English text to Simplified Chinese (简体中文). Only return the translation, no explanations.

Text: "${text}"

Translation:`
        }]
      })
    });

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error: any) {
    console.log(`  ⚠ Translation failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Translate using DeepL API
 */
async function translateWithDeepL(text: string, targetLang: string = 'ZH'): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.log('  ⚠ DEEPL_API_KEY not set, using placeholder');
    return `[待翻译] ${text}`;
  }

  try {
    const endpoint = process.env.DEEPL_ENDPOINT || 'https://api-free.deepl.com/v2/translate';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        source_lang: 'EN'
      })
    });

    const data = await response.json();
    return data.translations[0].text;
  } catch (error: any) {
    console.log(`  ⚠ DeepL translation failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Translate using Google Cloud Translation API
 */
async function translateWithGoogle(text: string, targetLang: string = 'zh-CN'): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.log('  ⚠ GOOGLE_TRANSLATE_API_KEY not set, using placeholder');
    return `[待翻译] ${text}`;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'en',
        format: 'text'
      })
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error: any) {
    console.log(`  ⚠ Google translation failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Translate using Youdao API (有道翻译)
 */
async function translateWithYoudao(text: string): Promise<string> {
  const appKey = process.env.YOUDAO_APP_KEY;
  const appSecret = process.env.YOUDAO_APP_SECRET;

  if (!appKey || !appSecret) {
    console.log('  ⚠ YOUDAO_APP_KEY or YOUDAO_APP_SECRET not set, using placeholder');
    return `[待翻译] ${text}`;
  }

  try {
    const crypto = await import('crypto');
    const salt = Date.now().toString();
    const curtime = Math.floor(Date.now() / 1000).toString();
    const input = text.length > 20
      ? text.substring(0, 10) + text.length + text.substring(text.length - 10)
      : text;

    const signStr = appKey + input + salt + curtime + appSecret;
    const sign = crypto.createHash('sha256').update(signStr).digest('hex');

    const params = new URLSearchParams({
      q: text,
      from: 'en',
      to: 'zh-CHS',
      appKey: appKey,
      salt: salt,
      sign: sign,
      signType: 'v3',
      curtime: curtime
    });

    const response = await fetch(`https://openapi.youdao.com/api?${params}`);
    const data = await response.json();

    if (data.errorCode === '0') {
      return data.translation[0];
    } else {
      throw new Error(`Youdao error: ${data.errorCode}`);
    }
  } catch (error: any) {
    console.log(`  ⚠ Youdao translation failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Translate using Baidu API (百度翻译)
 */
async function translateWithBaidu(text: string): Promise<string> {
  const appId = process.env.BAIDU_TRANSLATE_APP_ID;
  const secretKey = process.env.BAIDU_TRANSLATE_SECRET_KEY;

  if (!appId || !secretKey) {
    console.log('  ⚠ BAIDU_TRANSLATE_APP_ID or BAIDU_TRANSLATE_SECRET_KEY not set, using placeholder');
    return `[待翻译] ${text}`;
  }

  try {
    const crypto = await import('crypto');
    const salt = Date.now().toString();
    const signStr = appId + text + salt + secretKey;
    const sign = crypto.createHash('md5').update(signStr).digest('hex');

    const params = new URLSearchParams({
      q: text,
      from: 'en',
      to: 'zh',
      appid: appId,
      salt: salt,
      sign: sign
    });

    const response = await fetch(`https://fanyi-api.baidu.com/api/trans/vip/translate?${params}`);
    const data = await response.json();

    if (data.trans_result) {
      return data.trans_result[0].dst;
    } else {
      throw new Error(`Baidu error: ${data.error_code}`);
    }
  } catch (error: any) {
    console.log(`  ⚠ Baidu translation failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Main translation function
 */
export async function translate(
  text: string,
  config?: TranslationConfig
): Promise<string> {
  const provider = config?.provider || process.env.I18N_TRANSLATION_PROVIDER || 'claude';

  switch (provider) {
    case 'deepl':
      return translateWithDeepL(text);

    case 'google':
      return translateWithGoogle(text);

    case 'youdao':
      return translateWithYoudao(text);

    case 'baidu':
      return translateWithBaidu(text);

    case 'claude':
    default:
      return translateWithClaude(text);
  }
}

/**
 * Batch translate multiple texts
 */
export async function batchTranslate(
  texts: string[],
  config?: TranslationConfig
): Promise<string[]> {
  const provider = config?.provider || process.env.I18N_TRANSLATION_PROVIDER || 'claude';

  // For Claude, we can batch translate
  if (provider === 'claude' && process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `Translate the following English texts to Simplified Chinese (简体中文).
Return ONLY a JSON array of translations, one per line, no explanations.

Texts:
${texts.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

Translations (JSON array):`
          }]
        })
      });

      const data = await response.json();
      const translations = JSON.parse(data.content[0].text.trim());

      if (Array.isArray(translations) && translations.length === texts.length) {
        return translations;
      }
    } catch (error) {
      console.log('  ⚠ Batch translation failed, falling back to individual translation');
    }
  }

  // Fallback: translate individually
  const results: string[] = [];
  for (const text of texts) {
    results.push(await translate(text, config));
  }
  return results;
}