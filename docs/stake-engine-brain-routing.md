# Stake Engine Brain Routing Guide

Use this guide when a new documentation block or snippet is provided. It explains where to file the information so the "brain" stays organized across the existing templates and blueprints.

## Quick triage checklist
1. Identify the source type: official docs, external research, SDK/code snippet, architecture/operations note, or gameplay/staking logic.
2. Pin the target feature/language: TypeScript/Node, Rust, Cairo/PrimaTor, Python/Go, or generic.
3. Route the block using the mapping table below; keep citations/URLs when available.
4. If a target section is missing, add a `TODO` placeholder in the destination file and link back to the incoming block.

## Mapping table
| Incoming block type | Destination file/section | Notes |
| --- | --- | --- |
| Official docs text about terms, flows, auth, events, or limits | `docs/stake-engine-knowledge-base-template.md` (matching section by topic) | Preserve wording; cite URL/anchor. Use section 1–12 headers to place content. |
| REST/GraphQL/WebSocket endpoint details or schemas | `docs/stake-engine-knowledge-base-template.md` → Section 6 (APIs & SDKs) | Include request/response samples and error codes. Mirror pagination/filtering rules. |
| SDK install/usage for TypeScript/Node | `docs/stake-engine-language-brain.md` → TypeScript/Node quick reference + parity grid row | Add commands, minimal runtime, and sample calls. Reference knowledge base Section 6a entry. |
| SDK install/usage for Rust | `docs/stake-engine-language-brain.md` → Rust quick reference + parity grid row | Capture crate/features, toolchain, and sample client calls. Mirror in knowledge base Section 6a. |
| Contract details (Cairo/PrimaTor) | `docs/stake-engine-language-brain.md` → Cairo/PrimaTor section + parity grid row | Record compiler version, ABI, storage layout, and deployment steps. Cross-link to knowledge base Section 6a. |
| SDK guidance for Python/Go/other languages | `docs/stake-engine-language-brain.md` → Python/Go/other section + parity grid row | Include install command, auth helpers, and parity notes. Duplicate essentials in knowledge base Section 6a. |
| Architecture, lifecycle, or reliability guidance | `docs/stake-engine-knowledge-base-template.md` → Sections 2, 8, or 11 as appropriate | Add diagrams/flow descriptions; keep timing/threshold values. |
| Staking or game lifecycle rules, RNG/fairness, penalties | `docs/stake-engine-knowledge-base-template.md` → Sections 4–5 | Include formulas, timers, and dispute/slash criteria. |
| Compliance, security, or governance constraints | `docs/stake-engine-knowledge-base-template.md` → Section 9 | Note KYC/AML, regions, encryption, and audit requirements. |
| External research (third-party writeups, blog posts, forums) | `docs/stake-engine-external-research-playbook.md` → new entry under collection workflow; summarize in `docs/stake-engine-knowledge-base-template.md` matching sections | Capture provenance and validation steps. |
| How-to build/run agent features or demos | `docs/stake-engine-master-coder.md` or `docs/stake-engine-agent-stack.md` → relevant capability section | Keep commands and flags current with sample code. |
| Voice or command orchestration behaviors | `docs/stake-engine-agent-stack.md` → agent/voice endpoints; ensure readiness checks remain aligned | Add any new commands to the agent brain service as needed. |
| Missing gaps or open questions | `docs/stake-engine-knowledge-base-template.md` → Section 12 (Open questions / TODOs) | Include the unresolved question and source. |

## Ingestion workflow
- **Tag and date:** When pasting a block, annotate with the source (URL/title) and retrieval date.
- **Normalize language:** Keep original terminology; avoid paraphrasing unless noted as a summary.
- **Cross-link:** If a block affects multiple areas (e.g., API + Rust SDK), update both the knowledge base and the language brain, and add references between them.
- **Parity grid:** For any new flow or endpoint, fill the parity grid row in `docs/stake-engine-language-brain.md` so all languages stay synchronized.
- **Demo alignment:** When a new rule affects the runnable samples (`sdk/typescript/samples/*.ts`), note the required code change under `docs/stake-engine-master-coder.md` until implemented.

## When the destination is code
- For runtime behaviors or sample flows, update the TypeScript demos in `sdk/typescript/samples/` and document the change in `docs/stake-engine-agent-stack.md`.
- Keep admin/agent endpoints synchronized with the documented commands; add new endpoints to `samples/agent_brain_service.ts` and describe them in the agent stack guide.

## Review gate
Before marking a block as ingested:
- Verify the content is placed in all relevant files.
- Check for drift against existing parity grid entries.
- Add a `TODO` in Section 12 if any clarification is still needed.
