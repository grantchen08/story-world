import Phaser from 'phaser';
import { GameState } from '../systems/GameState';
import { DialogueSystem } from '../systems/DialogueSystem';
import { MapManager } from '../systems/MapManager';
import { Patrol } from '../objects/Patrol';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number = 200;
  private stateText!: Phaser.GameObjects.Text;
  private isDialogueOpen: boolean = false;
  private patrols: Patrol[] = [];
  private detectionTimer: number = 0;

  constructor() {
    super('GameScene');
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON('village', 'maps/village.json');
  }

  async create() {
    // 0. Load Data
    await DialogueSystem.getInstance().loadDialogueFile('prologue', './data/dialogue/prologue.json');

    // 1. Setup World
    MapManager.getInstance().init(this);
    MapManager.getInstance().loadMap(this, 'village');
    
    // 2. Setup Player
    const spawn = MapManager.getInstance().getSpawnPoint('SpawnPoint') || new Phaser.Math.Vector2(400, 300);
    this.player = this.add.circle(spawn.x, spawn.y, 16, 0xff0000);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    
    // Add collision with map
    const walls = MapManager.getInstance().getCollisionLayer();
    if (walls) {
        this.physics.add.collider(this.player, walls);
    }

    // 2.5 Setup Patrols
    const patrolPath = [
        new Phaser.Math.Vector2(300, 300),
        new Phaser.Math.Vector2(500, 300),
        new Phaser.Math.Vector2(500, 100),
        new Phaser.Math.Vector2(300, 100)
    ];
    const patrol = new Patrol(this, 300, 300, patrolPath);
    this.patrols.push(patrol);

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

        // Trigger Prologue Dialogue
        this.input.keyboard.on('keydown-T', () => {
            if (!this.isDialogueOpen) {
                this.startDialogue('prologue', 'prologue_start');
            }
        });
    }

    // 5. Setup UI
    this.stateText = this.add.text(10, 10, '', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000'
    }).setScrollFactor(0);
    
    this.updateUI();
    
    this.add.text(10, 500, 'WASD to move\nT: Start Prologue\nR/H: Stats, S/L: Save/Load', {
         fontSize: '14px',
         color: '#ffff00',
         backgroundColor: '#000000aa'
    }).setScrollFactor(0);

    if (!this.scene.isActive('UIScene')) {
        this.scene.launch('UIScene');
    }
  }

  update(time: number, delta: number) {
    // Add guard clause for uninitialized player
    if (!this.player) return;

    if (!this.cursors || this.isDialogueOpen) {
        // Stop movement if dialogue is open
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (body) body.setVelocity(0); // Also guard here just in case
        return;
    }

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

    // Update Patrols
    let detected = false;
    this.patrols.forEach(patrol => {
        patrol.update(time, delta);
        if (patrol.canSee(this.player)) {
            detected = true;
            patrol.setAlert(true);
        } else {
            patrol.setAlert(false);
        }
    });

    if (detected) {
        this.detectionTimer += delta;
        if (this.detectionTimer > 1000) { // 1 second of continuous detection
            GameState.getInstance().updateStat('heat', 1); // Increase heat
            this.updateUI();
            this.detectionTimer = 0;
            // Visual feedback could go here (screen flash, sound)
        }
    } else {
        this.detectionTimer = 0;
    }
  }

  private updateUI() {
    const stats = GameState.getInstance().getStats();
    const time = GameState.getInstance().getTime();
    this.stateText.setText(
        `Time: ${time}\nResolve: ${stats.resolve}\nCompassion: ${stats.compassion}\nHeat: ${stats.heat}`
    );
  }

  private startDialogue(fileKey: string, nodeId: string) {
    const ds = DialogueSystem.getInstance();
    const node = ds.getNode(fileKey, nodeId);

    if (!node) {
        console.error(`Dialogue node not found: ${fileKey}:${nodeId}`);
        // If node ends with "exit", we close dialogue
        if (nodeId.startsWith('exit')) {
             this.isDialogueOpen = false;
             this.events.emit('hide-dialogue');
        }
        return;
    }

    // Process entry effects (if any - though usually effects are on choices, node effects can be auto-applied)
    if (node.effects) {
        ds.processEffects(node.effects);
        this.updateUI();
    }

    this.isDialogueOpen = true;

    // Filter choices based on conditions
    const availableChoices = node.choices.filter(c => ds.checkConditions(c.conditions));

    // Map to UI format
    const uiChoices = availableChoices.map(c => ({
        text: c.text,
        callback: () => {
            // Apply choice effects
            if (c.effects) {
                ds.processEffects(c.effects);
                this.updateUI();
            }
            
            // Navigate or Close
            if (c.to.startsWith('exit')) {
                this.isDialogueOpen = false;
                this.events.emit('hide-dialogue');
            } else {
                // Next node
                this.startDialogue(fileKey, c.to);
            }
        }
    }));

    this.events.emit('show-dialogue', {
        text: `${node.speaker}: ${node.text}`,
        choices: uiChoices
    });
  }
}
