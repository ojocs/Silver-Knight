var state2 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'Assets/Credits v2.png');
    game.load.image('black', 'Assets/Black Screen.png');
    game.load.spritesheet('circContButton', 'Assets/Circle Continue Button.png', 100, 100);
    game.load.audio('creditsMusic', 'Assets/Audio/Music/Credits Music.wav');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg; //background
var circContButton;

function create() {
    showCredits = true;
    fadeOutIntro();
    
    console.log('credits');

    creditsMusic = game.add.audio('creditsMusic');
    creditsMusic.loopFull();
    
    bg = game.add.image(0, 0, 'background');
    
    circContButton = game.add.button(1900, 900, 'circContButton');
    circContButton.anchor.setTo(0.5);
    circContButton.frame = 0;
    circContButton.alpha = 0;
    circContButton.onInputUp.add(startLevelSelect, this);
    
    var timer = game.time.create(true);
    timer.add(2500, function(){
        game.add.tween(circContButton).to( { alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    });
    timer.start();
    
    black = game.add.image(0, 0, 'black');
    black.scale.setTo(10, 10);
}

function update() {
    game.add.tween(black).to( { alpha: 0}, 400, Phaser.Easing.Linear.None, true);
    
    //Back Button highlights when hovered over
    if (circContButton.input.pointerOver()){
        circContButton.frame = 1;
    } else{
        circContButton.frame = 0;
    }
}