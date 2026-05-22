/**
 * Multi-provider LLM adapter per ADR-0007 + ARCHITECTURE §7.
 *
 * Implements @nexural/sdk's ProviderCaller interface for:
 *   - Anthropic (primary)
 *   - OpenAI (fallback)
 *   - Ollama (emergency local)
 *
 * Used by the router for nx ask synthesis. Wrapped by @nexural/sdk.llmClient
 * which enforces cost caps + streaming abort + telemetry per ADR-0007.
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { ProviderCaller } from "@nexural/sdk";

export interface AnthropicCallerConfig {
  readonly apiKey?: string;
  readonly baseUrl?: string;
}

/**
 * Anthropic provider — primary per ADR-0007.
 */
export function createAnthropicCaller(config: AnthropicCallerConfig = {}): ProviderCaller {
  const client = new Anthropic({
    ...(config.apiKey ? { apiKey: config.apiKey } : {}),
    ...(config.baseUrl ? { baseURL: config.baseUrl } : {}),
  });

  return {
    async invoke({ modelId, messages, maxOutputTokens }) {
      const resp = await client.messages.create({
        model: modelId,
        max_tokens: maxOutputTokens,
        messages: messages as Anthropic.MessageParam[],
      });
      // Extract text from the first text block
      const text = resp.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return {
        outputText: text,
        inputTokens: resp.usage.input_tokens,
        outputTokens: resp.usage.output_tokens,
      };
    },

    async invokeStreaming({ modelId, messages, maxOutputTokens, onToken }) {
      const stream = client.messages.stream({
        model: modelId,
        max_tokens: maxOutputTokens,
        messages: messages as Anthropic.MessageParam[],
      });

      let outputText = "";
      let aborted = false;
      let inputTokens = 0;
      let outputTokens = 0;

      for await (const event of stream) {
        if (aborted) break;
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const chunk = event.delta.text;
          outputText += chunk;
          const result = onToken(chunk);
          if (result === false) {
            aborted = true;
          }
        } else if (event.type === "message_delta" && event.usage) {
          outputTokens = event.usage.output_tokens;
        } else if (event.type === "message_start" && event.message.usage) {
          inputTokens = event.message.usage.input_tokens;
        }
      }

      if (!aborted) {
        const final = await stream.finalMessage();
        inputTokens = final.usage.input_tokens;
        outputTokens = final.usage.output_tokens;
      }

      return { outputText, inputTokens, outputTokens };
    },
  };
}

export interface OpenAiCallerConfig {
  readonly apiKey?: string;
  readonly baseUrl?: string;
}

/**
 * OpenAI provider — fallback per ADR-0007.
 */
export function createOpenAiCaller(config: OpenAiCallerConfig = {}): ProviderCaller {
  const client = new OpenAI({
    ...(config.apiKey ? { apiKey: config.apiKey } : {}),
    ...(config.baseUrl ? { baseURL: config.baseUrl } : {}),
  });

  return {
    async invoke({ modelId, messages, maxOutputTokens }) {
      const resp = await client.chat.completions.create({
        model: modelId,
        max_completion_tokens: maxOutputTokens,
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      });
      const text = resp.choices[0]?.message?.content ?? "";
      return {
        outputText: text,
        inputTokens: resp.usage?.prompt_tokens ?? 0,
        outputTokens: resp.usage?.completion_tokens ?? 0,
      };
    },

    async invokeStreaming({ modelId, messages, maxOutputTokens, onToken }) {
      const stream = await client.chat.completions.create({
        model: modelId,
        max_completion_tokens: maxOutputTokens,
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        stream: true,
        stream_options: { include_usage: true },
      });

      let outputText = "";
      let aborted = false;
      let inputTokens = 0;
      let outputTokens = 0;

      for await (const chunk of stream) {
        if (aborted) break;
        const delta = chunk.choices[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          outputText += delta;
          const result = onToken(delta);
          if (result === false) {
            aborted = true;
          }
        }
        if (chunk.usage) {
          inputTokens = chunk.usage.prompt_tokens;
          outputTokens = chunk.usage.completion_tokens;
        }
      }

      return { outputText, inputTokens, outputTokens };
    },
  };
}

export interface OllamaCallerConfig {
  /** Default http://localhost:11434 — standard Ollama local server. */
  readonly baseUrl?: string;
}

/**
 * Ollama provider — emergency local-first per ADR-0007 + ARCHITECTURE §7.
 *
 * Uses Ollama's /api/chat endpoint (HTTP) — no SDK dep needed.
 */
export function createOllamaCaller(config: OllamaCallerConfig = {}): ProviderCaller {
  const baseUrl = (config.baseUrl ?? "http://localhost:11434").replace(/\/$/, "");

  async function chat(
    modelId: string,
    messages: ReadonlyArray<unknown>,
    maxOutputTokens: number,
    streaming: boolean,
  ): Promise<Response> {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: streaming,
        options: { num_predict: maxOutputTokens },
      }),
    });
    if (!res.ok) {
      throw new Error(`Ollama HTTP ${res.status}: ${await res.text()}`);
    }
    return res;
  }

  return {
    async invoke({ modelId, messages, maxOutputTokens }) {
      const res = await chat(modelId, messages, maxOutputTokens, false);
      const json = (await res.json()) as {
        message: { content: string };
        prompt_eval_count?: number;
        eval_count?: number;
      };
      return {
        outputText: json.message.content,
        inputTokens: json.prompt_eval_count ?? 0,
        outputTokens: json.eval_count ?? 0,
      };
    },

    async invokeStreaming({ modelId, messages, maxOutputTokens, onToken }) {
      const res = await chat(modelId, messages, maxOutputTokens, true);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let outputText = "";
      let aborted = false;
      let inputTokens = 0;
      let outputTokens = 0;

      while (!aborted) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const json = JSON.parse(line) as {
            message?: { content?: string };
            prompt_eval_count?: number;
            eval_count?: number;
            done?: boolean;
          };
          const chunk = json.message?.content ?? "";
          if (chunk) {
            outputText += chunk;
            const result = onToken(chunk);
            if (result === false) {
              aborted = true;
              break;
            }
          }
          if (json.prompt_eval_count) inputTokens = json.prompt_eval_count;
          if (json.eval_count) outputTokens = json.eval_count;
        }
      }

      return { outputText, inputTokens, outputTokens };
    },
  };
}

/**
 * Build the default provider map for @nexural/sdk's llmClient config.
 * Picks API keys from env vars per NAMING.md §7.
 */
export function defaultProviderMap(): ReadonlyMap<string, ProviderCaller> {
  return new Map<string, ProviderCaller>([
    [
      "anthropic",
      createAnthropicCaller({
        ...(process.env.ANTHROPIC_API_KEY ? { apiKey: process.env.ANTHROPIC_API_KEY } : {}),
      }),
    ],
    [
      "openai",
      createOpenAiCaller({
        ...(process.env.OPENAI_API_KEY ? { apiKey: process.env.OPENAI_API_KEY } : {}),
      }),
    ],
    [
      "ollama",
      createOllamaCaller({
        ...(process.env.OLLAMA_BASE_URL ? { baseUrl: process.env.OLLAMA_BASE_URL } : {}),
      }),
    ],
  ]);
}
