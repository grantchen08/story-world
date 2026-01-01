import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export class FinalScene extends Phaser.Scene {
  constructor() {
    super('FinalScene');
  }

  create() {
    const gs = GameState.getInstance();
    const stats = gs.getStats();
    gs.setFlag('final_seen', true);

    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);

    this.add.text(400, 60, 'Final: Confrontation', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);

    const ritualSuccess = gs.hasFlag('ritual_success');
    const mercy = gs.hasFlag('major_choice_mercy');
    const trusted = gs.hasFlag('trusted_insider');

    let outcome = 'You reach the threshold of the act.';
    if (ritualSuccess && stats.resolve >= 25) {
      outcome = mercy
        ? 'You act, but you refuse cruelty. The ending is sharp—and human.'
        : 'You act without hesitation. The ending is clean—and cold.';
    } else if (!ritualSuccess) {
      outcome = 'Noise and Heat ruin the moment. You escape, but the city remembers your shadow.';
    } else if (stats.compassion >= 40) {
      outcome = 'You turn away at the last step. The ending is quiet—and heavy.';
    }

    const details = [
      `Ritual: ${ritualSuccess ? 'stable' : 'failed'}`,
      `Mercy choice: ${mercy ? 'spared' : 'force'}`,
      `Insider: ${trusted ? 'trusted' : 'not trusted'}`,
      `Heat: ${stats.heat}`,
      `Resolve: ${stats.resolve}`,
      `Compassion: ${stats.compassion}`
    ].join('\n');

    this.add.text(400, 170, outcome, { fontSize: '18px', color: '#ffffff', align: 'center', wordWrap: { width: 720 } }).setOrigin(0.5);
    this.add.text(400, 300, details, { fontSize: '14px', color: '#aaaaaa', align: 'center' }).setOrigin(0.5);

    const restart = this.add.text(400, 520, '[ Return to Title ]', { fontSize: '20px', color: '#ffffff', backgroundColor: '#333333', padding: { x: 12, y: 8 } })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => restart.setStyle({ color: '#ffff00' }))
      .on('pointerout', () => restart.setStyle({ color: '#ffffff' }))
      .on('pointerdown', () => {
        gs.reset();
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');
        this.scene.start('BootScene');
      });
  }
}

