var tutorial = {
    preload: preload,
    create: create,
    update: update
}

var demo = {};
var vel = 600, outline, movementTested = false, skipButton;
var clickCount = 0;
var text = 'Use "W A S D" to move';
var moveText;
var attackText = "Press the spacebar to attack";
var blinkText = "Press either shift key while moving to\n blink in that direction" ;
var blinkText2 = "Now try reaching the star\n on top of the tower"
var blinkStar = false; // Boolean so the tutorial only progresses once the player reaches the star using blink
var blinkText3 = 'Great! You can blink 3 times before having\n to wait for it to recharge'
var blinkText4 = 'These icons will track your blinks'
var teleText = 'Press "F" to activate the long teleport,\n then click anywhere on the screen';
var teleText2 = 'Note the longer recharge time'
var teleText3 = 'Now, use the long teleport to get this star'
var teleStar = false; //Boolean so the tutorial only progresses once the play reaches the star using longTele
var tutorialFinishText = "You've completed the tutorial!\n Click the 'Exit' button when you're\n ready to begin your journey";


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
    game.load.image('mainMenuButton', 'assets/Win or Lose/Main Menu Button.png');
    
    //Preload background, ground/steps and tower
    game.load.image('background', 'assets/tutorial/tutorial elements/Tutorial BG 2.png');
    game.load.image('stepImg', 'assets/tutorial/tutorial elements/Tutorial Ground 2.png');
    game.load.image('towerBody', 'assets/tutorial/tutorial elements/Tutorial Tower Body.png');
    game.load.image('towerTop', 'assets/tutorial/tutorial elements/Tutorial Tower Top.png');
    
    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    
    // star
    game.load.spritesheet('star', 'assets/tutorial/Star.png');
    
    // blink box
    game.load.spritesheet('blinkflash', 'assets/tutorial/Blink Icon Box.png', 1000, 2000);
    
}

var steps, tower, stepImage;
var star;
var blinkFlash, blinking;

function create(){
    clickCount = 0
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // blink box flashing
    blinkFlash = game.add.sprite(game.world.centerX, game.world.centerY, 'blinkflash');
    blinkFlash.visible = true;
    console.log(blinkFlash);
    //blinking = blinkFlash.animations.add('blinking');
    
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

    // add star
    star = game.add.sprite(game.world.centerX + 725, 50, 'star');
    game.physics.enable(star);
    star.scale.setTo(.5,.5);
    star.body.immovable = true;
    
    //game.add.text(game.world.centerX, game.world.centerY, star.body);
    //Add button

//    skipButton = game.add.button(centerX+250, 60, 'skipButton', startLevelSelect, this);
//    skipButton.anchor.setTo(0.5, 0.5);
//    skipButton.scale.setTo(0.8, 0.8);
//    skipButton.inputEnabled = true;
    
    moveText = game.add.text(game.world.centerX - 175, game.world.centerY + 200, text, { font: "65px VT323", fill: "#f76300", align: "center" });
    nextButton = game.add.button(game.world.centerX - 300, game.world.centerY + 200, 'backButton', actionOnClick, this);
    nextButton.scale.setTo(1,1);
    
    //Boss stuff (placeholders really for blank boss)
    boss = game.add.sprite(0, 0, 'blankBoss');
    distanceFromBoss = 0, boss.hurtOnce = true;
    
    //create knight
    createKnight(0);
}
 
function update() {
    fadeOutIntro();
    playTutorial();
    
    //Collide with steps
    var stepCollide = game.physics.arcade.collide(knight, steps);
    var insideSteps = game.physics.arcade.overlap(knight, steps);
    //Collide with tower?
    game.physics.arcade.collide(knight, tower);
    
    // overlap with star
    game.physics.arcade.overlap(knight, star, collectStar, null, this);
    
        
    //Prevent/get out of glitch of going into steps
    if(insideSteps)
        knight.body.y -= 90;
    
    //update knight
    updateKnight(0, stepCollide);
        
    //testMovement();
}



function collectStar(knight, star) { 
    star.kill(); 
    teleStar = true;
    
}

function actionOnClick() {
    clickCount++;
    console.log('clickCount', clickCount);
}

function playTutorial(){
    
    if (clickCount == 1) {
        // The key here is setText(), which allows you to update the text of a text object.
        moveText.setText(attackText);
    } else if (clickCount == 2) {
        moveText.setText(blinkText);
    } else if (clickCount == 3 && blinkStar == false) {
        moveText.setText(blinkText2);
        
        //Remove nextButton so player has to get the star to continue
        nextButton.alpha = 0;
        nextButton.inputEnabled = false;
        
        //Removable code; makes sure tutorial doesn't progress until blinkStar = true
        game.time.events.add(2000, function() {
            blinkStar = true;
        }, this);
        //--------------------------------------//
    } else if (clickCount == 3 && blinkStar == true) {
        //Put nextButton back
        nextButton.alpha = 1;
        nextButton.inputEnabled = true;
        
        moveText.setText(blinkText3);
    } else if (clickCount == 4) {
        moveText.setText(teleText);
    } else if (clickCount == 5) {
        moveText.setText(teleText2);
    } else if (clickCount == 6 && teleStar == false) {
        moveText.setText(teleText3);

        nextButton.kill();
        
        //Removable code; makes sure tutorial doesn't progress until teleStar = true
        game.time.events.add(2000, function() {
            teleStar = true;
        }, this);
        //--------------------------------------//
    } else if(clickCount == 6 && teleStar == true){
        moveText.setText(tutorialFinishText);
    }
}


function returnToMain(){
    game.state.start('startScreen')
}