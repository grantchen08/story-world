import Phaser from 'phaser';
import { GameState } from '../systems/GameState';

export class ForgeryScene extends Phaser.Scene {
    // private selectedStamp: string | null = null;
    // private paperZone!: Phaser.GameObjects.Zone;
    // private appliedStamps: string[] = [];
    private feedbackText!: Phaser.GameObjects.Text;
    private paperGraphics!: Phaser.GameObjects.Graphics;

    constructor() {
        super('ForgeryScene');
    }

    create() {
        // Background overlay
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

        // Title
        this.add.text(400, 50, 'Forgery Station', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 100, 'Assemble the pass. "Use the Red Phoenix seal for the South Gate."', {
            fontSize: '18px',
            color: '#aaaaaa',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // The Paper (Document)
        this.paperGraphics = this.add.graphics();
        this.paperGraphics.fillStyle(0xeebb99, 1);
        this.paperGraphics.fillRect(250, 150, 300, 400); // The document
        
        // Zone for validation
        // this.paperZone = this.add.zone(400, 350, 300, 400).setRectangleDropZone(300, 400);
        this.add.zone(400, 350, 300, 400).setRectangleDropZone(300, 400);

        // Stamps (Draggable)
        this.createStamp(100, 200, 0xff0000, 'Red Phoenix');
        this.createStamp(100, 350, 0x0000ff, 'Blue Dragon');
        this.createStamp(100, 500, 0x00ff00, 'Green Turtle');

        // Submit Button
        const submitBtn = this.add.text(650, 500, '[ SUBMIT ]', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.evaluateForgery())
        .on('pointerover', () => submitBtn.setStyle({ color: '#ffff00' }))
        .on('pointerout', () => submitBtn.setStyle({ color: '#ffffff' }));

        // Feedback Text
        this.feedbackText = this.add.text(400, 560, '', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Input Handling
        this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', (_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.Container, _dropZone: Phaser.GameObjects.Zone) => {
            // Snap to zone? Or just leave it there.
            // For this minigame, we just visually leave it, but logically record it?
            // Actually, let's just leave it visually.
            // When submit is clicked, we check overlaps or just check if it was dropped in zone?
            
            // Simpler: Check overlap on submit.
            // But 'drop' event is good for feedback.
            
            // Let's rely on overlap check during submit for robustness, 
            // but here we can play a sound or visual effect.
        });

        // Close button (Cancel)
        this.add.text(750, 30, 'X', { fontSize: '24px', color: '#ff0000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.resume('GameScene');
            });
    }

    private createStamp(x: number, y: number, color: number, name: string) {
        const container = this.add.container(x, y);
        container.setSize(64, 64);
        
        const bg = this.add.circle(0, 0, 32, color);
        const text = this.add.text(0, 40, name, { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);
        
        container.add([bg, text]);
        container.setInteractive({ draggable: true });
        container.setData('name', name);
        container.setData('color', color); // Store color to "stamp" the paper later?
        
        return container;
    }

    private evaluateForgery() {
        // Find which stamps are overlapping the paper zone
        // Since we didn't track them in a list, we can iterate children or just query.
        // Let's use the stamp containers.
        
        // This is a bit hacky in Phaser without a group, but we know the stamps.
        // Let's just assume any container with 'name' data is a stamp.
        
        const stamps = this.children.list.filter(c => c instanceof Phaser.GameObjects.Container && c.getData('name'));
        const paperBounds = new Phaser.Geom.Rectangle(250, 150, 300, 400);

        const activeStamps: string[] = [];

        stamps.forEach(obj => {
            const container = obj as Phaser.GameObjects.Container;
            if (Phaser.Geom.Rectangle.Contains(paperBounds, container.x, container.y)) {
                activeStamps.push(container.getData('name'));
                
                // Visual flair: "Stamp" the paper (draw a permanent circle) and reset the tool? 
                // For MVP, just dragging the tool there is enough.
            }
        });

        if (activeStamps.length === 0) {
            this.feedbackText.setText("You haven't applied any seals!");
            return;
        }

        let success = false;
        
        // Win condition: Only "Red Phoenix"
        if (activeStamps.includes('Red Phoenix') && !activeStamps.includes('Blue Dragon') && !activeStamps.includes('Green Turtle')) {
            success = true;
            this.feedbackText.setText("Perfect match.");
            this.feedbackText.setColor('#00ff00');
        } else {
            this.feedbackText.setText("Incorrect seals. This looks fake.");
            this.feedbackText.setColor('#ff0000');
        }

        // Delay then close
        this.time.delayedCall(1500, () => {
            const gs = GameState.getInstance();
            if (success) {
                gs.setFlag('forgery_success', true);
                gs.updateStat('heat', -10); // Reward
            } else {
                gs.setFlag('forgery_success', false);
                gs.updateStat('heat', 20); // Penalty
            }
            
            // Set a flag that we attempted it
            gs.setFlag('forgery_attempted', true);

            this.scene.stop();
            this.scene.resume('GameScene');
        });
    }
}
