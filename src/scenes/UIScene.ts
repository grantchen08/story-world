import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export interface Choice {
  text: string;
  callback: () => void;
}

export class UIScene extends Phaser.Scene {
  private dialogContainer!: Phaser.GameObjects.Container;
  private dialogText!: Phaser.GameObjects.Text;
  private choiceContainer!: Phaser.GameObjects.Container;
  private objectiveText!: Phaser.GameObjects.Text;
  private lastObjective: string = '';

  constructor() {
    super('UIScene');
  }

  create() {
    // Objective HUD (top center)
    this.objectiveText = this.add.text(400, 10, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5, 0);
    this.objectiveText.setShadow(2, 2, '#000000', 2, true, true);

    // Dialog Box Background
    const rect = this.add.rectangle(400, 500, 700, 150, 0x000000, 0.8);
    rect.setStrokeStyle(2, 0xffffff);
    
    // Dialog Text
    this.dialogText = this.add.text(400, 460, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: 660 }
    }).setOrigin(0.5, 0);
    this.dialogText.setShadow(2, 2, '#000000', 2, true, true);

    this.dialogContainer = this.add.container(0, 0, [rect, this.dialogText]);
    this.choiceContainer = this.add.container(0, 0);
    
    // Start hidden
    this.hideDialogue();
    
    // Listen for events from GameScene
    const game = this.scene.get('GameScene');
    game.events.on('show-dialogue', this.showDialogue, this);
    game.events.on('hide-dialogue', this.hideDialogue, this);
  }

  update() {
    const objective = GameState.getInstance().getCurrentObjective();
    if (objective !== this.lastObjective) {
      this.lastObjective = objective;
      this.objectiveText.setText(objective ? `Objective: ${objective}` : '');
      this.objectiveText.setVisible(!!objective);
    }
  }

  public showDialogue(data: { text: string, choices: Choice[] }) {
    this.dialogContainer.setVisible(true);
    this.dialogText.setText(data.text);
    
    // Clear old choices
    this.choiceContainer.removeAll(true);

    // Create new choices
    let yOffset = 520;
    data.choices.forEach((choice, index) => {
        const bg = this.add.rectangle(400, yOffset, 600, 30, 0x333333)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => bg.setFillStyle(0x555555))
            .on('pointerout', () => bg.setFillStyle(0x333333))
            .on('pointerdown', () => {
                choice.callback();
                // Do NOT auto-hide; let the callback decide if we close or show next
            });

        const txt = this.add.text(400, yOffset, `${index + 1}. ${choice.text}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        txt.setShadow(2, 2, '#000000', 2, true, true);

        this.choiceContainer.add([bg, txt]);
        yOffset += 35;
    });
    
    this.dialogContainer.setVisible(true);
    this.choiceContainer.setVisible(true);
  }

  public hideDialogue() {
    this.dialogContainer.setVisible(false);
    this.choiceContainer.setVisible(false);
  }
}
