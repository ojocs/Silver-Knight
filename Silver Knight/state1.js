var state1 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    preloadKnight();
    //Level
    game.load.image('background', 'assets/Level 2/Level 2 BG.png');
    game.load.image('background', 'assets/Level 2/Platform 2.1.png');
    game.load.image('background', 'assets/Level 2/Platform 2.2.png');
    game.load.image('background', 'assets/Level 2/Platform 2.3.png');
    //Boss
    game.load.image('background', 'assets/Level 2/Tree Projectile.png');
    game.load.image('background', 'assets/Level 2/Tree Spike.png');
    game.load.image('background', 'assets/Level 2/Tree Spritesheet.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

function create() {
    console.log('level 2');
    
    var bg = game.add.image(0, 0, 'background');
    
    //Make knight
    createKnight(2);
}

function update() {
    updateKnight();
}