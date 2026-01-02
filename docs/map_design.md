# Map & Quest Design (Phase 2)

This document translates the narrative scenes into actionable game maps, objects, and quest logic.

## Global Systems
*   **Time System**: Tracks `Night` (Bedroom) -> `Dawn` (Forest) -> `Day` (City) -> `Dusk` (South Gate). Visual overlays must match.
*   **Inventory**: Needs to support story items: `Pine Torch`, `Reed`, `Blue Sword`, `Steamed Buns`, `Hoe`.
*   **Character Switch**: The game must support switching the controlled character from **Mei Jian Chi** to **The Dark Man** in the final act.

---

## Map 01: The Bedroom (`map_village_bedroom`)
**Scene**: The Rat and the Vat
**Visuals**: Small interior. Mud walls. Mud bed.
**Lighting**: Starts pitch black (100% darkness overlay).
**Music**: Silence + intermittent "Crunch, Crunch" sfx.

### Entities & Objects
| ID | Type | Interaction / Condition |
| :--- | :--- | :--- |
| `obj_pot_lid` | Prop | Emits "Crunch" sound. |
| `obj_fire_drill` | Interact | Adds `item_torch_lit` to inventory. Removes Darkness. |
| `obj_vat` | Interact | Requires `Light`. Triggers "Rat" dialogue/puzzle. |
| `obj_wall` | Interact | Gather `item_reed` (required to fish out rat). |
| `npc_mother` | NPC | Sleeping initially. Wakes after Rat sequence. |
| `obj_bed_floor` | Interact | Dig spot. Requires `item_hoe`. |

### Main Quest Logic
1.  **Objective**: "Investigate the noise."
    *   Player is blind. Must find `obj_fire_drill` by touch (collision box highlights).
2.  **Objective**: "Deal with the Rat."
    *   Inspect `obj_vat`. Rat is trapped.
    *   Get `item_reed` from wall.
    *   Use `item_reed` on `obj_vat`.
    *   *Choice*: Kill it or Save it? (Narrative flavor: Mei Jian Chi does both, establishing indecision).
3.  **Objective**: "Listen to Mother."
    *   Mother wakes. Dialogue triggers (Lore dump).
    *   Receive `item_hoe`.
4.  **Objective**: "Forge the Will."
    *   Use `item_hoe` on `obj_bed_floor`.
    *   Get `item_blue_sword`.
    *   Get `item_blue_coat`.

---

## Map 02: Cedar Forest (`map_forest_path`)
**Scene**: The Cedar Forest
**Visuals**: Linear path. Trees foreground/background.
**Lighting**: Gradient transition. Starts dark, ends with "colors of dawn".

### Entities
| ID | Type | Interaction |
| :--- | :--- | :--- |
| `zone_dewdrops` | Trigger | Displays narrative text about dewdrops hiding night air. |
| `zone_city_view` | Trigger | Camera pans to reveal distant City Walls. |

### Main Quest Logic
1.  **Objective**: "Travel to the City."
    *   Simple traversal.
    *   *Hidden Check*: If player turns back, Mother's voice: "Do not worry about me."

---

## Map 03: City North (`map_city_north`)
**Scene**: The City Gate & Crowd
**Visuals**: Bustling. High density of NPCs. Dust particles.
**Lighting**: Bright, harsh day.

### Entities
| ID | Type | Interaction |
| :--- | :--- | :--- |
| `npc_crowd_wall` | Obstacle | A literal wall of colliders. "Packed tightly." |
| `npc_bully` | NPC | The Wizened-faced youth. |
| `npc_dark_man` | NPC | Spawns after Bully event. |
| `zone_procession` | Trigger | Triggers cutscene: King passes. |

### Main Quest Logic
1.  **Objective**: "Assassinate the King."
    *   Player tries to move North through `npc_crowd_wall`.
    *   *Physics Puzzle*: The crowd pushes back. Player cannot pass.
2.  **Event**: "The Opportunity Lost."
    *   King's procession passes (Visuals only).
    *   Player trips (scripted movement lock).
3.  **Event**: "The Humiliation."
    *   `npc_bully` grabs player. Dialogue sequence.
    *   *Choice*: Apologize / Argue. (Result is same: helpless).
4.  **Event**: "The Rescue."
    *   `npc_dark_man` intervenes.
    *   Bully flees. Crowd disperses slightly.
    *   Player gains control.

---

## Map 04: South Gate (`map_city_south`)
**Scene**: The Mulberry Tree
**Visuals**: Sparse. A large Mulberry tree.
**Lighting**: Dusk (Orange -> Blue -> Dark).

### Entities
| ID | Type | Interaction |
| :--- | :--- | :--- |
| `obj_tree` | Prop | Sit spot. |
| `npc_dark_man` | NPC | Appears when darkness falls. Phosphorescent eyes. |

### Main Quest Logic
1.  **Objective**: "Wait for the King."
    *   Player must wait. Eat `item_steamed_buns` to pass time?
    *   Screen fades to Dark.
2.  **Event**: "The Revelation."
    *   Dark Man appears. Dialogue: "The King returned by East Gate."
    *   Hope is lost.
3.  **The Great Choice**:
    *   Dark Man asks for Head and Sword.
    *   **Option A (Canon)**: "Grant his wish."
        *   Player Character dies.
        *   **Control Switch**: Player now controls **The Dark Man**.
        *   Inventory update: `item_head_bundle`, `item_blue_sword`.
    *   **Option B (Divergent)**: "Refuse."
        *   Leads to "Survival" ending (Game Over for this specific story arc, but valid ending).

---

## Map 05: The Royal Court (`map_palace_hall`)
**Scene**: The Royal Court
**Visuals**: Gold everywhere. Steam/Smoke.
**Lighting**: Firelight (Red/Black).

### Entities
| ID | Type | Interaction |
| :--- | :--- | :--- |
| `obj_cauldron` | Prop | Animated boiling water. |
| `npc_king` | NPC | Stands on Golden Steps. |
| `obj_head_meijianchi`| Prop | Spawns in cauldron during trick. |

### Main Quest Logic
1.  **Objective**: "Perform the Trick."
    *   As Dark Man, approach Cauldron.
    *   Use `item_head_bundle`.
    *   *Minigame*: "The Song". Press keys in rhythm to make the Head dance/sing.
2.  **Objective**: "Lure the King."
    *   Keep the performance going until King enters `zone_danger`.
3.  **Objective**: "The Vengeance."
    *   Use `item_blue_sword` on King.
    *   King's head falls in.
4.  **Event**: "The Battle of Heads."
    *   Auto-play or simple QTE: Help Mei Jian Chi's head fight the King's.
    *   Mei Jian Chi is losing.
5.  **Objective**: "The Final Sacrifice."
    *   Dark Man realizes help is needed.
    *   Action: "Suicide".
    *   Dark Man's head joins the cauldron.
    *   Victory.

---

## Map 06: Epilogue (`map_city_street_funeral`)
**Scene**: The Funeral
**Visuals**: White banners. Altar tables.
**Logic**: Interactive cutscene. Player views the absurdity of the skulls being indistinguishable.
