class Level2 extends Level {
    constructor() {
        super('Level2')
        this.brickHeight = [null, null, null, null, [5.5], null, [5.5],
                            null, null, null, null, [2],[2],[2],[2],
                            null, null, [6], [6], [6], [6], [6],
                            null, [3], [3], [3],
                            null, null, null, null, null, null, [6], [6], [6], [6], [6]];
        this.quesHeight = [null, null, null, null, null, [5.5]];
        this.wboxHeight = [];
        this.pipeHeight = [null, null, null, null, null, null, null, null, null, null, null, null, [9.5],
                            null, null, null, null, null, null, null, null, null, null, null, null, null, null, [9.5]];
        this.enemies = ['koopa', 'pp', 'pt'];
        this.gift = 'elements/Mushroom.png';
    }
}