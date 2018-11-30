var levelSelect = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'Assets/startScreen/landscape.png');
    game.load.spritesheet('shield1', 'Assets/Level Select/Level 1 Shield v2.png', 142, 200);
    game.load.spritesheet('shield2', 'Assets/Level Select/Level 2 Shield.png', 142, 200);
    //game.load.spritesheet('shield3', 'Assets/Level Select/Level 3 Shield.png', 142, 200);
    game.load.spritesheet('tutButton', 'Assets/startScreen/tutorial button.png', 640, 320);
    game.load.image('locked', 'Assets/Level Select/Locked Level.png');
    game.load.spritesheet('backButton', 'Assets/back button.png', 640, 320);
    game.load.spritesheet('creditsButton', 'Assets/credits button.png', 640, 320);
    game.load.audio('creditsMusic', 'Assets/audio/music/credits music.wav');
   // game.load.image('black', 'Assets/black screen.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var shield1, shield2, locked2, shield3, locked3, backButton;
var creditsMusic;
var creditsButton, showCredits = false; //boolean to show the credits button upon completion of the game

//Booleans for when to unlock levels 2 and 3
var level2Locked = true, level3Locked = true;

function create() {
    console.log('levelSelect');
    
    // Fades out creditsMusic if any is playing
    if (creditsMusic != null){
        game.add.tween(creditsMusic).to( { volume: 0}, 100, Phaser.Easing.Linear.None, true);
    }
    
    // Fades out levelMusic if any is playing
    if (levelMusic != null){
        game.add.tween(levelMusic).to( { volume: 0}, 100, Phaser.Easing.Linear.None, true);
    }
    
    //Fade in background
    var bg = game.add.image(0, 0, 'background');
    bg.alpha = 1;
    
    shield1 = game.add.button(centerX-325, centerY-100, 'shield1');
    shield1.frame = 1;
    shield1.anchor.setTo(0.5, 0.5)
    shield1.scale.setTo(2, 2);
    shield1.onInputUp.add(startLevel1, this);
    
    shield2 = game.add.button(-300, 0, 'shield2', startLevel2, this); //Loads shield but outside of the screen
    
    locked2 = game.add.button(centerX+325, centerY-100, 'locked');
    locked2.anchor.setTo(0.5, 0.5);
    locked2.scale.setTo(2, 2);
    
/* Hold on Level 3
    shield3 = game.add.button(-300, 0, 'shield3', startLevel3, this);
    
    locked3 = game.add.button(centerX, centerY+200, 'locked');
    locked3.anchor.setTo(0.5, 0.5);
    locked3.scale.setTo(1.9, 1.9);
*/
    
    //Tutorial Button
    tutButton = game.add.button(centerX, 800, 'tutButton');
    tutButton.frame = 1
    tutButton.anchor.setTo(0.5, 0.5);
    tutButton.scale.setTo(0.5, 0.5);
    tutButton.inputEnabled = true;
    tutButton.onInputUp.add(startTutorial, this);
  
    backButton = game.add.button(180, 100, 'backButton');
    backButton.anchor.setTo(0.5);
    backButton.scale.setTo(0.4, 0.4);
    backButton.frame = 1;
    backButton.onInputUp.add(returnToMain, this);
    
    creditsButton = game.add.button(-300, 100, 'creditsButton');
    creditsButton.anchor.setTo(0.5);
    creditsButton.scale.setTo(0.4, 0.4);
    creditsButton.frame = 1;
    creditsButton.onInputUp.add(startLevel3, this);
    
    black = game.add.sprite(0, 0, 'black');
    black.alpha = 1;
    black.scale.setTo(10, 10);
    game.add.tween(black).to( { alpha: 0}, 500, Phaser.Easing.Linear.None, true);
}

function update() {
    resumeIntro();
    
    //Back Button highlights when hovered over
    if (backButton.input.pointerOver()){
        backButton.frame = 0;
    } else{
        backButton.frame = 1;
    }
    
    //Tutorial Button highlights when hovered over
    if (tutButton.input.pointerOver()){
        tutButton.frame = 0;
    }
    else{
        tutButton.frame = 1;
    }
    
    //Credits Button highlights when hovered over
    if (creditsButton.input.pointerOver()){
        creditsButton.frame = 0;
    } else{
        creditsButton.frame = 1;
    }
    
    if (showCredits){
        creditsButton.position.x = 1820;
    }
    
    //Shield1 highlights when hovered over
    if (shield1.input.pointerOver()){
        shield1.frame = 1;
    } else{
        shield1.frame = 0;
    }
    
    //Shield2 appears upon beating Level 1
    if (level2Locked == false){
        locked2.destroy();
        shield2.frame = 0;
        shield2.anchor.setTo(0.5, 0.5)
        shield2.scale.setTo(1.9, 1.9);
        //move shield2 into the right position
        shield2.position.x = centerX+325;
        shield2.position.y = centerY-100;
    } if (shield2.input.pointerOver()){
        shield2.frame = 1;
    } else{
        shield2.frame = 0;
    }
    
/* Commented out, hold on Level 3
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
*/
    
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