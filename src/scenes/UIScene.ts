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
    
    // Calculate required height based on content
    const padding = 20;
    const textHeight = this.dialogText.height;
    const choicesHeight = data.choices.length * 35;
    // Calculate total height needed: text + choices + padding (top/middle/bottom)
    const contentHeight = textHeight + choicesHeight + (padding * 2); 
    // Minimum 150px, Maximum 250px (approx 1/2 screen)
    const totalHeight = Phaser.Math.Clamp(contentHeight, 150, 400);
    
    // Update background rect
    const bgRect = this.dialogContainer.list[0] as Phaser.GameObjects.Rectangle;
    if (bgRect) {
        bgRect.setSize(700, totalHeight);
        
        // Position entire box near bottom
        // Center Y = Screen Height (600) - (Height/2) - Margin (20)
        const centerY = 600 - (totalHeight / 2) - 20;
        bgRect.setPosition(400, centerY);
        
        // Reposition text to start from top of box (relative to container center?)
        // Actually, we need to rebuild the container layout since text is static position in create()
        // Easier approach: Move the text object directly relative to the new box position
        
        // Text Y = Box Top + Padding + Text Origin Offset
        const boxTop = centerY - (totalHeight / 2);
        this.dialogText.setY(boxTop + padding);
        
        // Reposition choices below text
        let choiceY = boxTop + padding + textHeight + padding;
        
        // Clear old choices
        this.choiceContainer.removeAll(true);
        
        data.choices.forEach((choice, index) => {
            const bg = this.add.rectangle(400, choiceY, 600, 30, 0x333333)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => bg.setFillStyle(0x555555))
                .on('pointerout', () => bg.setFillStyle(0x333333))
                .on('pointerdown', () => {
                    choice.callback();
                });
    
            const txt = this.add.text(400, choiceY, `${index + 1}. ${choice.text}`, {
                fontFamily: 'monospace',
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
            txt.setShadow(2, 2, '#000000', 2, true, true);
    
            this.choiceContainer.add([bg, txt]);
            choiceY += 35;
        });
    }

    this.choiceContainer.setVisible(true);
  }

  public hideDialogue() {
    this.dialogContainer.setVisible(false);
    this.choiceContainer.setVisible(false);
  }
}
