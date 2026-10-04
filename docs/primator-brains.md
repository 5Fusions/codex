# Primator brain file (multi-model pack)

This brain file collects the model/provider pairings for the Primator copilot so you can swap “brains” quickly without re-writing your main config.

- **What it is:** a catalog of prefilled model/provider combos (OpenAI, Gemini, DeepSeek, Ollama) plus their provider blocks.
- **How to use it:** copy the provider blocks into `~/.codex/config.toml` (or `docs/primator-config.example.toml` before you copy it), then select the brain you want by setting `model` and `model_provider`.
- **Command-only by default:** Primator’s preamble/approval contract is unchanged—this file only helps you swap models.

## Steps

1. **Copy the brain pack.** Either open `docs/primator-brainpack.example.toml` and merge the provider sections you want into your `~/.codex/config.toml`, or append it directly:
   ```bash
   # merge brain pack into your config (creates the file if missing)
   cat docs/primator-brainpack.example.toml >> ~/.codex/config.toml
   ```
2. **Pick your brain.** Choose one entry from the `[brains.<name>]` table in the brain pack and set both `model` and `model_provider` to those values in your config (or pass them at runtime with `--config model=... model_provider=...`). Only one brain should be active at a time.
3. **Run Primator.** Launch with the command-only profile:
   ```bash
   codex --profile primator
   ```
4. **Stay approval-gated.** Keep `approval_policy = "untrusted"` (or stricter) so Primator only executes commands after you explicitly request a task and approve the run.

## Brain index

- **OpenAI (default):** Balanced general-purpose brain using `gpt-4o`.
- **Gemini:** Google Gemini-compatible brain for reasoning or multimodal tasks.
- **DeepSeek:** DeepSeek-compatible brain for code-heavy or research-oriented tasks.
- **Ollama/local:** Offline/local brain via Ollama for air-gapped or privacy-first sessions.

You can add more brains by extending the `[brains.<name>]` table and defining matching `model_providers.<name>` blocks.
