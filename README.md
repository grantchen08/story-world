# Story World: 2D Narrative RPG (No Combat) - Game Design

This repository is a design + prototype workspace for a **2D narrative RPG** inspired by Lu Xun's short story "Forging the Swords" (from *Old Tales Retold*).

The game is **story-first**: exploration, dialogue, stealth/evasion, and small set-piece puzzles replace traditional combat.

---

## Design goals

- **Faithful tone, playable structure**: preserve the story's tension (revenge vs mercy) while shaping it into interactive chapters.
- **No grinding, no combat loop**: progression comes from choices, information, relationships, and access - not fighting.
- **Readable stealth, low frustration**: failures should be recoverable (time/Heat cost, reroute) rather than "game over".
- **Data-driven narrative**: dialogue/quests in external data so content iteration is fast.

---

## Player fantasy

- Move through a grounded world under pressure.
- Learn the truth by speaking to people, reading clues, and observing.
- Decide **how far to go**, and pay narrative consequences for it.

---

## Core gameplay loop (no battle)

1. **Explore** small 2D areas (village -> roads -> city -> palace zone)
2. **Talk** to NPCs to unlock knowledge, routes, favors, and tools
3. **Solve** light puzzles / "ritual" set-pieces (forging, forgery, access)
4. **Evade** patrols/checkpoints (stealth + social engineering)
5. **Commit** to choices that shift future options and endings

---

## Key systems (replacing combat)

### Stats (story-facing, not "power")

- **Resolve**: ability to commit to dangerous or irreversible choices; affects "hold your nerve" moments.
- **Compassion**: unlocks alternative non-violent solutions and NPC support; shapes endings.
- **Heat**: how much attention you attract; increases patrol density, ID checks, locked routes.

### Time (day/night)

- Locations/NPCs/paths change by time.
- Curfew makes movement meaningful and reinforces pressure without combat.

### Inventory as "social tools"

Items are mostly **keys** and **proof**:

- pass token, letter/seal, disguise pieces, bribe item, locksmith kit, map notes, ritual materials

---

## Moment-to-moment mechanics

### Dialogue + checks

- Branching options gated by:
  - stats (Resolve/Compassion thresholds)
  - items (proof/letter/disguise)
  - world state (Heat level, time of day, prior choices)

### Stealth / evasion (minimalist)

- Patrol vision cones + simple sound radius
- Hiding spots (crowds, corners, doorways, shadows)
- Failure costs: **Heat↑**, **time passes**, **route closes** (rarely hard fail)

### Puzzles / set-pieces

- **Forging ritual**: timing + resource decisions (risk vs safe) with strong audiovisual feedback
- **Forgery / paperwork**: assemble correct seal/phrase from clues to pass checkpoints
- **Route puzzles**: find alternate entrances, manipulate schedule, distract patrols non-violently

---

## Narrative structure (chapter outline)

This is a suggested "small but complete" arc:

- **Prologue**: village night; establish tone; choices set initial stats
- **Chapter 1 (Preparation)**: gather clues/tools; meet key NPCs; choose approach (stealth-heavy vs social-heavy)
- **Chapter 2 (Enter the city)**: Heat + time systems activate; multiple entry routes
- **Chapter 3 (Access)**: palace perimeter via stealth + social engineering; fewer but sharper choices
- **Final (Confrontation)**: interactive dialogue + staged sequence (no boss fight); endings depend on stats + key decisions

---

## Art & audio direction (low-cost, high mood)

- **Pixel / silhouette ink style**: limited palettes; animated firelight, smoke, moon shadow.
- **UI**: dialogue box with optional **notes/codex** (footnote-like) for terms and context.
- **Audio**: ambient layers (night, forge, market); sparse percussion for tension; silence used intentionally.

---

## Technical approach (HTML/JS)

### Engine

- **Phaser 3** for rendering, input, camera, collisions, audio.

### Level editing

- **Tiled** for maps and triggers (NPC positions, dialogue zones, stealth volumes).

### Data-driven content

Keep narrative content in external files:

- **Dialogue**: nodes, lines, options, conditions, effects
- **Quests**: objectives, gating conditions, rewards (items/state changes)
- **World state**: flags, Heat thresholds, time-of-day schedule tables

---

## MVP (vertical slice)

Build a playable 10-15 minute slice before expanding:

- 1 village map + 1 short road map + 1 city gate micro-map
- 3-5 NPCs with branching dialogue and at least 1 stat-gated option
- Heat + time-of-day (simple: day/night) affecting patrols/checkpoint behavior
- 1 stealth route (patrol cones + hiding)
- 1 set-piece minigame (forging or forgery)
- 2 endings (commit vs withdraw) to prove reactivity

---

## Development plan (staged)

Stage 0 is captured in `docs/stage-0-alignment.md`.

### Stage 0 - Alignment

- Deliverables: 1-page vision, target playtime, art style, scope cap, definition of done.
- Exit criteria: decisions locked for combat (none), core verbs, endings count.

### Stage 1 - Narrative + content design

- Deliverables: chapter outline, scene list, NPC list, key choices and consequences, endings matrix.
- Output: dialogue/quests written in a structured schema (JSON/YAML) with flags/conditions/effects.

### Stage 2 - Technical foundation

- Deliverables: Phaser skeleton, world state (flags + stats + time), save/load, Tiled map loading, trigger zones, dialogue UI.
- Exit criteria: a blank map is playable and all systems function end-to-end.

### Stage 3 - Vertical slice

- Deliverables: the MVP slice above, polished enough for playtests.
- Exit criteria: players can finish without guidance; content can be iterated without code changes.

### Stage 4 - Production (full game content)

- Deliverables: all chapters implemented (maps, NPCs, quests), all set-pieces, patrol schedules, codex/notes.
- Exit criteria: full game playable start-to-finish (placeholder art/audio acceptable).

### Stage 5 - Alpha

- Deliverables: feature complete, all endings wired, balancing pass (Heat/time), performance pass.
- Exit criteria: only bugfix and polish remain.

### Stage 6 - Beta

- Deliverables: final art/audio integration, UX polish, accessibility pass, browser/device testing, bug triage.
- Exit criteria: release candidate builds are stable on target browsers.

### Stage 7 - Release + post-launch

- Deliverables: release build, deployment (GitHub Pages/itch.io), patch workflow, optional content updates.

---

## Success criteria

- Player understands stakes without exposition dumps.
- Choices change *routes/options* (not just text).
- Failure feels like narrative pressure, not punishment.

---

## Future extensions (optional)

- More chapters/locations; additional endings
- "Codex" that unlocks via exploration and influences dialogue checks
- Accessibility: speed controls, font scaling, colorblind-safe palettes
