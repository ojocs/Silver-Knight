var state1 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/state1/Level 2 Background.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

function create() {
    console.log('level 2')
    
    var bg = game.add.image(0, 0, 'background');
}

function update() {
    
}