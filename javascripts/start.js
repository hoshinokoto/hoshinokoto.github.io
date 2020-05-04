class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
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
        // Create background
        gameState.bg = this.add.image(0, 0, 'bgLevel').setOrigin(0, 0).setScale(.8).setScrollFactor(0);

        // Create background music
        gameState.bgMusic = this.sound.add('bgStart');
        gameState.bgMusic.play({ loop: true });
        
        // Title
        this.add.text(config.width/2, 100, '2016-2020', { fill: '#000000', fontSize: '14px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);
        this.add.text(config.width/2, 150, 'THE ADVENTURE', 
                        { fill: '#000000', fontSize: '36px', fontFamily: '"Press Start 2P", monospace', strokeThickness: 5, stroke: '#fff', 
                        shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 3, stroke: true} }).setOrigin(0.5, 0.5);
        this.add.text(config.width/2, 230, 'Press SPACE to start', { fill: '#000000', fontSize: '10px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);

        // Create platform
        gameState.platform = this.physics.add.staticGroup();
        for (let i = 0; i < 26; i++) {
            let xCor = i * 60;
            gameState.platform.create(xCor, config.height+10, 'assets', 'elements/Platform.png').setScale(.5).setOrigin(0,1).refreshBody().setOffset(0,10);
        }

        // Create player
        gameState.player = this.physics.add.sprite(config.width/2-10, 300, 'assets', 'player/Mario/Mario_Idle_02.png').setScale(.5);
        gameState.player.flipX = true;
        this.physics.add.collider(gameState.player, gameState.platform);
        gameState.player.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, config.width, config.height);

        // Create animations
        this.createAnims();
        gameState.player.anims.play('marioIdle', true);

        // Keys to control player
        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Mario walks or stands
        if (gameState.cursors.right.isDown) {
            gameState.player.flipX = true;
            gameState.player.setVelocityX(300);
            gameState.player.anims.play('marioWalk', true);
        } else if (gameState.cursors.left.isDown) {
            gameState.player.flipX = false;
            gameState.player.setVelocityX(-300);
            gameState.player.anims.play('marioWalk', true);
        } else {
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('marioIdle', true);   
        }

        // Press space to start
        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
            gameState.player.setVelocityY(gameState.ySpeed);
            const goSound = this.sound.add('marioGo').setDetune(100);
            goSound.play();
            this.cameras.main.fade(800, 255, 255, 255, false, (camera, progress) => {
                if (progress > 0.9) {
                    this.scene.start('Level1');
                }
            });
        } 
        
        // Mario jumps
        if (gameState.player.body.velocity.y < 0) {
            gameState.player.anims.play('marioJump', true);
            gameState.bgMusic.stop();
        }
    }

    createAnims() {
        // Mario stands by
        const marioIdleFrame = this.anims.generateFrameNames('assets', {
            start: 2,
            end: 4,
            zeroPad: 2,
            prefix: 'player/Mario/Mario_Idle_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'marioIdle',
            frames: marioIdleFrame,
            frameRate: 5,
            repeat: -1
        });

        // Mario walks
        const marioWalkFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'player/Mario/Mario_WalkBig_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'marioWalk',
            frames: marioWalkFrame,
            frameRate: 5,
            repeat: -1
        });
                
        // Mario jumps
        const marioJumpFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 1,
            zeroPad: 2,
            prefix: 'player/Mario/Mario_Jump_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'marioJump',
            frames: marioJumpFrame,
            frameRate: 5,
            repeat: -1
        });
    }
}