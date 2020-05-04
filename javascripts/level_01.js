class Level1 extends Level {
    constructor() {
        super('Level1')
        this.brickHeight = [null, null, null, null, null, null, [5.5], [5.5], [5.5],
                            null, null, null, null, null, null, null, null, null, null, [4.5], [4.5], [4.5]];
        this.quesHeight = [];
        this.wboxHeight = [null, null, null, null, null, null, null, null, null, null, null, null,
                            [9.5], [8.5, 9.5], [7.5, 8.5, 9.5],
                            null, null, null, null, null, null, null, null, null, null, null,
                            [7.5, 8.5, 9.5], [8.5, 9.5],[9.5]];
        this.pipeHeight = [];
        this.enemies = ['goomba', 'buzzy'];
        this.gift = null;
    }
}