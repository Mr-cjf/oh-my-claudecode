#!/usr/bin/env tsx

/**
 * Test Free Translation Services
 *
 * Test all available free translation providers
 */

import { testFreeServices, translateFree } from './free-translation.js';

async function main() {
  const command = process.argv[2];

  if (command === 'test') {
    await testFreeServices();
    return;
  }

  // Interactive test
  const provider = process.argv[2] || 'mymemory';
  const text = process.argv[3] || 'Configuration is valid!';

  console.log(`Testing ${provider} with: "${text}"\n`);

  const translation = await translateFree(text, provider as any);

  console.log(`Result: ${translation}\n`);
}

main().catch(console.error);