var tutorial = {
    preload: preload,
    create: create,
    update: update
}

var demo = {};
var vel = 600, outline, movementTested = false, skipButton;
var clickCount = 0;
var starCount;
var text = 'Use "W A S D" to move';
var moveText;
var attackText = "Press the spacebar to attack";
var blinkText = "Press either shift key while moving to\n blink in that direction" ;
var blinkText2 = "These icons will track your blinks\n They recharge anytime you're not blinking"
var blinkText3 = "Now try reaching the star\n on top of the tower"
var blinkStar; // Boolean so the tutorial only progresses once the player reaches the star using blink
var blinkText4 = 'Great!'
var teleText = 'Press "F" to activate the long teleport,\n then click anywhere on the screen';
var teleText2 = 'Note the longer recharge time'
var teleText3 = 'Now, use the long teleport to get this star'
var teleStar; //Boolean so the tutorial only progresses once the play reaches the star using longTele
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
    game.load.spritesheet('star', 'assets/tutorial/Star Spritesheet.png', 100, 100);
    game.load.audio('starSound', 'assets/audio/star spawn.wav'); 
    
    // blink box
    game.load.spritesheet('blinkflash', 'assets/tutorial/Blink Icon Box.png', 1000, 500);
    game.load.spritesheet('teleflash', 'assets/tutorial/tele icon box.png', 1000, 500);
    
}

var steps, tower, stepImage;
var star, starSound;
var soundPlayed, soundPlayed2; // Booleans for starSound
var blinkFlash, teleFlash;

function create(){
    soundPlayed = false;
    soundPlayed2 = false;
    starCount = 0;
    blinkStar = false;
    teleStar = false;
    
    clickCount = 0
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
    
    // blink box flashing
    blinkFlash = game.add.sprite(0, 0, 'blinkflash');
    blinkFlash.alpha = 0;
    blinkFlash.scale.setTo(2, 2);
    blinkFlash.animations.add('blinking');
    
    // tele box flashing
    teleFlash = game.add.sprite(0, 0, 'teleflash');
    teleFlash.alpha = 0;
    teleFlash.scale.setTo(2, 2);
    teleFlash.animations.add('blinking');

    // add star
    star = game.add.sprite(game.world.centerX + 725, -200, 'star');
    star.animations.add('shimmer');
    star.animations.play('shimmer', 14, true);
    game.physics.enable(star);
    star.body.immovable = true;
    starSound = game.add.audio('starSound');
    
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
    star.position.x = -200;
    starCount += 1;
    if (starCount == 0){
        blinkStar = false;
        telestar = false;
    }else if (starCount == 1){
        blinkStar = true;
    } else if (starCount == 2){
        teleStar = true;
        star.kill();
    }
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
    } else if (clickCount == 3) {
        blinkFlash.alpha = 1;
        blinkFlash.animations.play('blinking', 16, true);
        game.world.bringToTop(blinkFlash);
        game.world.bringToTop(nextButton);
        moveText.setText(blinkText2);
        game.world.bringToTop(moveText);
    } else if (clickCount == 4 && blinkStar == false) {
        blinkFlash.kill();
        moveText.setText(blinkText3);

//        game.time.events.add(1000, function() {
            star.alpha = 1;
            star.position.y = 25;
            
            //Star sound plays only once
//            if (soundPlayed == false){
//            //    starSound.play();
//                game.time.events.add(10, function() {
//                    soundPlayed = true;
//                }, this)
//                if (soundPlayed){
//                    console.log('soundPlayed');
//                }
//            };
  //      }, this)

        //Remove nextButton so player has to get the star to continue
        nextButton.alpha = 0;
        nextButton.inputEnabled = false;        
    } else if (clickCount == 4 && blinkStar == true) {
        //Put nextButton back
        nextButton.alpha = 1;
        nextButton.inputEnabled = true;
        moveText.setText(blinkText4);
    } else if (clickCount == 5) {
        moveText.setText(teleText);
    } else if (clickCount == 6) {
        teleFlash.alpha = 1;
        teleFlash.animations.play('blinking', 16, true);
        game.world.bringToTop(teleFlash);
        game.world.bringToTop(nextButton);
        moveText.setText(teleText2);
        game.world.bringToTop(moveText);
    } else if (clickCount == 7 && teleStar == false) {
        console.log('teleStar = false');
        teleFlash.kill();
        moveText.setText(teleText3);

        //Have to use this method for delay because game.time.events.add was being skipped
        var timer = game.time.create(false);
        timer.add(1000, this.starSound2, this);
        timer.start();
        
        nextButton.kill();
    } else if(clickCount == 7 && teleStar == true){
        console.log('teleStar = true');
        moveText.setText(tutorialFinishText);
    }
}

function starSound2(){
    star.position.x = 30;
    star.position.y = 150;
    if (soundPlayed2 == false){
        starSound.play();
        var timer = game.time.create(false);
        timer.add(10, this.sound2True, this);
        timer.start()
        if (soundPlayed2){
            console.log('soundPlayed');
            starSound.stop();
        }
    };
}

function sound2True(){
    soundPlayed2 = true;
}

function returnToMain(){
    game.state.start('startScreen')
}