# Stake Engine Master Coder Blueprint

Goal: define how to operate as an offline-first expert coder for staking-enabled games, ready to execute once `docs/stake-engine-study-plan.md` and `docs/stake-engine-knowledge-base-template.md` are populated from https://stake-engine.com/docs and external research.

## Operating constraints
- No live internet in the sandbox; rely on the populated knowledge base and external research artifacts as the source of truth.
- Honor the languages and SDKs enumerated in the knowledge base (e.g., PrimaTor, Cairo, Rust, TypeScript) and prefer their official build/test flows.
- Never fabricate staking rules; if a fact is missing, surface a TODO with the exact question and blocking dependency.

## Inputs to load before coding
1. Completed knowledge base (`docs/stake-engine-knowledge-base-template.md`) with URLs/anchors.
2. External research addendum (`docs/stake-engine-external-research-playbook.md` outputs): SDK install/build/publish steps, repo links, and validated samples.
3. Game/staking acceptance criteria from product/design (win conditions, slashing rules, payout logic, fairness/RNG requirements).
4. Environment constraints: supported runtimes, deployment targets, testing sandboxes, and security requirements.

## Core capabilities
- **Staking primitives:** implement/create/top-up/pause/resume/unstake/withdraw flows; reward accrual and slashing logic; cooldowns and penalties with precise state transitions.
- **Game lifecycle:** lobby/match/session orchestration, player enrollment, timers/windows, fairness/RNG hooks, settlement and dispute handling.
- **Integrations:** wire APIs/SDKs/CLIs, event streams (WebSocket/SSE), and contract bindings (PrimaTor/Cairo) with retries, idempotency, and backfill rules.
- **Telemetry & safety:** metrics/logs/traces, health checks, rate limits, anti-cheat/anti-replay defenses, and governance/upgrades where required.

## Coding playbooks (apply per language/toolchain)
- **General:** adopt the official install/build/test/publish commands from the knowledge base; mirror config/env-var names exactly; keep schemas and examples verbatim.
- **PrimaTor/Cairo:** generate contracts/modules following documented storage/layout patterns, event emissions, and on-chain/off-chain split; include fuzz/simulation hooks if provided.
- **Rust:** favor typed clients, error enums, and integration tests derived from canonical request/response pairs; respect feature flags and workspace conventions.
- **TypeScript/Node:** expose thin SDK wrappers with input validation, backoff/retry helpers, and typed payloads; ship example scripts mirroring quick-starts.
- **Polyglot consistency:** align naming, state diagrams, and error codes across languages; centralize constants and schemas to avoid drift.

## Task execution flow
1. **Scope:** restate the target feature/fix and map it to knowledge base sections (staking primitive, game integration, SDK endpoint).
2. **Plan:** outline endpoints/contracts/modules touched, configuration keys, and test vectors; log any unknowns as TODOs with source references.
3. **Implement:** follow the relevant language playbook; keep payloads/schemas identical to the docs; add guardrails (idempotency keys, signature checks, rate-limit handling) per guidance.
4. **Validate:** run the documented test commands; add golden tests from doc examples (create stake, join/start game, settle, slash/penalize, distribute rewards); record outputs and gaps.
5. **Document:** update the knowledge base delta (new behaviors, errors, or constraints observed) and note any unresolved items.

## Staking/game scenario recipes
- **Create & activate stake:** validate inputs, sign/authenticate, submit, await activation event; assert state and reward baseline.
- **Cooldown/unstake/withdraw:** enforce cooldown timers, verify eligibility, process withdrawal, and emit audit events.
- **Match lifecycle:** create lobby/session → join window → start → resolve RNG → settle scores → distribute rewards/penalties; ensure deterministic replay and dispute hooks.
- **Slashing:** detect trigger (cheat/fault), calculate penalty per formula, apply state change, notify observers, and lock withdrawals as required.
- **Observability check:** ensure each scenario emits metrics/logs/traces with correlation IDs and player/session identifiers.

## Quality gates before delivery
- All code paths linked to doc anchors or research artifacts; no undocumented behaviors.
- Tests cover: happy path, invalid inputs, timing windows, retries/idempotency, and failure/recovery for each scenario.
- Security reviews: signature/nonce/replay protection, role/permission checks, PII/key handling, and governance/upgrade safety.
- Performance notes: concurrency limits, batching thresholds, cache hints, and benchmark targets from the docs.

## Rapid response / unknowns
- If the knowledge base lacks a detail, mark a TODO with the needed source (URL/section) and propose a safe default guarded by feature flags.
- Maintain a running list of discrepancies between docs and observed behavior; escalate with reproducible test cases.

## Local runnable demo
- A minimal end-to-end stake-and-match simulator lives at `sdk/typescript/samples/stake_engine_app.ts`.
- It showcases player registration, staking, match entry, deterministic scoring, reward distribution, slashing checks, and withdrawals.
- Run it with `pnpm ts-node-esm --files sdk/typescript/samples/stake_engine_app.ts` to see balances and audit trails printed to the console.
