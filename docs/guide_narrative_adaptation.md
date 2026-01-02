# Guide: Converting Original Story to Narrative Blueprint

This guide documents the workflow for adapting linear fiction (specifically Lu Xun's *Forging the Swords*) into interactive game content. The goal is to preserve the "powerful language" of the source material while making it functional for a 2D RPG.

## 1. The Goal
We want the player to *feel* the atmosphere of the novel.
*   **Original Novel**: Passive reading; rich descriptions; internal monologue.
*   **Game**: Active exploration; visual constraints; external interaction.

**The Blueprint** bridges this gap. It maps *text segments* from the book to *systems* in the game.

## 2. Selection Strategy
Not all text fits a game. When scanning the source text, look for three specific categories:

### A. Sensory Details (Atmosphere)
Look for descriptions of light, sound, smell, and texture. These replace generic "You see a forest" text.
*   *Keywords to hunt*: "Flash", "Glow", "Silence", "Smell", "Cold", "Tremble".
*   *Example*: "The pine torch burnt out" is better than "It was dark."

### B. Tangible Objects (Items/Interactables)
Look for physical descriptions of things the character touches or uses.
*   *Keywords to hunt*: nouns (Sword, Cauldron, Rat, Coat), colors, materials.
*   *Example*: "A blade rounded like a leek leaf" is a specific visual that defines the item.

### C. "Power Lines" (Dialogue/Monologue)
Look for philosophical statements, sudden outbursts, or strange phrasings.
*   *Keywords to hunt*: quotes, exclamation marks, internal questions.
*   *Example*: "Tears can never wash away fate."

## 3. The Categorization Process
Once you have extracted the text, sort it into the Blueprint format (see `docs/narrative_flavor.md`).

| Category | Game System Target | Purpose |
| :--- | :--- | :--- |
| **Atmosphere** | `src/systems/FlavorText.ts` | Triggers when entering a Map or Zone. Sets the mood. |
| **Object** | `Item Description` (UI) | Shown when inspecting an item in inventory or on the map. |
| **Dialogue** | `public/data/dialogue/*.json` | Spoken by NPCs or the Narrator during conversation trees. |

## 4. Adaptation Rules
You rarely copy/paste 1:1. You must adapt for the medium.

### Rule 1: Shift Perspective (He -> You)
The novel is 3rd person ("Mei Jian Chi felt..."). The game is 2nd person ("You feel...").
*   *Source*: "Mei Jian Chi shuddered all over as if possessed."
*   *Blueprint*: "You shudder all over as if possessed."

### Rule 2: Compress for UI
Game text boxes are small. Long paragraphs must be broken up or trimmed.
*   *Source*: "It was just scratching along the inner wall of the jar, going round and round. Only its scratching was less vigorous than before..."
*   *Blueprint*: "It scratches along the inner wall—round and round—though less vigorously than before."

### Rule 3: Active Verbs
Change passive descriptions into active observations.
*   *Source*: "There was a sound of women crying."
*   *Blueprint*: "From the crowd comes the sound of women crying."

## 5. Implementation Workflow

1.  **Read**: Scan the relevant chapter in the source text.
2.  **Draft**: Create an entry in `docs/narrative_flavor.md`.
    ```markdown
    ### [Location Name]
    **Context**: Entering the map.
    **Source**: "[Quote from book]"
    **Implementation**: "You see [Quote adapted for game]."
    ```
3.  **Code**:
    *   **Maps**: Update `AreaDescriptions` in `FlavorText.ts`.
    *   **Dialogue**: Update `public/data/dialogue/[chapter].json`.
    *   **Items**: Update item definitions (if applicable).

## Example: The "Rat" Scene

**Step 1: Source**
> "Mei Jian Chi... heard a scratching sound—claws against earthenware."

**Step 2: Adaptation**
*   *Context*: The player interacts with the pot in the prologue.
*   *Draft*: "You hear a scratching sound—claws against earthenware."

**Step 3: Implementation**
In `prologue.json`:
```json
{
  "speaker": "Narrator",
  "text": "You hear a scratching sound—claws against earthenware."
}
```
