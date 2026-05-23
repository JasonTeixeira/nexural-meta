# Playbook: Deploy to Modal

> **Trigger:** You have a Python function that needs GPU access, runs longer than Lambda's
> 15-minute limit, needs burst scale without provisioned infrastructure, or you want
> a production-grade endpoint for an ML model in under an hour.

---

## Why Modal vs Replicate vs RunPod

From [DECISIONS.md] (GPU / Inference section):

```
Modal:     serverless containers, Python-first DX, cold start ~1-2s, pay per second,
           A10G/A100/H100 available, great for burst GPU without server management.

Replicate: model-as-API, deploy any model with a Cog container, best if you want to
           publish a model for others to call, less control than Modal.

RunPod:    on-demand and spot GPU pods, ~40-60% cheaper than Modal at sustained 24/7 load,
           but you manage the server. Right choice when utilization > 50% continuously.
```

**Choose Modal when:**

- Python functions with GPU burst (spiky load, not 24/7)
- Inference endpoints you want live in <1 hour
- Batch processing jobs (embed documents, run evals, fine-tune on schedule)
- Any job >15 minutes (Lambda's hard limit)
- You want zero server management

**Choose RunPod when:**

- Serving a model 24/7 at consistent load (RunPod on-demand ~$0.44/hr A10G vs Modal ~$1.10/hr)
- Need NVLink multi-GPU setups for 70B+ model inference
- Budget is the primary constraint and you can manage a persistent server

---

## Step 1: Install and Authenticate

```bash
pip install modal
modal token new
# Opens browser → authenticate with GitHub/Google → saves token to ~/.modal.toml
```

Verify it worked:

```bash
modal run --help
# Should print Modal CLI help without auth errors
```

---

## Step 2: Your First @app.function

Modal apps are Python files. The core concept: `@app.function()` turns any Python function
into a serverless function that runs in Modal's cloud. The function body runs remotely;
everything else is local.

```python
# hello_modal.py
import modal

app = modal.App("hello-world")

@app.function()
def greet(name: str) -> str:
    return f"Hello, {name}! Running in Modal."

# Run locally (but executes in Modal's cloud):
# modal run hello_modal.py::greet --name "Sage"
```

### Adding dependencies

```python
# anything_image.py
import modal

# Define a custom image with your dependencies
image = modal.Image.debian_slim(python_version="3.12").pip_install([
    "torch",
    "transformers",
    "accelerate",
    "pydantic",
])

app = modal.App("my-ml-app", image=image)

@app.function(gpu="A10G", timeout=600)
def run_inference(prompt: str) -> str:
    from transformers import pipeline
    pipe = pipeline("text-generation", model="microsoft/Phi-3-mini-4k-instruct")
    result = pipe(prompt, max_new_tokens=200)
    return result[0]["generated_text"]
```

Run it:

```bash
modal run anything_image.py::run_inference --prompt "What is retrieval-augmented generation?"
```

---

## Step 3: @web_endpoint — Public HTTP Endpoint

```python
# inference_server.py
import modal
from pydantic import BaseModel

image = modal.Image.debian_slim(python_version="3.12").pip_install([
    "torch", "transformers", "accelerate", "fastapi", "pydantic"
])

app = modal.App("inference-server", image=image)

# Store model in a Volume so it persists across cold starts (see Step 5)
model_volume = modal.Volume.from_name("model-weights", create_if_missing=True)

class InferenceRequest(BaseModel):
    prompt: str
    max_tokens: int = 256

class InferenceResponse(BaseModel):
    text: str
    tokens_generated: int

@app.cls(
    gpu="A10G",
    volumes={"/models": model_volume},
    min_replicas=0,    # scale to zero when idle
    max_replicas=5,    # max scale-out
)
class InferenceModel:
    @modal.enter()
    def load_model(self):
        """Runs once per container startup — load heavy artifacts here."""
        from transformers import AutoModelForCausalLM, AutoTokenizer
        import torch

        model_id = "microsoft/Phi-3-mini-4k-instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch.float16,
            device_map="cuda",
        )
        print("Model loaded!")

    @modal.web_endpoint(method="POST")
    def infer(self, request: InferenceRequest) -> InferenceResponse:
        import torch

        inputs = self.tokenizer(request.prompt, return_tensors="pt").to("cuda")
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=request.max_tokens,
                do_sample=True,
                temperature=0.7,
            )

        generated = self.tokenizer.decode(
            outputs[0][inputs.input_ids.shape[1]:],
            skip_special_tokens=True
        )
        return InferenceResponse(
            text=generated,
            tokens_generated=len(outputs[0]) - inputs.input_ids.shape[1],
        )
```

Deploy it:

```bash
modal deploy inference_server.py
# → https://your-username--inference-server-inferencemodel-infer.modal.run
```

Test it:

```bash
curl -X POST https://your-endpoint.modal.run \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain RAG in one paragraph", "max_tokens": 150}'
```

---

## Step 4: Secrets Management

Never hardcode API keys. Modal has a built-in secrets management system.

```bash
# Create a secret in Modal (one-time setup)
modal secret create openai-key OPENAI_API_KEY=sk-...
modal secret create anthropic-key ANTHROPIC_API_KEY=sk-ant-...
```

```python
# Use secrets in your functions
@app.function(
    secrets=[
        modal.Secret.from_name("openai-key"),
        modal.Secret.from_name("anthropic-key"),
    ]
)
def call_openai(prompt: str) -> str:
    import os, openai

    # Secret is injected as env var automatically
    client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
```

For local development, Modal secrets are available when using `modal run` (not just deploy).
You can also use `modal.Secret.from_dotenv()` to read from a local `.env` file.

---

## Step 5: Volume Mounts for Model Weights

Downloading a 7B model on every cold start is expensive (~3-5 minutes). Volumes persist
files across container restarts.

```python
# download_weights.py — run once to populate the volume
import modal

app = modal.App("download-weights")
model_volume = modal.Volume.from_name("llama-weights", create_if_missing=True)

image = modal.Image.debian_slim().pip_install(["huggingface_hub"])

@app.function(
    image=image,
    volumes={"/models": model_volume},
    timeout=3600,  # 1 hour — model downloads take time
)
def download_llama():
    from huggingface_hub import snapshot_download

    snapshot_download(
        "meta-llama/Llama-3.1-8B-Instruct",
        local_dir="/models/llama-3.1-8b-instruct",
        token=os.environ.get("HF_TOKEN"),  # needed for gated models
    )
    modal_volume.commit()  # flush writes to volume
    print("Downloaded!")

# Run once:
# modal run download_weights.py::download_llama
```

```python
# inference_server.py — reuse the volume
@app.cls(
    gpu="A10G",
    volumes={"/models": model_volume},  # mount the same volume
)
class Model:
    @modal.enter()
    def load(self):
        # /models/llama-3.1-8b-instruct already exists — no download
        from transformers import AutoModelForCausalLM, AutoTokenizer
        self.model = AutoModelForCausalLM.from_pretrained(
            "/models/llama-3.1-8b-instruct",
            device_map="cuda",
        )
```

---

## Step 6: Autoscaling and Concurrency Knobs

```python
@app.cls(
    gpu="A10G",
    min_replicas=0,          # Scale to zero when no traffic (saves money)
    max_replicas=10,          # Max scale-out
    scaledown_window=300,     # Keep warm for 5 minutes after last request
    allow_concurrent_inputs=4, # 4 concurrent requests per container (batching)
)
class MyModel:
    ...
```

**Concurrency knobs explained:**

- `min_replicas=0`: cheapest option; ~2s cold start. Set `min_replicas=1` for always-warm
  if cold starts are user-facing and unacceptable.
- `allow_concurrent_inputs`: for LLM inference, set to 1 (requests block each other).
  For CPU-bound tasks (embeddings, preprocessing), set higher.
- `scaledown_window`: trade-off between cost (lower) and cold start frequency (higher).

**GPU options (May 2026 pricing, pay per second):**

| GPU         | $/hr   | Use case                        |
| ----------- | ------ | ------------------------------- |
| T4          | ~$0.30 | Small models, dev/test          |
| A10G        | ~$1.10 | 7-13B inference, 8B fine-tune   |
| A100 (40GB) | ~$3.70 | 13-30B inference, 13B fine-tune |
| A100 (80GB) | ~$4.90 | 30-70B inference, 30B fine-tune |
| H100        | ~$8.50 | Maximum throughput production   |

---

## Step 7: Cost Monitoring

Modal Insights shows spend per function, per day, and per GPU type.
Set budget alerts:

```bash
# Modal dashboard → Settings → Billing → Set monthly limit
# Also monitor via CLI:
modal app list
modal app stats inference-server  # shows invocations, tokens, cost
```

**Cost estimation formula:**

```
Daily cost = (avg_requests/day × avg_GPU_seconds/request × $/second)

Example: 1,000 requests/day, 3s each on A10G ($1.10/hr = $0.000306/sec):
  = 1,000 × 3 × $0.000306 = $0.92/day = $27.60/mo

At 10,000 requests/day: $9.18/day = $275.40/mo
At 100,000 requests/day: $91.80/day = $2,754/mo → evaluate RunPod at this point
```

---

## Step 8: CI/CD with GitHub Actions

Autodeploy on merge to main:

```yaml
# .github/workflows/deploy-modal.yml
name: Deploy to Modal
on:
  push:
    branches: [main]
    paths:
      - "inference/**"
      - "requirements.txt"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: pip install modal

      - name: Deploy to Modal
        env:
          MODAL_TOKEN_ID: ${{ secrets.MODAL_TOKEN_ID }}
          MODAL_TOKEN_SECRET: ${{ secrets.MODAL_TOKEN_SECRET }}
        run: |
          modal deploy inference/server.py

      - name: Smoke test endpoint
        run: |
          ENDPOINT=$(modal app list --json | jq -r '.[] | select(.name=="inference-server") | .url')
          curl -f -X POST "$ENDPOINT" \
            -H "Content-Type: application/json" \
            -d '{"prompt": "test", "max_tokens": 10}'
```

**Get your Modal token for CI:**

```bash
modal token new --create-service-account "github-ci"
# Copy MODAL_TOKEN_ID and MODAL_TOKEN_SECRET to GitHub repo secrets
```

---

## Common Gotchas

### Cold starts

Cold starts take ~1-2s for CPU functions and ~5-30s for GPU functions (model loading).
The GPU cold start is dominated by:

1. Container pull (~2s, mostly cached)
2. Model weight loading from disk (~2-25s depending on model size and volume read speed)

**Mitigations:**

- Use `min_replicas=1` for user-facing endpoints where cold starts are unacceptable
- Warm up the model in `@modal.enter()` so it's ready before the first request
- Use Modal Volumes (NVMe SSD) instead of downloading weights on startup
- `scaledown_window=300` keeps containers warm for 5 minutes after last request

### Timeout limits

Default timeout is 5 minutes. Increase for long-running jobs:

```python
@app.function(timeout=3600)  # 1 hour max; fine-tune jobs, batch processing
def long_job():
    ...
```

**Max timeout:** 1 hour for regular functions, 24 hours for batch jobs with
`modal.Batch`.

### Region selection

Modal defaults to US regions. For latency-sensitive European traffic:

```python
@app.function(region="eu-central-1")  # Frankfurt
def eu_inference():
    ...
```

Available regions: `us-east-1`, `us-west-2`, `eu-central-1`, `ap-southeast-1`.
For voice agents, deploying to the region closest to your users is non-negotiable
(adds ~50-100ms RTT otherwise).

### Import costs

Modal functions import their dependencies fresh on each cold start. Heavy imports
(torch, transformers) add 2-5s to cold start time. Mitigate by loading in
`@modal.enter()` and keeping references on `self`.

### Debugging remote functions

```python
# Run in local debug mode (no Modal cloud, runs in your local process):
modal run --local my_function.py

# Stream remote logs:
modal logs --follow inference-server

# SSH into a running container (for debugging model loading issues):
modal shell inference-server
```

---

## Related Warehouse Entries

- [`modal`] — the tool entry with full capabilities, pricing, and comparison
- [`runpod`] — when 24/7 sustained load makes RunPod cheaper than Modal
- [`vllm`] — serve open-weight models on Modal for higher throughput than Transformers
- [`langfuse`] — add LLM observability to your Modal inference endpoint
- [`replicate`] — alternative if you want to publish models publicly rather than internal endpoints

---

## Quick Reference Checklist

```
Day 1:
  [ ] modal token new (authenticated)
  [ ] First @app.function() running remotely
  [ ] Dependencies in Image definition (not requirements.txt in repo root)
  [ ] Secrets in modal.Secret.from_name(), not hardcoded

Week 1:
  [ ] @web_endpoint with Pydantic request/response models
  [ ] Model weights in Volume (not downloaded per cold start)
  [ ] GitHub Action deploying on merge to main
  [ ] Smoke test in CI pipeline

Production:
  [ ] min_replicas set appropriately (0 for batch, 1 for user-facing)
  [ ] Budget alert configured in Modal dashboard
  [ ] EU region deployed if European users (latency)
  [ ] Timeout set for long-running functions (default 5min is too low for training)
```
