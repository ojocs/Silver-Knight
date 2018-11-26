var state2 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/Credits.png');
    game.load.image('black', 'assets/black screen.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg; //background

function create() {
    bg = game.add.image(0, 0, 'background');
    console.log('credits');
    black = game.add.image(0, 0, 'black');
    black.scale.setTo(10, 10);
}

function update() {
    game.add.tween(black).to( { alpha: 0}, 500, Phaser.Easing.Linear.None, true);
}