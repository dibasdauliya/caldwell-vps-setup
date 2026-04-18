#!/usr/bin/env node

/**
 * Test script to verify environment variable validation
 * Run this script to test that missing env vars throw appropriate errors
 */

console.log('Testing Environment Variable Validation\n');
console.log('=' .repeat(50));

// Test 1: With valid environment variable
console.log('\n✅ Test 1: With valid NEXT_PUBLIC_SERVER_URL');
process.env.NEXT_PUBLIC_SERVER_URL = 'https://api.example.com';

try {
  // Clear the module cache to force re-evaluation
  delete require.cache[require.resolve('../lib/env.ts')];
  const { env } = require('../lib/env.ts');
  console.log('   SUCCESS: Environment loaded successfully');
  console.log('   SERVER_URL:', env.NEXT_PUBLIC_SERVER_URL);
} catch (error) {
  console.log('   FAILED: Should not have thrown an error');
  console.log('   Error:', error.message);
}

// Test 2: With missing environment variable
console.log('\n❌ Test 2: With missing NEXT_PUBLIC_SERVER_URL');
delete process.env.NEXT_PUBLIC_SERVER_URL;

try {
  // Clear the module cache to force re-evaluation
  delete require.cache[require.resolve('../lib/env.ts')];
  const { env } = require('../lib/env.ts');
  console.log('   FAILED: Should have thrown an error');
} catch (error) {
  console.log('   SUCCESS: Error thrown as expected');
  console.log('   Error Name:', error.name);
  console.log('   Error Message:', error.message.split('\n')[0]);
}

// Test 3: With empty string environment variable
console.log('\n❌ Test 3: With empty NEXT_PUBLIC_SERVER_URL');
process.env.NEXT_PUBLIC_SERVER_URL = '   ';

try {
  // Clear the module cache to force re-evaluation
  delete require.cache[require.resolve('../lib/env.ts')];
  const { env } = require('../lib/env.ts');
  console.log('   FAILED: Should have thrown an error for empty string');
} catch (error) {
  console.log('   SUCCESS: Error thrown as expected for empty string');
  console.log('   Error Name:', error.name);
  console.log('   Error Message:', error.message.split('\n')[0]);
}

console.log('\n' + '=' .repeat(50));
console.log('Environment validation tests completed!');