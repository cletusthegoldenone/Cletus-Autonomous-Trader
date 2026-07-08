import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');

const requiredFiles = [
  '.env.example',
  '.gitignore',
  'package.json',
  'src/app/page.tsx',
  'src/app/api/trade/scan/route.ts',
  'src/app/api/ai/ask/route.ts',
  'vercel.json',
];

test('repository includes the scaffold files needed to build', () => {
  for (const relativePath of requiredFiles) {
    assert.equal(existsSync(path.join(repoRoot, relativePath)), true, `${relativePath} should exist`);
  }
});

test('package.json exposes build and lint scripts', () => {
  const packageJson = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

  assert.equal(packageJson.scripts.build, 'next build');
  assert.equal(packageJson.scripts.lint, 'eslint .');
});
