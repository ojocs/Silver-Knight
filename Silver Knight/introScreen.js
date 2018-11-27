var introScreen = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/startScreen/landscape.png');
    game.load.image('black', 'assets/black screen.png');
    game.load.spritesheet('button', 'assets/continue button.png',640, 320);
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
    
    continueButton = game.add.button(1500, 750, 'button', startLevelSelect, this);
    continueButton.inputEnabled = true;
    continueButton.scale.setTo(0.5, 0.5);
    continueButton.frame = 1;
    //continueButton.alpha = 0;
    
    var style = { font: "bold 32px Arial",
    fill: "#fff"};

    //  The Text is positioned at 0, 100
    text = game.add.text(0, 0,
                         "As the Silver Knight, you are the sole protector of this land.\nTrained for battle and learned in chivalry, you battle off evils to defend the innocent.\n Fight! Defend! Win!",
                         style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
}

function update() {    
    game.add.tween(black).to( { alpha: 0.6}, 500, Phaser.Easing.Linear.None, true);
    
    //Continue Button highlights when hovered over
    if (continueButton.input.pointerOver()){
        continueButton.frame = 0;
    } else{
        continueButton.frame = 1;
    }
}