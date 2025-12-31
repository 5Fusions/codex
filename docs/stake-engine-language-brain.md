# Stake Engine Language Brain

Purpose: concentrate per-language coding guidance so the agent can produce parity-complete staking/game code across all supported stacks (TypeScript/Node, Rust, Cairo/PrimaTor, Python/Go, and any others discovered).

## Coverage goals
- Every staking/game flow (create/top-up/pause/resume/unstake/withdraw, lobby/match lifecycle, settlement, slashing/disputes) must have a known implementation path in each supported language.
- Auth, retries, idempotency, and error handling must stay consistent across SDKs and contracts.
- SDKs/clients should be derivable from a shared schema/ABI to eliminate drift; when codegen is unavailable, capture authoritative snippets from the docs and mirror them verbatim.

## Per-language quick references (fill from docs/knowledge base)

### TypeScript/Node
- Package/install command, Node version, and required flags (e.g., `--loader`, `--experimental-vm-modules`).
- Auth helpers and environment variables.
- Canonical client initialization and sample calls for stake create/join game/settle/withdraw.
- Test/lint/build/publish commands and how to run provided examples.
- Captured docs (source: Stake Development Kit API Documentation; date not specified): front-end framework uses PixiJS/Svelte to render slot games in-browser, consuming math-engine outputs so the UI stays aligned with deterministic outcomes generated offline. Track required PixiJS/Svelte versions/tooling once available and mirror build commands in parity grid.

### Rust
- Crate name/features, minimum Rust toolchain, and workspace layout.
- Typed request/response structs and error enums for staking and game endpoints.
- Async runtime expectations, backoff/retry helpers, and tracing/logging setup.
- Cargo commands for tests/examples/benchmarks; how to run contract or API integration tests if provided.

### Cairo/PrimaTor (contracts)
- Compiler/tool version and install command.
- Storage layout, event schema, and function signatures for staking/game contracts.
- Deploy/upgrade/migration steps; ABI generation; fuzz/simulation hooks.
- Integration notes for off-chain callers (signatures, nonce/replay protection, fee/gas config).

### Python/Go/other
- Module path/install command and minimal runtime version.
- Auth/retry middleware and request builders.
- Example code for the full lifecycle (stake create → withdraw; lobby → settle → distribute) mirroring TypeScript expectations.
- Test commands (pytest/go test) and packaging/publish steps.
- Captured docs (source: Stake Development Kit API Documentation): math framework is Python-based for defining slot rules, simulating outcomes, optimizing win distributions, and emitting backend/config files, lookup tables, and simulation results for upload to the Stake Engine/ACP. Capture install/runtime requirements and CLI/API entry points when available; ensure parity grid reflects deterministic artifact generation.

## Parity grid template
| Flow | TypeScript entry point | Rust entry point | Cairo/PrimaTor contract fn | Python/Go entry point | Notes/quirks |
| --- | --- | --- | --- | --- | --- |
| Create stake | | | | | |
| Top-up | | | | | |
| Pause/resume | | | | | |
| Unstake/withdraw | | | | | |
| Lobby/match create | | | | | |
| Join/start | | | | | |
| Settle | | | | | |
| Slash/dispute | | | | | |

## Validation hooks
- Keep golden request/response payloads per language; ensure they serialize identically (numbers vs decimals, bigint handling).
- Add parity tests that execute the same scenario across languages and compare resulting state/events.
- Track changelog per language; when one SDK/contract changes, update others or mark TODOs with required deltas.

## Sandbox/demo pointers
- The local TypeScript simulator lives at `sdk/typescript/samples/stake_engine_app.ts`; extend it with feature flags to mirror official behaviors as they are documented.
- When official docs provide language-specific demos, import them here with notes on prerequisites and expected outputs.
