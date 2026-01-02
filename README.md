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

## Visual polish (current prototype)

Even with placeholder shapes/tiles, the prototype aims for “high mood” through rendering and VFX:

- **Pixel-perfect rendering**: `pixelArt: true`, `antialias: false`, and `roundPixels` to keep motion crisp.
- **Responsive scaling**: FIT + centered canvas so it displays cleanly across window sizes.
- **Dynamic lighting**: a screen-space darkness overlay with a soft player spotlight that reacts to **Time** (Day/Night/Curfew) and **Heat**.
- **Stealth feedback**: brief screen flash + small camera shake when patrol detection ticks up Heat.

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
Stage 1 is captured in `docs/stage-1-narrative-content.md`.
Reference text is in `docs/reference_story_en.md`.

### Stage 0 - Alignment (Complete)

- Deliverables: 1-page vision, target playtime, art style, scope cap, definition of done.
- Exit criteria: decisions locked for combat (none), core verbs, endings count.

### Stage 1 - Narrative + content design (Complete)

- Deliverables: chapter outline, scene list, NPC list, key choices and consequences, endings matrix.
- Output: dialogue/quests written in a structured schema (JSON/YAML) with flags/conditions/effects.

### Stage 2 - Technical foundation (Complete)

- Deliverables: Phaser skeleton, world state (flags + stats + time), save/load, Tiled map loading, trigger zones, dialogue UI.
- Exit criteria: a blank map is playable and all systems function end-to-end.

### Stage 3 - Vertical Slice (Complete)

- Deliverables: Playable MVP slice.
- Features Implemented:
    - **Dialogue System**: Loading external JSON, conditional choices, stat/flag effects.
    - **Map System**: Tiled JSON loading, collision, camera follow.
    - **Stealth**: Patrols with vision cones, Heat accumulation mechanics.
    - **Minigames**:
      - Forgery (drag-and-drop) affecting Heat
      - Records “proof” puzzle with timer + Heat pressure
      - Ritual timing minigame (SPACE-in-zone) affecting flags/stats
    - **Narrative (prototype arc)**:
      - Prologue → Chapter 1 (Fence + Forgery) → Chapter 2 (City Gate) → Chapter 3 (Inner City + Insider + Records) → Chapter 4 (Palace Perimeter + Ritual) → Final outcome screen
    - **Persistence**: Basic Save/Load.

### Stage 4 - Production (In Progress)

- Goal: expand the prototype into the full content outlined in `docs/stage-1-narrative-content.md`.
- Not done yet:
  - Additional locations (teahouse, back street, full records room, palace routes)
  - Quest system + route selection (`gate_route`)
  - Time/curfew affecting patrols/access in meaningful ways
  - 4-ending matrix with real branching content (not just a summary screen)
  - Stealth upgrades (suspicion meter, LOS vs walls, hiding/crowds, schedules)

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

---

## Current prototype content (at a glance)

- **Locations/maps**:
  - Village (`public/maps/village.json`)
  - City Gate (`public/maps/city_gate.json`)
  - Inner City (`public/maps/inner_city.json`)
  - Palace Perimeter (`public/maps/palace_perimeter.json`)
- **Content files**: `public/data/dialogue/` (`prologue.json`, `chapter1.json`, `chapter2.json`, `chapter3.json`, `chapter4.json`)
- **Minigames**:
  - `src/scenes/ForgeryScene.ts`
  - `src/scenes/RecordsScene.ts`
  - `src/scenes/RitualScene.ts`
  - Final outcome: `src/scenes/FinalScene.ts`

## Versioning

- The title screen displays the current version from `package.json`.
- When committing changes, bump patch version first:
  - `npm run bump:patch` (increments `0.1.x`)

## Progress log

- **v0.1.7**:
  - Add **Objective HUD** (top-center) and wire objectives through dialogue/minigames.
  - Make save/load **backwards-compatible** when new fields are added.

- **v0.1.8**:
  - Add a minimal **Quest System** (JSON-driven) and persist quest state in saves.
  - Drive the Objective HUD from the active quest step.

- **v0.1.9**:
  - Fix quest start so the Objective HUD updates reliably (boot flow and post-prologue).

- **v0.1.10**:
  - **Visual Polish**: Added pixel-perfect rendering, lighting overlays, and time-of-day/Heat atmosphere.
  - **Procedural Sprites**: Replaced placeholder circles with generated pixel-art characters (Player, Guard, NPCs).
  - **Feedback**: Added screen shake and flash on stealth detection.

- **v0.1.11**:
  - **Narrative Flavor**: Integrated original "Forging the Swords" text into Prologue and map descriptions.
  - **Area Descriptions**: Added a system to trigger atmospheric narrator text when entering new maps.
  - **UI**: Added dynamic dialogue box resizing to support longer narrative text.
  - **Documentation**: Added `docs/guide_narrative_adaptation.md` to guide future content updates.
  - **Redesign Plan**: Created `docs/narrative_scenes.md` to map the novel's scenes to game levels.
  - **Map Design**: Created `docs/map_design.md` detailing the 6 new maps and their quest logic.
  - **Asset Specs**: Created `docs/asset_design_spec.md` and detailed specs for characters, tilesets, audio, and cutscenes.
  - **Asset Placeholders**: Generated placeholder files and folder structure for all specified assets.
  - **Asset Pipeline**: Added `public/align_tool.html` and `public/test_sprite.html` to assist in generating and testing JSON atlases for sprite sheets.
  - **New Assets**: Added `char_black_man` sprite sheet and generated its JSON atlas using the alignment tool.
