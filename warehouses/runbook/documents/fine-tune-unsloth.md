# Playbook: Fine-Tune with Unsloth

> **Trigger:** You've tried prompting, few-shot examples, and RAG, and you still need
> either (a) consistently formatted structured output, (b) a specific tone/style
> the base model won't hold, or (c) strong performance on a domain where the base
> model is weak, without paying frontier API prices. This is Sage's first fine-tune playbook.

---

## When to Fine-Tune vs Just Prompt Better

Fine-tuning is often the wrong tool. Be honest about this test first.

```
Fine-tuning is justified when ALL of these are true:
  ✓ You have tried 5+ prompt variations and none achieve the quality target
  ✓ You have 200+ high-quality labeled examples (ideally 500+)
  ✓ The task is stable (the "right answer" definition won't change monthly)
  ✓ You need this improvement at production scale (not just a demo)

Fine-tuning is NOT justified when:
  ✗ You haven't tried few-shot prompting with 5-10 examples in context
  ✗ You're chasing a quality target that RAG could achieve instead
  ✗ You have <100 examples — you'll overfit
  ✗ The task evolves rapidly (you'll be re-fine-tuning every month)
  ✗ Your quality signal is "vibes" (you don't have a measurement harness)
```

**The honest test:** Write 20 eval cases. Can the base model with a well-crafted system
prompt achieve >80% pass rate? If yes, don't fine-tune yet. You haven't exhausted prompting.

**When fine-tuning clearly wins:**

- Consistent JSON output in a specific schema (especially complex nested structures)
- Domain vocabulary injection (medical, legal, proprietary terminology)
- Latency/cost reduction: a fine-tuned 8B model can match GPT-4o on specific tasks
  at 10-100x lower cost
- Style/voice enforcement that prompts can't hold over long outputs

---

## Why Unsloth

