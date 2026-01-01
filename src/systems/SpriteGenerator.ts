import Phaser from 'phaser';

export interface SpriteOptions {
    skinColor?: number;
    hairColor?: number;
    shirtColor?: number;
    pantsColor?: number;
    shoeColor?: number;
}

export class SpriteGenerator {
    // A simple 12x20 character map
    // . = transparent
    // H = hair
    // S = skin
    // T = torso (shirt)
    // L = legs (pants)
    // F = feet (shoes)
    // E = eye (usually black or dark)
    private static HUMAN_TEMPLATE = [
        "....HHHH....",
        "....HHHH....",
        "....HHHH....",
        "...SSSSSS...",
        "...SE.SE....",
        "...SSSSSS...",
        "...SSSSSS...",
        "..TTTTTTTT..",
        "..TTTTTTTT..",
        "..TTTTTTTT..",
        "..TTTTTTTT..",
        "..TTTTTTTT..",
        "...LL..LL...",
        "...LL..LL...",
        "...LL..LL...",
        "...LL..LL...",
        "...LL..LL...",
        "...FF..FF...",
        "...FF..FF..."
    ];

    static createHumanTexture(scene: Phaser.Scene, key: string, options: SpriteOptions) {
        if (scene.textures.exists(key)) return;

        const pixelSize = 2; // Each "dot" in our template is 2x2 real pixels
        const width = 12 * pixelSize;
        const height = 19 * pixelSize;

        const graphics = scene.make.graphics({ x: 0, y: 0 });

        // Defaults
        const skin = options.skinColor ?? 0xffccaa;
        const hair = options.hairColor ?? 0x4a3b2a;
        const shirt = options.shirtColor ?? 0x888888;
        const pants = options.pantsColor ?? 0x444444;
        const shoes = options.shoeColor ?? 0x111111;
        const eye = 0x1a1a1a;

        this.HUMAN_TEMPLATE.forEach((row, y) => {
            for (let x = 0; x < row.length; x++) {
                const char = row[x];
                if (char === '.') continue;

                let color = 0xff00ff;
                if (char === 'H') color = hair;
                if (char === 'S') color = skin;
                if (char === 'T') color = shirt;
                if (char === 'L') color = pants;
                if (char === 'F') color = shoes;
                if (char === 'E') color = eye;

                graphics.fillStyle(color, 1);
                graphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        });

        // Add a subtle shadow at the feet
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillEllipse(width / 2, height - 2, width - 4, 6);

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
}
