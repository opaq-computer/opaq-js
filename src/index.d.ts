import OpenAI, { type ClientOptions } from 'openai';

export declare const OPAQ_ORIGIN: 'https://opaq.computer';
export declare const OPAQ_BASE_URL: 'https://opaq.computer/v1';

export interface OpaqModel {
  id: string;
  object: 'model';
  created?: number;
  owned_by?: string;
  name?: string;
  context_length?: number;
  /** Served inside a hardware enclave (TEE). */
  private?: boolean;
  input_modalities?: string[];
  output_modalities?: string[];
  features?: string[];
  /** USD per 1M tokens, margin included. */
  pricing: { prompt_per_mtok: number; completion_per_mtok: number };
  [key: string]: unknown;
}

export interface OpaqUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  input_tokens?: number;
  output_tokens?: number;
}

export declare function createOpaq(options?: ClientOptions & { apiKey?: string; baseURL?: string }): OpenAI;
export declare function listModels(options?: { privateOnly?: boolean; baseURL?: string; fetch?: typeof fetch }): Promise<OpaqModel[]>;
export declare function estimateCost(model: OpaqModel, usage?: OpaqUsage): number;
export declare function claudeCodeEnv(apiKey?: string): { ANTHROPIC_BASE_URL: string; ANTHROPIC_API_KEY: string };
export default createOpaq;
