<p align="center"><img src="https://raw.githubusercontent.com/opaq-computer/brand/main/logo/opaq-logo-512.png" width="96" alt="Opaq" /></p>

<h1 align="center">opaq-js</h1>

<p align="center">The JavaScript and TypeScript client for <a href="https://opaq.computer">Opaq</a>: private AI inference on Solana.<br/>200+ models through one OpenAI-compatible endpoint, paid from a sealed balance in Solana Privacy Rings. Zero prompt logs.</p>

<p align="center">
  <a href="https://github.com/opaq-computer/opaq-js/actions/workflows/test.yml"><img src="https://github.com/opaq-computer/opaq-js/actions/workflows/test.yml/badge.svg" alt="tests" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-f7c600" alt="MIT" /></a>
  <a href="https://opaq.computer/docs"><img src="https://img.shields.io/badge/docs-opaq.computer-16161a" alt="docs" /></a>
</p>

## Install

```bash
npm install openai github:opaq-computer/opaq-js
```

Opaq speaks the OpenAI API, so this package is a thin layer over the official [`openai`](https://www.npmjs.com/package/openai) client: everything it does (streaming, tools, vision) works unchanged.

## Quickstart

Get a key in the [console](https://opaq.computer/console) (sign in with a Solana wallet, seal a top-up, create a key).

```js
import { createOpaq } from '@opaq-computer/sdk';

const opaq = createOpaq(); // reads OPAQ_API_KEY

const r = await opaq.chat.completions.create({
  model: 'anthropic/claude-sonnet-5.5',
  messages: [{ role: 'user', content: 'Hello' }],
});
console.log(r.choices[0].message.content);
```

### Streaming

```js
const stream = await opaq.chat.completions.create({
  model: 'deepseek/deepseek-v4.1-flash',
  stream: true,
  messages: [{ role: 'user', content: 'Write a haiku about privacy.' }],
});
for await (const chunk of stream) process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
```

### Models and prices

```js
import { listModels, estimateCost } from '@opaq-computer/sdk';

const models = await listModels();                       // live catalog, no key needed
const enclave = await listModels({ privateOnly: true }); // models served inside a hardware enclave (TEE)

const model = models.find((m) => m.id === 'anthropic/claude-sonnet-5.5');
console.log(estimateCost(model, r.usage)); // USD, from the usage a response returned
```

### Claude Code

```js
import { claudeCodeEnv } from '@opaq-computer/sdk';
// { ANTHROPIC_BASE_URL: 'https://opaq.computer', ANTHROPIC_API_KEY: '<your key>' }
```

Or in a terminal:

```bash
export ANTHROPIC_BASE_URL=https://opaq.computer
export ANTHROPIC_API_KEY=$OPAQ_API_KEY
claude --model claude-sonnet-5.5
```

## API

| Export | What it does |
|---|---|
| `createOpaq(options?)` | An `OpenAI` client with `baseURL` set to `https://opaq.computer/v1`. Throws if no key. |
| `listModels({ privateOnly? })` | The live catalog from `GET /v1/models`, with prices per 1M tokens. |
| `estimateCost(model, usage)` | Cost in USD of a response, from OpenAI or Anthropic usage. |
| `claudeCodeEnv(apiKey?)` | The two environment variables that run Claude Code on Opaq. |
| `OPAQ_ORIGIN`, `OPAQ_BASE_URL` | `https://opaq.computer` and `https://opaq.computer/v1`. |

## Privacy

Opaq never stores prompts or completions and strips end-user identifiers before routing. What is stored and what stays public is listed at [opaq.computer/security](https://opaq.computer/security).

## Links

[Docs](https://opaq.computer/docs) · [OpenAPI spec](https://opaq.computer/openapi.json) · [Examples](https://github.com/opaq-computer/examples) · [X](https://x.com/OpaqPrivacy) · Security reports: team@opaq.computer

## License

MIT
