var tutorial = {
    preload: preload,
    create: create,
    update: update
}

var demo = {};
var backButton, skipButton;
var outline;

var knight, vel = 1300;

function preload(){
    game.load.image('backButton', 'assets/Tutorial/Continue Button.png');
    game.load.image('skipButton', 'assets/Tutorial/Skip Button.png');
    
    game.load.tilemap('tutorial', 'Assets/Tutorial/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('backgroundTile', 'Assets/Tutorial/backgroundTile.png'); // Key must match tileset names
    game.load.image('groundTile', 'Assets/Tutorial/groundTile.png');
    game.load.image('towerTile', 'Assets/Tutorial/towerTile.png');
    game.load.image('rtWindow', 'Assets/Tutorial/Right Window.png');
    game.load.image('ltWindow', 'Assets/Tutorial/Left Window.png');
    game.load.image('outline', 'Assets/Tutorial/outlineTile.png');
    game.load.image('towerWindow', 'Assets/Tutorial/Tower Window.png');
    game.load.image('knight', 'assets/knight/Silver Knight 8-Bit 500.png');
}

function create(){
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    var map = game.add.tilemap('tutorial');
    map.addTilesetImage('backgroundTile');
    map.addTilesetImage('groundTile');
    map.addTilesetImage('towerTile');
    map.addTilesetImage('rtWindow');
    map.addTilesetImage('ltWindow');
    map.addTilesetImage('outline');
    map.addTilesetImage('towerWindow');
    
    var background = map.createLayer('background');
    map.createLayer('windows');
    map.createLayer('ground');
    map.createLayer('tower');
    map.createLayer('towerWindow');
    outline = map.createLayer('outline');
    
    
    // --------- COLLISION NOT WORKING ---------- //
    map.setCollisionBetween(681, 688, true, 'outline');
    
    //Add buttons
    backButton = game.add.button(100, 100, 'backButton');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.scale.setTo(-1, 1);
    backButton.inputEnabled = true;
    backButton.onInputUp.add(returnToStart, this);
    
    skipButton = game.add.button(1800, 100, 'skipButton');
    skipButton.anchor.setTo(0.5, 0.5);
    skipButton.scale.setTo(0.5, 0.5);
    skipButton.inputEnabled = true;
    skipButton.onInputUp.add(startGame, this); 
    
    // -----knight------- //
    knight = game.add.sprite(0, 0, 'knight');
    knight.anchor.setTo(0.5, 0.5);
    knight.scale.setTo(0.7, 0.7);
    knight.animations.add('walk', [0, 1]);
    game.physics.enable(knight);
    cursors = game.input.keyboard.createCursorKeys(); // Placeholder to test movement
}

function update(){
    game.physics.arcade.collide(knight, outline);
    
    // Movement
    if (cursors.up.isDown){
        knight.body.velocity.y = -vel; // Must use velocity w/ physics engine
    }
    else if (cursors.down.isDown){
        knight.body.velocity.y = vel;
    }
    else{ // Di stops moving when nothing is pressed
        knight.body.velocity.y = 0;
    }


    if (cursors.left.isDown){
        knight.body.velocity.x = -vel;
    }
    else if (cursors.right.isDown){
        knight.body.velocity.x = vel;
    }
    else{
        knight.body.velocity.x = 0;
    }
}

function returnToStart(){
    game.state.start('startScreen')
}