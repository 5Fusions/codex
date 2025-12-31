# Stake Engine External Research Playbook

> This environment cannot reach the public internet (`CODEX_SANDBOX_NETWORK_DISABLED=1`). Use this playbook when connectivity is available to perform the “deep web search” the user requested and to feed results into `docs/stake-engine-knowledge-base-template.md`.

## Goals
- Catalog every programming language, SDK, CLI, contract language (e.g., PrimaTor, Cairo), and framework referenced by Stake Engine.
- Capture build, install, and publishing steps for each SDK/library (package managers, build flags, required toolchains).
- Collect authoritative examples for staking + gaming flows (code snippets, repos, tutorials, samples) across all supported stacks.
- Identify ecosystem dependencies (compilers, runtimes, wallets, chains, databases, telemetry backends) and their version constraints.
- Map external findings back to the agent’s implementation backlog (APIs to wrap, type definitions to mirror, integration tests to script).

## Research sources (prioritized)
1. **Official properties**: stake-engine.com (main site + blog/changelog), docs subpages, status pages, download centers, SDK repos (GitHub/GitLab), package registries (npm, crates.io, PyPI, Cargo, Go modules), and container registries.
2. **Community/secondary**: forum posts, issue trackers, StackOverflow/Q&A, conference talks, and example projects that reference Stake Engine primitives.
3. **Adjacent tech**: languages/toolchains mentioned (e.g., Cairo/PrimaTor toolchains, Rust/TypeScript SDKs, Solidity/CosmWasm bindings) and any staking-related libraries they depend on.

## Data to collect per artifact
- **Identity**: name, repo URL, package URL, latest version, release date, license.
- **Language/toolchain**: required compilers, SDK/runtime versions, build tools, and platform prerequisites.
- **Install/build**: commands for install, build, test, lint, and publish (include env vars, feature flags, target triples).
- **API surface**: key classes/functions/modules, initialization/configuration patterns, auth hooks, request/response shapes.
- **Examples**: minimal runnable snippets for staking lifecycle and game integration flows; note dependencies and expected outputs.
- **Integration notes**: compatibility constraints, breaking changes, migration guidance, deprecation notices.
- **Security/perf guidance**: signing/verification steps, rate limits, concurrency/throughput tuning, sandbox/test harnesses.

## Workflow
1. **Inventory**
   - Search for “Stake Engine” + SDK/CLI keywords (e.g., `npm view stake-engine`, `cargo search stake-engine`, `pip search stake-engine`).
   - Enumerate repos under official org/user; list branches/tags/releases.
   - Note any reference to PrimaTor or Cairo and locate their official docs/toolchains.
2. **Pull artifacts**
   - Clone/download each repo; copy READMEs, docs, examples, and sample configs.
   - For packages, fetch metadata (dependencies, scripts, engines, supported platforms) from manifests.
3. **Extract & normalize**
   - Summarize install/build/test commands verbatim; record required environment variables and config files.
   - Capture public API signatures and primary usage patterns (constructor args, init options, event handlers, error types).
   - Save canonical staking/gameplay examples for each language.
4. **Validate**
   - Run quick-starts and sample scripts where possible; record outputs and troubleshooting steps.
   - Flag flaky/outdated guidance; note unresolved questions in the knowledge base “Open questions” section.
5. **Feed into knowledge base**
   - Populate `APIs & SDKs`, `Architecture`, `Staking primitives`, `Game integration`, `Testing`, and `Open questions` sections with citations to the discovered sources.
   - Add a matrix of supported languages vs. capability coverage (staking ops, matchmaking, observability, deployment tooling).

## Output checklist (attach to knowledge base)
- Table of SDKs/CLIs with install/build/publish commands and version requirements.
- Snippet gallery per language for: create stake, join/start game, settle and distribute rewards, handle slashing/penalties.
- Dependency graph linking core libraries to chains/toolchains (e.g., Cairo compiler version, PrimaTor runtime, node/rust toolchains).
- Validation notes: which quick-starts/tests succeeded, which failed, and fixes.
- Pending questions and follow-ups when documentation or code is ambiguous.
