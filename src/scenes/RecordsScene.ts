import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export class RecordsScene extends Phaser.Scene {
  private feedbackText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private timeLeftMs: number = 12000;
  private finished: boolean = false;

  constructor() {
    super('RecordsScene');
  }

  create() {
    const gs = GameState.getInstance();

    // Overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

    this.add.text(400, 60, 'Records Room', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 105, 'Find the proof record before the patrol returns.', {
      fontSize: '18px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    const heat = gs.getStats().heat;
    const hint = heat >= 50
      ? 'High Heat: you have less time and harsher consequences.'
      : 'Tip: the clerk mentioned the “Phoenix registry” is kept in the middle ledger.';

    this.add.text(400, 140, hint, {
      fontSize: '14px',
      color: heat >= 50 ? '#ff6666' : '#cccccc'
    }).setOrigin(0.5);

    // Timer
    if (heat >= 50) this.timeLeftMs = 8000;
    this.timerText = this.add.text(400, 180, '', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

    // Buttons (three ledgers)
    this.makeLedgerButton(250, 300, 'Ledger A (Taxes)', () => this.finish(false));
    this.makeLedgerButton(400, 300, 'Ledger B (Phoenix Registry)', () => this.finish(true));
    this.makeLedgerButton(550, 300, 'Ledger C (Labor)', () => this.finish(false));

    // Feedback
    this.feedbackText = this.add.text(400, 520, '', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

    // Close button (cancel)
    this.add.text(750, 30, 'X', { fontSize: '24px', color: '#ff0000' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
      });

    // Countdown
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.finished) return;
        this.timeLeftMs -= 100;
        this.timerText.setText(`Time left: ${(this.timeLeftMs / 1000).toFixed(1)}s`);
        if (this.timeLeftMs <= 0) {
          this.finish(false, true);
        }
      }
    });
  }

  private makeLedgerButton(x: number, y: number, label: string, onClick: () => void) {
    const bg = this.add.rectangle(x, y, 260, 70, 0x333333, 1)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(0x555555, 1))
      .on('pointerout', () => bg.setFillStyle(0x333333, 1))
      .on('pointerdown', () => {
        if (this.finished) return;
        onClick();
      });

    const txt = this.add.text(x, y, label, { fontSize: '14px', color: '#ffffff', align: 'center', wordWrap: { width: 240 } })
      .setOrigin(0.5);

    return [bg, txt];
  }

  private finish(success: boolean, timedOut: boolean = false) {
    if (this.finished) return;
    this.finished = true;

    const gs = GameState.getInstance();
    const heat = gs.getStats().heat;
    const penalty = heat >= 50 ? 15 : 8;

    if (success) {
      gs.setFlag('has_proof_piece', true);
      gs.setFlag('records_success', true);
      gs.updateStat('heat', -5);
      this.feedbackText.setText('You found the proof record.');
      this.feedbackText.setColor('#00ff00');
    } else {
      gs.setFlag('records_success', false);
      gs.updateStat('heat', penalty);
      this.feedbackText.setText(timedOut ? 'Too late—footsteps. You flee.' : 'Wrong ledger—too much noise.');
      this.feedbackText.setColor('#ff4444');
    }

    this.time.delayedCall(1200, () => {
      this.scene.stop();
      this.scene.resume('GameScene');
    });
  }
}

