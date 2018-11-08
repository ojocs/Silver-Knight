var state0 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.spritesheet('knight', 'assets/knight/Silver Knight Spritesheet.png', 354, 230);
    game.load.spritesheet('giant', 'assets/state0/Giant Spritesheet.png', 497, 630);
    game.load.spritesheet('timer', 'assets/Timer Spritesheet.png', 100, 100);
    game.load.image('background', 'assets/state0/Level 1 Background.png');
    game.load.image('heart', 'assets/knight/heart 100.png');
    game.load.image('half_heart', 'assets/knight/half heart 100.png');
    game.load.image('ground', 'assets/state0/Platform 1.1.png');
}

var demo = {},
    centerX = 2000 / 2,
    centerY = 1000 / 2,
    knight;

//Hitboxes for attacks/weapons
var hitboxes;
var knightBox;
var giantHitboxes;
var giantBox;

//Giant Variables
var giant;
var giantDistThreshold = 30;
var giantSpeed = 150;
var giantMoves;
var bossStompTime = 5;
var thresholdFromBossWalk = 100;
var thresholdFromBossAttack = 100;

//Movement Variables
var moveBinds;
var ground;

//Blink Variables
var blink;
var blinkDist = 450;
var blinkTimer; //Unused
var canBlink;

var blinkAni;

//Long teleport
var canTele;
var teleKey;
var teleMode;
var teleTimer = 0;
var timerSprite;

//Attack
var attack;

// Momentum
var speed, drag = 25;
var vertSpeed = 0;
var walkSpeed = 600;

var bossHealth = 1000;//Giant has health by points. Dies at 0
var health = 6; //Knight has 6 lives
//var change = game.rnd.integerInRange(1, 3);

var platforms, ledge;

var debug;

