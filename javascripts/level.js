class Level extends Phaser.Scene {
    constructor(key) {
        super({key});
        this.levelKey = key;
        this.nextLevel = {
          'Level1': 'Level2',
          'Level2': 'Level3',
          'Level3': 'Level4',
          'Level4': 'Letter'
        };
    }

    // preload() {
    //     this.load.image('bgLevel', '../images/Background_Level.png');
    //     this.load.multiatlas('assets', '../images/assets.json', 'images');
    //     this.load.audio('bgStart', '../sounds/bgStart.mp3');
    //     this.load.audio('marioGo', '../sounds/marioLetsgo.mp3');
    //     this.load.audio('bgLevel1', '../sounds/bgLevel1.mp3');
    //     this.load.audio('bgLevel2', '../sounds/bgLevel2.mp3');
    //     this.load.audio('bgLevel3', '../sounds/bgLevel3.mp3');
    //     this.load.audio('bgLevel4', '../sounds/bgLevel4.mp3');
    //     this.load.audio('marioJumpSound', '../sounds/marioJump.mp3');
    //     this.load.audio('marioUpgrade', '../sounds/marioUpgrade.mp3');
    //     this.load.audio('marioFireSound', '../sounds/marioFire.mp3');
    //     this.load.audio('marioHit', '../sounds/marioHit.mp3');
    //     this.load.audio('marioFailSound', '../sounds/marioFail.mp3');
    //     this.load.audio('pipeSound', '../sounds/pipeSound.mp3');
    //     this.load.audio('marioKick', '../sounds/marioKick.mp3');
    //     this.load.audio('bowserFire', '../sounds/bowserFire.mp3');
    //     this.load.audio('bowserHitSound', '../sounds/bowserHit.mp3');
    //     this.load.audio('bowserFailSound', '../sounds/bowserFail.mp3');
    //     this.load.audio('goSound', '../sounds/goSound.mp3');
    // }
    
    create() {
        // Reset game status
        gameState.active = true;
        gameState.pipeSound = 0;
        gameState.hitSound = 0;
        gameState.failSound = 0;
        console.log(gameState);
        
        // Create background music
        this.time.addEvent({
            delay: 500,
            callback: () => {
                switch(this.levelKey) {
                    case 'Level1':
                        gameState.bgMusic = this.sound.add('bgLevel1', { volume: 0.8 });
                        gameState.bgMusic.play({ loop: true });
                        break;
        
                    case 'Level2':
                        gameState.bgMusic = this.sound.add('bgLevel2', { volume: 0.8 });
                        gameState.bgMusic.play({ loop: true });        
                        break;
                        
                    case 'Level3':
                        gameState.bgMusic = this.sound.add('bgLevel3', { volume: 0.8 });
                        gameState.bgMusic.play({ loop: true });        
                        break;
        
                    case 'Level4':
                        gameState.bgMusic = this.sound.add('bgLevel4');
                        gameState.bgMusic.play({ loop: true });
                        break;
                }
            },
            scope: this,
            loop: false
        })        

        // Create background and title
        gameState.bg = this.add.image(0, 0, 'bgLevel').setOrigin(0, 0).setScale(.8).setScrollFactor(0);
        gameState.sign = this.physics.add.image(100, 360, 'assets', 'background/Sign_01.png');
        gameState.sign.body.moves = false;
        switch (this.levelKey) {
            case 'Level1':
                gameState.bubble = this.add.image(98, 288, 'assets', 'background/Bubble_01.png').setScale(.1);
                gameState.bubble.setAlpha(0);
                this.add.text(20, 20, 'STAGE 2016-17', { fill: '#000', fontSize: '16px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0, 0).setScrollFactor(0);
                break;

            case 'Level2':
                gameState.bubble = this.add.image(98, 288, 'assets', 'background/Bubble_02.png').setScale(.1);
                gameState.bubble.setAlpha(0);
                this.add.text(20, 20, 'STAGE 2017-18', { fill: '#000', fontSize: '16px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0, 0).setScrollFactor(0);
                break;

            case 'Level3':
                gameState.bubble = this.add.image(98, 288, 'assets', 'background/Bubble_03.png').setScale(.1);
                gameState.bubble.setAlpha(0);
                this.add.text(20, 20, 'STAGE 2018-19', { fill: '#000', fontSize: '16px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0, 0).setScrollFactor(0);
                break; 
            
            case 'Level4':
                gameState.sign.destroy();
                gameState.bg.setTint(0xe05104);
                this.add.text(20, 20, 'STAGE 2019-20', { fill: '#000', fontSize: '16px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0, 0).setScrollFactor(0);
                break;
        }

        // Create platform
        gameState.platform = this.physics.add.staticGroup();
        for (let i = 0; i < 26; i++) {
            let xCor = i * 60;
            gameState.platform.create(xCor, config.height+10, 'assets', 'elements/Platform.png').setScale(.5).setOrigin(0,1).refreshBody().setOffset(0,10);
        }
        
        // Create walls outside screen
        gameState.platform.create(0, config.height, 'assets', 'elements/Platform.png').setScale(5).setOrigin(1,1).refreshBody(); 
        gameState.platform.create(config.width * 2, config.height, 'assets', 'elements/Platform.png').setScale(5).setOrigin(0,1).refreshBody(); 

        // Create levels
        gameState.brick = this.physics.add.staticGroup();
        gameState.woodbox = this.physics.add.staticGroup();
        gameState.pipe = this.physics.add.staticGroup();
        this.setLevels(gameState.brick, this.brickHeight, 'elements/Block_Brick.png', 0.2);
        this.setLevels(gameState.woodbox, this.wboxHeight, 'elements/Crate.png', 0.505);
        this.setLevels(gameState.pipe, this.pipeHeight, 'elements/Pipe.png', 0.4);

        // Create animations
        this.createAnims();

        // Create player
        gameState.player = this.physics.add.sprite(100, 300, 'assets', 'player/Mario/Mario_Idle_02.png').setScale(gameState.marioScale);
        gameState.player.flipX = true;
        gameState.onGround = this.physics.add.collider(gameState.player, gameState.platform);
        gameState.onBrick = this.physics.add.collider(gameState.player, gameState.brick);
        gameState.onWoodbox = this.physics.add.collider(gameState.player, gameState.woodbox);
        gameState.onPipe = this.physics.add.collider(gameState.player, gameState.pipe);

        // Player watches sign
        this.physics.add.overlap(gameState.player, gameState.sign, () => gameState.showSign = true);

        // Player key control
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.fireKey = this.input.keyboard.addKey('F');
        gameState.fireKey.enabled = gameState.fireEnable;
        console.log(`fireKey: ${gameState.fireEnable}`);
        
        // Create gifts (behind question box)
        if (this.gift !== null) {
            gameState.gift = this.physics.add.sprite(190, 209,'assets', this.gift).setOrigin(-0.05,-0.05).setScale(.1);
            gameState.gift.body.enable = false;
        }

        // Create quesiton box
        gameState.ques = this.physics.add.group();
        for (const [ xIndex, yIndex ] of this.quesHeight.entries()) {
            if (yIndex !== null) {
                yIndex.forEach(h => {
                    const qBox = gameState.ques.create(xIndex * 38,  h * 38, 'assets', 'elements/Block_Question.png').setScale(0.064).setOrigin(0,0);
                    qBox.body.allowGravity = false;
                    qBox.body.immovable = true;
                })
            }
        }

        // Player hits question box
        let hit = 0;
        gameState.onQues = this.physics.add.collider(gameState.player, gameState.ques, (player, box) => {
            
            // Question box jumps
            if (gameState.player.body.touching.up) {
                this.tweens.add({
                    targets: box,
                    duration: 50,
                    y: '-= 3',
                    ease: 'Linear',
                    yoyo: true,
                    repeat: 0,
                    // onStart: () => {this.sound.play('goSound')} // play coin sound ww
                })
            }
            
            // Gift pops out of question box
            if (hit === 0) {
                gameState.gift.y -= 35;
                gameState.gift.body.enable = true;
                gameState.gift.setVelocityY(-250);
                gameState.gift.setVelocityX(-50);
                this.physics.add.collider(gameState.gift, gameState.brick);
                this.physics.add.collider(gameState.gift, gameState.ques);
                this.physics.add.collider(gameState.gift, gameState.platform);
                hit++;
            }

            // Player upgrades
            this.physics.add.overlap(gameState.player, gameState.gift, () => {
                this.sound.play('marioUpgrade');
                gameState.gift.destroy();
                gameState.marioScale = 0.4;
                gameState.player.setScale(gameState.marioScale);
                gameState.ySpeed = -650;
                gameState.player.setVelocityY(-400);
                console.log(gameState);
                if (this.gift === 'elements/Fireflower.png') {
                    gameState.fireEnable = true;
                    gameState.fireKey.enabled = true;
                    console.log(`fireKey: ${gameState.fireEnable}`);
                    console.log(gameState);
                }
            })
        });

        // Player attacks
        gameState.fireball = this.physics.add.group();        
        gameState.fireKey.on('down', () => {                        
            this.sound.play('marioFireSound', { volume: 2 });
            let xCor;
            gameState.player.flipX ? xCor = gameState.player.x + 10 : xCor = gameState.player.x - 10;
            const fire = gameState.fireball.create(gameState.player.x, gameState.player.y, 'assets', 'elements/Fireball.png').setScale(.05);
            fire.bounce = 0;
            gameState.player.flipX ? fire.body.setVelocityX(600) : fire.body.setVelocityX(-600);
            this.physics.add.collider(fire, gameState.brick, () => fire.bounce++);
            this.physics.add.collider(fire, gameState.ques, () => fire.bounce++);
            this.physics.add.collider(fire, gameState.woodbox, () => fire.bounce++);
            this.physics.add.collider(fire, gameState.pipe, () => fire.bounce++);
            this.physics.add.collider(fire, gameState.platform, () => fire.bounce++);
            fire.body.setBounce(1,1);
        }) 

        // Create enemies
        this.createEnemies(this.enemies);

        // Eemies attack
        if (this.levelKey === 'Level3') {

            // pp attacks
            gameState.ppFireball = this.physics.add.group();
            gameState.ppFire.getChildren().forEach(ppKid => {
                gameState.ppFireAttack = this.time.addEvent({
                    delay: 1200,
                    callback: () => {
                        const weapon = gameState.ppFireball.create(ppKid.x-30, ppKid.y, 'assets', 'elements/Lava.png').setScale(.2);
                        weapon.body.setVelocityX(-350);
                        weapon.body.setVelocityY(-200);
                        this.physics.add.collider(weapon, gameState.player, () => this.levelFail());
                    },
                    callbackScope: this,
                    loop: true
                });    
            })

            // Hammer Bro attacks
            gameState.hbroAxes = this.physics.add.group();
            gameState.hbro.getChildren().forEach(hbroKid => {
                gameState.hbroAxeAttack = this.time.addEvent({
                    delay: 990,
                    callback: () => {
                        const weapon = gameState.hbroAxes.create(hbroKid.x-20, hbroKid.y-10, 'assets', 'elements/Axe.png').setScale(0.5);
                        weapon.body.setVelocityX(-200);
                        weapon.body.setVelocityY(-300);
                        this.physics.add.collider(weapon, gameState.player, () => this.levelFail());
                    },
                    callbackScope: this,
                    loop: true
                });    
            })
        }
        

        // Final Stage: Bowser
        if (this.levelKey === 'Level4') {
            
            // Reset Bowser HP
            gameState.bowserHP = 10000;
            
            // Show Bowser HP
            gameState.HPtext = this.add.text(config.width - 20, 20, 'BOSS: 10000 HP', { fill: '#000', fontSize: '16px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(1, 0).setScrollFactor(0);

            // Create Bowser
            gameState.bowser = this.physics.add.sprite(config.width, 300, 'assets', 'enemies/Bowser/Bowser_Walk_01.png').setScale(.5);
            gameState.bowser.anims.play('bowserWalk', true);
            gameState.bowser.body.moves = false;

            // Player touches Bowser
            this.physics.add.collider(gameState.bowser, gameState.player, () => {
                gameState.fireball.destroy();
                this.levelFail();
            });

            // Bowser attacks
            gameState.bowserFires = this.physics.add.group();
            gameState.bowserFireAttack = this.time.addEvent({
                delay: 600,
                callback: () => {
                    this.sound.play('bowserFire');
                    let xCor = gameState.bowser.x;
                    gameState.bowser.flipX ? xCor += 80 : xCor -= 80;
                    const weapon = gameState.bowserFires.create(xCor, gameState.bowser.y, 'assets', 'elements/Lava.png').setScale(0.3);
                    let xSpeed = 600;
                    let ySpeed = this.getRandom(-800, 300);
                    // let ySpeed = Math.floor(Math.random() * (300 - (-800) + 1)) + (-800)
                    gameState.bowser.flipX ? weapon.body.setVelocityX(xSpeed) : weapon.body.setVelocityX(-xSpeed);
                    weapon.body.setVelocityY(ySpeed);
                    weapon.body.allowGravity = false;
                    gameState.bowserHitMario = this.physics.add.collider(weapon, gameState.player, () => this.levelFail());
                },
                callbackScope: this,
                loop: true
            });

            // Bowser got hit
            const bowserGotHit = this.physics.add.collider(gameState.bowser, gameState.fireball, (bowser, fireball) => {
                fireball.destroy();
                if (gameState.bowserHP > 250) {
                    this.sound.play('bowserHitSound');
                    gameState.bowserHP -= 250;
                    gameState.bowserHit = true; // play hit/walk anims in update()
                    gameState.HPtext.setText(`BOSS: ${gameState.bowserHP} HP`);
                } else {
                    
                    // Bowser falls
                    this.physics.world.removeCollider(bowserGotHit);
                    gameState.bowser.body.moves = true;
                    gameState.bowser.setVelocityY(-200);
                    gameState.bowser.flipX ? gameState.bowser.setVelocityX(-300) : gameState.bowser.setVelocityX(300);
                    gameState.bowser.anims.play('bowserFail', true);
                    gameState.bowserFireAttack.destroy();
                    this.physics.world.removeCollider(gameState.bowserHitMario);

                    // Bowser falling sound
                    gameState.bowserFailSound = this.sound.add('bowserFailSound', { volume: 10, loop: false });
                    gameState.bowserFailSound.play();
                    if (gameState.active) {  // debug if Mario and Bowser fail at same time
                        gameState.bowserFailSound.once('complete', () => {
                            gameState.bgMusic.stop();
                            gameState.bgMusic = this.sound.add('bgLevel1', { volume: 0.8 });
                            gameState.bgMusic.play({ loop: true });
                        });
                    }
                    
                    // Background changes
                    gameState.bowserHP = 0;
                    gameState.HPtext.setText(`BOSS: 0 HP`);
                    this.cameras.main.fadeOut(2000, 0);
                    this.cameras.main.once('camerafadeoutcomplete', camera => {
                        gameState.bg.clearTint();
                        camera.fadeIn(1500, 265);
                        this.goGo();
                    });
                }
                console.log('Bowser HP: ' + gameState.bowserHP)
            })            
        }

        // Create barrier ontop exit
        gameState.ExitTop = this.physics.add.staticGroup();
        gameState.ExitTop.create(config.width*2-70, 290, 'assets', 'elements/ExitTop.png').setAlpha(0).setSize(20,5);
        gameState.ExitTop.create(config.width*2+45, 300, 'assets', 'elements/ExitTop.png').setAlpha(0);
        this.physics.add.collider(gameState.player, gameState.ExitTop);

        // Create exit
        gameState.exit = this.physics.add.staticGroup();
        gameState.exit.create(config.width * 2 - 30, 350, 'assets', 'elements/Exit.png').setScale(.7).setSize(30,30).setOffset(100,100);
        this.physics.add.overlap(gameState.player, gameState.exit, () => {            
            gameState.bgMusic.stop();
            if (gameState.pipeSound === 0) {
                this.sound.play('pipeSound');
                gameState.pipeSound++;
            }
            this.cameras.main.fade(800, 0, 0, 0, false, (camera, progress) => {
                if (progress > 0.9) {
                    console.log(gameState);
                    this.scene.start(this.nextLevel[this.levelKey]);
                }
            });
        })

        // Setup world boundary and camera
        this.cameras.main.setBounds(0, 0, config.width * 2, config.height);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);
        this.cameras.main.fadeIn(800, 255, 255, 255);
        this.physics.world.setBounds(0, 0, config.width * 2, config.height);
    };

    update() {
        if (gameState.active) {
            // Mario watches sign
            if (gameState.showSign) {
                gameState.bubble.setAlpha(1);
                gameState.showSign = false;
            } else {
                gameState.bubble.setAlpha(0);
            }
            
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

            // Mario jumps up
            if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
                gameState.player.setVelocityY(gameState.ySpeed);
                this.sound.play('marioJumpSound', { volume: 0.1 });
            } 
            if (gameState.player.body.velocity.y < 0) {
                gameState.player.anims.play('marioJump', true);
            }

            // Mario out of screen
            if (gameState.player.y > config.height) {
                    this.levelFail();
            }

            // Fireball spins & vanishes
            gameState.fireball.getChildren().forEach(fire => {
                fire.angle += 20;
                if (fire.bounce > 3) {
                    fire.destroy();
                }
            })
            
            // Enemy weapon spins
            if (this.levelKey === 'Level3') {
                const spinList = [gameState.ppFireball, gameState.hbroAxes];
                spinList.forEach(group => {
                    group.getChildren().forEach(weapon => {
                        weapon.angle -= 10;
                        if (weapon.y > config.height) {
                            weapon.destroy();
                        }
                    })
                })
            }
            
            // Enemy walks
            const walkList = [{key: 'goomba', group: gameState.goomba},
                                {key: 'buzzy', group: gameState.buzzy},
                                {key: 'koopa', group: gameState.koopa},
                                {key: 'pt', group: gameState.pt}];
            const enemyWalks = walkList.filter(enemy => this.enemies.includes(enemy.key));
            enemyWalks.forEach(enemy => this.enemyTurn(enemy.group));

            // Final Stage setup
            if (this.levelKey === 'Level4') {
                
                // Bowser turns around
                gameState.player.x >= gameState.bowser.x ? gameState.bowser.flipX = true : gameState.bowser.flipX = false;
                
                // Bowser fire spins
                gameState.bowserFires.getChildren().forEach(weapon => {
                    weapon.angle -= 10;
                    if (weapon.y > config.height) {
                        weapon.destroy();
                    }
                })

                // Bowser hits or walks
                if (gameState.bowserHP > 0) {
                    if (gameState.bowserHit) {
                        gameState.bowser.anims.play('bowserHit', true);
                        this.time.addEvent({
                            delay: 150,
                            callback: () => { gameState.bowserHit = false; },
                            scope: this,
                            loop: false
                        })
                    } else {
                        gameState.bowser.anims.play('bowserWalk', true);
                    }
                }
            }
                /* TEST: Enemy turns to where player is */
                /* TEST: make all enemies stop attacking after failing */
        }
    }

    getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
      }
    
    goGo() {
        const goText = this.add.text(config.width - 20, config.height / 2, 'GO>', { fill: '#000', fontSize: '32px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(1, 0.5).setScrollFactor(0);
        goText.setAlpha(0);
        this.tweens.add({
            targets: goText,
            delay: 2000,
            duration: 200,
            ease: 'Linear',
            alpha: 1,
            repeat: 2,
            repeatDelay: 500,
            yoyo: true,
            onStart: () => {this.sound.play('goSound')},
            onRepeat: () => {this.sound.play('goSound')},
            onComplete: () => goText.destroy()
        });
    }


    setLevels(element, placeList, fileKey, scale) {
        for (const [ xIndex, yIndex ] of placeList.entries()) {
            if (yIndex !== null) {
                yIndex.forEach(h => {
                    element.create(xIndex * 38,  h * 38, 'assets', fileKey).setScale(scale).setOrigin(0,0).refreshBody();
                })
            }
        }                
    }
    
    setEnemy(spriteGroup, placeList, fileKey, scale, flip, speed, animKey, failKey) {
        placeList.forEach(place => {
            const enemy = spriteGroup.create(place.x, place.y, 'assets', fileKey).setScale(scale);
            enemy.flipX = flip;
            enemy.place = place.x;
            enemy.body.setVelocityX(speed);
            enemy.anims.play(animKey, true);
            const enemyOnGround = this.physics.add.collider(enemy, gameState.platform);
            const enemyOnBrick = this.physics.add.collider(enemy, gameState.brick);
            const enemyOnQues = this.physics.add.collider(enemy, gameState.ques);
            const enemyOnWoodbox = this.physics.add.collider(enemy, gameState.woodbox);
            const enemyOnPipe = this.physics.add.collider(enemy, gameState.pipe);
            
            // Fireball hits enemy
            this.physics.add.collider(enemy, gameState.fireball, (enemy, fireball) => {
                this.sound.play('marioKick', { volume: 2 });
                fireball.destroy();
                if (spriteGroup === gameState.ppFire) {
                    enemy.body.moves = true;
                }
                this.fail(enemy, failKey, enemyOnGround, enemyOnBrick, enemyOnWoodbox, enemyOnPipe, enemyOnQues);
                /* TEST: stop enemy keep attacking after felling */
                /* TEST: destroy enemy after felling off */
            });

            // Player touches enemy
            gameState.playerTouch = this.physics.add.collider(enemy, gameState.player, () => this.levelFail());
        })
    }

    createEnemies(enemyList) {
        enemyList.forEach(enemy => {
            switch(enemy) {
                case 'goomba':
                    gameState.goomba = this.physics.add.group();
                    const goombaPlace = [{ x: 235, y: 100 }, { x: 1200, y: 300 }];
                    this.setEnemy(gameState.goomba, goombaPlace, 'enemies/Goomba/Goomba_Walk_01.png', 0.3, true, 80, 'goombaWalk', 'goombaFail');
                    break;

                case 'buzzy':
                    gameState.buzzy = this.physics.add.group();
                    const buzzyPlace = [{ x: 700, y: 300 }, { x: 800, y: 300 }, { x: 900, y: 300 }];
                    this.setEnemy(gameState.buzzy, buzzyPlace, 'enemies/Buzzy/Buzzy_Walk_01.png', 0.3, true, 80, 'buzzyWalk', 'buzzyFail');
                    break;
                
                case 'pp':
                    gameState.pp = this.physics.add.group();
                    const ppPlace = [{ x: 490, y: 320 }, { x: 1060, y: 320 }];
                    this.setEnemy(gameState.pp, ppPlace, 'enemies/PiranhaPlant/PiranhaPlant_Bite_01.png', 0.3, false, 0, 'ppBite', 'ppFail');
                    gameState.pp.getChildren().forEach(kid => kid.body.moves = false);
                    break;
                    
                case 'koopa':
                    gameState.koopa = this.physics.add.group();
                    const koopaPlace = [{ x: 300, y: 350 }, { x: 770, y: 100 }, { x: 1300, y: 100 }];
                    this.setEnemy(gameState.koopa, koopaPlace, 'enemies/KoopaTroopa/KoopaTroopa_Walk_01.png', 0.3, true, 80, 'koopaWalk', 'koopaFail');
                    break;
                    
                case 'pt':
                    gameState.pt = this.physics.add.group();
                    const ptPlace = [{ x: 500, y: 25 }, { x: 750, y: 300 }, { x: 900, y: 300 }];
                    this.setEnemy(gameState.pt, ptPlace, 'enemies/Ptooie/Ptooie_Walk_01.png', 0.3, true, 80, 'ptWalk', 'ptFail');
                    break;
                
                case 'ppFire':
                    gameState.ppFire = this.physics.add.group();
                    const ppFirePlace = [{ x: 460, y: 330 }, { x: 850, y: 330 }, { x: 1230, y: 330 }];
                    this.setEnemy(gameState.ppFire, ppFirePlace, 'enemies/PiranhaPlant/PiranhaPlant_Fire_01.png', 0.3, false, 0, 'ppFire', 'ppFail');
                    gameState.ppFire.getChildren().forEach(kid => kid.body.moves = false);
                    break;
                    
                case 'hbro':
                    gameState.hbro = this.physics.add.group();
                    const hbroPlace = [{ x: 530, y: 100 }, { x: 810, y: 25 }, { x: 1120, y: 150 }, { x: 1320, y: 25 }];
                    this.setEnemy(gameState.hbro, hbroPlace, 'enemies/HammerBro/HammerBro_Throw_01.png', 0.3, false, 0, 'hbroThrow', 'hbroFail');
                    break;                    
            }
        })
    }

    enemyTurn(spriteGroup) {
        spriteGroup.getChildren().forEach(enemy => {
            if (enemy.x - enemy.place > 50) {
                enemy.body.setVelocityX(-80);
                enemy.flipX = false;
            } else if (enemy.place - enemy.x > 50) {
                enemy.body.setVelocityX(80);
                enemy.flipX = true;
            }
        })
    }

    fail(failer, failKey, onGround, onBrick, onWoodbox, onPipe, onQues) {
        // gameState.active = false;
        failer.setVelocityY(-300);
        if (failer.body.touching.right) {
            failer.setVelocityX(-300);
        } else if (failer.body.touching.left) {
            failer.setVelocityX(300);
        }
        // failer.flipX ? failer.setVelocityX(-300) : failer.setVelocityX(300);
        failer.anims.play(failKey, true);
        this.physics.world.removeCollider(onGround);
        this.physics.world.removeCollider(onBrick);
        this.physics.world.removeCollider(onWoodbox);
        this.physics.world.removeCollider(onPipe);
        this.physics.world.removeCollider(onQues);
    }

    levelFail() {
        if (gameState.marioScale > 0.3) {
            /* BUG: fire would keep collide after player gets smaller
            // so player still fail soon even though they shoould have gotten one more chance
            gameState.player.setVelocityX(-500);
            gameState.player.setVelocityY(-500);*/
            if (gameState.hitSound === 0) {
                this.sound.play('marioHit', { volume: 3 });
                gameState.hitSound++;
            }
            this.cameras.main.shake(500, 0.01, true);
            gameState.player.flipX ? gameState.player.setVelocityX(-500) : gameState.player.setVelocityX(500);
            gameState.marioScale = 0.3;
            gameState.player.setScale(gameState.marioScale);
        } else {
            if (gameState.failSound === 0) {
                this.sound.play('marioFailSound', { volume: 3 });
                gameState.failSound++;
            }
            gameState.bgMusic.stop();
            this.cameras.main.shake(500, 0.01, true);
            this.cameras.main.fadeOut(1800, 0);
            gameState.active = false;
            gameState.marioScale = 0.3;
            gameState.ySpeed = -500;
            gameState.fireEnable = false;
            gameState.fireKey.enabled = false;            
            this.fail(gameState.player, 'marioFail', gameState.onGround, gameState.onBrick, gameState.onWoodbox, gameState.onPipe, gameState.onQues);
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.scene.restart();
                },
                scope: this,
                loop: false
            })
            console.log(gameState);
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

        // Mario fails
        const marioFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'player/Mario/Mario_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'marioFail',
            frames: marioFailFrame,
            frameRate: 5,
            repeat: -1
        });

        /*
        // Mario fires
        const marioFireFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'player/FireMario/FireMario_Fire_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'marioFire',
            frames: marioFireFrame,
            frameRate: 5,
            repeat: 1
        });
        */

        // Goomba walks
        const goombaWalkFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'enemies/Goomba/Goomba_Walk_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'goombaWalk',
            frames: goombaWalkFrame,
            frameRate: 5,
            repeat: -1
        });

        // Goomba fails
        const goombaFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'enemies/Goomba/Goomba_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'goombaFail',
            frames: goombaFailFrame,
            frameRate: 5,
            repeat: -1
        });

        // Buzzy walks
        const buzzyWalkFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'enemies/Buzzy/Buzzy_Walk_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'buzzyWalk',
            frames: buzzyWalkFrame,
            frameRate: 5,
            repeat: -1
        });

        // Buzzy fails
        const buzzyFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'enemies/Buzzy/Buzzy_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'buzzyFail',
            frames: buzzyFailFrame,
            frameRate: 5,
            repeat: -1
        });
        
        // Piranha Plant bites
        const ppBiteFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'enemies/PiranhaPlant/PiranhaPlant_Bite_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'ppBite',
            frames: ppBiteFrame,
            frameRate: 5,
            repeat: -1
        });

        // Piranha Plant fires
        const ppFireFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 2,
            zeroPad: 2,
            prefix: 'enemies/PiranhaPlant/PiranhaPlant_Fire_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'ppFire',
            frames: ppFireFrame,
            frameRate: 5,
            repeat: -1
        });

        // Piranha Plant fails
        const ppFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 2,
            zeroPad: 2,
            prefix: 'enemies/PiranhaPlant/PiranhaPlant_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'ppFail',
            frames: ppFailFrame,
            frameRate: 5,
            repeat: -1
        });

        // Koopa Troopa walks
        const koopaWalkFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'enemies/KoopaTroopa/KoopaTroopa_Walk_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'koopaWalk',
            frames: koopaWalkFrame,
            frameRate: 5,
            repeat: -1
        });

        // Koopa Troopa fails
        const koopaFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'enemies/KoopaTroopa/KoopaTroopa_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'koopaFail',
            frames: koopaFailFrame,
            frameRate: 5,
            repeat: -1
        });

        // Ptooie walks
        const ptWalkFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'enemies/Ptooie/Ptooie_Walk_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'ptWalk',
            frames: ptWalkFrame,
            frameRate: 5,
            repeat: -1
        });

        // Ptooie bites
        const ptBiteFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 2,
            zeroPad: 2,
            prefix: 'enemies/Ptooie/Ptooie_Bite_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'ptBite',
            frames: ptBiteFrame,
            frameRate: 1,
            repeat: -1
        });

        // Ptooie fails
        const ptFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'enemies/Ptooie/Ptooie_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'ptFail',
            frames: ptFailFrame,
            frameRate: 5,
            repeat: -1
        });

        // Hammer Bro throws
        const hbroThrowFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 5,
            zeroPad: 2,
            prefix: 'enemies/HammerBro/HammerBro_Throw_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'hbroThrow',
            frames: hbroThrowFrame,
            frameRate: 5,
            repeat: -1
        });

        // Hammer Bro fails
        const hbroFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 2,
            zeroPad: 2,
            prefix: 'enemies/HammerBro/HammerBro_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'hbroFail',
            frames: hbroFailFrame,
            frameRate: 5,
            repeat: -1
        });

        // Browser walks
        const bowserWalkFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 4,
            zeroPad: 2,
            prefix: 'enemies/Bowser/Bowser_Walk_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'bowserWalk',
            frames: bowserWalkFrame,
            frameRate: 3,
            repeat: -1
        });

        // Browser roars
        const bowserRoarFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 2,
            zeroPad: 2,
            prefix: 'enemies/Bowser/Bowser_Roar_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'bowserRoar',
            frames: bowserRoarFrame,
            frameRate: 5,
            repeat: -1
        });

        // Browser hits
        const bowserHitFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 1,
            zeroPad: 2,
            prefix: 'enemies/Bowser/Bowser_Hit_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'bowserHit',
            frames: bowserHitFrame,
            frameRate: 5,
            repeat: -1
        });

        // Browser fails
        const bowserFailFrame = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            zeroPad: 2,
            prefix: 'enemies/Bowser/Bowser_Fail_',
            suffix: '.png'
        });
        this.anims.create({
            key: 'bowserFail',
            frames: bowserFailFrame,
            frameRate: 5,
            repeat: -1
        });
    }

    /* TEST: create animation function
    setAnims(start, end, prefix, key, frameRate) {
        const frameName = this.anims.generateFrameNames('assets', {
            start,
            end,
            zeroPad: 2,
            prefix, 
            suffix: '.png'
        });

        this.anims.create({
            key,
            frames: frameName,
            frameRate,
            repeat
        })
    }
    */
}

