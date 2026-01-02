# Narrative Flavor Blueprint

This document maps game locations and objects to their source text in Lu Xun's *Forging the Swords*. These excerpts should be used to replace placeholder text in `public/data/dialogue/*.json` and `public/maps/*.json` to capture the "powerful language" of the original.

## Prologue: The Village Night

### Atmosphere / Ambient
**Context**: Initial description of the room.
**Current Game Text**: "The night is heavy. The oil lamp flickers..."
**Source Text**:
> "Mei Jian Chi had just gone to bed with his mother when a rat came out to gnaw at the pot lid, making a noise that grated on his nerves... crunch, crunch."
> "The torch burnt out. He stood silently in the dark, gradually seeing the moonlight's brightness."

**Implementation**:
- **Dialogue Node `prologue_start`**: Replace narrator text with: *"The pine torch has burnt out. You stand silently in the dark, gradually seeing the moonlight's brightness. A rat gnaws at the pot lid—crunch, crunch—a noise that grates on your nerves."*

### The Mother
**Context**: Mother's appearance.
**Source Text**:
> "His mother sitting in the grey-white moonlight, her body seeming to tremble. The low voice contained infinite sorrow, making his hair stand on end with cold."

**Implementation**:
- **Dialogue Node `prologue_mother_notice`**: Replace text with: *"She sits in the grey-white moonlight, her body seeming to tremble. Her low voice contains infinite sorrow: 'The water in the jar has been boiling for some time. But your nature... neither cold nor hot, changing not a bit.'"*

### The Vow / The Story
**Context**: Describing the father's death and the sword.
**Source Text**:
> "A jet of white vapor rushed up... turning crimson and casting a peach-blossom glow over everything."
> "The day I present the swords is the day my life ends. Tears can never wash away fate."

**Implementation**:
- **Dialogue Node `prologue_vow_setup`**: Use the specific imagery of the forge. *"Your father's blood fed the sword. A jet of white vapor rushed up, turning crimson and casting a peach-blossom glow. He knew: tears can never wash away fate."*

### The Sword (Item)
**Context**: Finding/Receiving the sword.
**Source Text**:
> "A coldness like touching ice and snow... the pure blue transparent sword appeared."
> "The sword dissolved into this blue light, appearing as if it were nothing... not particularly sharp, with a blade somewhat rounded like a leek leaf."

**Implementation**:
- **Item Description**: *"A pure blue, transparent sword. It dissolves into blue light, appearing as if it were nothing. The blade is rounded like a leek leaf, but cold as ice and snow."*

---

## Chapter 1: Departure & Forest

### The Forest (Map Description)
**Context**: Entering the forest map.
**Source Text**:
> "Every needle of the cedar forest hung with a dewdrop, hiding the night air within. But by the time he reached the other end... the dewdrops flashed with all kinds of brilliance, gradually turning into the colors of dawn."

**Implementation**:
- **Map Trigger**: When entering the Forest map, display: *"Every needle of the cedar forest hangs with a dewdrop, hiding the night air within."*

### The Stranger / Dark Man
**Context**: Meeting the "Mentor" figure (The Dark Man).
**Source Text**:
> "A dark man... black beard, black eyes, thin as iron. He said nothing, just smiled coldly."
> "Voice like an owl."
> "My soul bears so many wounds inflicted by others and by myself that I already hate myself!"

**Implementation**:
- **NPC Dialogue**: Use "thin as iron" and "voice like an owl" in the narrator description. Use the "wounds" line for his motivation speech.

---

## Chapter 2: The City Gate

### The City Atmosphere
**Context**: Entering the city.
**Source Text**:
> "Grey-black city walls and battlements."
> "Men stood around in rows; women peered out from doors... swollen eyes, unkempt hair, and sallow faces."
> "A great upheaval was coming, and they were all waiting anxiously yet patiently for this upheaval."

**Implementation**:
- **Map Trigger**: Display: *"Grey-black city walls and battlements loom ahead. The people have swollen eyes and sallow faces. They are waiting anxiously yet patiently for an upheaval."*

### The Crowd (Obstacle)
**Context**: Getting pushed around.
**Source Text**:
> "People were packed tightly, craning their necks... stretched necks."
> "Warriors with wooden clubs, spears, swords, crossbows, and flags, raising clouds of yellow dust."

**Implementation**:
- **Flavor Text (Examining Crowd)**: *"A wall of stretched necks. Warriors raise clouds of yellow dust ahead."*

---

## Chapter 3: Inner City & Palace

### The King (Visuals)
**Context**: Seeing the target.
**Source Text**:
> "A fat man in painted clothes, with a grizzled beard and a small head. At his waist... a blue sword."

### The Palace Mood
**Context**: The opulence vs the horror.
**Source Text**:
> "Golden dragon... golden cauldron filled with clear water and boiled with beast-charcoal."

**Implementation**:
- **Object Description (Cauldron)**: *"A golden cauldron used for boiling oxen, filled with water, with beast-charcoal piled underneath."*

---

## Direct Dialogue Injections

| Game Character | Original Role | Suggested Lines |
| :--- | :--- | :--- |
| **Mother** | Mother | "Tears can never wash away fate." <br> "The iron is cold, but the blood is still hot." (Modified) |
| **Mentor** | The Dark Man | "Justice, sympathy—those things were once clean, but now they have all become capital for usury." <br> "Your enemy returned to the palace by the east gate long ago." |
| **King** | The King | "Alas! Boring!" <br> "What?!" (Short, irritable) |
| **Patrol/Guard** | Crowd/Knights | "His precious 'Dan Tian' has been crushed." (For a bullying encounter) |
