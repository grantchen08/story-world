# Stage 1 - Narrative + Content Design

This document defines the full narrative structure and content scope in a way that can be implemented with a data-driven dialogue/quest system.

Assumptions (locked in Stage 0):
- No combat; pressure comes from Heat/time, stealth, social checks, and set-piece puzzles.
- Target playtime: 45-60 minutes per run.
- Endings: 4 (2 major + 2 variants).

---

## Story frame (adaptation notes)

The game is inspired by Lu Xun's "Forging the Swords" (*Old Tales Retold*). We aim for thematic fidelity rather than a line-by-line retelling. Iconic moments should appear as playable beats, while long passages are transformed into exploration, dialogue, stealth, and set-piece puzzles.

---

## Narrative pillars (what every chapter should deliver)

- **Pressure**: the world pushes back (Heat rises, curfew tightens, access narrows).
- **Choice with consequence**: choices change routes, allies, and endings (not just dialogue flavor).
- **Human cost**: NPCs are not loot sources; asking for help creates obligation and risk.
- **Ambiguity**: avoid clean heroism; endings reflect tradeoffs (revenge, mercy, survival, meaning).

---

## Fun Boosters (Mechanics for Engagement)

To ensure "no combat" doesn't mean "boring reading," we use:

### 1. Active Inquiry (Keywords)
- Players learn **keywords** (e.g., "Blacksmith", "Rebellion") and choose what to ask about.
- Asking the wrong person dangerous keywords raises **Heat**.

### 2. Social Stealth (Blending In)
- **Suspicion Meter**: Guards don't attack instantly. They get suspicious (`?` icon fills).
- **Blending**: Walk slowly (hold shift) or stand near crowds/stalls to reduce suspicion.
- It's about managing risk in plain sight, not just hiding in shadows.

### 3. Tactile Minigames
- **Forgery**: Drag-and-drop stamps onto a pass. Imperfect alignment = higher starting Heat at the gate.
- **Ritual Casting**: Timing-based (rhythm) interaction. "Too hot" or "too cool" changes the sword's properties/ending.

### 4. Reactive World
- **Heat Effects**: High Heat doubles shop prices, makes NPCs refuse to talk, and spawns extra guards.
- **Compassion Effects**: High Compassion makes beggars/children distract guards for you automatically.

---

## World state model (design-level)

### Stats

- **Resolve** (0-100): commitment under fear; gates irreversible choices.
- **Compassion** (0-100): willingness to spare/help; unlocks non-violent alternatives and support.
- **Heat** (0-100): attention and crackdown; affects patrols/checkpoints and what routes remain viable.

### Time

Minimum implementation: **Day / Night** plus **Curfew** as a rule that changes patrol behavior and access.

### Flags

Boolean or small enums for plot state, e.g.:
- `has_pass_token`
- `has_seal_imprint`
- `gate_route` = `market` | `alley` | `official`
- `forgery_success`
- `identity_disguise` = `none` | `merchant` | `runner`
- `major_choice_mercy` (did you spare someone at key moment)

---

## Chapter outline (full game)

### Prologue - The night in the village

**Goal**: establish tone and the player's baseline values.

- Scene P1: home interior at night; small interaction choices set initial Resolve/Compassion.
- Scene P2: the vow (or refusal to vow); unlocks the main quest.

Key choice:
- **P2 Choice**: commit now vs delay/seek certainty
  - Commit: Resolve +, Heat baseline +
  - Delay: Compassion +, later access requires proof

### Chapter 1 - Preparation (people, proof, plan)

**Goal**: gather information and tools; pick an approach route.

Locations:
- Village square
- Workshop/shrine interior
- Road fork (exit)

Major beats:
- C1-S1: meet the Mentor (gives background, warns about cost).
- C1-S2: meet the Fence/Trader (offers access tools for a price).
- C1-S3: optional mercy beat (help a vulnerable NPC) that pays off later.

Key choice:
- **Route selection** (sets `gate_route`): market, alley, or official.

Set-piece (light puzzle):
- **Seal/letter preparation**: obtain a seal imprint or letter fragment via conversation + observation.

### Chapter 2 - Enter the city (Heat becomes real)

**Goal**: pass the city boundary without fighting; introduce patrol logic.

Locations:
- City gate exterior
- Checkpoint lane(s)
- Market edge / alley mouth

