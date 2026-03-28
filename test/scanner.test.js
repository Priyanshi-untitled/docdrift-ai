const assert = require('assert');
const path = require('path');

console.log('\n🧪 DocDrift AI — Test Suite\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

// Test: Config loader
test('Config loader returns default config', () => {
  const { loadConfig } = require('../src/configLoader');
  const config = loadConfig('/nonexistent/path');
  assert.strictEqual(config.version, 2);
  assert.ok(config.scan.include.length > 0);
  assert.ok(config.ai.primaryModel);
});

// Test: Score Engine
test('Score engine calculates trust scores', () => {
  const { calculateTrustScores } = require('../src/scoreEngine');
  const results = [
    { confidence: 90, accurate: true, content: 'test function hello', category: null },
    { confidence: 30, accurate: false, content: 'test function missing', category: 'FUNCTION_MISSING' }
  ];
  const codeSymbols = [{ name: 'hello', language: 'JavaScript' }];
  const scored = calculateTrustScores(results, null, codeSymbols);
  assert.ok(scored[0].trustScore > 0);
  assert.ok(scored[1].trustScore < scored[0].trustScore);
});

// Test: Cache Manager
test('Cache manager stores and retrieves', () => {
  const { CacheManager } = require('../src/cacheManager');
  const cache = new CacheManager('/tmp');
  cache.set('doc1', 'code1', { confidence: 95 });
  const result = cache.get('doc1', 'code1');
  assert.strictEqual(result.confidence, 95);
});

// Test: Cache miss returns null
test('Cache miss returns null', () => {
  const { CacheManager } = require('../src/cacheManager');
  const cache = new CacheManager('/tmp');
  assert.strictEqual(cache.get('nonexistent', 'data'), null);
});

// Test: Utils
test('Utils scoreColor returns function', () => {
  const { scoreColor } = require('../src/utils');
  assert.strictEqual(typeof scoreColor(90), 'function');
});

test('Utils timeAgo formats correctly', () => {
  const { timeAgo } = require('../src/utils');
  assert.strictEqual(timeAgo(0), 'today');
  assert.strictEqual(timeAgo(1), 'yesterday');
  assert.ok(timeAgo(15).includes('weeks'));
});

test('Utils progressBar returns string', () => {
  const { progressBar } = require('../src/utils');
  const bar = progressBar(50);
  assert.ok(typeof bar === 'string');
  assert.ok(bar.length > 0);
});

// Summary
console.log(`\n  ─────────────────────────`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log(`  ─────────────────────────\n`);

process.exit(failed > 0 ? 1 : 0);