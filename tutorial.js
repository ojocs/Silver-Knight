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
var blinkText2 = "These icons will track your blinks\n They recharge anytime you're\n not blinking"
var blinkText3 = "Now try reaching the star"
var blinkStar; // Boolean so the tutorial only progresses once the player reaches the star using blink
var blinkText4 = 'Great! When on a platform,\n press "S" to drop down'
var teleText = 'Press "E" to activate the long teleport,\n then click anywhere on the screen';
var teleText2 = 'Note the longer recharge time'
var teleText3 = 'Now, teleport to get this star'
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
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //Blank boss
    game.load.image('blankBoss', 'Assets/blankBoss.png');
    //preload knight
    preloadKnight();
        
    //Buttons
    game.load.spritesheet('nextButton', 'Assets/Tutorial/Next Button Orange Txt.png', 200, 100);
    game.load.image('mainMenuButton', 'Assets/Win or Lose/Main Menu Button.png');
    
    //Preload background, ground/steps and tower
    game.load.image('background', 'Assets/Tutorial/Tutorial Elements/Tutorial BG 2.png');
    game.load.image('stepImg', 'Assets/Tutorial/Tutorial Elements/Ground.png');
    game.load.image('towerPlat', 'Assets/Tutorial/Tutorial Elements/Platform.png');
    
    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    
    // star
    game.load.spritesheet('star', 'Assets/Tutorial/Star Spritesheet.png', 100, 100);
    game.load.audio('starSound', 'Assets/Audio/Star Spawn.wav');
    game.load.spritesheet('sparks', 'Assets/Tutorial/Sparks.png', 140, 140);
    game.load.audio('pickup', 'Assets/Audio/Item Pickup.wav');
    
    // blink box
    game.load.spritesheet('blinkflash', 'Assets/Tutorial/Blink Icon Box.png', 1000, 500);
    game.load.spritesheet('teleflash', 'Assets/Tutorial/Tele Icon Box.png', 1000, 500);
    
}

var steps, stepImage, platforms, towerPlatform;
var star, starSound, sparks, sparksCount;
var sparksPlayed, sparksPlayed2; // Booleans for the animations to only play when these equal false, changes to true after 1 playthrough
var soundPlayed, soundPlayed2; // Booleans for starSound
var blinkFlash, teleFlash;
var pickupSound;

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
    stepImage = steps.create(0, 800, 'stepImg');
    stepImage.enableBody = true, stepImage.body.immovable = true;
    stepImage.body.setSize(2250, 50, 0, 125);
    //Rest are "hitbox" steps
    var step = steps.create(360, 880, null);
    step.body.enable = true, step.body.immovable = true, step.body.setSize(1850, 30);
    step = steps.create(467, 800, null);
    step.body.enable = true, step.body.immovable = true, step.body.setSize(1500, 30);

    //Add tower
    platforms = game.add.group();
    platforms.enableBody = true, platforms.antiStuck = step.body.height;
    towerPlatform = platforms.create(1500, 250, 'towerPlat');
    towerPlatform.body.enable = true, towerPlatform.body.immovable = true;
    
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
    starSound.volume = 0.6
    pickupSound = game.add.audio('pickup');
    
    // star sparks
    sparks = game.add.sprite(-centerX, centerY, 'sparks');
    sparks.animations.add('sparks');
    sparks.scale.setTo(1.6, 1.6);
    sparksCount = 0;
    sparksPlayed = false, sparksPlayed2 = false;
    
    moveText = game.add.text(500, 800, text, { font: "65px VT323", fill: "#f76300", align: "center" });
    nextButton = game.add.button(1700, game.world.centerY + 350, 'nextButton', actionOnClick, this);
    nextButton.frame = 0;
    
    //Boss stuff (placeholders really for blank boss)
    boss = game.add.sprite(0, 0, 'blankBoss');
    distanceFromBoss = 0, boss.hurtOnce = true;
    
    //create knight
    createKnight(0);
}

function update() {
    fadeOutIntro();
    playTutorial();
    
    //Next button highlights when hovered over
    if (nextButton.input.pointerOver()){
        nextButton.frame = 1;
    }
    else{
        nextButton.frame = 0;
    }
    
    //Collide with steps
    hitPlatform = game.physics.arcade.collide(knight, platforms);
    hitSteps = game.physics.arcade.collide(knight, steps);
    var insideSteps = game.physics.arcade.overlap(knight, steps);
    
    // overlap with star
    game.physics.arcade.overlap(knight, star, collectStar, null, this);
    
        
    //Prevent/get out of glitch of going into steps
    if(insideSteps || knight.body.center.y >= game.world.height)
        knight.body.y -= 90;
    
    //update knight
    updateKnight(0, 0, null);
        
    //Because bugs, overwrite jump code in knight.js with this
    if (moveBinds.upW.isDown && knight.body.touching.down && (hitSteps || hitPlatform)) {
        knight.body.velocity.y = -1000;
    }
}

function collectStar(knight, star) { 
    pickupSound.volume = 1.4
    pickupSound.play();
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
        
        var timer = game.time.create(false);
        timer.add(1100, this.star1, this);
        timer.start();

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
        teleFlash.kill();
        moveText.setText(teleText3);

        //Have to use this method for delay because game.time.events.add was being skipped
        var timer = game.time.create(false);
        timer.add(1100, this.star2, this);
        timer.start();
        
        nextButton.kill();
    } else if(clickCount == 7 && teleStar == true){
        console.log('teleStar = true');
        moveText.setText(tutorialFinishText);
    }
}

function star1(){
    var timer = game.time.create(false);
    timer.add(200, this.star1Appear, this);
    timer.start();
    
    if (sparksPlayed == false){
        sparks.position.x = 1665;
        sparks.position.y = 60;
        sparks.animations.play('sparks', 12, true);
        var timer = game.time.create(false);
        sparksCount = 1;
        timer.add(633, this.stopSparks, this);
        timer.start();
    };

    //Star sound plays only once
    if (soundPlayed == false){
        starSound.play();
        
        //So sound plays only once
        var timer = game.time.create(false);
        timer.add(10, this.sound1True, this);
        timer.start()
        if (soundPlayed){
            starSound.stop();
        }
    };
}

function star1Appear(){
    star.alpha = 1;
    star.position.y = 125;
}

function sound1True(){
    console.log('sond1True');
    soundPlayed = true;
    console.log('sond1True Done')
}

var timer2, timer2Bool = false;

function stopSparks() {
    console.log('sparksCount', sparksCount);
    // Moves spark animation out of screen
    sparks.position.x = -300;
    if (sparksCount == 1){
        sparksPlayed = true; 
    } else if (sparksCount == 2){
        sparksPlayed2 = true;
        
    }
}

function star2(){
    var timer = game.time.create(false);
    timer.add(200, this.star2Appear, this);
    timer.start();
    
    if (sparksPlayed2 == false){
        console.log('sparksPlayed2');
        sparks.position.x = -20;
        sparks.position.y = 100;
        sparks.animations.play('sparks', 12, false);
        var timer = game.time.create(false);
        sparksCount = 2;
        timer.add(550, this.stopSparks, this);
        timer.start();
    };
    
    if (soundPlayed2 == false){
        starSound.play();
        var timer = game.time.create(false);
        timer.add(10, this.sound2True, this);
        timer.start()
        if (soundPlayed2){
            starSound.stop();
        }
    };
}

function star2Appear(){
    star.position.x = 40;
    star.position.y = 175;
}

function sound2True(){
    soundPlayed2 = true;
}

function returnToMain(){
    game.state.start('startScreen')
}