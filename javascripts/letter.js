class Letter extends Phaser.Scene {
    constructor() {
        super({ key: "Letter" });
    }

    preload() {
        this.load.image('bgLetter', '../images/Background_Letter.jpg');
        this.load.multiatlas('assets', '../images/assets.json', 'images');
        this.load.audio('marioWin', '../sounds/marioWin.mp3');
        this.load.audio('theLetter', '../sounds/theLetter.mp3');
        this.load.audio('theOptions', '../sounds/theOptions.mp3');
        this.load.audio('marioJumpSound', '../sounds/marioJump.mp3');
        this.load.audio('click', '../sounds/click.mp3');
        this.load.audio('marioGo', '../sounds/marioLetsgo.mp3');
    }

    create() {
        // Reset letter status
        gameState.active = false;

        // Create background
        gameState.background = this.add.image(0, 0, 'bgLetter').setOrigin(0,0).setScale(1.06);
        this.cameras.main.fadeIn(500, 0);
        
        // Create congratulation scene and music
        const madeIt = this.add.text(config.width/2, 200, 'YOU MADE IT !!', { fill: '#fff', fontSize: '36px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);
        const marioWin = this.sound.add('marioWin');
        marioWin.play();

        // Create animations
        this.createAnims();

        // Create Mario
        gameState.mario = this.physics.add.sprite(0, 0, 'assets', 'player/Mario/Mario_WalkBig_01.png').setScale(.5);
        gameState.mario.flipX = true;
        gameState.mario.setVelocityX(300);
        gameState.mario.setCollideWorldBounds(true);
        gameState.mario.setBounce(1,1);

        // Create caps
        gameState.caps = this.physics.add.group(); 
        gameState.capThrow = this.time.addEvent({
            delay: 100,
            callback: () => {this.throw(gameState.caps, 'elements/Cap.png', 0.05)},
            callbackScope: this,
            loop: true
        })

        // Create diplomas
        gameState.diplomas = this.physics.add.group();
        gameState.diplomasThrow = this.time.addEvent({
            delay: 200,
            callback: () => {this.throw(gameState.diplomas, 'elements/Diploma.png', 0.05)},
            callbackScope: this,
            loop: true
        })

        // Create key controls
        gameState.cursors = this.input.keyboard.createCursorKeys();

        // Create the letter
        gameState.theLetterMusic = this.sound.add('theLetter');
        gameState.theWords = "To My Dear Brother,\n\n\n" + 
                            "Congratulations!!\n\n" + 
                            "You\'ve made through all the tough schoolworks!!\n\n" +
                            "GREAT JOB \\ > w < / \n\n" +
                            "Now you\'re finally FREE!!! XDD\n\n" + 
                            "Even though the works you\'ll encounter in the future are going to be much tougher,\n\n" +
                            "it also means you\'ll learn much more than what school could give you.\n\n" + 
                            "Isn\'t that great? And you\'ll get money as well!! www\n\n" + 
                            "Anyway, since now you are finally free, feel no fear or constraint to achieve what you want!! :)\n\n" + 
                            "Oh, and of course it doesn't have to be right now.\n\n" +
                            "Just take your time, have a good, long ~ rest (since you finally don't need to worry about school XD ).\n\n" +
                            "And then you can go on and chase your goal!\n\n" +
                            "I wish that someday you will find the job that could give you the sense of accomplishment and happiness :)\n\n\n\n" +
                            "Btw, sorry for giving you the present this late T^T\n\n" +
                            "This is my first time coding game and it took much longer than I thought.\n\n" +
                            "It\'s really not that easy to make it work like Nintendo\'s real game XD\"\n\n" +
                            "Anyway, I hope you like the mini game I made :)\n\n\n\n" +
                            "Once again,\n\n\n" +
                            "     Congratulations on Your Graduation !!\n\n\n" + 
                            "And also,\n\n\n" +
                            "            HAPPY BIRTHDAY <3\n\n\n\n\n" +
                            "Love,\n\n" +
                            "your sister Angela\n\n" +
                            "2020.05.03";

        // Stop animations when music stops
        marioWin.once('complete', () => {
            madeIt.destroy();
            gameState.mario.setBounce(0, 0);
            gameState.diplomasThrow.remove();
            gameState.capThrow.remove();
            
            // Show the letter and play letter song
            this.showLetter();
        });

        // Setup world boundary and camera
        this.physics.world.setBounds(-config.width * 0.25, 0, config.width * 1.5, config.height * 1.5);
        this.cameras.main.setBounds(-config.width * 0.25, 0, config.width * 1.5, config.height * 1.5);

        /* IDEA */
        // Follow mario jumping down / walking through the screen when presenting the credits lines
        // this.cameras.main.setBounds(0, 0, config.width * 2, config.height);
        // this.cameras.main.startFollow(gameState.mario, true, 0.5, 0.5);
    }

    update() {        
        // Mario turns around
        if (gameState.mario.body.velocity.x >= 0) {
            gameState.mario.flipX = true;
            gameState.mario.anims.play('marioWalk', true);
        } else {
            gameState.mario.flipX = false;
            gameState.mario.anims.play('marioWalk', true);
        }

        // Mario jumps
        if (gameState.mario.body.velocity.y < 0) {
            gameState.mario.anims.play('marioJump', true);
        }

        // Mario2 walks
        if (gameState.active) {
            if (gameState.cursors.right.isDown) {
                gameState.mario2.flipX = true;
                gameState.mario2.setVelocityX(300);
                gameState.mario2.anims.play('marioWalk', true);
            } else if (gameState.cursors.left.isDown) {
                gameState.mario2.flipX = false;
                gameState.mario2.setVelocityX(-300);
                gameState.mario2.anims.play('marioWalk', true);
            } else {
                gameState.mario2.setVelocityX(0);
                gameState.mario2.anims.play('marioIdle', true);   
            }
            
            // Mario2 jumps
            if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.mario2.body.touching.down) {
                gameState.mario2.setVelocityY(-650);
                this.sound.play('marioJumpSound', { volume: 0.1 });
            } 
            if (gameState.mario2.body.velocity.y < 0) {
                gameState.mario2.anims.play('marioJump', true);
            }            
        }

        // Options enlarge
        if (gameState.active) {
            
            // Option1: letter
            if (gameState.mario2.x < gameState.option1sticker.x + 170 &&
                gameState.mario2.x > gameState.option1sticker.x - 170) {
                gameState.option1sticker.setScale(.75);
                if (gameState.marioIn !== 1) {
                    this.sound.play('click', { volume: 2 });
                    gameState.marioIn = 1;
                }
            } else {
                gameState.option1sticker.setScale(.55);
            }

            // Option2: mushroom
            if (gameState.mario2.x < gameState.option2sticker.x + 150 &&
                gameState.mario2.x > gameState.option2sticker.x - 150) {
                gameState.option2sticker.setScale(.2);
                if (gameState.marioIn !== 2) {
                    this.sound.play('click', { volume: 2 });
                    gameState.marioIn = 2;
                }
            } else {
                gameState.option2sticker.setScale(.15);
            }
        }
    }

    getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
      }

    throw(group, fileKey, scale) {
        const xCor = Math.random() * ((config.width - (-config.width)) + (-config.width));
        const item = group.create(xCor, config.height, 'assets', fileKey).setScale(scale);
        item.body.setVelocityX(this.getRandom(100, -100));
        item.body.setVelocityY(this.getRandom(-400, -550));
        item.body.velocity.x >= 0 ? item.flipX = false : item.flipX = true;
        let randomAngle = 0;
        item.body.velocity.x >= 0 ?  randomAngle = this.getRandom(180, 90) : randomAngle = this.getRandom(-90, -180);
        this.tweens.add({
            targets: item,
            angle: randomAngle,
            ease: 'Linear',
            duraiton: 100
        });
    }

    showLetter() {
        gameState.active = false;
        gameState.theLetterMusic.play();
        gameState.theLetter = this.add.text(config.width/2, config.height, gameState.theWords, { fill: '#fff', fontSize: '14px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0);
        gameState.theLetter.setWordWrapWidth(config.width - 80);
        gameState.theLetter.setLineSpacing(5);
        this.tweens.add({
            targets: gameState.theLetter,
            y: -config.height * 2.5,
            duration: 60000, // original: 60000
            delay: 800,
            ease: 'Linear',
            onComplete: () => { 
                
                // Fadeout to next scene
                this.tweens.add({
                    targets: [gameState.theLetter, gameState.background],
                    alpha: 0,
                    delay: 1000,
                    duration: 1500,
                    ease: 'Linear',
                    onComplete: () => {
                        
                        // Create options
                        this.time.addEvent({
                            delay: 800,
                            callback: () => {
                                // gameState.optionMusic = this.sound.add('');
                                const optionBg = this.sound.add('theOptions');
                                optionBg.play({ loop: true });
                                gameState.thanks = this.add.text(config.width / 2, config.height / 2, 'Thank You for Playing!', { fill: '#fff', fontSize: '16px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);
                                gameState.option1sticker = this.physics.add.sprite(config.width / 4, config.height * 1.5 - 30, 'assets', 'elements/Letter.png').setScale(.55).setOrigin(0.5, 0.5);
                                gameState.option2sticker = this.physics.add.sprite(config.width * 3 / 4, config.height * 1.5 - 30, 'assets', 'elements/Mushroom.png').setScale(.15).setOrigin(0.5, 0.5);
                                gameState.option1text = this.add.text(config.width / 4, config.height * 1.5 + 30, 'Read letter again <3', { fill: '#fff', fontSize: '10px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);
                                gameState.option2text = this.add.text(config.width * 3 / 4, config.height * 1.5 + 30, 'Play again!', { fill: '#fff', fontSize: '10px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5, 0.5);
                                gameState.option1sticker.body.moves = false;
                                gameState.option2sticker.body.moves = false;
                                gameState.marioIn = 0;
                                
                                // Create player
                                gameState.mario2 = this.physics.add.sprite(config.width / 2, config.height * 1.9, 'assets', 'player/Mario/Mario_Idle_01.png').setScale(.3).setOrigin(0.5, 1);
                                gameState.mario2.body.moves = false;
                                gameState.mario2.flipX = true;

                                // Show options
                                this.tweens.add({
                                    targets: [gameState.thanks, gameState.mario2,
                                                gameState.option1sticker, gameState.option1text,
                                                gameState.option2sticker, gameState.option2text],
                                    y: `-=${config.height}`,
                                    delay: 1000,
                                    duration: 1500,
                                    ease: 'Linear',
                                    onComplete: () => {
                                        gameState.grounds = this.physics.add.staticGroup();
                                        gameState.ground = gameState.grounds.create(config.width / 2, config.height, 'assets', 'elements/Platform.png').setScale(10).setOrigin(0.5, 0).refreshBody();
                                        gameState.ground.setAlpha(0);
                                        this.physics.resume();
                                        gameState.active = true;
                                        gameState.mario2.body.moves = true;                                        
                                        gameState.mario2.setCollideWorldBounds(true);
                                        this.physics.add.collider(gameState.mario2, gameState.ground);
                                        
                                        // Option1: read letter again
                                        this.physics.add.overlap(gameState.mario2, gameState.option1sticker, () => {
                                            this.sound.play('marioGo');
                                            optionBg.stop();
                                            this.physics.pause();
                                            this.cameras.main.fade(1200, 0);
                                            this.cameras.main.once('camerafadeoutcomplete', () => {
                                                const fadeList = [gameState.mario2,
                                                    gameState.option1sticker, gameState.option1text,
                                                    gameState.option2sticker, gameState.option2text];
                                                fadeList.forEach(element => {
                                                    gameState.active = false;
                                                    element.destroy();
                                                });
                                                gameState.background.setAlpha(1);                                                
                                                this.cameras.main.fadeIn(800, 0);
                                                this.cameras.main.once('camerafadeincomplete', () => this.showLetter());
                                            });
                                        });
                                        
                                        // Option2: play again
                                        this.physics.add.overlap(gameState.mario2, gameState.option2sticker, () => {
                                            this.sound.play('marioGo');
                                            this.physics.pause();
                                            this.cameras.main.fade(1200, 0);
                                            this.cameras.main.once('camerafadeoutcomplete', () => {
                                                window.location.reload(true);
                                            })
                                        });
                                    }
                                })
                            },
                            callbackScope: this,
                            loop: false
                        })
                    }
                })            
            }
        });
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