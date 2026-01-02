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

## Phase 3: Implementation Strategy
**Goal**: Build the redesigned game in iterative stages.

**Execution Order**:
1.  **Asset Generation**: Create/update tilesets and sprites to match the new visual descriptions.
2.  **Map Building**: Create Tiled maps (`.json`) for each location identified in Phase 2.
3.  **Data Entry**: Write the new `dialogue.json` and `quests.json` files using the extracted text.
4.  **Logic Coding**:
    *   Implement specific puzzle mechanics (e.g., a "Waiting" mechanic, a "Digging" minigame).
    *   Wire up map transitions based on the designed conditions.

---

## Next Steps
1.  **Execute Phase 1**: Create `docs/narrative_scenes.md` by analyzing the novel text.
2.  **Execute Phase 2**: Create `docs/map_design.md` based on the scenes.
3.  **Execute Phase 3**: Begin implementation of the first chapter (The Village/Bedroom).
