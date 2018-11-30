var introScreen = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/startScreen/landscape.png');
    game.load.image('black', 'assets/black screen.png');
    game.load.spritesheet('button', 'assets/continue button.png',640, 320);
    game.load.image('introText', 'assets/intro text.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg; //background
var continueButton;

function create() {
    needIntro = false;
    bg = game.add.image(0, 0, 'background');

    black = game.add.image(0, 0, 'black');
    black.scale.setTo(10, 10);
    
    continueButton = game.add.button(-1000, 770, 'button', startLevelSelect, this);

    startTimer();
    
    var text = game.add.image(0, 0, 'introText');
    text.alpha = 0;
    text.scale.setTo(0.93, 0.93);
    game.add.tween(text).to( { alpha:1 }, 1400, Phaser.Easing.Linear.None, true);
}

function update() {    
    game.add.tween(black).to( { alpha: 0.6}, 400, Phaser.Easing.Linear.None, true);
    
    //Continue Button highlights when hovered over
    if (continueButton.input.pointerOver()){
        continueButton.frame = 0;
    } else{
        continueButton.frame = 1;
    }
}

function startTimer(){
    var timer = game.time.create(false);
    timer.add(500, this.addButton, this);
    timer.start();
    console.log('timer.start')
}

function addButton(){
    console.log('addButton');
    continueButton.position.x = 1580;
    continueButton.inputEnabled = true;
    continueButton.scale.setTo(0.5, 0.5);
    continueButton.frame = 1;
    continueButton.alpha = 0;
    
    game.add.tween(continueButton).to( { alpha:1 }, 1000, Phaser.Easing.Linear.None, true);
}