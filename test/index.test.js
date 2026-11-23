import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createOpaq, listModels, estimateCost, claudeCodeEnv, OPAQ_BASE_URL } from '../src/index.js';

test('createOpaq points the OpenAI client at Opaq', () => {
  const client = createOpaq({ apiKey: 'opaq_sk_test' });
  assert.equal(client.baseURL, OPAQ_BASE_URL);
});

test('createOpaq refuses to start without a key', () => {
  const saved = process.env.OPAQ_API_KEY;
  delete process.env.OPAQ_API_KEY;
  assert.throws(() => createOpaq(), /Missing Opaq API key/);
  if (saved) process.env.OPAQ_API_KEY = saved;
});

test('estimateCost reads OpenAI and Anthropic usage', () => {
  const model = { pricing: { prompt_per_mtok: 3, completion_per_mtok: 15 } };
  assert.equal(estimateCost(model, { prompt_tokens: 1_000_000, completion_tokens: 0 }), 3);
  assert.equal(estimateCost(model, { input_tokens: 0, output_tokens: 1_000_000 }), 15);
});

test('claudeCodeEnv returns the two variables Claude Code needs', () => {
  assert.deepEqual(claudeCodeEnv('opaq_sk_x'), { ANTHROPIC_BASE_URL: 'https://opaq.computer', ANTHROPIC_API_KEY: 'opaq_sk_x' });
});

test('listModels reads the live catalog', { skip: process.env.OFFLINE === '1' }, async () => {
  const models = await listModels();
  assert.ok(models.length > 50, 'catalog has models');
  assert.ok(models.every((m) => typeof m.pricing?.prompt_per_mtok === 'number'), 'every model has a price');
  const priv = await listModels({ privateOnly: true });
  assert.ok(priv.every((m) => m.private));
});
