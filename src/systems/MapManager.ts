import Phaser from 'phaser';

export class MapManager {
    private static instance: MapManager;
    private map!: Phaser.Tilemaps.Tilemap;
    private layers: Map<string, Phaser.Tilemaps.TilemapLayer> = new Map();
    private currentKey: string | null = null;
    
    private constructor() {}

    static getInstance(): MapManager {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
    }

    init(scene: Phaser.Scene) {
        // Generate placeholder tileset texture if not present
        if (!scene.textures.exists('tiles')) {
            const graphics = scene.make.graphics({ x: 0, y: 0 });
            
            // Tile 1: Grass/Ground (Dark Green)
            graphics.fillStyle(0x004400);
            graphics.fillRect(0, 0, 32, 32);
            
            // Tile 2: Wall/Obstacle (Dark Gray)
            graphics.fillStyle(0x555555);
            graphics.fillRect(32, 0, 32, 32);
            
            graphics.generateTexture('tiles', 64, 32);
        }
    }

    loadMap(scene: Phaser.Scene, key: string) {
        // Cleanup previous layers (if any)
        if (this.currentKey) {
            for (const layer of this.layers.values()) {
                layer.destroy();
            }
            this.layers.clear();
        }

        this.map = scene.make.tilemap({ key });
        this.currentKey = key;
        
        // The first argument is the name of the tileset in Tiled
        // The second argument is the key of the image loaded in Phaser
        const tileset = this.map.addTilesetImage('tiles', 'tiles');
        
        if (!tileset) {
            console.error('Could not load tileset');
            return;
        }

        // Create layers
        const groundLayer = this.map.createLayer('Ground', tileset, 0, 0);
        if (groundLayer) {
            this.layers.set('Ground', groundLayer);
            // Ensure map renders behind actors
            groundLayer.setDepth(-10);
        }

        // Try to create Walls layer if it exists
        const wallsLayer = this.map.createLayer('Walls', tileset, 0, 0);
        if (wallsLayer) {
            this.layers.set('Walls', wallsLayer);
            wallsLayer.setCollisionByExclusion([-1]);
            wallsLayer.setDepth(-5);
        }
        
        // Setup world bounds
        scene.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    getMapWidth(): number {
        return this.map ? this.map.widthInPixels : 1600;
    }

    getMapHeight(): number {
        return this.map ? this.map.heightInPixels : 1200;
    }

    getSpawnPoint(name: string = 'SpawnPoint'): Phaser.Math.Vector2 | null {
        const objectLayer = this.map.getObjectLayer('Objects');
        if (!objectLayer) return null;

        const spawn = objectLayer.objects.find(obj => obj.name === name);
        if (spawn) {
            return new Phaser.Math.Vector2(spawn.x, spawn.y);
        }
        return null;
    }

    getObjectPosition(name: string, layerName: string = 'Objects'): Phaser.Math.Vector2 | null {
        const objectLayer = this.map.getObjectLayer(layerName);
        if (!objectLayer) return null;

        const obj = objectLayer.objects.find(o => o.name === name);
        if (!obj) return null;

        return new Phaser.Math.Vector2(obj.x, obj.y);
    }

    getCollisionLayer(): Phaser.Tilemaps.TilemapLayer | undefined {
        return this.layers.get('Walls');
    }
}
