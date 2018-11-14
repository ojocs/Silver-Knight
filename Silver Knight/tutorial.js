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

function preload(){
        game.physics.startSystem(Phaser.Physics.ARCADE); // Redundant since it's already been called in state0
        
        //preload knight
        preloadKnight();
        
        //Buttons
        game.load.image('skipButton', 'assets/Tutorial/Skip Tutorial Button.png'); 
        game.load.image('backButton', 'assets/Tutorial/Continue Button.png');
        
//        //Preload tilemap
//        game.load.tilemap('test', 'assets/tutorial/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
//        game.load.image('backgroundTile', 'assets/tutorial/backgroundTile.png'); // Key must match tileset names
//        game.load.image('ltWindowTile', 'assets/tutorial/Left Window.png');
//        game.load.image('rtWindowTile', 'assets/tutorial/Right Window.png');
//        game.load.image('groundTile', 'assets/tutorial/groundTile.png');
//        game.load.image('towerTile', 'assets/tutorial/towerTile.png');
//        game.load.image('towerWindow', 'assets/tutorial/Tower Window.png');
//        game.load.image('outlineTile', 'assets/tutorial/outlineTile.png');
    
    //Preload background, ground/steps and tower
    game.load.image('background', 'assets/tutorial/tutorial elements/Tutorial BG.png');
    game.load.image('step1', 'assets/tutorial/tutorial elements/Tutorial Ground Step 1.png');
    game.load.image('step2', 'assets/tutorial/tutorial elements/Tutorial Ground Step 2.png');
    game.load.image('step3', 'assets/tutorial/tutorial elements/Tutorial Ground Step 3.png');
    game.load.image('step4', 'assets/tutorial/tutorial elements/Tutorial Ground Step 4.png');
    game.load.image('step5', 'assets/tutorial/tutorial elements/Tutorial Ground Step 5.png');
    game.load.image('towerBody', 'assets/tutorial/tutorial elements/Tutorial Tower Body.png');
    game.load.image('towerTop', 'assets/tutorial/tutorial elements/Tutorial Tower Top.png');
}

var steps, tower;

function create(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
//    var map = game.add.tilemap('test');
//    map.addTilesetImage('backgroundTile');
//    map.addTilesetImage('ltWindowTile');
//    map.addTilesetImage('rtWindowTile');
//    map.addTilesetImage('groundTile');
//    map.addTilesetImage('towerTile');
//    map.addTilesetImage('towerWindow');
//    map.addTilesetImage('outlineTile');
//        
//    // Add tilemap layers
//    map.createLayer('background');
//    map.createLayer('ltWindow');
//    map.createLayer('rtWindow');
//    map.createLayer('ground');
//    map.createLayer('tower');
//    map.createLayer('towerWindow');
//    outline = map.createLayer('outline');
//    
//    //Allows things to collide with the outline layer
//    map.setCollisionBetween(1332, 1360, true, 'outline');
    
    //Add background
    var background = game.add.sprite(0, 0, 'background');
    background.scale.setTo(0.89, 0.7);
    
    //Add steps
    steps = game.add.group();
    steps.enableBody = true;
    var step = steps.create(0, 940, 'step1');
    step.body.immovable = true;
    step = steps.create(399, 890, 'step2');
    step.body.immovable = true;
    step = steps.create(519, 804, 'step3');
    step.body.immovable = true;
    step = steps.create(648, 715, 'step4');
    step.body.immovable = true;
    step = steps.create(780, 619, 'step5');
    step.body.immovable = true;
    
    
    //Add tower
    tower = game.add.group();
    tower.enableBody = true;
    var towerPiece = tower.create(1550, 159, 'towerBody');
    towerPiece.body.immovable = true;
    towerPiece.scale.setTo(.85, .85);
    towerPiece = tower.create(1465, 58, 'towerTop');
    towerPiece.body.immovable = true;
//    towerPiece.scale.setTo(.85, .85);

        
    //Add button

//    skipButton = game.add.button(centerX+250, 60, 'skipButton', startLevelSelect, this);
//    skipButton.anchor.setTo(0.5, 0.5);
//    skipButton.scale.setTo(0.8, 0.8);
//    skipButton.inputEnabled = true;
    
    moveText = game.add.text(game.world.centerX,game.world.centerY - 100, text, { font: "65px Arial", fill: "#ffffff", align: "center" });
        
    nextButton = game.add.button(game.world.centerX+50, game.world.centerY + 50, 'backButton', actionOnClick, this);
    nextButton.scale.setTo(1,1);
    
    //create knight
    createKnight(0);
    //To prevent uneeded sword clink
    bossHurtOnce = true;
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