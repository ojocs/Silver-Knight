var tutorial = {
    preload: preload,
    create: create,
    update: update
}

var demo = {};
var vel = 600, outline, movementTested = false, skipButton;
var clickCount = 0;
var text = "A W S D to move";
var moveText;
var attackText = "Space bar to attack";
var blinkText = "Shift + one move key to\n blink in specified direction" ;
var teleText = "F + cursor click to\n teleport anywhere on screen";
var tutorialFinishText = "Tutorial Done!\n Now play the game";


//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['VT323']
    }

};

function preload(){
    game.physics.startSystem(Phaser.Physics.ARCADE); // Redundant since it's already been called in state0
    
    //Blank boss
    game.load.image('blankBoss', 'assets/blankBoss.png');
    //preload knight
    preloadKnight();
        
    //Buttons
    game.load.image('skipButton', 'assets/Tutorial/Skip Tutorial Button.png'); 
    game.load.image('backButton', 'assets/Tutorial/Continue Button.png');
    
    //Preload background, ground/steps and tower
    game.load.image('background', 'assets/tutorial/tutorial elements/Tutorial BG 2.png');
    game.load.image('stepImg', 'assets/tutorial/tutorial elements/Tutorial Ground 2.png');
    game.load.image('towerBody', 'assets/tutorial/tutorial elements/Tutorial Tower Body.png');
    game.load.image('towerTop', 'assets/tutorial/tutorial elements/Tutorial Tower Top.png');
    
    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    
}

var steps, tower, stepImage;

function create(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //Add background
    var background = game.add.image(0, 0, 'background');
    background.scale.setTo(0.89, 0.8);
    
    //Add steps
    steps = game.add.group();
    steps.enableBody = true;
    //Main step image
    stepImage = steps.create(0, 685, 'stepImg');
    stepImage.enableBody = true, stepImage.body.immovable = true;
    stepImage.body.setSize(2250, 100, 0, 230);
    //Rest are "hitbox" steps
    var step = steps.create(403, 860, null);
    step.body.enable = true, step.body.immovable = true, step.body.setSize(1850, 30);
    step = steps.create(523, 770, null);
    step.body.enable = true, step.body.immovable = true, step.body.setSize(1500, 30);
    step = steps.create(655, 685, null);
    step.body.enable = true, step.body.immovable = true, step.body.setSize(1300, 30);
    
    //Add tower
    tower = game.add.group();
    tower.enableBody = true;
    var towerPiece = tower.create(1550, 225, 'towerBody');
    towerPiece.body.immovable = true;
    towerPiece.scale.setTo(.85, .85);
    towerPiece = tower.create(1465, 120, 'towerTop');
    towerPiece.body.immovable = true;
//    towerPiece.scale.setTo(.85, .85);

        
    //Add button

//    skipButton = game.add.button(centerX+250, 60, 'skipButton', startLevelSelect, this);
//    skipButton.anchor.setTo(0.5, 0.5);
//    skipButton.scale.setTo(0.8, 0.8);
//    skipButton.inputEnabled = true;
    
    moveText = game.add.text(game.world.centerX,game.world.centerY - 400, text, { font: "65px VT323", fill: "#ffffff", align: "center" });
    nextButton = game.add.button(game.world.centerX+50, game.world.centerY + 50, 'backButton', actionOnClick, this);
    nextButton.scale.setTo(1,1);
    
    //Boss stuff (placeholders really for blank boss)
    boss = game.add.sprite(0, 0, 'blankBoss');
    distanceFromBoss = 0, boss.hurtOnce = true;
    
    //create knight
    createKnight(0);
}
 
function update() {
    //Collide with steps
    var stepCollide = game.physics.arcade.collide(knight, steps);
    var insideSteps = game.physics.arcade.overlap(knight, steps);
    //Collide with tower?
    game.physics.arcade.collide(knight, tower);
        
    //Prevent/get out of glitch of going into steps
    if(insideSteps)
        knight.body.y -= 90;
    
    //update knight
    updateKnight(0, stepCollide);
        
    //testMovement();
}

function actionOnClick() {
    clickCount++;
    
    if (clickCount == 1) {
        // The key here is setText(), which allows you to update the text of a text object.
        moveText.setText(attackText);
    } else if (clickCount == 2) {
        moveText.setText(teleText);
    } else if (clickCount == 3) {
        moveText.setText(blinkText);
    } else if (clickCount == 4) {
        moveText.setText(tutorialFinishText);
    } else {
        moveText.setText("");
        nextButton.kill();
    }
    
}


function returnToMain(){
    game.state.start('startScreen')
}