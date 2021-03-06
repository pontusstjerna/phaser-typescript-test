import 'phaser';
import { Math } from 'phaser';

class GameScene extends Phaser.Scene {

    starTimer: number = 0;
    starInterval: number = 1000;
    starsCaught: number = 0;
    sand: Phaser.Physics.Arcade.StaticGroup;
    info: Phaser.GameObjects.Text;

    gameOver: boolean = false

    constructor() {
        super({ key: "GameScene" });
    }

    // called when the scene starts; this function may accept parameters,
    // which are passed from other scenes or game by calling
    init(params): void {
        // TODO
    }

    // is called before the scene objects are created, and it contains loading assets;
    // these assets are cached, so when the scene is restarted, they are not reloaded
    preload(): void {
        this.load.image('egil', 'https://scontent-arn2-1.cdninstagram.com/vp/59c8039e3dd104ca8a4cf88c4bd1342d/5E28E8F7/t51.2885-19/s320x320/24327539_1523461121070850_4786915036222193664_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com');
        this.load.setBaseURL('https://raw.githubusercontent.com/mariyadavydova/starfall-phaser3-typescript/master/');
        this.load.image('star', 'assets/star.png');
        this.load.image('sand', 'assets/sand.jpg');
    }

    // is called when the assets are loaded and usually contains creation of the main game objects
    // (background, player, obstacles, enemies, etc.)
    create(): void {
        this.sand = this.physics.add.staticGroup({
            key: 'sand',
            frameQuantity: 20
        });

        Phaser.Actions.PlaceOnLine(
            this.sand.getChildren(),
            new Phaser.Geom.Line(20, 580, 820, 580)
        );

        this.sand.refresh();

        this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
    }

    // is called every tick and contains the dynamic part of the scene — everything that moves, flashes, etc.
    update(time, delta): void {
        this.starTimer += delta;

        if (this.starTimer > this.starInterval && !this.gameOver) {
            this.emitStar();
            this.starTimer = 0;
            this.starInterval -= 10
        }
        this.info.text = `Level: ${this.starsCaught}`
    }

    private emitStar(): void {
        const x = Math.Between(25, 755);
        const y = 26;
        const star: Phaser.Physics.Arcade.Image = this.physics.add.image(x, y, 'egil');
        star.setDisplaySize(50,50);
        star.setVelocity(Math.Between(-10,10), Math.Between(25, 250));
        star.setInteractive();
        star.setAngularVelocity(Math.Between(-90, 90));
        star.on('pointerdown', () => this.onClick(star), this);
        this.physics.add.collider(star, this.sand, () => this.onFall(star), null, this);
    }

    private onFall = (star: Phaser.Physics.Arcade.Image): void => {
        star.setVelocity(0,0);
        star.setAngularVelocity(0);
        star.setTint(0xff0000);

        this.gameOver = true
    };

    private onClick = (star: Phaser.Physics.Arcade.Image): void => {
        star.setTint(0x44ff44);
        star.setVelocity(Math.Between(-500, 500), -500);
        this.starsCaught++;
        this.time.delayedCall(500, star => star.destroy(), [star], this);
    };


}

export default GameScene;
