import { GameState } from './GameState';

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices: DialogueChoice[];
  effects?: EffectMap;
  conditions?: ConditionMap;
}

export interface DialogueChoice {
  text: string;
  to: string;
  effects?: EffectMap;
  conditions?: ConditionMap;
}

export interface EffectMap {
  add?: Record<string, number>; // "resolve": 5
  set?: Record<string, any>;    // "vow_taken": true
}

export interface ConditionMap {
  gte?: Record<string, number>; // "resolve": 10
  eq?: Record<string, any>;     // "vow_taken": true
}

export class DialogueSystem {
  private static instance: DialogueSystem;
  private dialogueCache: Map<string, DialogueNode[]> = new Map();

  private constructor() {}

  public static getInstance(): DialogueSystem {
    if (!DialogueSystem.instance) {
      DialogueSystem.instance = new DialogueSystem();
    }
    return DialogueSystem.instance;
  }

  public async loadDialogueFile(key: string, path: string): Promise<void> {
    try {
      const response = await fetch(path);
      const data = await response.json();
      this.dialogueCache.set(key, data.nodes);
      console.log(`Loaded dialogue: ${key}`);
    } catch (e) {
      console.error(`Failed to load dialogue ${path}`, e);
    }
  }

  public getNode(fileKey: string, nodeId: string): DialogueNode | undefined {
    const nodes = this.dialogueCache.get(fileKey);
    return nodes?.find(n => n.id === nodeId);
  }

  public processEffects(effects?: EffectMap) {
    if (!effects) return;

    const gameState = GameState.getInstance();

    if (effects.add) {
      for (const [key, value] of Object.entries(effects.add)) {
        if (key === 'resolve' || key === 'compassion' || key === 'heat') {
          gameState.updateStat(key as any, value);
        }
      }
    }

    if (effects.set) {
      for (const [key, value] of Object.entries(effects.set)) {
        if (typeof value === 'boolean') {
            gameState.setFlag(key, value);
        }
        // Special case for location transitions
        if (key === 'currentLocation' && typeof value === 'string') {
             gameState.setCurrentLocation(value);
        }
        // Special case for objective updates
        if (key === 'currentObjective' && typeof value === 'string') {
             gameState.setCurrentObjective(value);
        }
      }
    }
  }

  public checkConditions(conditions?: ConditionMap): boolean {
    if (!conditions) return true;
    
    const gameState = GameState.getInstance();
    const stats = gameState.getStats();

    if (conditions.gte) {
      for (const [key, value] of Object.entries(conditions.gte)) {
         const statVal = (stats as any)[key];
         if (statVal === undefined || statVal < value) return false;
      }
    }
    
    if (conditions.eq) {
        for (const [key, value] of Object.entries(conditions.eq)) {
            if (gameState.hasFlag(key) !== value) return false;
        }
    }

    return true;
  }
}