Major beats:
- C2-S1: checkpoint conversation (stat + item gated).
- C2-S2: stealth bypass option (patrol cones; hiding spots).
- C2-S3: consequence scene: if failed, Heat spikes and a route closes, but the game continues.

Set-piece (primary puzzle #1):
- **Forgery at the gate**: assemble correct phrasing/seal from clues (success reduces Heat; failure raises it).

### Chapter 3 - Inner city (network of favors)

**Goal**: build leverage; decide who you trust.

Locations:
- Teahouse (information hub)
- Back street (stealth route)
- Archive/records room (interior)

Major beats:
- C3-S1: meet the Insider (can open palace access but demands proof).
- C3-S2: obtain the missing proof piece (records puzzle).
- C3-S3: betrayal risk: share your intent or conceal it.

Key choice:
- **Trust vs conceal** (sets `trusted_insider` and shifts endings availability).

Set-piece (primary puzzle #2):
- **Records puzzle**: locate a specific record using partial hints; time pressure at Night.

### Chapter 4 - Palace perimeter (final approach)

**Goal**: execute the plan under maximum pressure.

Locations:
- Palace wall exterior
- Service corridor / garden edge (route-dependent)

Major beats:
- C4-S1: curfew patrol density changes based on Heat.
- C4-S2: last chance mercy beat: spare a guard/runner via non-violent action.
- C4-S3: reach the confrontation trigger.

Set-piece (primary puzzle #3):
- **Ritual/forging moment** (timing + risk decisions): determines stability of the final sequence.

### Final - Confrontation (interactive dialogue + staged sequence)

**Goal**: resolve themes; deliver endings based on choices and state.

Structure:
- F1: dialogue choices with escalating constraint (options disappear under low Resolve or high Heat).
- F2: a short staged sequence driven by earlier success/failure (forgery, trust, mercy).
- F3: ending selection.

---

## Key NPC list (design roles)

Use strong roles first; names can be finalized later.

- **Protagonist**: player character (youth with a burdened mission).
- **Mother**: moral and emotional anchor; sets stakes and tone.
- **Mentor**: reveals history; warns against simple revenge narratives.
- **Fence/Trader**: sells access tools; introduces compromise and consequence.
- **Vulnerable NPC**: optional mercy beat; later provides a safehouse or key hint.
- **Gate Clerk**: checkpoint face; reacts to Heat and paperwork.
- **Insider**: can open a palace route; trust is a major branching lever.
- **Patrol Captain**: embodies systemic pressure; increases patrol intensity when Heat rises.

---

## Endings (4) - matrix

We target two major endings, each with a variant based on mercy/trust.

### E1: Revenge completed (major)

Conditions (typical):
- Resolve >= threshold
- `forgery_success` OR successful stealth route

Variants:
- **E1a (cold)**: high Heat, low Compassion; success but heavy collateral/alienation.
- **E1b (cost-aware)**: mercy beat completed; success with a different emotional resolution.

### E2: Revenge refused or redirected (major)

Conditions (typical):
- Compassion >= threshold, or key mercy choice + low Resolve at the final step

Variants:
- **E2a (survival)**: you walk away; Heat drops; relationships preserved but mission unresolved.
- **E2b (meaning)**: you redirect the act into exposure/helping others; you lose access but gain a different closure.

---

## Content implementation format (for Stage 2)

We will implement narrative using data files so iteration is content-only.

### Dialogue node model (proposed)

Fields:
- `id`: unique string
- `speaker`: string
- `text`: string
- `choices`: array of choices
- `effects`: list of state changes (optional)
- `conditions`: list of checks that gate the node (optional)

Choice fields:
- `text`
- `to` (next node id)
- `conditions` (optional)
- `effects` (optional)

Effects examples:
- set flag: `{ "set": ["has_pass_token", true] }`
- add stat: `{ "add": ["Heat", 10] }`
- set enum: `{ "set": ["gate_route", "market"] }`

Conditions examples:
- stat threshold: `{ "gte": ["Compassion", 50] }`
- flag: `{ "eq": ["forgery_success", true] }`

### Quest model (proposed)

- `id`, `title`, `description`
- `objectives`: ordered steps with conditions
- `rewards`: items/flags/stats

---

## Stage 1 exit checklist

- Chapter outline locked with locations and set-pieces.
- NPC roles locked and mapped to chapters.
- Key choices identified with explicit state changes.
- Ending matrix defined (4 endings) with gating conditions.
- Proposed data schema is documented for Stage 2 implementation.
