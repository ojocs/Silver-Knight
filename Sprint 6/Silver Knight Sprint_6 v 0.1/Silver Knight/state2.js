var state2 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {

}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

function create() {
    console.log('level 2');
    game.add.text(centerX, centerY, 'LEVEL 3', {
        fontSize: '100px',
        fill: '#ffffff'
    });
}

function update() {
    
}