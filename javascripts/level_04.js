class Level4 extends Level {
    constructor() {
        super('Level4')
        this.brickHeight = [null, null, null, null, [5.5], null, [5.5],
                            null, null, null, null, [3], [3], [3],
                            null, null, null, null, null, null,
                            null, null, null, null, [4], [4], [4],
                            null, null, null, [7], [7], [7]];
        this.quesHeight = [null, null, null, null, null, [5.5]];
        this.wboxHeight = [];
        this.pipeHeight = [];
        this.enemies = [];
        this.gift = 'elements/Fireflower.png';
    }
}