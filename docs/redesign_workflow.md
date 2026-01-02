# Game Redesign Workflow: "Forging the Swords" Adaptation

This document outlines the workflow used to redesign "Story World" into a faithful interactive adaptation of Lu Xun's *Forging the Swords*. The goal is to restore the power and impact of the original story by making the main quest follow the novel's exact plot, supported by puzzles and exploration derived directly from the text.

## Source Material
*   **Original Novel Text**: `docs/reference_story_en.md` (Full English translation).
*   **Scene Breakdown**: `docs/narrative_scenes.md` (Deconstruction of the novel into playable scenes with direct quotes).
*   **Design Blueprint**: `docs/map_design.md` (Translation of scenes into technical map and quest requirements).

## Phase 1: Narrative Deconstruction
**Goal**: Break down the original novel into discrete, playable scenes.

**Output**: `docs/narrative_scenes.md`

**Process**:
For each distinct scene in the novel:
1.  **Identify the Scene**: Give it a clear name (e.g., "The Rat and the Vat", "The City Gate Crowd").
2.  **Extract Details**:
    *   **Location**: Where is this? (e.g., Bedroom, Cedar Forest).
    *   **Environment**: Use original text to describe lighting, sound, atmosphere.
    *   **Characters**: Who is present? What do they look like? (Original descriptions).
    *   **Objects**: What physical items are mentioned? (e.g., The Rat, The Pine Torch, The Blue Sword).
    *   **Events**: What happens? What is said?

## Phase 2: Map & Quest Design
**Goal**: Translate narrative scenes into game maps, puzzles, and progression logic.

**Output**: `docs/map_design.md`

**Process**:
For each required map:
1.  **Map Definition**:
    *   Name/ID (e.g., `map_bedroom`).
    *   Visual Style: Colors, lighting, and assets based on Phase 1 descriptions.
2.  **Entity Placement**:
    *   **NPCs**: Where do they stand?
    *   **Objects**: Where are they located? (e.g., "The water jar is in the corner").
3.  **Main Quest Design (The Original Path)**:
    *   **Objective**: What must the player do to advance?
    *   **Puzzles/Conditions**:
        *   *Information Gates*: Answering questions based on previous dialogue (e.g., "What color was the vapor?").
        *   *Item Gates*: Obtaining specific objects mentioned in the text (e.g., "Find the fire drill").
        *   *Logic Gates*: Performing actions in order (e.g., "Wait for the cock to crow").
4.  **Alternative Paths (Optional)**:
    *   If the player diverges from the novel, what happens? (Secondary priority).

## Phase 3: Asset Design & Generation
**Goal**: Create specific visual and audio requirements based on the narrative and map designs.

**Output**: `docs/asset_design_spec.md` (High-level list), `docs/specs/assets/...` (Detailed artist specs).

**Process**:
1.  **Sprite Sheets**: Define character appearances, animations, and tileset needs.
2.  **Cut Scenes**: Outline visual storytelling requirements for key narrative moments.
3.  **Audio**:
    *   **BGM**: Define mood, tempo, and instrumentation for each area.
    *   **SFX**: List required sound effects for interactions and environment.
4.  **Artist Spec Generation**:
    *   For each asset identified in `asset_design_spec.md`:
        1.  Create a detailed markdown spec in `docs/specs/assets/[type]/[asset_id].md`.
        2.  Derive details directly from `docs/reference_story_en.md`.
        3.  Ensure consistency with the "Ancient China / Mythological" aesthetic.
        4.  Create a placeholder file in `public/assets/[type]/[asset_id].[ext]` for immediate development use.

## Phase 4: Implementation Strategy
**Goal**: Build the redesigned game in iterative stages.

**Execution Order**:
1.  **Map Building**: Create Tiled maps (`.json`) for each location identified in Phase 2 using assets from Phase 3.
2.  **Data Entry**: Write the new `dialogue.json` and `quests.json` files using the extracted text.
3.  **Logic Coding**:
    *   Implement specific puzzle mechanics (e.g., a "Waiting" mechanic, a "Digging" minigame).
    *   Wire up map transitions based on the designed conditions.

---

## Next Steps
1.  **Execute Phase 1**: Create `docs/narrative_scenes.md` by analyzing the novel text.
2.  **Execute Phase 2**: Create `docs/map_design.md` based on the scenes.
3.  **Execute Phase 3**: Create `docs/asset_design_spec.md` defining all required assets.
4.  **Execute Phase 4**: Begin implementation of the first chapter (The Village/Bedroom).
