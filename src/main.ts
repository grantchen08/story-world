import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { ForgeryScene } from './scenes/ForgeryScene';
import { RecordsScene } from './scenes/RecordsScene';
import { RitualScene } from './scenes/RitualScene';
import { FinalScene } from './scenes/FinalScene';

// Define a simple BootScene to start
class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b0b10');

    const title = this.add
      .text(400, 260, 'Story World\nForging the Swords', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffffff',
        align: 'center'
      })
      .setOrigin(0.5);
    title.setShadow(2, 2, '#000000', 2, true, true);

    this.add.text(400, 330, `v${__APP_VERSION__}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#b7b7c2',
      align: 'center'
    }).setOrigin(0.5);
    
    this.add.text(400, 400, 'Press SPACE to start', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#b7b7c2'
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => {
        this.scene.start('GameScene');
        // Launch UI Scene in parallel
        this.scene.launch('UIScene');
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  pixelArt: true,
  backgroundColor: '#1a1a1a',
  render: {
    antialias: false,
    roundPixels: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, GameScene, UIScene, ForgeryScene, RecordsScene, RitualScene, FinalScene]
};

new Phaser.Game(config);
