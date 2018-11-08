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
        
        //Preload tilemap
        game.load.tilemap('test', 'assets/tutorial/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('backgroundTile', 'assets/tutorial/backgroundTile.png'); // Key must match tileset names
        game.load.image('ltWindowTile', 'assets/tutorial/Left Window.png');
        game.load.image('rtWindowTile', 'assets/tutorial/Right Window.png');
        game.load.image('groundTile', 'assets/tutorial/groundTile.png');
        game.load.image('towerTile', 'assets/tutorial/towerTile.png');
        game.load.image('towerWindow', 'assets/tutorial/Tower Window.png');
        game.load.image('outlineTile', 'assets/tutorial/outlineTile.png');
}

function create(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    var map = game.add.tilemap('test');
    map.addTilesetImage('backgroundTile');
    map.addTilesetImage('ltWindowTile');
    map.addTilesetImage('rtWindowTile');
    map.addTilesetImage('groundTile');
    map.addTilesetImage('towerTile');
    map.addTilesetImage('towerWindow');
    map.addTilesetImage('outlineTile');
        
    // Add tilemap layers
    map.createLayer('background');
    map.createLayer('ltWindow');
    map.createLayer('rtWindow');
    map.createLayer('ground');
    map.createLayer('tower');
    map.createLayer('towerWindow');
    outline = map.createLayer('outline');
    
    //Allows things to collide with the outline layer
    map.setCollisionBetween(1332, 1360, true, 'outline');
        
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
}
 
function update() {
    //Just change 'adam' to whatever sprite's name that you want to collide
    var lineCollide = game.physics.arcade.collide(knight, outline);
        
    //update knight
    updateKnight(0, lineCollide);
//    if(skipButton.input.pointerOver())
//        teleMode = false;
        
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