[Unsloth](https://github.com/unslothai/unsloth) is a fine-tuning library that wraps
HuggingFace Transformers with hand-written CUDA kernels and memory optimizations.

**Benchmarks vs vanilla HuggingFace:**

- **2x faster training** (OpenHermes 2.5 benchmark: 4.81x speedup on A100)
- **70% less VRAM** (fits Llama 3.1 8B fine-tune in 16GB VRAM vs 40GB normally)
- **No quality loss** — outputs identical to HuggingFace with same hyperparams
- Supports: Llama 3.x, Qwen 2.5, Mistral, Phi-3, Gemma 2, and most popular models

The VRAM reduction is the headline for solo developers — it's the difference between
running a Llama 3.1 8B fine-tune on a single 4090 (24GB) vs needing an A100 (40GB).

```bash
pip install unsloth
# or with specific CUDA version:
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
```

---

## Hardware Sizing

### Llama 3.1 8B fine-tune (most common case)

| Setup                  | Cost             | Speed                    | Notes                                    |
| ---------------------- | ---------------- | ------------------------ | ---------------------------------------- |
| 4090 (24GB) self-owned | $0/hr            | ~2.5 hrs for 1k examples | QLoRA required for fit                   |
| A10G via Modal         | ~$1.10/hr        | ~1.5 hrs                 | Modal: `gpu="A10G"`                      |
| A100 40GB via RunPod   | ~$1.64/hr        | ~0.8 hrs                 | 2x faster than A10G                      |
| Colab Pro (V100)       | ~$0.38/hr credit | ~3 hrs                   | Slowest; good for first-time experiments |

**VRAM usage with Unsloth (8B, 4-bit QLoRA):**

- Training: ~10-12 GB VRAM (fits comfortably on 4090/A10G)
- Without Unsloth: ~22-28 GB VRAM (needs A100 40GB)

### Llama 3.1 70B fine-tune (serious investment)

| Setup          | Cost               | Notes                             |
| -------------- | ------------------ | --------------------------------- |
| 2× A100 80GB   | ~$9.80/hr (RunPod) | 70B in 4-bit across 2 GPUs        |
| H100 (80GB)    | ~$8.50/hr (Modal)  | Single GPU; fastest               |
| A100 80GB (1×) | ~$4.90/hr          | Tight; use gradient checkpointing |

**Recommendation:** Fine-tune 8B first. Validate the approach. Only move to 70B if 8B
fine-tuned model doesn't hit your quality target. The gap between fine-tuned 8B and
fine-tuned 70B is much smaller than between base 8B and base 70B.

---

## Dataset Preparation

### Instruction format (most common)

```python
# The standard alpaca/instruction format
dataset = [
    {
        "instruction": "Classify the sentiment of this review.",
        "input": "This product is absolutely terrible. Broke after one day.",
        "output": "negative"
    },
    {
        "instruction": "Classify the sentiment of this review.",
        "input": "Best purchase I've made this year. Works perfectly.",
        "output": "positive"
    },
]
```

### ShareGPT format (for conversational fine-tuning)

```python
# Multi-turn conversation format — better for chat-style fine-tuning
dataset = [
    {
        "conversations": [
            {"from": "human", "value": "Classify this support ticket: My bill is wrong"},
            {"from": "gpt", "value": "billing"},
        ]
    },
    {
        "conversations": [
            {"from": "human", "value": "Classify this support ticket: App crashes on login"},
            {"from": "gpt", "value": "technical"},
        ]
    },
]
```

### Sage's 500-example minimum

The 500-example minimum is empirical: below 200 examples, fine-tuning often fails to
generalize. Between 200-500, you'll see inconsistent improvement. 500+ examples is
where the fine-tune reliably outperforms the base model on your target task.

**Quality over quantity.** 500 high-quality examples beat 5,000 low-quality ones.
Define "high quality" before labeling:

- Does it have the exact output format you need?
- Is the label unambiguous (two reviewers would agree)?
- Does it cover diverse inputs (not 500 variations of the same pattern)?

```python
# Data preparation with Hugging Face datasets
from datasets import Dataset

def prepare_dataset(raw_data: list[dict]) -> Dataset:
    """
    Convert raw examples to the format Unsloth expects.
    Uses alpaca_prompt template.
    """
    alpaca_prompt = """Below is an instruction that describes a task, \
paired with an input that provides further context. \
Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

    def format_example(example):
        return {
            "text": alpaca_prompt.format(
                example["instruction"],
                example.get("input", ""),
                example["output"],
            ) + "<|end_of_text|>"  # EOS token
        }

    return Dataset.from_list([format_example(ex) for ex in raw_data])
```

---

## LoRA vs QLoRA vs Full Fine-Tune

```
Full fine-tune:
  VRAM: 8B = ~80GB (impractical for solo dev)
  When: Maximum possible quality, unlimited resources, 100k+ examples
  Don't use unless you're a research lab

LoRA (Low-Rank Adaptation):
  VRAM: 8B = ~16-20GB (A10G, A100 40GB)
  When: Best quality of the PEFT options, have 20GB+ VRAM, 500+ examples
  Default choice if your GPU has the VRAM

QLoRA (Quantized LoRA, what Unsloth uses by default):
  VRAM: 8B = ~10-12GB (4090, A10G)
  When: Limited VRAM, solo dev workflow, quality very close to LoRA
  Default choice if you're on consumer hardware or single A10G

Quality ordering: Full >> LoRA ≈ QLoRA >> few-shot prompting
For most production fine-tuning: QLoRA is the practical answer.
```

---

## Training Loop: Full Walkthrough

```python
# finetune.py — complete Unsloth fine-tuning script
from unsloth import FastLanguageModel
from trl import SFTTrainer
from transformers import TrainingArguments
from datasets import Dataset
import torch

# ─── 1. Load model ─────────────────────────────────────────────────────────────
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-Instruct",
    max_seq_length=2048,
    dtype=None,         # auto-detect: float16 on A10G/A100, bfloat16 on H100
    load_in_4bit=True,  # QLoRA: 4-bit quantized base weights
)

# ─── 2. Add LoRA adapters ───────────────────────────────────────────────────────
model = FastLanguageModel.get_peft_model(
    model,
    r=16,               # LoRA rank — higher = more capacity, more VRAM
                        # 8 for simple tasks, 16 for moderate, 32-64 for complex
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,      # typically set equal to r
    lora_dropout=0,     # 0 = no dropout for Unsloth (optimized path)
    bias="none",
    use_gradient_checkpointing="unsloth",  # Unsloth's memory-saving checkpointing
    random_state=42,
)

# ─── 3. Prepare dataset ────────────────────────────────────────────────────────
train_dataset = prepare_dataset(your_training_data)  # from previous section

# ─── 4. Training arguments ─────────────────────────────────────────────────────
training_args = TrainingArguments(
    output_dir="./outputs",
    per_device_train_batch_size=2,      # 2-4 on A10G; 8-16 on A100
    gradient_accumulation_steps=4,      # effective batch = 2 × 4 = 8
    warmup_steps=5,
    num_train_epochs=3,                 # 3 epochs is the safe default
                                        # watch loss curve; stop if overfitting
    learning_rate=2e-4,                 # 1e-4 to 5e-4; 2e-4 is the sweet spot
    fp16=not torch.cuda.is_bf16_supported(),
    bf16=torch.cuda.is_bf16_supported(),
    logging_steps=10,
    optim="adamw_8bit",                 # Unsloth 8-bit Adam — more memory-efficient
    weight_decay=0.01,
    lr_scheduler_type="linear",
    seed=42,
    report_to="wandb",                  # remove if no W&B account
)

# ─── 5. Train ──────────────────────────────────────────────────────────────────
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_dataset,
    dataset_text_field="text",
    max_seq_length=2048,
    dataset_num_proc=2,
    packing=False,  # True packs short sequences; set False if all examples similar length
    args=training_args,
)

trainer.train()

# ─── 6. Save ───────────────────────────────────────────────────────────────────
model.save_pretrained("./my-fine-tuned-model")
tokenizer.save_pretrained("./my-fine-tuned-model")

# Save merged model for GGUF export (Ollama)
model.save_pretrained_merged("./my-fine-tuned-model-merged", tokenizer,
                              save_method="merged_16bit")
```

---

## Eval Before/After

**This is not optional.** Fine-tuning without before/after eval is how you ship a
regression without knowing it.

```python
# eval_before_after.py
# Run this before training to establish baseline, then again after

from evals.runner import run_eval, load_cases, exact_match
import openai

# Use the same golden set you have for prompting evals
cases = load_cases("tests/golden_set_v1.jsonl")

# Before: base model
def base_model_task(input_dict):
    from openai import OpenAI
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # stand-in for comparison
        messages=[
            {"role": "system", "content": "Classify as: billing | technical | general"},
            {"role": "user", "content": input_dict["message"]},
        ],
        temperature=0,
    )
    return response.choices[0].message.content.strip().lower()

# After: fine-tuned model via vLLM or Ollama
def finetuned_model_task(input_dict):
    from openai import OpenAI
    # Point to your local vLLM or Ollama endpoint
    client = OpenAI(base_url="http://localhost:8000/v1", api_key="local")
    response = client.chat.completions.create(
        model="my-fine-tuned-model",
        messages=[
            {"role": "user", "content": input_dict["message"]},
            # No system prompt needed — it's baked into the fine-tune
        ],
        temperature=0,
    )
    return response.choices[0].message.content.strip().lower()

base_results, base_score = run_eval(base_model_task, cases)
ft_results, ft_score = run_eval(finetuned_model_task, cases)

print(f"Base model:      {base_score:.2%}")
print(f"Fine-tuned:      {ft_score:.2%}")
print(f"Improvement:     {ft_score - base_score:+.2%}")
```

Also track: HumanEval-style task-specific metrics for your domain, not just golden set.
For a code generation fine-tune, run the full HumanEval benchmark before and after.

---

## Serving: GGUF for Ollama, vLLM for Production

### Export to GGUF for Ollama (local/dev serving)

```python
# After training: export to GGUF format for Ollama
# Q4_K_M = 4-bit quantization, good quality-size balance

model.save_pretrained_gguf(
    "my-model-gguf",
    tokenizer,
    quantization_method="q4_k_m"  # options: q4_k_m, q5_k_m, q8_0, f16
)

# Creates: my-model-gguf/model-Q4_K_M.gguf
```

```bash
# Create Modelfile for Ollama
cat > Modelfile << 'EOF'
FROM ./my-model-gguf/model-Q4_K_M.gguf

PARAMETER temperature 0
PARAMETER stop "<|end_of_text|>"

SYSTEM """
You are a customer support classifier. Classify messages as: billing | technical | general
"""
EOF

ollama create my-classifier -f Modelfile
ollama run my-classifier "My subscription was charged twice"
```

### Serve with vLLM for production (higher throughput)

```python
# modal_serve.py — deploy fine-tuned model via vLLM on Modal
import modal

app = modal.App("fine-tuned-classifier")
model_volume = modal.Volume.from_name("fine-tuned-model")
image = modal.Image.debian_slim().pip_install(["vllm"])

@app.cls(
    gpu="A10G",
    image=image,
    volumes={"/model": model_volume},
)
class Classifier:
    @modal.enter()
    def start_vllm(self):
        from vllm import LLM, SamplingParams
        self.llm = LLM(model="/model/my-fine-tuned-model-merged")
        self.sampling = SamplingParams(temperature=0, max_tokens=50)

    @modal.web_endpoint(method="POST")
    def classify(self, request: dict) -> dict:
        outputs = self.llm.generate([request["message"]], self.sampling)
        return {"category": outputs[0].outputs[0].text.strip().lower()}
```

---

## Common Gotchas

**Catastrophic forgetting**

When you fine-tune on a narrow task, the model can "forget" general capabilities.
Example: fine-tuning for JSON extraction might degrade the model's ability to write prose.
Mitigate by:

- Adding 5-10% general instruction-following examples to your training set
- Using conservative LoRA rank (r=8 or r=16, not r=64)
- Keeping fine-tuning to 1-3 epochs on smaller datasets

**Overfitting at 5 epochs**

A training loss that keeps decreasing while your eval loss stops improving is classic
overfitting. 3 epochs is the safe default. Add early stopping:

```python
from transformers import EarlyStoppingCallback

trainer = SFTTrainer(
    ...
    callbacks=[EarlyStoppingCallback(early_stopping_patience=3)],
)
# requires: evaluation_strategy="steps", eval_steps=50 in TrainingArguments
```

**VRAM OOM during training**

If you hit OOM:

1. Reduce `per_device_train_batch_size` to 1
2. Increase `gradient_accumulation_steps` to compensate (keep effective batch size)
3. Reduce `max_seq_length` (most impactful — VRAM scales quadratically with seq length)
4. Reduce LoRA rank from 16 → 8
5. If still OOM: use Unsloth's `use_gradient_checkpointing="unsloth"` (already on in template)

**Wrong chat template**

Each model family has a specific chat template (Llama 3 uses `<|start_header_id|>`,
Mistral uses `[INST]`, etc.). Mixing them causes subtle quality degradation that looks
like a training problem.

```python
# Unsloth automatically applies the correct template:
from unsloth.chat_templates import get_chat_template
tokenizer = get_chat_template(tokenizer, chat_template="llama-3")  # or "mistral", "phi-3"
```

---

## Related Warehouse Entries

- [`unsloth`] — the tool entry with full capabilities and limitations
- [`vllm`] — production serving of fine-tuned models
- [`modal`] — run fine-tuning jobs on serverless GPU without managing servers
- [`ollama`] — local serving of GGUF exports for dev/testing
- [`wandb`] — experiment tracking for fine-tuning runs
- [`langfuse`] — trace the fine-tuned model in production to measure real-world quality

---

## Quick Reference Checklist

```
Before you start:
  [ ] 500+ high-quality labeled examples
  [ ] Eval harness with golden set (run baseline score first)
  [ ] Hardware sized to model (8B needs A10G or 4090; 70B needs 2×A100)
  [ ] W&B or MLflow tracking set up

Training:
  [ ] pip install unsloth trl transformers datasets
  [ ] load_in_4bit=True (QLoRA — fits 8B on A10G)
  [ ] r=16, lora_alpha=16 (start here; tune if quality insufficient)
  [ ] num_train_epochs=3 (watch loss curve; stop early if eval loss rises)
  [ ] Correct chat template applied via get_chat_template()

Post-training:
  [ ] Eval score vs baseline (must show improvement on golden set)
  [ ] Export GGUF for Ollama (dev/local testing)
  [ ] Export merged 16-bit for vLLM (production serving)
  [ ] Run 10 adversarial test cases (did catastrophic forgetting occur?)

Production:
  [ ] vLLM endpoint deployed (Modal for burst, RunPod for 24/7)
  [ ] Langfuse traces on fine-tuned model (compare quality vs API model)
  [ ] Re-run evals weekly for first month (quality can drift with traffic distribution shift)
```