function create() {
    //Initiate game physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Game screen will adjust with the window size
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.time.advancedTiming = true;

    //Load Background
    var background = game.add.sprite(0, 0, 'background');

    //Make hitboxes for weapons
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    giantHitboxes = game.add.group();
    giantHitboxes.enableBody = true;

    //  The platforms group contains the ground and the ledges we can jump on
    platforms = game.add.group();
    platforms.enableBody = true;
    // Here we create the ground.
    ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game 
    ground.scale.setTo(6, 2);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    //Give platforms a height property, for not getting stuck in these objects later
    platforms.antiStuck = ground.body.height;
    
    ledge = platforms.create(1650, 300, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(0, 250, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(1150, 450, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(500, 430, 'ground');
    ledge.body.immovable = true;
    
    //Add Giant
    giant = game.add.sprite(centerX - 100, centerY + 120, 'giant');
    giant.anchor.setTo(0.5, 0.5);
    game.physics.enable(giant);
    giant.body.gravity.y = 400;giant.frame = 1;
    //Adjust size of sprite's body, aka built in hitbox
    giant.body.setSize(200, 1000, 280, 170);//(200, 520, 280, 170);
    
    //Make hitBox for club
    giant.addChild(giantHitboxes);
    giantBox = giantHitboxes.create(0, 0, null);
    giantBox.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    giantBox.body.enable = false;
    
    giant.body.collideWorldBounds = true;
    giant.animations.add('walk', [1, 2, 3, 4], 3);
    giant.animations.add('stomp', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 12);
    
    //To add delay in turning, gives playaer a chance to attack
    giant.turning = false;
    giant.turnAni = giant.animations.add('turn', [1], 1);//add more frames for slower turning?
    giant.turnAni.onStart.add(function (){
        game.time.events.add(Phaser.Time.SECOND, this);
    });
    giant.turnAni.onComplete.add(function (){
        giant.turning = false;
    });
    giant.swinging = false;
    giant.swingAni = giant.animations.add('swing', [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 16);
    giant.swingAni.onComplete.add(function (){
        giant.swinging = false;
    });

    //Health Display
    heart1 = game.add.image(10, 10, 'heart');
    heart2 = game.add.image(125, 10, 'heart');
    heart3 = game.add.image(240, 10, 'heart');
    
    //Teleport Timer Display
    timerSprite = game.add.sprite(355, 10, 'timer');
    
    //Add Silver Knight
    knight = game.add.sprite(0, 0, 'knight');
    knight.anchor.setTo(0.5, 0.5);
    game.physics.enable(knight);
    knight.body.gravity.y = 2500;
    //Adjust size of sprite's body, aka built in hitbox
    knight.body.setSize(80, 211, 40, 10);
    
    //Make hitbox for sword
    knight.addChild(hitboxes);
    knightBox = hitboxes.create(0, 0, null);
    knightBox.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless knight is attacking
    knightBox.body.enable = false;
    
    knight.attacking = false;
    
    knight.body.collideWorldBounds = true;
    knight.animations.add('stand', [1, 2], 5);
    knight.animations.add('walk', [4, 5], 5);
    knight.attackAni = knight.animations.add('attack', [14, 15, 16, 17, 18, 19, 20, 21], 25);
    knight.tele = knight.animations.add('teleport', [7, 8, 9, 10, 11, 12], 14);
    
    knight.attackAni.onStart.add(function (){
        speedF;
    });
    
    //To play animations completely
    knight.attackAni.onComplete.add(function () {
        knight.attacking = false;
    });
    knight.tele.onComplete.add(function () {
        knight.teleporting = false;
    });
    
    //Movement Key Binds
    moveBinds = game.input.keyboard.addKeys({
        'upW': Phaser.KeyCode.W,
        'downS': Phaser.KeyCode.S,
        'leftA': Phaser.KeyCode.A,
        'rightD': Phaser.KeyCode.D
    });

    // Shift for blink, either left or right works
    blink = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
    
    //Space for attack
    attack = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //Mouse click for teleportation, click teleKey to enter long tele mode
    game.input.mouse.capture = true;
    teleKey = game.input.keyboard.addKey(Phaser.KeyCode.F);
    teleMode = false;
    
    //For limiting teleportation
    canBlink = true;
    canTele = true;
    
    // camera follow knight 
    game.camera.follow(knight);
    
    //Debugging
    debug = game.add.text(500, 16, 'Debugger, mouse x, mouse y, knight x, knight y: 0, 0, 0, 0', {
        fontSize: '32px', fill: '#000' });
}

function update() {
    //---Character collisions----//
    //Knight loses health when touching by the giant
   // game.physics.arcade.overlap(knight, giant, knightDamage, null, this);
    //Giant loses health when hit by sword
    game.physics.arcade.overlap(knightBox, giant, giantDamage, null, this);
    //Knight loses health when hit by club
    game.physics.arcade.overlap(knight, giantBox, knightDamage, null, this);
    
    //----Environment collisions----//
    var hitPlatform = game.physics.arcade.collide(knight, platforms);
    var touchingGround = game.physics.arcade.collide(knight, ground);
    var onPlatform = game.physics.arcade.overlap(knight, platforms);
    
    //To prevent falling through platforms when you teleport to one, seems unfair if not
    if(onPlatform && knight.teleporting){//Only when he's teleporting
        //put knight above platform
        knight.body.y = knight.body.y - platforms.antiStuck/2;
    }
    
    //Long tele, click teleKey to enter long tele mode
    if(teleKey.downDuration(1)){
        teleMode = !teleMode;
    }
    
    var knightOrientation = knight.scale.x;
    
    //Attack
    if(attack.isDown && !knight.teleporting){
        attackFunc(knightOrientation);
    }
    
    //------------------MOVEMENT--------------------------//
    
    
    // teleport timer
    if (!canTele) {
        teleTimer += 1;
    }
    
    if (teleTimer == 1000) {
        canTele = true;
        timerSprite.frame = 5;
    }
    
    //Teleport
    if (blink.isDown &&//VV These for blinking in current direction VV
        (moveBinds.leftA.isDown || moveBinds.rightD.isDown || moveBinds.upW.isDown || moveBinds.downS.isDown)) {
        knight.teleporting = true;
        knight.animations.play('teleport');
        if(canBlink){
            blinkTele();
            canBlink = false;
        }
    } else if (game.input.activePointer.leftButton.isDown && teleMode) {
        knight.teleporting = true;
        knight.animations.play('teleport');
        if(canTele){
            cursorTele();
            //canTele = false;
        }
    }
    
    var magicKnightPivotNumber = 114;//cause it's some random number that works
    //So animations work properly and one doesn't stop the other
    if(!knight.attacking && !knight.teleporting){    
        //Move Left and Right
        if (moveBinds.leftA.isDown) {
            knight.body.velocity.x = walkSpeed * -1;
            knight.scale.setTo(-1, 1); //Knight faces left
            if(knightOrientation != knight.scale.x){//Pivot turning
                knight.body.x -= knight.body.width + magicKnightPivotNumber;
            }
            knight.animations.play('walk');
        } else if (moveBinds.rightD.isDown) {
            knight.body.velocity.x = walkSpeed;
            knight.scale.setTo(1, 1); //Knight faces right
            if(knightOrientation != knight.scale.x){//Pivot turning
                knight.body.x += knight.body.width + magicKnightPivotNumber;
            }
            knight.animations.play('walk');
        } else if(knight.body.velocity.x == 0){
            knight.animations.play('stand');
        }

    //Jump ------------NEEDS FIXING: touching.down->->->->Only works with actual ground and platforms, not world bounds. So make ground and //platform objects
        if (moveBinds.upW.isDown && knight.body.touching.down) {
            knight.body.velocity.y = -1000;
        }

    //Stop moving left/right and fall through platforms
        if (moveBinds.downS.isDown){
            if(hitPlatform && knight.body.touching.down //Allow knight to fall through the platform
               && (knight.body.y + knight.body.height < game.world.height - 70)){//Not the ground
               knight.body.y += platforms.antiStuck/4;
            }
            knight.body.velocity.x = 0;
        }
    }

    speedF();
    //------------------END MOVEMENT--------------------------//

    
    //--------------GIANT AI-----------------------------//
    var distanceFromBoss = giant.body.center.x - knight.body.center.x;
    giantAI(distanceFromBoss);
    
    //--------------END GIANT AI-----------------------------//

    //Debugging
    debugF(game.physics.arcade.collide(knightBox, giant));    
}

function speedF(){
    // Horizontal momentum kept and slowed down with drag
    speed = knight.body.velocity.x;
    if (speed > 0) {
        knight.body.velocity.x = Math.abs(speed - drag);
    } else if (speed < 0) {
        knight.body.velocity.x = speed + drag;
    } else {
        knight.body.velocity.x = 0;
    }
}

//Attack animation and hitbox
function attackFunc(knightOrientation) {
    knight.attacking = true;
    //knightBox.body.setSize(30, 100, -30 * (knightOrientation/knightOrientation), -70);
    //Above setting for it to appear on sword, later plan to figure out how to rotate knightBox in tangent to sword animation
    //Make knightBox appear
    knightBox.body.setSize(200, 220, -30 * (knightOrientation/knightOrientation), -110);
    knightBox.body.enable = true;
    knight.animations.play('attack');
    var knightBoxTimer = game.time.create(true);
    knightBoxTimer.add(500, function(){
        knight.attacking = false;
        knightBox.body.enable = false;
    });
    knightBoxTimer.start();
}

//Long teleportation
function cursorTele() {//Get center of knight to wherever mouse clicks
    
    //Width-wise. Weird numbers because of how spritesheet is set up right now
    var newX = game.input.activePointer.x;
    if(knight.scale.x == 1){//facing right
       newX -= knight.body.width/4;
    }else if(knight.scale.x == -1){//facing left
        newX -= knight.body.width/1.4;
    }
    
    //Height-wise
    var newY = game.input.activePointer.y - knight.body.height/2;
    teleport(newX, newY);
}


//Blink
function blinkTele(sprite, animation) {
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
    }

    teleport(newX, newY);
}

//Teleport
function teleport(newX, newY) {
    if (canTele) {
        knight.body.x = newX;
        knight.body.y = newY;
        //Make teleporting look like actual teleporting
        knight.visibile = false;
        game.time.events.add(Phaser.Time.SECOND, this);
        canTele = false;
        teleTimer = 0;
    }
}

//Giant swinging attack
function giantSwing(bossOrientation){
    giant.swinging = true;
    giantBox.body.setSize(200, 220, -100 * (bossOrientation/bossOrientation), 100);
    giantBox.body.enable = true;
    giant.animations.play('swing');
    var giantBoxTimer = game.time.create(true);
    giantBoxTimer.add(500, function(){
        giant.swinging = false;
        giantBox.body.enable = false;
    });
    giantBoxTimer.start();
}

//Giant's movement in response to knight
function giantAI(distanceFromBoss){
    var currentTime = game.time.totalElapsedSeconds();
    var turnDelay = 1000;
    var bossOrientation = giant.scale.x;

    //Swing if in close range
    if ((distanceFromBoss < thresholdFromBossAttack)){// && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on right
        giant.body.velocity.x = 0;
        giant.scale.setTo(-1, 1); // Turns right
        if(bossOrientation != giant.scale.x){//Pivot turning
            giant.turning = true;
            giant.body.x += giant.body.width;
            game.time.events.add(turnDelay, function () {/* … */});
            giant.animations.play('turn');
        }
        giantSwing(bossOrientation);
    } else if ((distanceFromBoss > (-1 * thresholdFromBossAttack))){// && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on left
        giant.body.velocity.x = 0;
        giant.scale.setTo(1, 1); // Turns left
        if(bossOrientation != giant.scale.x){//Pivot turning
            giant.turning = true;
            giant.body.x -= giant.body.width;
            game.time.events.add(turnDelay, function () {/* … */});
            giant.animations.play('turn');
        }
        giantSwing(bossOrientation);
    }

    if(!giant.alive){//if(!giant.swinging){
    //Stomp if further from the player than swing range, around every bossStompTime seconds
    if ((distanceFromBoss > thresholdFromBossWalk) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giant.scale.setTo(1, 1); // Turns left
        if(bossOrientation != giant.scale.x){//Pivot turning
            giant.turning = true;
            giant.body.x -= giant.body.width;
            game.time.events.add(turnDelay, function () {/* … */});
            giant.animations.play('turn');
        }
        giant.animations.play('stomp');
    } else if ((distanceFromBoss < (-1 * thresholdFromBossWalk)) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giant.scale.setTo(-1, 1); // Turns right
        if(bossOrientation != giant.scale.x){//Pivot turning
            giant.turning = true;
            giant.body.x += giant.body.width;
            game.time.events.add(turnDelay, function () {/* … */});
            giant.animations.play('turn');
        }
        giant.animations.play('stomp');
    }

    //Follow/track player
    else if (distanceFromBoss > thresholdFromBossWalk) {
        //giant.body.velocity.x = -1 * giantSpeed;
        giant.scale.setTo(1, 1); // Turns left
        if(bossOrientation != giant.scale.x){//Pivot turning
            giant.turning = true;
            giant.body.x -= giant.body.width;
            game.time.events.add(turnDelay, function () {giant.animations.play('turn');});
            giant.animations.play('turn');
        }
        giant.animations.play('walk');
    } else if (distanceFromBoss < (-1 * thresholdFromBossWalk)) {
        //giant.body.velocity.x = giantSpeed;
        giant.scale.setTo(-1, 1); //Turns right
        if(bossOrientation != giant.scale.x){//Pivot turning
            giant.turning = true;
            giant.body.x += giant.body.width;
            game.time.events.add(turnDelay, function () {/* … */});
            giant.animations.play('turn');
        }
        giant.animations.play('walk');
    }
    }
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

//Boss loses health
function giantDamage(){
    bossHealth--;
        
    //Add in animation when boss dies
    if(bossHealth <= 0)
        giant.kill();
}

function debugF(knightSlash){
    debug.text = 'Debugger:\n knight x-' + knight.body.x + '\n knight y-' + knight.body.y 
//        + '\n currentTime: ' + currentTime + '\n currentTime % bossStompTime: ' + (currentTime % bossStompTime) 
        + '\n teleKey-' + teleKey.isDown + '\n teleMode-' + teleMode + '\n bossTurning-'+ giant.turning+ '\nknight.attacking-'+knight.attacking + '\n slash-'+knightSlash + '\n giantHealth-' + bossHealth;
    game.debug.body(knight);
    game.debug.body(knightBox);
    game.debug.body(giant);
    game.debug.body(giantBox);
}
