import Phaser from 'phaser';

export class Patrol extends Phaser.GameObjects.Container {
    private visionCone: Phaser.GameObjects.Graphics;
    private patrolPath: Phaser.Math.Vector2[];
    private currentTargetIndex: number = 0;
    private moveSpeed: number = 60;
    private visionRange: number = 150;
    private visionAngle: number = Math.PI / 3; // 60 degrees
    private alertIcon: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, path: Phaser.Math.Vector2[]) {
        super(scene, x, y);

        this.patrolPath = path;

        // Visual representation (Guard)
        const body = scene.add.circle(0, 0, 12, 0x8800ff);
        this.add(body);

        // Vision cone
        this.visionCone = scene.add.graphics();
        this.add(this.visionCone);

        // Alert Icon
        this.alertIcon = scene.add.text(0, -25, '!', { 
            fontSize: '20px', 
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setVisible(false);
        this.add(this.alertIcon);

        // Physics
        scene.physics.add.existing(this);
        const pBody = this.body as Phaser.Physics.Arcade.Body;
        pBody.setCircle(12, -12, -12); // Offset to center

        scene.add.existing(this);
    }

    preUpdate(_time: number, _delta: number) {
        // Container doesn't auto-call preUpdate on children usually, but we call update manually from Scene
    }

    update(_time: number, _delta: number) {
        this.move();
        this.drawVisionCone();
        this.alertIcon.rotation = -this.rotation; // Keep ! upright
    }

    private move() {
        if (this.patrolPath.length === 0) return;

        const target = this.patrolPath[this.currentTargetIndex];
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (distance < 5) {
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.patrolPath.length;
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(this.moveSpeed);
        
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(velocity.x, velocity.y);
        
        // Rotate container to face movement
        this.rotation = angle;
    }

    private drawVisionCone() {
        this.visionCone.clear();
        this.visionCone.fillStyle(0xffff00, 0.2);
        
        // Draw fan
        // slice(x, y, radius, startAngle, endAngle, anticlockwise)
        // We draw relative to container (0,0), facing right (0 rads) is forward
        this.visionCone.slice(0, 0, this.visionRange, -this.visionAngle / 2, this.visionAngle / 2, false);
        this.visionCone.fillPath();
    }

    canSee(target: Phaser.GameObjects.GameObject): boolean {
        if (!target.body) return false;
        
        const tBody = target.body as Phaser.Physics.Arcade.Body;
        // Use center of target
        const targetX = tBody.center.x;
        const targetY = tBody.center.y;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
        
        if (dist > this.visionRange) return false;

        const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        let angleDiff = Phaser.Math.Angle.Wrap(angleToTarget - this.rotation);
        
        if (Math.abs(angleDiff) < this.visionAngle / 2) {
            // TODO: Raycast check against walls
            return true;
        }

        return false;
    }

    setAlert(isAlert: boolean) {
        this.alertIcon.setVisible(isAlert);
    }
}
