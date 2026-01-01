import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export class RitualScene extends Phaser.Scene {
  private marker!: Phaser.GameObjects.Rectangle;
  private feedback!: Phaser.GameObjects.Text;
  private targetZone!: Phaser.GameObjects.Rectangle;

  private markerDir: number = 1;
  private markerSpeed: number = 340; // px/sec
  private hitsRequired: number = 3;
  private hits: number = 0;
  private misses: number = 0;

  constructor() {
    super('RitualScene');
  }

  create() {
    const gs = GameState.getInstance();
    const heat = gs.getStats().heat;

    // Overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

    this.add.text(400, 60, 'Ritual: Temper the Blade', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 100, 'Press SPACE when the marker is inside the green zone (3 times).', { fontSize: '16px', color: '#aaaaaa' }).setOrigin(0.5);

    if (heat >= 50) {
      this.markerSpeed = 420;
      this.add.text(400, 130, 'High Heat: the ritual is unstable.', { fontSize: '14px', color: '#ff6666' }).setOrigin(0.5);
    }

    // Bar
    this.add.rectangle(400, 300, 520, 24, 0x333333, 1);

    // Target zone
    this.targetZone = this.add.rectangle(400, 300, 120, 24, 0x00ff00, 0.25);

    // Marker
    this.marker = this.add.rectangle(140, 300, 10, 36, 0xffffff, 1);

    // Feedback
    this.feedback = this.add.text(400, 420, 'Hits: 0/3', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

    // Close button
    this.add.text(750, 30, 'X', { fontSize: '24px', color: '#ff0000' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
      });

    // Input
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.marker || this.hits >= this.hitsRequired) return;

      const inZone = Phaser.Geom.Rectangle.Overlaps(
        this.marker.getBounds(),
        this.targetZone.getBounds()
      );

      if (inZone) {
        this.hits += 1;
        this.feedback.setText(`Good. Hits: ${this.hits}/${this.hitsRequired}`);
        this.feedback.setColor('#00ff00');
      } else {
        this.misses += 1;
        this.feedback.setText(`Miss. Hits: ${this.hits}/${this.hitsRequired}`);
        this.feedback.setColor('#ff4444');
      }

      if (this.hits >= this.hitsRequired) {
        this.complete(true);
      } else if (this.misses >= 2) {
        this.complete(false);
      }
    });
  }

  update(_time: number, delta: number) {
    if (!this.marker || this.hits >= this.hitsRequired) return;

    const left = 400 - 260;
    const right = 400 + 260;
    const move = (this.markerSpeed * delta) / 1000;

    this.marker.x += move * this.markerDir;
    if (this.marker.x <= left) {
      this.marker.x = left;
      this.markerDir = 1;
    } else if (this.marker.x >= right) {
      this.marker.x = right;
      this.markerDir = -1;
    }
  }

  private complete(success: boolean) {
    const gs = GameState.getInstance();
    gs.setFlag('ritual_done', true);
    gs.setFlag('ritual_success', success);

    if (success) {
      gs.updateStat('resolve', 5);
      this.feedback.setText('The ritual holds. Your hands stop shaking.');
      this.feedback.setColor('#00ff00');
    } else {
      gs.updateStat('heat', 10);
      this.feedback.setText('The ritual slips. Too loud, too hot.');
      this.feedback.setColor('#ff4444');
    }

    this.time.delayedCall(1200, () => {
      this.scene.stop();
      this.scene.resume('GameScene');
    });
  }
}

