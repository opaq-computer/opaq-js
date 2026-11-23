import OpenAI from 'openai';

/** The Opaq origin. The OpenAI-compatible API lives under /v1, the Anthropic-compatible API at the origin. */
export const OPAQ_ORIGIN = 'https://opaq.computer';
export const OPAQ_BASE_URL = `${OPAQ_ORIGIN}/v1`;

const envKey = () => (typeof process !== 'undefined' ? process.env?.OPAQ_API_KEY : undefined);

/**
 * An OpenAI client pointed at Opaq. Every method of the official `openai` package works:
 * chat completions, streaming, tools, vision.
 */
export function createOpaq({ apiKey = envKey(), baseURL = OPAQ_BASE_URL, ...options } = {}) {
  if (!apiKey) throw new Error('Missing Opaq API key. Pass { apiKey } or set OPAQ_API_KEY. Create one at https://opaq.computer/console');
  return new OpenAI({ apiKey, baseURL, ...options });
}

/**
 * The live catalog, with prices per 1M tokens (margin included). No key needed.
 * @param {{ privateOnly?: boolean, baseURL?: string, fetch?: typeof fetch }} [opts]
 */
export async function listModels({ privateOnly = false, baseURL = OPAQ_BASE_URL, fetch: f = globalThis.fetch } = {}) {
  const res = await f(`${baseURL}/models`);
  if (!res.ok) throw new Error(`Opaq /v1/models answered ${res.status}`);
  const { data } = await res.json();
  return privateOnly ? data.filter((m) => m.private) : data;
}

/**
 * What a request costs, in USD, from a model of the catalog and the usage a response returned.
 * Accepts OpenAI usage (prompt_tokens, completion_tokens) or Anthropic usage (input_tokens, output_tokens).
 */
export function estimateCost(model, usage = {}) {
  const p = model?.pricing;
  if (!p) throw new Error('estimateCost needs a model from listModels()');
  const input = usage.prompt_tokens ?? usage.input_tokens ?? 0;
  const output = usage.completion_tokens ?? usage.output_tokens ?? 0;
  return (input * p.prompt_per_mtok + output * p.completion_per_mtok) / 1e6;
}

/** Environment variables that run Claude Code (or any Anthropic SDK) on your Opaq balance. */
export function claudeCodeEnv(apiKey = envKey()) {
  if (!apiKey) throw new Error('Missing Opaq API key.');
  return { ANTHROPIC_BASE_URL: OPAQ_ORIGIN, ANTHROPIC_API_KEY: apiKey };
}

export default createOpaq;
