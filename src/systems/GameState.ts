export interface GameStats {
  resolve: number;
  compassion: number;
  heat: number;
}

export enum TimeOfDay {
  Day = 'Day',
  Night = 'Night',
  Curfew = 'Curfew'
}

export interface GameData {
  stats: GameStats;
  time: TimeOfDay;
  flags: Record<string, boolean>;
  inventory: string[];
  currentLocation: string;
  currentObjective: string;
}

const INITIAL_DATA: GameData = {
  stats: {
    resolve: 20,
    compassion: 20,
    heat: 0
  },
  time: TimeOfDay.Night, // Starts at night in Prologue
  flags: {},
  inventory: [],
  currentLocation: 'prologue_home',
  currentObjective: 'Begin the story.'
};

export class GameState {
  private static instance: GameState;
  private data: GameData;

  private constructor() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  // --- Stats ---
  public getStats(): GameStats {
    return { ...this.data.stats };
  }

  public updateStat(stat: keyof GameStats, value: number) {
    this.data.stats[stat] = Math.max(0, Math.min(100, this.data.stats[stat] + value));
  }

  public setStat(stat: keyof GameStats, value: number) {
    this.data.stats[stat] = Math.max(0, Math.min(100, value));
  }

  // --- Flags ---
  public setFlag(flag: string, value: boolean = true) {
    this.data.flags[flag] = value;
  }

  public hasFlag(flag: string): boolean {
    return !!this.data.flags[flag];
  }

  // --- Inventory ---
  public addItem(item: string) {
    if (!this.data.inventory.includes(item)) {
      this.data.inventory.push(item);
    }
  }

  public hasItem(item: string): boolean {
    return this.data.inventory.includes(item);
  }

  public removeItem(item: string) {
    this.data.inventory = this.data.inventory.filter(i => i !== item);
  }

  // --- Time ---
  public setTime(time: TimeOfDay) {
    this.data.time = time;
  }

  public getTime(): TimeOfDay {
    return this.data.time;
  }

  // --- Location ---
  public getCurrentLocation(): string {
    return this.data.currentLocation;
  }

  public setCurrentLocation(location: string) {
    this.data.currentLocation = location;
  }

  // --- Objectives ---
  public getCurrentObjective(): string {
    return this.data.currentObjective;
  }

  public setCurrentObjective(objective: string) {
    this.data.currentObjective = objective;
  }

  // --- Persistence ---
  public save() {
    localStorage.setItem('story-world-save', JSON.stringify(this.data));
    console.log('Game Saved', this.data);
  }

  public load(): boolean {
    const saveStr = localStorage.getItem('story-world-save');
    if (saveStr) {
      try {
        const loaded = JSON.parse(saveStr) as Partial<GameData>;
        // Backwards-compatible merge (older saves may miss new fields)
        this.data = {
          ...JSON.parse(JSON.stringify(INITIAL_DATA)),
          ...loaded,
          stats: { ...INITIAL_DATA.stats, ...(loaded.stats ?? {}) },
          flags: { ...(loaded.flags ?? {}) },
          inventory: Array.isArray(loaded.inventory) ? loaded.inventory : []
        };
        console.log('Game Loaded', this.data);
        return true;
      } catch (e) {
        console.error('Failed to load save', e);
        return false;
      }
    }
    return false;
  }

  public reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}
