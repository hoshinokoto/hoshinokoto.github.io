class Level3 extends Level {
    constructor() {
        super('Level3')
        this.brickHeight = [null, null, null, null, [5.5], null, [5.5],
                            null, null, null, null, null, null, [4.5], [4.5], [4.5],
                            null, null, null, null, [3], [3], [3],
                            null, null, null, null, [6], [6], [6],
                            null, null, null, null, [2.5], [2.5], [2.5],];
        this.quesHeight = [null, null, null, null, null, [5.5]];
        this.wboxHeight = [];
        this.pipeHeight = [null, null, null, null, null, null, null, null, null, null, null, null, [9.5],
                            null, null, null, null, null, null, null, null, null, [9.5],
                            null, null, null, null, null, null, null, null, null, [9.5]];
        this.enemies = ['ppFire', 'hbro'];
        this.gift = 'elements/Fireflower.png';
    }
}