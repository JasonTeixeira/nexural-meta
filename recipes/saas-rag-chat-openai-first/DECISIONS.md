# DECISIONS — `saas-rag-chat-openai-first`

Inherits from `saas-rag-chat/DECISIONS.md`.

## Model chain override

| Use case            | This recipe          | Parent               |
| ------------------- | -------------------- | -------------------- |
| Synthesis primary   | `openai:flagship`    | `anthropic:opus`     |
| Synthesis fallback  | `anthropic:opus`     | `openai:flagship`    |
| Synthesis emergency | `ollama:llama-large` | `ollama:llama-large` |

## When to use

- Anthropic API is unavailable in your region
- You need OpenAI's structured outputs (`response_format: json_schema`)
- You need OpenAI-specific function calling primitives
- You have OpenAI Enterprise commitments + spend efficiency from that contract

## Cost envelope tighter

`per_request_usd: 0.30` (vs parent's 0.50) — GPT-4o pricing supports tighter
cap with the same usable context.

Everything else inherited.
