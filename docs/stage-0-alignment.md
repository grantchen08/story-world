# Stage 0 - Alignment (Complete)

This document locks the high-level product decisions so implementation can proceed without scope drift.

---

## One-page vision

**Working title**: Story World  
**Genre**: 2D narrative RPG (no combat)  
**Platform**: Web (HTML/JS)  
**Core promise**: A tense, choice-driven journey where exploration, conversation, stealth/evasion, and set-piece puzzles deliver the emotional pressure of revenge vs mercy.

### Player experience (what it feels like)

- You move through small, readable spaces under increasing scrutiny.
- You discover truth and leverage through people, notes, and observation.
- You make hard choices that change access, relationships, and endings.

### Target playtime

- **First release target**: **45-60 minutes** for a single playthrough.
- **Replay value**: 2-3 replays to see alternative routes/endings.

---

## Locked constraints

- **No combat**: no HP bars, no damage numbers, no enemy-kill progression.
- **No grinding**: no random encounters, no farming, no “level up by repetition”.
- **Core verbs**:
  - Explore
  - Talk (choices + checks)
  - Sneak / evade (readable stealth)
  - Solve (small puzzles / ritual set-pieces)
- **Failure philosophy**: failure increases pressure (Heat/time) and reroutes the player; it is not a harsh game-over loop.

---

## Art direction (locked)

- **Style**: pixel art with a restrained palette; silhouette/ink-inspired lighting.
- **Animation priorities**: firelight, smoke, moon shadows, crowd motion (small loops).
- **UI**: clean dialogue box; optional codex/notes panel.

---

## Audio direction (locked)

- Ambient-first: night/forge/market layers.
- Sparse music cues: tension spikes and chapter transitions.
- Silence is a tool (especially before major choices).

---

## Systems scope (locked)

### Story-facing stats

- **Resolve**: gates irreversible or high-risk choices.
- **Compassion**: unlocks non-violent alternatives and NPC support.
- **Heat**: drives patrol density, checkpoint strictness, and route availability.

### Time

- Minimum: day/night (or “safe hours” vs “curfew”).
- Time changes patrol behavior and NPC availability.

### Inventory

Primarily “access tools” rather than weapons: tokens, letters/seals, disguise parts, notes, ritual materials.

---

## Content scope (first release)

- **Maps**: 5-8 small maps (village, road, market alley, city gate, inner city, palace perimeter, 1-2 interiors).
- **NPCs**: 10-18 total, with 5-8 “major” NPCs that can branch outcomes.
- **Set-piece puzzles**: 2-3 total (e.g., forgery/checkpoint, route timing, ritual/forging).
- **Endings**: **4** endings (2 major, 2 variants) based on key choices and stat thresholds.

---

## Definition of done (release criteria)

Stage 0 is complete when the following are written and agreed by the repo:

- This alignment doc exists and reflects current intent.
- The game can be described in 2-3 sentences without contradictions.
- “No combat” is enforced at the design level (no hidden combat fallback).

The game is “ready for release” later when:

- Full story playable start-to-finish, with all endings reachable.
- Save/load works and does not corrupt state.
- Stealth is readable (clear telegraphing; low frustration).
- Performance acceptable on target browsers (Chrome/Firefox).
- Basic accessibility: rebindable keys (or at least configurable), text speed control, volume controls, readable fonts.

