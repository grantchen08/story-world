import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

// Define a simple BootScene to start
class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.add.text(400, 300, 'Story World\nForging the Swords', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    this.add.text(400, 400, 'Press SPACE to start', {
        fontSize: '16px',
        color: '#aaaaaa'
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
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, GameScene, UIScene]
};

new Phaser.Game(config);
