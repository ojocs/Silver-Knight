var state2 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/Credits.png');
    game.load.image('black', 'assets/black screen.png');
    game.load.spritesheet('backButton', 'assets/back button.png', 640, 320);
    game.load.audio('creditsMusic', 'assets/audio/music/credits music.wav');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg; //background

function create() {
    console.log('credits');

    creditsMusic = game.add.audio('creditsMusic');
    creditsMusic.play();
    creditsMusic.loopFull();
    
    bg = game.add.image(0, 0, 'background');
    
    backButton = game.add.button(180, 775, 'backButton');
    backButton.anchor.setTo(0.5);
    backButton.scale.setTo(0.3, 0.3);
    backButton.frame = 1;
    backButton.onInputUp.add(startLevelSelect, this);
    
    black = game.add.image(0, 0, 'black');
    black.scale.setTo(10, 10);
}

function update() {
    game.add.tween(black).to( { alpha: 0}, 500, Phaser.Easing.Linear.None, true);
    
    //Back Button highlights when hovered over
    if (backButton.input.pointerOver()){
        backButton.frame = 0;
    } else{
        backButton.frame = 1;
    }
}