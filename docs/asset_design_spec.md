# Asset Design Specification

This document details the visual and audio assets required to bring the *Forging the Swords* adaptation to life. It is derived from the following design documents:

*   **Narrative Scenes**: `docs/narrative_scenes.md` (Source of character descriptions and event details).
*   **Map Design**: `docs/map_design.md` (Source of environment and tileset requirements).

## 1. Sprite Sheets

### Characters
Define the visual style, dimensions, and animation states for characters.
*   **Format**: [e.g., Pixel Art, 32x32 or 48x48 grids]
*   **Standard Animations**: Idle (4 dir), Walk (4 dir).

| Character ID | Description | Key Features | Animations Needed |
| :--- | :--- | :--- | :--- |
| `char_mei_jian_chi` | The protagonist (16 years old). | "Coat of indeterminate color", "eyes like those of his father". | Idle, Walk, Startled |
| `char_mother` | Mei Jian Chi's mother. | Older, weary, holding the "old basket". | Idle, Walk, Sitting |
| `char_black_man` | The Assassin. | Black clothes, black beard, "eyes like cold stars". | Idle, Walk, Combat Stance |
| `char_king` | The King. | Royal robes, "golden yellow". | Idle, Laughing, Terrified |

### Tilesets
Define the environment tiles needed for map creation.
*   **Style**: [e.g., Ancient China, slightly dark/mythological tone]

| Tileset Name | Usage | Key Elements |
| :--- | :--- | :--- |
| `tiles_village_interior` | Mei Jian Chi's home. | Wooden floors, stove, straw mats, rat hole. |
| `tiles_city_exterior` | The Capital. | Stone walls, crowded streets, city gates, notice boards. |
| `tiles_palace` | The King's domain. | Polished floors, ornate pillars, golden cauldron. |
| `tiles_cedar_forest` | The Assassin's meeting place. | Tall cedar trees, pine needles, moonlit atmosphere. |

## 2. Cut Scenes
Visuals for key narrative moments that cannot be easily conveyed through standard gameplay.

| Scene ID | Trigger | Visual Description | Mood |
| :--- | :--- | :--- | :--- |
| `cut_prologue_rat` | Start of game. | Close up of a rat gnawing on a wooden vessel. | Tense, quiet, annoying. |
| `cut_sword_reveal` | Mother gives the sword. | The bundle is unwrapped, revealing the "invisible" blue sword. | Mystical, cold. |
| `cut_assassin_meet` | Meeting in the forest. | The Black Man steps out from behind a tree, eyes glowing. | Eerie, suspenseful. |
| `cut_cauldron_fight` | Climax. | The three heads dancing in the boiling water. | Chaos, bizarre, tragic. |

## 3. Background Music (BGM)
Music tracks to establish atmosphere for different locations and scenes.

| Track ID | Location/Scene | Mood | Instrumentation |
| :--- | :--- | :--- | :--- |
| `bgm_night_village` | Home/Village at night. | Quiet, solitary, slightly oppressive. | Solo flute, distant wind, minimal percussion. |
| `bgm_city_bustle` | The Capital streets. | Busy, noisy, tense underneath. | Drums, clatter, traditional strings (Guzheng). |
| `bgm_forest_encounter` | Cedar Forest. | Mysterious, dangerous. | Low strings, slow tempo, silence gaps. |
| `bgm_royal_court` | Palace. | Grand but menacing. | Brass (ancient horns), bells. |
| `bgm_climax_dance` | The Cauldron scene. | Frantic, rhythmic, bizarre. | Fast percussion, dissonant melody. |

## 4. Sound Effects (SFX)
One-shot sounds for interactions and environmental details.

### Environmental
*   `sfx_rat_gnaw`: Scritch-scratch sound of the rat.
*   `sfx_wind_forest`: Whistling wind through pine trees.
*   `sfx_boiling_water`: Bubbling sound for the cauldron.

### Interaction
*   `sfx_ui_select`: Menu selection.
*   `sfx_item_get`: Picking up an item (e.g., the sword).
*   `sfx_sword_swing`: Whoosh of the invisible sword.
*   `sfx_dialogue_advance`: Soft click for text scrolling.
