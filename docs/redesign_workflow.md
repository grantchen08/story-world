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
**Goal**: Translate narrative scenes into detailed technical map specifications and progression logic.

**Output**: `docs/map_design.md`

**Process**:
For each required map:
1.  **Map Specification**:
    *   **Dimensions**: Exact width and height (e.g., 40x30 tiles).
    *   **Composition**: Major zones and their layout (e.g., "North: Sleeping area, South: Exit to courtyard").
    *   **Visual Style**: Colors, lighting, and assets based on Phase 1 descriptions.
2.  **Entity Kinetics**:
    *   **NPCs**: Initial locations (coordinates), patrol ranges, and movement trajectories.
    *   **Objects/Props**: Exact grid locations for all interactive and decorative items.
3.  **Main Quest Design (The Original Path)**:
    *   **Objective**: What must the player do to advance?
    *   **Puzzles/Conditions**:
        *   *Information Gates*: Answering questions based on previous dialogue.
        *   *Item Gates*: Obtaining specific objects.
        *   *Logic Gates*: Performing actions in order.
4.  **Alternative Paths (Optional)**:
    *   Divergent interactions and their consequences.

## Phase 3: Data-Driven Spec Generation (AI/Automation)
**Goal**: Convert designs into machine-readable JSON specifications to enable AI-driven asset generation and map construction. Maps will be generated programmatically, not manually drawn.

**Output**:
*   `docs/data/assets.json` (Master registry of all assets)
*   `public/assets/**/*.json` (Individual AI generation specs co-located with intended asset files)
*   `docs/data/maps/map_*.json` (Map definitions)
*   `docs/data/dialogue.json`
*   `docs/data/quests.json`

**Process**:
1.  **Asset Specifications**:
    *   **Master Registry (`docs/data/assets.json`)**: Create a top-level file listing every asset to be used in the game.
        *   Fields: `id` (meaningful name), `path` (relative path to file), `type` (sprite, audio, etc.), `brief_description`.
    *   **Individual Asset Specs**: For *each* asset listed in the registry, create a corresponding JSON file at the *same location* as the intended asset (e.g., if asset is `img/hero.png`, spec is `img/hero.json`).
        *   Content: A detailed description specifically designed as a prompt for AI generation of that single asset.
2.  **Map Definitions**:
    *   Generate a structured JSON for each map (e.g., `docs/data/maps/map_village.json`).
    *   Content:
        *   `tileset`: References to IDs from `assets.json`.
        *   `layout`: Algorithmic rules or data for tile placement (AI-generated).
        *   `entities`: Arrays of NPCs and Objects with coordinates derived from Phase 2.
        *   `audio`: References to audio asset IDs.
        *   `properties`: Lighting, weather, and other metadata.
3.  **Narrative Data**:
    *   Structure all dialogues and quest steps into `dialogue.json` and `quests.json`.

## Phase 4: Asset Generation
**Goal**: Create actual visual and audio assets based strictly on the Phase 3 JSON specifications.

**Output**: `public/assets/...`

**Process**:
1.  **Execution**: Use the `assets.json` specs to generate:
    *   Character Sprite Sheets (Idle, Walk, Interact).
    *   Tilesets (Walls, floors, decorations).
    *   Audio files (BGM, SFX).
2.  **Validation**: Ensure generated assets match the dimensions and styles defined in the JSONs.

## Phase 5: Programmatic Implementation
**Goal**: Build the game by parsing the data generated in Phase 3.

**Execution Order**:
1.  **Map Generation**: Write scripts to read `maps/*.json` and dynamically generate the game world (tiles, collision, entities) programmatically.
2.  **System Integration**:
    *   Load `dialogue.json` and `quests.json` into the engine.
    *   Implement special logic mechanics (minigames, custom events) described in Phase 2.

---

## Next Steps
1.  **Execute Phase 1**: Create `docs/narrative_scenes.md`.
2.  **Execute Phase 2**: Create `docs/map_design.md` with detailed metrics and kinetics.
3.  **Execute Phase 3**: Generate JSON specifications for assets, maps, and text.
4.  **Execute Phase 4**: Generate assets based on JSONs.
5.  **Execute Phase 5**: Program the game to read the JSONs and render the world.
