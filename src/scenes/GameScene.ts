import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number = 200;
  private stateText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create() {
    // 1. Setup World (Placeholder)
    this.add.grid(0, 0, 1600, 1200, 32, 32, 0x00b9f2).setAlpha(0.2).setOrigin(0);
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // 2. Setup Player
    this.player = this.add.circle(400, 300, 16, 0xff0000);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    
    // 3. Setup Camera
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 4. Setup Input
    if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Debug keys
        this.input.keyboard.on('keydown-R', () => {
            GameState.getInstance().updateStat('resolve', 10);
            this.updateUI();
        });
        this.input.keyboard.on('keydown-H', () => {
            GameState.getInstance().updateStat('heat', 10);
            this.updateUI();
        });
        this.input.keyboard.on('keydown-S', () => {
            GameState.getInstance().save();
            console.log("Saved");
        });
         this.input.keyboard.on('keydown-L', () => {
            if (GameState.getInstance().load()) {
                console.log("Loaded");
                this.updateUI();
            }
        });

        // Test Dialogue Trigger
        this.input.keyboard.on('keydown-T', () => {
            this.events.emit('show-dialogue', {
                text: "Stranger: The path ahead is watched. What will you do?",
                choices: [
                    { 
                        text: "[Resolve] Push through.", 
                        callback: () => {
                            GameState.getInstance().updateStat('resolve', 5);
                            GameState.getInstance().updateStat('heat', 10);
                            this.updateUI();
                            console.log("Chose Resolve");
                        }
                    },
                    { 
                        text: "[Compassion] Find another way.", 
                        callback: () => {
                            GameState.getInstance().updateStat('compassion', 5);
                            this.updateUI();
                            console.log("Chose Compassion");
                        }
                    }
                ]
            });
        });
    }

    // 5. Setup UI
    this.stateText = this.add.text(10, 10, '', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000'
    }).setScrollFactor(0);
    
    this.updateUI();
    
    // Instructions
    this.add.text(10, 500, 'WASD/Arrows to move\nT: Talk Test\nR/H: Stats, S/L: Save/Load', {
         fontSize: '14px',
         color: '#ffff00',
         backgroundColor: '#000000aa'
    }).setScrollFactor(0);

    // Launch UI Scene if not running (safety check, though Main handles it)
    if (!this.scene.isActive('UIScene')) {
        this.scene.launch('UIScene');
    }
  }

  update() {
    if (!this.cursors) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const speed = this.speed;

    body.setVelocity(0);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
    }

    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
        body.velocity.normalize().scale(speed);
    }
  }

  private updateUI() {
    const stats = GameState.getInstance().getStats();
    const time = GameState.getInstance().getTime();
    this.stateText.setText(
        `Time: ${time}\nResolve: ${stats.resolve}\nCompassion: ${stats.compassion}\nHeat: ${stats.heat}`
    );
  }
}
