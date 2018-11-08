var levelSelect = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/startScreen/landscape.png');
    game.load.spritesheet('shield1', 'assets/Level Select/Level 1 Shield.png', 142, 200);
    game.load.spritesheet('shield2', 'assets/Level Select/Level 2 Shield.png', 142, 200);
    game.load.spritesheet('shield3', 'assets/Level Select/Level 3 Shield.png', 142, 200);
    game.load.image('locked', 'assets/Level Select/Locked Level.png');
    game.load.image('backButton', 'assets/tutorial/continue button.png');
   // game.load.image('black', 'assets/black screen.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var shield1, shield2, locked2, shield3, locked3, backButton;

//Booleans for when to unlock levels 2 and 3
var level2Locked = true, level3Locked = true;

function create() {
    console.log('levelSelect');
    
    //Fade in background
    var bg = game.add.image(0, 0, 'background');
    bg.alpha = 1;
    
    shield1 = game.add.button(centerX-300, centerY-200, 'shield1');
    shield1.frame = 1;
    shield1.anchor.setTo(0.5, 0.5)
    shield1.scale.setTo(1.9, 1.9);
    shield1.onInputUp.add(startLevel1, this);
    
    shield2 = game.add.button(-300, 0, 'shield2', startLevel2, this); //Loads shield but outside of the screen
    
    locked2 = game.add.button(centerX+300, centerY-200, 'locked');
    locked2.anchor.setTo(0.5, 0.5);
    locked2.scale.setTo(1.9, 1.9);
    
    shield3 = game.add.button(-300, 0, 'shield3', startLevel3, this);
    
    locked3 = game.add.button(centerX, centerY+200, 'locked');
    locked3.anchor.setTo(0.5, 0.5);
    locked3.scale.setTo(1.9, 1.9);
    
    backButton = game.add.button(100, 100, 'backButton');
    backButton.anchor.setTo(0.5);
    backButton.scale.setTo(-1.2, 1.2);
    backButton.onInputUp.add(returnToMain, this);
    
    black = game.add.sprite(0, 0, 'black');
    black.alpha = 1;
    black.scale.setTo(10, 10);
    game.add.tween(black).to( { alpha: 0}, 500, Phaser.Easing.Linear.None, true);
}

function update() {
    if (shield1.input.pointerOver()){
        shield1.frame = 1;
    } else{
        shield1.frame = 0;
    }
    
    if (level2Locked == false){
        locked2.destroy();
        shield2.frame = 0;
        shield2.anchor.setTo(0.5, 0.5)
        shield2.scale.setTo(1.9, 1.9);
        //move shield2 into the right position
        shield2.position.x = centerX+300;
        shield2.position.y = centerY-200;
    } if (shield2.input.pointerOver()){
        shield2.frame = 1;
    } else{
        shield2.frame = 0;
    }
    
    if (level3Locked = false){
        locked3.destroy();
        shield3.frame = 0;
        shield3.anchor.setTo(0.5, 0.5);
        shield3.scale.setTo(1.9, 1.9);
        shield3.position.x = centerX;
        shield3.position.y = centerY+200;
    } if (shield3.input.pointerOver()){
        shield3.frame = 1;
    } else{
        shield3.frame = 0;
    }
    
    game.world.bringToTop(black);
}

//Takes you to Level 1
function startLevel1(){
    teleMode = false;
    fadeAll();
    game.time.events.add(500, function() {
        game.state.start('state0');
    }, this);
}

function startLevel2(){
    teleMode = false;
    fadeAll();
//    game.time.events.add(500, function() {
//        game.state.start('state1');
//    }, this);
    game.state.start('state1');
}

function startLevel3(){
    teleMode = false;
    fadeAll();
//    game.time.events.add(500, function() {
//        game.state.start('state2');
//    }, this);
    game.state.start('state2');
}

//Return to the start screen
function returnToMain(){
    teleMode = false;
    console.log('reutrn to main');
    fadeAll();
    game.time.events.add(500, function() {
        game.state.start('startScreen');
    }, this);
}