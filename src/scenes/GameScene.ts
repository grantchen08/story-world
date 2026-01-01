import Phaser from 'phaser';
import { GameState } from '../systems/GameState';
import { DialogueSystem } from '../systems/DialogueSystem';
import { MapManager } from '../systems/MapManager';
import { Patrol } from '../objects/Patrol';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private speed: number = 200;
  private stateText!: Phaser.GameObjects.Text;
  private isDialogueOpen: boolean = false;
  private patrols: Patrol[] = [];
  private detectionTimer: number = 0;
  private activeLocation: string = 'village_square';
  private locationObjects: Phaser.GameObjects.GameObject[] = [];
  private canInteract: boolean = false;
  private interactAction: (() => void) | null = null;
  private interactExpiresAt: number = 0;
  private lastChapter2Unlocked: boolean | null = null;

  constructor() {
    super('GameScene');
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON('village', 'maps/village.json');
    this.load.tilemapTiledJSON('city_gate', 'maps/city_gate.json');
    this.load.tilemapTiledJSON('inner_city', 'maps/inner_city.json');
  }

  async create() {
    // 0. Load Data
    await DialogueSystem.getInstance().loadDialogueFile('prologue', './data/dialogue/prologue.json');
    await DialogueSystem.getInstance().loadDialogueFile('chapter1', './data/dialogue/chapter1.json');
    await DialogueSystem.getInstance().loadDialogueFile('chapter2', './data/dialogue/chapter2.json');

    const gs = GameState.getInstance();
    // If we start GameScene directly (boot), default into village
    if (gs.getCurrentLocation().startsWith('prologue')) {
        gs.setCurrentLocation('village_square');
    }
    this.activeLocation = gs.getCurrentLocation();

    // 1. Setup World
    MapManager.getInstance().init(this);
    MapManager.getInstance().loadMap(this, this.mapKeyForLocation(this.activeLocation));
    
    // 2. Setup Player
    const spawn = MapManager.getInstance().getSpawnPoint('SpawnPoint') || new Phaser.Math.Vector2(400, 300);
    this.player = this.add.circle(spawn.x, spawn.y, 16, 0xff0000);
    this.player.setDepth(10);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    
    // Add collision with map
    const walls = MapManager.getInstance().getCollisionLayer();
    if (walls) {
        this.physics.add.collider(this.player, walls);
    }

    // 2.5 Setup Location Entities (NPCs, exits, patrols)
    this.setupLocationEntities(this.activeLocation);

    // 3. Setup Camera
    this.cameras.main.setBounds(0, 0, MapManager.getInstance().getMapWidth(), MapManager.getInstance().getMapHeight());
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 4. Setup Input
    if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
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
        
        // Trigger Forgery Minigame (Debug or Interaction)
        this.input.keyboard.on('keydown-F', () => {
            this.scene.pause();
            this.scene.launch('ForgeryScene');
        });
    }

    // 5. Setup UI
    this.stateText = this.add.text(10, 10, '', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000'
    }).setScrollFactor(0);
    
    this.updateUI();
    
    this.add.text(10, 500, 'WASD to move\nE: Interact\nT: Prologue, F: Forgery\nR/H: Stats, S/L: Save/Load', {
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

    // Handle location changes driven by dialogue/effects
    const gs = GameState.getInstance();
    if (gs.getCurrentLocation() !== this.activeLocation) {
        this.transitionToLocation(gs.getCurrentLocation());
    }

    if (!this.cursors || this.isDialogueOpen) {
        // Stop movement if dialogue is open
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (body) body.setVelocity(0); // Also guard here just in case
        return;
    }

    // Live-refresh village gate marker/label after forgery unlock
    if (this.activeLocation === 'village_square') {
        const unlocked = gs.hasFlag('chapter2_unlocked');
        if (this.lastChapter2Unlocked !== unlocked) {
            this.lastChapter2Unlocked = unlocked;
            for (const obj of this.locationObjects) {
                if ((obj as any).getData && (obj as any).getData('ui') === 'city_gate_label') {
                    const label = obj as Phaser.GameObjects.Text;
                    label.setVisible(true);
                    label.setText(unlocked ? 'City Gate →' : 'City Gate (locked)');
                    label.setColor(unlocked ? '#ffffff' : '#bbbbbb');
                }
                if ((obj as any).getData && (obj as any).getData('ui') === 'city_gate_marker') {
                    const marker = obj as Phaser.GameObjects.Rectangle;
                    marker.setFillStyle(unlocked ? 0x888888 : 0x444444, 1);
                }
            }
        }
    }

    // Expire stale interactions (prevents interacting far away)
    if (time > this.interactExpiresAt) {
        this.canInteract = false;
        this.interactAction = null;
    }

    // Interaction
    if (this.canInteract && this.interactAction && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.interactAction();
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
        `Loc: ${GameState.getInstance().getCurrentLocation()}\nTime: ${time}\nResolve: ${stats.resolve}\nCompassion: ${stats.compassion}\nHeat: ${stats.heat}`
    );
  }

  private mapKeyForLocation(location: string): string {
      if (location === 'city_gate') return 'city_gate';
      if (location === 'inner_city') return 'inner_city';
      return 'village';
  }

  private clearLocationEntities() {
      for (const obj of this.locationObjects) {
          obj.destroy();
      }
      this.locationObjects = [];
      this.patrols = [];
      this.canInteract = false;
      this.interactAction = null;
      this.interactExpiresAt = 0;
      this.lastChapter2Unlocked = null;
  }

  private transitionToLocation(newLocation: string) {
      this.activeLocation = newLocation;
      this.clearLocationEntities();

      MapManager.getInstance().loadMap(this, this.mapKeyForLocation(this.activeLocation));

      const spawn = MapManager.getInstance().getSpawnPoint('SpawnPoint') || new Phaser.Math.Vector2(200, 200);
      this.player.setPosition(spawn.x, spawn.y);
      this.player.setDepth(10);
      this.children.bringToTop(this.player);
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0);
      body.setCollideWorldBounds(true);

      // Re-apply collisions
      const walls = MapManager.getInstance().getCollisionLayer();
      if (walls) {
          this.physics.add.collider(this.player, walls);
      }

      // Update camera bounds
      this.cameras.main.setBounds(0, 0, MapManager.getInstance().getMapWidth(), MapManager.getInstance().getMapHeight());

      this.setupLocationEntities(this.activeLocation);
      this.updateUI();
  }

  private setupLocationEntities(location: string) {
      // Reset interaction state on location init
      this.canInteract = false;
      this.interactAction = null;

      if (location === 'city_gate') {
          this.setupCityGate();
          return;
      }
      if (location === 'inner_city') {
          this.setupInnerCity();
          return;
      }
      this.setupVillage();
  }

  private setupVillage() {
      // Fence NPC
      const fence = this.add.circle(600, 200, 16, 0x00ff00);
      this.locationObjects.push(fence);
      this.physics.add.existing(fence);
      const fenceBody = fence.body as Phaser.Physics.Arcade.Body;
      fenceBody.setImmovable(true);

      this.physics.add.overlap(this.player, fence, () => {
          if (this.isDialogueOpen) return;
          this.canInteract = true;
          this.interactAction = () => this.startDialogue('chapter1', 'chapter1_start');
          this.interactExpiresAt = this.time.now + 150;
      });

      // Forgery Table
      const tablePos = new Phaser.Math.Vector2(200, 200);
      const tableVisual = this.add.rectangle(tablePos.x, tablePos.y, 32, 32, 0x8b4513);
      this.locationObjects.push(tableVisual);
      const tableLabel = this.add.text(tablePos.x, tablePos.y + 26, 'Forgery', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);
      this.locationObjects.push(tableLabel);

      const forgeryZone = this.add.zone(tablePos.x, tablePos.y, 40, 40);
      this.locationObjects.push(forgeryZone);
      this.physics.add.existing(forgeryZone);
      const fzBody = forgeryZone.body as Phaser.Physics.Arcade.Body;
      fzBody.setAllowGravity(false);
      fzBody.setImmovable(true);

      this.physics.add.overlap(this.player, forgeryZone, () => {
          if (this.isDialogueOpen) return;
          this.canInteract = true;
          this.interactAction = () => {
              this.scene.pause();
              this.scene.launch('ForgeryScene');
          };
          this.interactExpiresAt = this.time.now + 150;
      });

      // Exit to City Gate (unlocks after forgery attempt)
      // Keep exit within the village map bounds (20 tiles * 32px = 640px wide)
      const exitPos = new Phaser.Math.Vector2(620, 320);
      const exitVisual = this.add.rectangle(exitPos.x, exitPos.y, 28, 160, 0x444444);
      exitVisual.setData('ui', 'city_gate_marker');
      this.locationObjects.push(exitVisual);
      const exitLabel = this.add.text(exitPos.x - 40, exitPos.y, 'City Gate →', { fontSize: '14px', color: '#ffffff', backgroundColor: '#000000aa' })
        .setOrigin(1, 0.5);
      exitLabel.setData('ui', 'city_gate_label');
      this.locationObjects.push(exitLabel);

      // Always show label; update() will refresh locked/unlocked state.
      exitLabel.setVisible(true);

      const exitZone = this.add.zone(exitPos.x, exitPos.y, 60, 180);
      this.locationObjects.push(exitZone);
      this.physics.add.existing(exitZone);
      const ezBody = exitZone.body as Phaser.Physics.Arcade.Body;
      ezBody.setAllowGravity(false);
      ezBody.setImmovable(true);

      this.physics.add.overlap(this.player, exitZone, () => {
          if (this.isDialogueOpen) return;
          if (!GameState.getInstance().hasFlag('chapter2_unlocked')) return;
          this.canInteract = true;
          this.interactAction = () => {
              GameState.getInstance().setCurrentLocation('city_gate');
          };
          this.interactExpiresAt = this.time.now + 150;
      });

      // Patrols (basic)
      const patrolPath = [
          new Phaser.Math.Vector2(300, 300),
          new Phaser.Math.Vector2(500, 300),
          new Phaser.Math.Vector2(500, 100),
          new Phaser.Math.Vector2(300, 100)
      ];
      this.patrols.push(new Patrol(this, 300, 300, patrolPath));
  }

  private setupCityGate() {
      // Visible gate wall/arch
      const wall = this.add.rectangle(400, 40, 800, 100, 0x333333);
      this.locationObjects.push(wall);
      const arch = this.add.rectangle(400, 80, 180, 90, 0x222222);
      this.locationObjects.push(arch);
      const gateLabel = this.add.text(400, 20, 'CITY GATE', { fontSize: '18px', color: '#ffffff', backgroundColor: '#00000055' }).setOrigin(0.5);
      this.locationObjects.push(gateLabel);

      const clerkPos = MapManager.getInstance().getObjectPosition('GateClerk') || new Phaser.Math.Vector2(540, 350);
      const clerk = this.add.circle(clerkPos.x, clerkPos.y, 16, 0xffcc00);
      this.locationObjects.push(clerk);
      const clerkLabel = this.add.text(clerkPos.x, clerkPos.y + 26, 'Clerk', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);
      this.locationObjects.push(clerkLabel);
      this.physics.add.existing(clerk);
      const cBody = clerk.body as Phaser.Physics.Arcade.Body;
      cBody.setImmovable(true);

      this.physics.add.overlap(this.player, clerk, () => {
          if (this.isDialogueOpen) return;
          this.canInteract = true;
          this.interactAction = () => this.startDialogue('chapter2', 'gate_start');
          this.interactExpiresAt = this.time.now + 150;
      });

      // Heat-driven patrol density
      const heat = GameState.getInstance().getStats().heat;
      const basePath = [
          new Phaser.Math.Vector2(200, 450),
          new Phaser.Math.Vector2(600, 450),
          new Phaser.Math.Vector2(600, 250),
          new Phaser.Math.Vector2(200, 250)
      ];
      this.patrols.push(new Patrol(this, 200, 450, basePath));

      if (heat >= 30) {
          const extraPath = [
              new Phaser.Math.Vector2(120, 520),
              new Phaser.Math.Vector2(700, 520)
          ];
          this.patrols.push(new Patrol(this, 120, 520, extraPath));
      }

      if (heat >= 60) {
          const extraPath2 = [
              new Phaser.Math.Vector2(120, 180),
              new Phaser.Math.Vector2(700, 180)
          ];
          this.patrols.push(new Patrol(this, 700, 180, extraPath2));
      }

      // Optional: if already entered city, allow exit zone to inner city
      const toInnerPos = MapManager.getInstance().getObjectPosition('ToInnerCity') || new Phaser.Math.Vector2(400, 80);
      const innerHint = this.add.rectangle(toInnerPos.x + 48, toInnerPos.y + 24, 96, 48, 0x00ff00, 0.15);
      this.locationObjects.push(innerHint);
      const innerLabel = this.add.text(toInnerPos.x + 48, toInnerPos.y + 24, 'To Inner City', { fontSize: '12px', color: '#ffffff', backgroundColor: '#000000aa' }).setOrigin(0.5);
      this.locationObjects.push(innerLabel);

      const exitZone = this.add.zone(toInnerPos.x + 48, toInnerPos.y + 24, 96, 48);
      this.locationObjects.push(exitZone);
      this.physics.add.existing(exitZone);
      const ezBody = exitZone.body as Phaser.Physics.Arcade.Body;
      ezBody.setAllowGravity(false);
      ezBody.setImmovable(true);

      this.physics.add.overlap(this.player, exitZone, () => {
          if (this.isDialogueOpen) return;
          if (!GameState.getInstance().hasFlag('entered_city')) return;
          this.canInteract = true;
          this.interactAction = () => {
              GameState.getInstance().setCurrentLocation('inner_city');
          };
          this.interactExpiresAt = this.time.now + 150;
      });
  }

  private setupInnerCity() {
      // Placeholder NPC to confirm transition worked
      const insiderPos = MapManager.getInstance().getObjectPosition('Insider') || new Phaser.Math.Vector2(540, 250);
      const insider = this.add.circle(insiderPos.x, insiderPos.y, 16, 0x00ccff);
      this.locationObjects.push(insider);
      this.physics.add.existing(insider);
      const iBody = insider.body as Phaser.Physics.Arcade.Body;
      iBody.setImmovable(true);

      this.physics.add.overlap(this.player, insider, () => {
          if (this.isDialogueOpen) return;
          this.canInteract = true;
          this.interactAction = () => {
              // For now, just a quick prologue node as placeholder interaction
              this.startDialogue('prologue', 'prologue_mother_notice');
          };
          this.interactExpiresAt = this.time.now + 150;
      });

      // Light patrol
      const patrolPath = [
          new Phaser.Math.Vector2(200, 400),
          new Phaser.Math.Vector2(600, 400)
      ];
      this.patrols.push(new Patrol(this, 200, 400, patrolPath));
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
