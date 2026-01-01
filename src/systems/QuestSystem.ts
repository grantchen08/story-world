import { GameState } from './GameState';
import type { ConditionMap, EffectMap } from './DialogueSystem';

export interface QuestStep {
  id: string;
  objective: string;
  completeWhen: ConditionMap;
  onComplete?: EffectMap;
}

export interface QuestDefinition {
  id: string;
  title: string;
  steps: QuestStep[];
}

export class QuestSystem {
  private static instance: QuestSystem;
  private questCache: Map<string, QuestDefinition> = new Map();

  private constructor() {}

  public static getInstance(): QuestSystem {
    if (!QuestSystem.instance) {
      QuestSystem.instance = new QuestSystem();
    }
    return QuestSystem.instance;
  }

  public async loadQuestFile(key: string, path: string): Promise<void> {
    try {
      const response = await fetch(path);
      const data = (await response.json()) as QuestDefinition;
      this.questCache.set(key, data);
      console.log(`Loaded quest: ${key}`);
    } catch (e) {
      console.error(`Failed to load quest ${path}`, e);
    }
  }

  public ensureQuestStarted(flagName: string, questKey: string) {
    const gs = GameState.getInstance();
    const qs = gs.getQuestState();
    if (!gs.hasFlag(flagName)) return;
    if (qs.activeQuestId) return;
    if (qs.completedQuestIds.includes(questKey)) return;
    this.startQuest(questKey);
  }

  public startQuest(questKey: string) {
    const gs = GameState.getInstance();
    const quest = this.questCache.get(questKey);
    if (!quest) {
      console.warn(`Quest not loaded: ${questKey}`);
      return;
    }
    gs.setActiveQuest(quest.id, 0);
    gs.setCurrentObjective(quest.steps[0]?.objective ?? '');
  }

  public update() {
    const gs = GameState.getInstance();
    const { activeQuestId, stepIndex } = gs.getQuestState();
    if (!activeQuestId) return;

    const quest = this.questCache.get(activeQuestId);
    if (!quest) return;

    const step = quest.steps[stepIndex];
    if (!step) {
      gs.completeQuest(activeQuestId);
      gs.setCurrentObjective('');
      return;
    }

    // Keep HUD synced
    if (gs.getCurrentObjective() !== step.objective) {
      gs.setCurrentObjective(step.objective);
    }

    // Advance when conditions met
    if (this.checkConditions(step.completeWhen)) {
      if (step.onComplete) this.applyEffects(step.onComplete);
      gs.advanceQuestStep();

      const next = quest.steps[gs.getQuestState().stepIndex];
      if (next) {
        gs.setCurrentObjective(next.objective);
      } else {
        gs.completeQuest(activeQuestId);
        gs.setCurrentObjective('');
      }
    }
  }

  private checkConditions(conditions: ConditionMap): boolean {
    const gs = GameState.getInstance();
    const stats = gs.getStats();

    if (conditions.gte) {
      for (const [key, value] of Object.entries(conditions.gte)) {
        const statVal = (stats as any)[key];
        if (statVal === undefined || statVal < value) return false;
      }
    }

    if (conditions.eq) {
      for (const [key, value] of Object.entries(conditions.eq)) {
        // This quest system uses flags for eq checks (boolean)
        if (typeof value === 'boolean') {
          if (gs.hasFlag(key) !== value) return false;
        } else {
          // Not supported yet (kept strict to avoid accidental truthiness)
          return false;
        }
      }
    }

    return true;
  }

  private applyEffects(effects: EffectMap) {
    const gs = GameState.getInstance();

    if (effects.add) {
      for (const [key, value] of Object.entries(effects.add)) {
        if (key === 'resolve' || key === 'compassion' || key === 'heat') {
          gs.updateStat(key as any, value);
        }
      }
    }

    if (effects.set) {
      for (const [key, value] of Object.entries(effects.set)) {
        if (typeof value === 'boolean') gs.setFlag(key, value);
        if (key === 'currentLocation' && typeof value === 'string') gs.setCurrentLocation(value);
        if (key === 'currentObjective' && typeof value === 'string') gs.setCurrentObjective(value);
      }
    }
  }
}

