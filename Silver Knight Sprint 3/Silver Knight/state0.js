var state0 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.spritesheet('knight', 'assets/Silver Knight Spritesheet.png', 354, 230);
    game.load.spritesheet('giant', 'assets/Giant Spritesheet.png', 497, 630);
    game.load.image('background', 'assets/Level 1 Background.png');
    game.load.image('heart', 'assets/heart 100.png');
    game.load.image('half_heart', 'assets/half heart 100.png');
    game.load.image('ground', 'assets/Platform 1.1.png');
}

var demo = {},
    centerX = 2000 / 2,
    centerY = 1000 / 2,
    knight;

//Giant Variables
var giant;
var giantDistThreshold = 30;
var giantSpeed = 50;
var giantMoves;
var bossStompTime = 5;
var thresholdFromBossWalk = 100;
var thresholdFromBossAttack = 70;

//Movement Variables
var moveBinds;
var ground;
var antiGroundStuck;

//Blink Variables
var blink;
var blinkDist = 60;
var blinkTimer; //Unused
var canBlink;

//Attack
var attack;

// Momentum
var speed, drag = 10;
var vertSpeed = 0;

var health = 6; //Knight has 6 lives
//var change = game.rnd.integerInRange(1, 3);

var platforms;

var debug;

function create() {
    //Initiate game physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Game screen will adjust with the window size
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.time.advancedTiming = true;

    //Load Background
    var background = game.add.sprite(0, 0, 'background');

    //Ground

    //ground = platforms and stuff;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    platforms.enableBody = true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game 
    ground.scale.setTo(6, 2);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(1100, 700, 'ground');
    ledge.body.immovable = true;

    //Add Giant
    giant = game.add.sprite(centerX, centerY, 'giant');
    giant.anchor.setTo(0.5, 0.5);
    game.physics.enable(giant);
    giant.body.gravity.y = 400;
    giant.body.collideWorldBounds = true;
    giant.animations.add('walk', [1, 2, 3, 4], 3);
    giant.animations.add('stomp', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 12);
    giant.animations.add('swing', [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 12);

    //Health Display
    heart1 = game.add.image(10, 10, 'heart');
    heart2 = game.add.image(125, 10, 'heart');
    heart3 = game.add.image(240, 10, 'heart');

    //Add Silver Knight
    knight = game.add.sprite(0, 0, 'knight');
    knight.anchor.setTo(0.5, 0.5);
    game.physics.enable(knight);
    knight.body.bounce.y = 0.1;
    knight.body.gravity.y = 330;
    knight.body.collideWorldBounds = true;
    knight.animations.add('stand', [1, 2], 5);
    knight.animations.add('walk', [4, 5], 5);
    knight.animations.add('teleport', [7, 8, 9, 10, 11, 12], 14);
    knight.animations.add('attack', [14, 15, 16, 17, 18, 19, 20, 21], 14);

    //Movement Key Binds
    moveBinds = game.input.keyboard.addKeys({
        'upW': Phaser.KeyCode.W,
        'downS': Phaser.KeyCode.S,
        'leftA': Phaser.KeyCode.A,
        'rightD': Phaser.KeyCode.D
    });

    // Shift for blink, either left or right works
    blink = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
    canBlink = true;

    //Space for attack
    attack = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //Mouse click for teleportation
    game.input.mouse.capture = true;
    antiGroundStuck = ground.body.height + knight.body.height * 1.1; //Prevents the player from teleporting into the ground

    //Debugging
    //    debug = game.add.text(500, 16, 'Debugger, mouse x, mouse y, knight x, knight y: 0, 0, 0, 0', {
    //        fontSize: '32px',
    //        fill: '#000'
    //    });
}

function update() {
    //Knight loses health when hit by the giant
    game.physics.arcade.overlap(knight, giant, knightDamage, null, this);
    var hitPlatform = game.physics.arcade.collide(knight, platforms);

    //------------------MOVEMENT--------------------------//

    //Teleport
    if (blink.isDown && canBlink &&
        (moveBinds.leftA.isDown || moveBinds.rightD.isDown || moveBinds.upW.isDown || moveBinds.downS.IsDown)) {
        knight.animations.play('teleport');
        knight.visibile = false;
        blinkTele();
    } else if (game.input.activePointer.leftButton.isDown && canBlink) {
        knight.animations.play('teleport');
        game.time.events.add(Phaser.Time.SECOND * 5, update, this);
        cursorTele();
    }
    //Attack
    else if (attack.isDown) {
        knight.animations.play('attack');
    }
    //Move Left and Right
    else if (moveBinds.leftA.isDown) {
        knight.body.velocity.x = -400;
        knight.scale.setTo(-1, 1); //Knight faces left
        knight.animations.play('walk');
    } else if (moveBinds.rightD.isDown) {
        knight.body.velocity.x = 400;
        knight.scale.setTo(1, 1); //Knight faces right
        knight.animations.play('walk');
    } else {
        knight.animations.play('stand');
    }

    //Jump ------------NEEDS FIXING: touching.down->->->->Only works with actual ground and platforms, not world bounds. So make ground and //platform objects
    if (moveBinds.upW.isDown && knight.body.touching.down) {
        knight.body.velocity.y = -220;
    }

    //Stop moving left/right ------------NEEDS FIXING: touching.down->->->->->Ditto^^^
    if (moveBinds.downS.isDown && knight.body.touching.down) {
        knight.body.velocity.x = 0;
    }

    // Horizontal momentum kept and slowed down with drag
    speed = knight.body.velocity.x;
    if (speed > 0) {
        knight.body.velocity.x = Math.abs(speed - drag);
    } else if (speed < 0) {
        knight.body.velocity.x = speed + drag;
    } else {
        knight.body.velocity.x = 0;
    }
    //------------------END MOVEMENT--------------------------//

    //--------------GIANT AI-----------------------------//
    var distanceFromBoss = giant.body.center.x - knight.body.center.x;
    var currentTime = game.time.totalElapsedSeconds();

    //Swing if in close range
    if ((distanceFromBoss < thresholdFromBossAttack) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on right
        giant.body.velocity.x = 0;
        giant.scale.setTo(-1, 1); // Turns right
        giant.animations.play('swing');
    } else if ((distanceFromBoss > (-1 * thresholdFromBossAttack)) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on left
        giant.body.velocity.x = 0;
        giant.scale.setTo(1, 1); // Turns left
        giant.animations.play('swing');
    }

    //Stomp if further from the player than swing range, around every bossStompTime seconds
    else if ((distanceFromBoss > thresholdFromBossWalk) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giant.scale.setTo(1, 1); // Turns left
        giant.animations.play('stomp');
    } else if ((distanceFromBoss < (-1 * thresholdFromBossWalk)) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giant.scale.setTo(-1, 1); // Turns right
        giant.animations.play('stomp');
    }

    //Follow/track player
    else if (distanceFromBoss > thresholdFromBossWalk) {
        giant.body.velocity.x = -100;
        giant.scale.setTo(1, 1); // Turns left
        giant.animations.play('walk');
    } else if (distanceFromBoss < (-1 * thresholdFromBossWalk)) {
        giant.body.velocity.x = 100;
        giant.scale.setTo(-1, 1); //Turns right
        giant.animations.play('walk');
    }
    //--------------END GIANT AI-----------------------------//

    //Debugging
    //    debug.text = 'Debugger:\n mouse x-' + game.input.activePointer.x + '\n mouse y-' + game.input.activePointer.y + '\n knight x-' + knight.body.x + '\n knight y-' + knight.body.y + '\n currentTime: ' + currentTime + '\n currentTime % bossStompTime: ' + (currentTime % bossStompTime);
}

//Long teleportation
function cursorTele() {
    var newX = game.input.activePointer.x;
    var newY = game.input.activePointer.y;
    //to prevent getting stuck in ground
    if (newY >= game.world.height - antiGroundStuck) {
        newY = game.world.height - antiGroundStuck;
    }
    teleport(newX, newY);
}


//Blink
function blinkTele() {
    var newX = knight.body.x;
    var newY = knight.body.y;
    //if moving right add 10 to current pos
    if (moveBinds.rightD.isDown) {
        newX += blinkDist;
    }
    //else subtract 10
    else if (moveBinds.leftA.isDown) {
        newX -= blinkDist;
    }

    //if moving up subtract 10 to current pos
    else if (moveBinds.upW.isDown) {
        newY -= blinkDist;
    }
    //else add 10
    else if (moveBinds.downS.isDown) {
        newY += blinkDist;
        //check to not go below ground. Account for height of world and height of ground
        if (newY >= game.world.height - antiGroundStuck)
            newY = game.world.height - antiGroundStuck; //above or exactly at ground height
    }

    //        blinkTick--;

    //reset timer and tick if out of ticks
    //if(){
    //knight.body.y = 300;
    //            this.blinkTimer.destroy();
    //            blinkTimer = game.time.create(false);
    //            blinkTimer.start();
    //            blinkTick = 5;
    //      }
    teleport(newX, newY);
}

//Teleport
function teleport(newX, newY) {
    // knight.animations.play('teleport', 15, true);
    knight.body.x = newX;
    knight.body.y = newY;
    //Make teleporting look like actual teleporting
    knight.visibile = false;
    game.time.events.add(Phaser.Time.SECOND, update, this);
}

//Player loses health
function knightDamage() {
    health -= 1;

    // move player back when hit
    if (giant.body.velocity.x > knight.body.x) {

        knight.body.x -= 100;

    } else {

        knight.body.x += 100;

    }

    if (health == 5) {
        heart3.kill();
        heart3 = game.add.image(240, 10, 'half_heart');
    } else if (health == 4) {
        heart3.kill();
    } else if (health == 3) {
        heart2.kill();
        heart2 = game.add.image(125, 10, 'half_heart');
    } else if (health == 2) {
        heart2.kill();
    } else if (health == 1) {
        heart1.kill();
        heart1 = game.add.image(10, 10, 'half_heart');
    } else if (health <= 0) {
        heart1.kill();
        game.add.text(150, 250, 'GAME OVER', {
            fontSize: '90px',
            fill: '#000'
        });
    }
}
