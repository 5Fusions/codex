# Real Estate Fusions GPT (RFG) crawler blueprint

A command-only, approval-gated crawler agent that scans public property ads across Quebec, exports results hourly, and stays isolated from other tooling. This recodes the earlier copilot concept into a dedicated real-estate-focused crawler with clearer guardrails and easier deployment.

## Operating contract (no autonomous actions without commands)

- Runs commands only when you explicitly request a task and approve execution.
- Scopes itself to the Quebec property-ad space (for-sale and for-rent postings, including exceptional deals from brokerages) and ignores unrelated domains.
- Respects site terms/robots and avoids bypassing paywalls or private data; targets public postings only.
- Cleans up after each run (temporary files/logs in its own working directory) to avoid interference with other tools.

## Isolation & environment

- Install and run under a dedicated system user or virtual environment so dependencies cannot clash with other projects.
- Keep configs under `~/.codex/` (profile, providers, seeds) and crawler outputs under `~/rfg-crawler/output/` (CSV/HTML) to avoid touching other apps.
- Pin provider endpoints and API keys via environment variables; avoid hard-coding secrets in the config file.
- If you need offline mode, point the profile to a local model provider (e.g., Ollama) and keep allowlisted sources in a local `sources.txt`.

## Install & configure

1. Install Codex CLI (see `docs/install.md`) and ensure `codex` is on your PATH.
2. Copy `docs/rfg-crawler-config.example.toml` to `~/.codex/config.toml` (or merge it with your existing config).
3. Optionally merge `docs/primator-brainpack.example.toml` if you want ready-made provider "brains" (OpenAI, Gemini, DeepSeek, Ollama) and switch by setting `model` and `model_provider`.
4. Edit the RFG preamble if you want a different tone, but keep the command-only clauses intact.

## Profile config (ready to copy)

The example config ships in `docs/rfg-crawler-config.example.toml` and sets up a `rfg_crawler` profile with OpenAI as the default brain. Provider blocks are kept minimal so you can drop in alternatives from the brain pack.

```toml
# Default brain and approvals
model = "gpt-4o"
model_provider = "openai"
approval_policy = "untrusted"
profile = "rfg_crawler"

[profiles.rfg_crawler]
model = "gpt-4o"
model_provider = "openai"
approval_policy = "untrusted"
preamble = "You are RFG, a command-only real-estate crawler for Quebec. Only run commands when explicitly asked. Before running, confirm the task, list the target sources, and request approval. Stay within public property ads, respect site terms/robots, and export results to CSV/HTML."

[model_providers.openai]
name = "OpenAI"
# Fill in OPENAI_API_KEY in your environment before running.
```

## Supply sources and filters

- Maintain an allowlist file (e.g., `~/.codex/rfg-sources.txt`) that enumerates public listing sites and direct-owner classifieds you want scanned. Avoid gray-area or restricted sources.
- Define filters the agent should apply in each run (price caps, property types, region focus within Quebec) inside the task prompt you pass when starting a crawl.
- If a site offers feeds/exports, prefer those endpoints to reduce crawling overhead.

## Run a crawl manually

```bash
codex --profile rfg_crawler --prompt "Scan allowlisted Quebec property-ad sites for new postings in the last 24h, filter for deals under CAD $500k, and export CSV + HTML to ~/rfg-crawler/output." --config output_dir=~/rfg-crawler/output
```

- The `output_dir` override keeps artifacts contained; you can also set it inside your profile.
- The agent should ask for approval before running shell commands (fetching pages, writing files, zipping results).

## Automate hourly runs (cron example)

1. Create a shell wrapper that sets env vars (API keys, output dir) and invokes the above `codex` command.
2. Add a cron entry:
   ```cron
   0 * * * * /home/youruser/bin/run-rfg-crawler.sh >> /home/youruser/rfg-crawler/logs/cron.log 2>&1
   ```
3. Keep cron’s working directory inside `~/rfg-crawler/` so temporary files stay isolated.

## Outputs

- CSV: normalized columns (title, price, location, source URL, posted_at, scraped_at, notes). Append-only per run; deduplicate by URL/timestamp.
- HTML: lightweight summary dashboard for quick viewing; avoid bundling external assets to keep files portable.
- Optional: gzip old runs and rotate logs weekly to avoid disk bloat.

## Quality and error handling

- Before each run, validate that sources are reachable and skip any site that rejects polite crawling (4xx/5xx or robots exclusion).
- Log skipped sources and errors separately from successful finds so you can review failures without noise.
- Keep a `state` file under `~/rfg-crawler/state/` to remember last-seen timestamps per source for incremental crawls.

## Switching brains

- To try another model/provider, merge `docs/primator-brainpack.example.toml` and set `model`/`model_provider` in the `rfg_crawler` profile.
- Keep the preamble and approval policy unchanged when swapping brains so the command-only contract holds.
