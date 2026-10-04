# Efasa embodiment roadmap (avatar + voice)

Efasa can ship today as a command-only crawler UI, but the “embodied” assistant requires extra pieces (3D avatar, voice, and interaction loops). This roadmap keeps the scope practical while paving a path to higher fidelity later.

## Phase 1: on-screen avatar inside the starter (Electron + React + Three.js)
- **Model source**: start with a ready-made GLB/VRM (e.g., ReadyPlayerMe or another licensable avatar) dressed as a sharp real estate professional.
- **Renderer**: use Three.js inside a React component (corner widget) with a transparent background; hide when minimized.
- **Behaviors**:
  - Idle loop (typing/looking around) and a “listening” pose when the mic is on.
  - Basic gestures driven by UI events (success/fail, new lead, export complete).
  - Toggle to shrink/expand the avatar so it does not block work.
- **Voice**: start with browser TTS or a pluggable TTS provider (ElevenLabs, Amazon Polly, or OpenAI TTS). Cache short phrases locally for offline-ish UX.
- **Hooks**: drive speech from the same responses you render in the UI (no separate logic). Keep audio opt-in with a visible mute toggle.

## Phase 2: richer animation and realism (optional)
- Swap the model for a higher-fidelity avatar (MetaHuman or similar) if you move to Unreal/Unity.
- Add blendshape-driven facial animation tied to phonemes/visemes from your TTS provider.
- Use mocap clips for walking/gesturing; trigger them from app events (crawler running, export done, alert states).

## Integration steps for the current starter
- Add an `AvatarPanel` React component that mounts a Three.js canvas in the corner and exposes simple props: `state` (idle/listening/speaking/success/error) and `onMuteToggle`.
- Keep the component client-only (no server dependency) and ensure Electron packaging includes the model assets under `public/`.
- Wire speech synthesis to the same messages surfaced in the UI (crawler status, marketing drafts, consent reminders).
- Gate all voice/animation behind the existing command-only/approval posture: nothing plays until the user opts in.

## Assets and settings to decide
- **Look and attire**: face/profile reference, hairstyle, business outfit palette.
- **Voice**: accent/tone (e.g., warm Canadian English) and emotion range.
- **Color theme**: align avatar lighting and UI theme (background gradients, glassy panels, or neutral office tones).

## What remains to be coded
- Three.js scene setup and loading of the chosen GLB/VRM model.
- Event mapping from crawler/marketing actions to avatar states.
- TTS integration and optional STT for voice input.
- Packaging of assets in Electron (copy to `public/` and reference with relative paths).

Use this plan alongside `docs/efasa.md` to keep the embodied experience consistent with the command-only, consent-first contract.
