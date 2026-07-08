import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const endpoints = [
  'src/app/api/trade/scan/route.ts',
  'src/app/api/trade/execute/route.ts',
  'src/app/api/trade/close-position/route.ts',
  'src/app/api/trade/positions/route.ts',
  'src/app/api/emergency/kill-switch/route.ts',
  'src/app/api/ai/ask/route.ts',
];

test('documented route stubs export NextResponse handlers', () => {
  for (const endpoint of endpoints) {
    const content = readFileSync(path.join(repoRoot, endpoint), 'utf8');
    assert.match(content, /NextResponse\.json/);
  }
});
