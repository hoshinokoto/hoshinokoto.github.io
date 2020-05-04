class Loading extends Phaser.Scene {
    constructor() {
        super({ key: 'Loading' });
    }

    preload() {
        this.load.image('bgLevel', '../images/Background_Level.png');
        this.load.multiatlas('assets', '../images/assets.json', 'images');
        this.load.audio('bgStart', '../sounds/bgStart.mp3');
        this.load.audio('marioGo', '../sounds/marioLetsgo.mp3');
        this.load.audio('bgLevel1', '../sounds/bgLevel1.mp3');
        this.load.audio('bgLevel2', '../sounds/bgLevel2.mp3');
        this.load.audio('bgLevel3', '../sounds/bgLevel3.mp3');
        this.load.audio('bgLevel4', '../sounds/bgLevel4.mp3');
        this.load.audio('marioJumpSound', '../sounds/marioJump.mp3');
        this.load.audio('marioUpgrade', '../sounds/marioUpgrade.mp3');
        this.load.audio('marioFireSound', '../sounds/marioFire.mp3');
        this.load.audio('marioHit', '../sounds/marioHit.mp3');
        this.load.audio('marioFailSound', '../sounds/marioFail.mp3');
        this.load.audio('pipeSound', '../sounds/pipeSound.mp3');
        this.load.audio('marioKick', '../sounds/marioKick.mp3');
        this.load.audio('bowserFire', '../sounds/bowserFire.mp3');
        this.load.audio('bowserHitSound', '../sounds/bowserHit.mp3');
        this.load.audio('bowserFailSound', '../sounds/bowserFail.mp3');
        this.load.audio('goSound', '../sounds/goSound.mp3');
    }

    create() {
        gameState.loadMario = this.add.sprite(config.width / 2, config.height / 2 - 20, 'assets', 'player/Mario/Mario_White_01.png').setScale(.3).setOrigin(0.5, 0.5);
        this.createAnims();
        gameState.loadMario.anims.play('marioWhite', true);
        this.add.text(config.width / 2 + 20, config.height / 2 + 50, 'Loading...', { fontSize: '14px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);
        this.time.addEvent({
            delay: 5000,
            callback: () => { 
                this.cameras.main.fadeOut(200, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.start('Start'); })  
            },
            callbackScope: this,
            loop: false
        });
    }
    
    createAnims() {
        // Mario walks
        const marioWhiteFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'player/Mario/Mario_White_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'marioWhite',
            frames: marioWhiteFrame,
            frameRate: 5,
            repeat: -1
        });
    }
}