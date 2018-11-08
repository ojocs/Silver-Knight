var demo = {}, adam, vel = 600, outline, moveBinds, movementTested = false;
demo.tutorial = function(){};
demo.tutorial.prototype = {
    preload: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE); // Redundant since it's already been called in state0
        
        //Buttons
        game.load.image('backButton', 'assets/Tutorial/Continue Button.png');
        game.load.image('skipButton', 'assets/Tutorial/Skip Button.png');        
        
        //Preload tilemap
        game.load.tilemap('test', 'assets/tutorial/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('backgroundTile', 'assets/tutorial/backgroundTile.png'); // Key must match tileset names
        game.load.image('ltWindowTile', 'assets/tutorial/Left Window.png');
        game.load.image('rtWindowTile', 'assets/tutorial/Right Window.png');
        game.load.image('groundTile', 'assets/tutorial/groundTile.png');
        game.load.image('towerTile', 'assets/tutorial/towerTile.png');
        game.load.image('towerWindow', 'assets/tutorial/Tower Window.png');
        game.load.image('outlineTile', 'assets/tutorial/outlineTile.png');
        game.load.image('adam', 'assets/tutorial/adam.png');
    },
    create: function(){
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
        
        //Add buttons
        backButton = game.add.button(100, 100, 'backButton');
        backButton.anchor.setTo(0.5, 0.5);
        backButton.scale.setTo(-1, 1);
        backButton.inputEnabled = true;
        backButton.onInputUp.add(returnToMain, this);

        skipButton = game.add.button(1800, 100, 'skipButton');
        skipButton.anchor.setTo(0.5, 0.5);
        skipButton.scale.setTo(0.5, 0.5);
        skipButton.inputEnabled = true;
        skipButton.onInputUp.add(startLevel1, this); 
        
        //Movement Key Binds
        moveBinds = game.input.keyboard.addKeys({
            'upW': Phaser.KeyCode.W,
            'downS': Phaser.KeyCode.S,
            'leftA': Phaser.KeyCode.A,
            'rightD': Phaser.KeyCode.D
        });
        
        // Can remove this sprite //
        adam = game.add.sprite(50, 50, 'adam');
        adam.anchor.setTo(0.5, 0.5);
        game.physics.enable(adam);
        
        // Can remove this "cursors" line //
        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function(){
        //Just change 'adam' to whatever sprite's name that you want to collide
        game.physics.arcade.collide(adam, outline);
        
        
        if (!movementTested){
            testMovement()
        }
        // ---- Temporary Sprite's Movement ------ // Can be removed
        if (moveBinds.upW.isDown){
            adam.body.velocity.y = -vel;
        }
        else if (moveBinds.downS.isDown){
            adam.body.velocity.y = vel;
        }
        else{
            adam.body.velocity.y = 0;
        }
        
        
        if (moveBinds.leftA.isDown){
            adam.body.velocity.x = -vel;
        }
        else if (moveBinds.rightD.isDown){
            adam.body.velocity.x = vel;
        }
        else{
            adam.body.velocity.x = 0;
        }
        // ----- End Movement ----- ..

    },
};

//WASD movement
function testMovement(){
    game.add.text(600, 50, 'Try to move by pressing the WASD keys', {
                fontSize: '50px',
                fill: '#FFFFFF'
            });
        if (moveBinds.upW.isDown){
            adam.body.velocity.y = -vel;
            movementTested = true;
        }
        else if (moveBinds.downS.isDown){
            adam.body.velocity.y = vel;
            movementTested = true;
        }
        else{
            adam.body.velocity.y = 0;
        }
        
        
        if (moveBinds.leftA.isDown){
            adam.body.velocity.x = -vel;
            movementTested = true;
        }
        else if (moveBinds.rightD.isDown){
            adam.body.velocity.x = vel;
            movementTested = true;
        }
        else{
            adam.body.velocity.x = 0;
        }
        
    
}


function returnToMain(){
    game.state.start('startScreen')
}