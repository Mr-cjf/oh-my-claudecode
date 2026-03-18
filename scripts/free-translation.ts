/**
 * Free Translation Providers
 *
 * Completely free translation services - no API keys required!
 */

export type FreeTranslationProvider = 'libretranslate' | 'mymemory' | 'lingva' | 'google-free';

/**
 * LibreTranslate (Free & Open Source)
 *
 * Public instances: https://github.com/LibreTranslate/LibreTranslate#public-instances
 */
async function translateWithLibreTranslate(text: string): Promise<string> {
  // Use public LibreTranslate instances
  const instances = [
    'https://libretranslate.de',
    'https://translate.argosopentech.com',
    'https://translate.terraprint.co'
  ];

  for (const instance of instances) {
    try {
      const response = await fetch(`${instance}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'zh',
          format: 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.translatedText;
      }
    } catch (error) {
      // Try next instance
      continue;
    }
  }

  // Fallback
  console.log('  ⚠ LibreTranslate instances unavailable');
  return `[待翻译] ${text}`;
}

/**
 * MyMemory Translation API (Free)
 *
 * Free tier: 5000 chars/day, no API key required
 * Docs: https://mymemory.translated.net/doc/spec.php
 */
async function translateWithMyMemory(text: string): Promise<string> {
  try {
    const langpair = 'en|zh-CN';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (error: any) {
    console.log(`  ⚠ MyMemory translation failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Lingva Translate (Free & Open Source)
 *
 * Alternative front-end to Google Translate
 * Instances: https://lingva.ml, https://translate.plausibility.cloud, etc.
 */
async function translateWithLingva(text: string): Promise<string> {
  const instances = [
    'https://lingva.ml',
    'https://translate.plausibility.cloud',
    'https://lingva.lunar.icu'
  ];

  for (const instance of instances) {
    try {
      // Lingva API: /api/v1/{source}/{target}/{query}
      const url = `${instance}/api/v1/en/zh/${encodeURIComponent(text)}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.translation;
      }
    } catch (error) {
      continue;
    }
  }

  console.log('  ⚠ Lingva instances unavailable');
  return `[待翻译] ${text}`;
}

/**
 * Google Translate (Free, no API key)
 *
 * Uses the web interface (unofficial, may be rate-limited)
 */
async function translateWithGoogleFree(text: string): Promise<string> {
  try {
    const url = 'https://translate.googleapis.com/translate_a/single';
    const params = new URLSearchParams({
      client: 'gtx',
      sl: 'en',
      tl: 'zh-CN',
      dt: 't',
      q: text
    });

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Google returns an array: [[["translation","original",null,null,10],null,null,null,null]]
    if (data && data[0] && data[0][0]) {
      return data[0][0][0];
    }

    throw new Error('Invalid response');
  } catch (error: any) {
    console.log(`  ⚠ Google Translate failed: ${error.message}`);
    return `[待翻译] ${text}`;
  }
}

/**
 * Main translation function (Free)
 */
export async function translateFree(
  text: string,
  provider?: FreeTranslationProvider
): Promise<string> {
  const selectedProvider = provider || process.env.I18N_FREE_PROVIDER || 'mymemory';

  switch (selectedProvider) {
    case 'libretranslate':
      return translateWithLibreTranslate(text);

    case 'lingva':
      return translateWithLingva(text);

    case 'google-free':
      return translateWithGoogleFree(text);

    case 'mymemory':
    default:
      return translateWithMyMemory(text);
  }
}

/**
 * Batch translate with rate limiting (Free services have limits)
 */
export async function batchTranslateFree(
  texts: string[],
  provider?: FreeTranslationProvider
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    console.log(`  Translating ${i + 1}/${texts.length}...`);
    const translation = await translateFree(texts[i], provider);
    results.push(translation);

    // Rate limiting: wait between requests to avoid being blocked
    if (i < texts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
    }
  }

  return results;
}

/**
 * Test all free translation services
 */
export async function testFreeServices(): Promise<void> {
  const testText = 'Configuration is valid!';

  console.log('Testing free translation services:\n');

  console.log('1. MyMemory API:');
  const mymemory = await translateWithMyMemory(testText);
  console.log(`   Result: ${mymemory}\n`);

  console.log('2. Lingva Translate:');
  const lingva = await translateWithLingva(testText);
  console.log(`   Result: ${lingva}\n`);

  console.log('3. LibreTranslate:');
  const libre = await translateWithLibreTranslate(testText);
  console.log(`   Result: ${libre}\n`);

  console.log('4. Google Translate (Free):');
  const google = await translateWithGoogleFree(testText);
  console.log(`   Result: ${google}\n`);

  console.log('✅ All tests completed!');
}