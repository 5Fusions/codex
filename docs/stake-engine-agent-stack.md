# Stake Engine Agent Stack (Front-end + Back-end)

This sample pairs a minimal "brain" back-end with a console-friendly front-end so you can teach and query a stake-engine-focused agent locally. The back-end exposes an HTTP API for administrators to extend the agent's brain (languages, knowledge, commands), while the front-end sends user prompts and receives narrated responses.

## Back-end

The back-end lives in `sdk/typescript/samples/agent_brain_service.ts` and runs an in-memory `AgentBrain` with the following routes:

- `POST /admin/languages` — register a language profile (code, name, modalities, proficiency, focusAreas).
- `POST /admin/modules` — create a module to group knowledge and commands.
- `POST /admin/modules/connect-language` — link a language to a module.
- `POST /admin/knowledge` — add knowledge to a module (topic, content, tags, priority).
- `POST /admin/commands` — add command definitions to a module (name, description, syntax, example).
- `GET /admin/brain` — snapshot all languages, modules, knowledge, and commands.
- `GET /agent/readiness?moduleId=<optional>` — report whether the brain (or a module) has enough languages, knowledge, and commands to build stake games, plus any missing gaps to fix first.
- `POST /agent/message` — user-facing chat entry point; returns a message plus optional voice cue and suggested commands.
- `POST /agent/voice-design` — turn a voice-described game idea into a stake match blueprint plus narrated build steps.

The server uses only Node's standard library and keeps all data in-memory for quick iteration.

## Front-end

The same sample file includes two lightweight clients:

- `AdminClient` handles back-end calls to seed languages, modules, knowledge, and commands.
- `FrontEndClient` posts user prompts to `/agent/message` with optional module selection, preferred language, and voice flag.

The front end can also call `/agent/readiness` before prompting the agent to confirm that the stake module has languages, onboarding/match/payout knowledge, and commands linked; any missing items are logged so the admin can fix them first.

A demo run seeds a Stake Engine module (player onboarding, match flow, payouts, voice UX) plus three commands (`register-player`, `open-match`, `settle-match`). The front-end first asks the agent to design and narrate a three-player match and prints the textual and vocal outputs alongside suggested commands. It then sends a voice-style prompt to `/agent/voice-design`, which emits a ready-to-run blueprint (players, stakes, rounds, RNG seed, suggested commands) and a narrated build plan.

## Running the demo

```bash
cd sdk/typescript
pnpm ts-node-esm --files samples/agent_brain_service.ts
```

The script starts the back-end on `http://localhost:8787`, seeds the brain, issues a front-end prompt, prints the response, and then shuts down the server.
