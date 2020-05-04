const gameState = {
    startLoad: false,
    active: true,
    ySpeed: -500,
    marioScale: 0.3,
    fireEnable: false,
    showSign: false,
    pipeSound: 0,
    hitSound: 0,
    failSound: 0,
    bowserHP: 10000,
    bowserHit: false
};

const config = {
    type: Phaser.AUTO,
    width: 740,
    height: 425,
    backgroundColor: "#000",
    parent: "theGame",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    // Order: Start, Level1, Level2, Level3, Level4, Letter
    scene: [Loading, Start, Level1, Level2, Level3, Level4, Letter]
};

const game = new Phaser.Game(config);