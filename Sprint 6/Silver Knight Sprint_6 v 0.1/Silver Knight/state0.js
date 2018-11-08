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
    game.load.image('evil_heart', 'Assets/Evil Heart 100.png');
    game.load.image('evil_half_heart', 'Assets/Evil Half Heart 100.png');
    game.load.image('ground', 'assets/state0/Platform 1.1.png');
    
    //Pause Menu
    game.load.image('pauseMenu', 'assets/pause/Pause Menu.png');
    game.load.spritesheet('pauseButton', 'assets/pause/Pause Button.png', 100, 100);
    
    //Victory and Game Over
    game.load.image('victoryText', 'assets/Win or Lose/Victory Text.png');
    game.load.image('mainMenuButton', 'assets/Win or Lose/Main Menu Button.png');
    game.load.image('nextLevelButton', 'assets/Win or Lose/Next Lvl Button.png');
    game.load.image('gameOverText', 'assets/Win or Lose/Game Over Text.png');
    game.load.image('tryAgainButton', 'assets/Win or Lose/Try Again Button.png');
}

var demo = {},
    centerX = 2000 / 2,
    centerY = 1000 / 2,
    knight;

//Pause variables
var pauseButton, pauseMenu, mainMenuButton;

//Hitboxes for attacks/weapons
var hitboxes;
var knightBox;
var giantHitboxes;
var swingBox1, swingBox2, swingBox3;

//Giant Variables
var giant;
var giantSpeed = 150;
var giantMoves;
var bossStompTime = 5, bossTurnTimer;
var thresholdFromBossWalk = 300;

//Movement Variables
var moveBinds;
var ground;

//Blink Variables
var blink;
var blinkDist = 450;
var blinkTimer = 0;
var blinkCount = 3;
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
var walkSpeed = 600;

var bossHealth = 10;//Giant has health by points. Dies at 0
var health = 6; //Knight has 6 lives
//var change = game.rnd.integerInRange(1, 3);
var knightHurtTimer = 0, giantHurtTimer = 0;

var platforms, ledge;

var hitPlatform;
var touchingGround;
var onPlatform;

var pauseButton;

var debug;

function create() {
    console.log('level 1');
    
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
    ground = game.add.sprite(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game 
    ground.scale.setTo(8, 2);
    //  This stops it from falling away when you jump on it
    game.physics.enable(ground, Phaser.Physics.ARCADE);
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
    giant = game.add.sprite(centerX, centerY + 120, 'giant');
    giant.anchor.setTo(0.8, 0.5);
    game.physics.enable(giant);
    giant.hurtOnce = false;
    giant.body.gravity.y = 400;
    giant.frame = 1;
    //Adjust size of sprite's body, aka built in hitbox
    giant.body.setSize(200, 520, 280, 170);//520 y1
    
    giant.turning = false;
    bossTurnTimer = 100; 
    
    //Make hitBoxes for club
    giant.addChild(giantHitboxes);
    swingBox1 = giantHitboxes.create(0, 0, null);
    swingBox1.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    swingBox1.body.enable = false;

    swingBox2 = giantHitboxes.create(0, 0, null);
    swingBox2.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    swingBox2.body.enable = false;

    swingBox3 = giantHitboxes.create(0, 0, null);
    swingBox3.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    swingBox3.body.enable = false;
    
    giant.newScaleX = 1;
    giant.body.collideWorldBounds = true;
    giant.animations.add('walk', [1, 2, 3, 4], 3);
    
    //Stomping
    giant.stomping = false;
    giant.stompAni = giant.animations.add('stomp', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23, 23, 23, 23, 23, 23], 12);
    giant.stompAni.onComplete.add(function(){
        giant.stomping = false;
    }); 
    
    //Swinging club
    giant.swinging = false;
    giant.swingAni = giant.animations.add('swing', [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 16);

    // knight Health Display
    health = 6; // must be written here so it will be updated upon state.restart
    heart1 = game.add.image(10, 10, 'heart');
    heart2 = game.add.image(125, 10, 'heart');
    heart3 = game.add.image(240, 10, 'heart');
    
    // giant health display
    bossHealth = 10;
    evilHeart1 = game.add.image(1890, 10, 'evil_heart');
    evilHeart2 = game.add.image(1775, 10, 'evil_heart');
    evilHeart3 = game.add.image(1660, 10, 'evil_heart');
    evilHeart4 = game.add.image(1545, 10, 'evil_heart');
    evilHeart5 = game.add.image(1430, 10, 'evil_heart');
     
    //Teleport Timer Display
    timerSprite = game.add.sprite(355, 10, 'timer');
    timerSprite.alpha = 0.5;
    
    //Add Silver Knight
    knight = game.add.sprite(200, 0, 'knight');
    knight.anchor.setTo(0.5, 0.5);
    game.physics.enable(knight);
    knight.body.gravity.y = 2500;
    //Adjust size of sprite's body, aka built in hitbox
    knight.body.setSize(75, 211, 60, 18);
    
    //Make hitbox for sword
    knight.addChild(hitboxes);
    knightBox = hitboxes.create(0, 0, null);
    knightBox.anchor.setTo(0.5, 0.5);
    knight.hurtOnce = false;
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
    
    //Main Menu Button
    var mainMenuButton = game.add.button(centerX-250, 60, 'mainMenuButton', startLevelSelect, this);
    mainMenuButton.scale.setTo(.8, .8);
    mainMenuButton.anchor.setTo(0.5, 0.5);
    
    //Pause
    pauseButton = game.add.button(centerX + 100, 60, 'pauseButton');
    pauseButton.frame = 1;
    pauseButton.anchor.setTo(0.5, 0.5);
    pauseButton.onInputUp.add(pauseGame, this);
    
    //Debugging
    debug = game.add.text(1500, 16, ' ', {
        fontSize: '50px', fill: '#000' });
}

function update() {
    //Button Tints: Buttons tint when hovered over
    if (pauseButton.input.pointerOver()){
        pauseButton.frame = 0;
    }
    else{
        pauseButton.frame = 1;
    }
    
    //---Character collisions----//
    //Knight loses health when touching the giant, only when giant isn't turning
    if(!giant.turning)
        game.physics.arcade.overlap(knight, giant, knightDamage, null, this);
    //Giant loses health when hit by sword
    game.physics.arcade.overlap(giant, knightBox, giantDamage, null, this);
    //Knight loses health when hit by club
    if(!giant.turning)
        game.physics.arcade.overlap(giantHitboxes, knight, knightDamage, null, this);
    
    //----Environment collisions----//
    hitPlatform = game.physics.arcade.collide(knight, platforms);
    touchingGround = game.physics.arcade.collide(knight, ground);
    onPlatform = game.physics.arcade.overlap(knight, platforms);
    
    //To prevent falling through platforms when you teleport to one, seems unfair if not
    if(onPlatform && knight.teleporting){//Only when he's teleporting
        //put knight above platform
        knight.body.y = knight.body.y - platforms.antiStuck/2;
    }
    
    //------Timers------//
    //Damage timers
    hurt();
    
    
    // teleport timer
    teleTimers();
    
    var knightOrientation = knight.scale.x;
    
    //Attack
    if(attack.isDown && !knight.teleporting){
        attackFunc();
    }
    
    //------------------MOVEMENT--------------------------//   
    
    //Teleport controls
    teleControls();
    
    //Normal Movement
    movement(knightOrientation, hitPlatform);

    //Speed and drag
    speedF();
    //------------------END MOVEMENT--------------------------//

    
    //--------------GIANT AI-----------------------------//
    //giantTurnTimerFunc();
    var distanceFromBoss = giant.body.center.x - knight.body.center.x;
    if(giant.alive && giant.hurtOnce)
        giantAI(distanceFromBoss, touchingGround);
    
    //--------------END GIANT AI-----------------------------//

    //Debugging
    //debugF();    
}


//WASD movement
function movement(knightOrientation, hitPlatform){
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

    //Jump
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
}

//----------------- PAUSE ----------------------//

function pauseGame(){
    pauseMenu = game.add.sprite(centerX, centerY, 'pauseMenu');
    pauseMenu.anchor.setTo(0.5, 0.5);
    game.paused = true;
    game.input.onDown.add(unpauseGame, self);    
}

function unpauseGame(event){
    pauseMenu.destroy();
    game.paused = false;
}
        
//------------- END PAUSE ----------------------//

//Speed and drag
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

//Timers for in between each teleport/blink
function teleTimers(){
    
    if (canTele) {
        
        if(teleMode)
            timerSprite.frame = 4;
        else
            timerSprite.frame = 5;

    } else if (!canTele && teleTimer < 200) {

        teleTimer += 1;

        timerSprite.frame = 0;

    } else if (!canTele && teleTimer < 400) {

        teleTimer += 1;

        timerSprite.frame = 1;

    } else if (!canTele && teleTimer < 600) {

        teleTimer += 1;

        timerSprite.frame = 2;      

    } else if (!canTele && teleTimer < 800) {

        teleTimer += 1;

        timerSprite.frame = 3;

    } else if (!canTele && teleTimer == 800) {

        canTele = true;

        timerSprite.frame = 4;

    }

    //Blink timer
    if (!canBlink){
        blinkTimer += 1;
    }
    //Resetting for when using blinks
    if (blinkTimer === 15 && blinkCount > 0) {//Still have all blinks
        canBlink = true;
    } else if(blinkTimer === 270 && blinkCount === 0) {//Used up all blinks
        canBlink = true;
        blinkCount = 3;
    }
}

//Controls to teleport or blink
function teleControls(){
    //Long tele, click teleKey to enter long tele mode
    if(teleKey.downDuration(1)){
        teleMode = !teleMode;
    }
    
    //Controls for blinking and long teleporting
    if (blink.isDown &&//VV These for blinking in current direction VV
        (moveBinds.leftA.isDown || moveBinds.rightD.isDown || moveBinds.upW.isDown || moveBinds.downS.isDown)) {
        knight.teleporting = true;
        knight.animations.play('teleport');
        if(canBlink){
            blinkTele();
        }
    } else if (game.input.activePointer.leftButton.isDown && teleMode) {
        knight.teleporting = true;
        knight.animations.play('teleport');
        if(canTele){
            cursorTele();
        }
    }
}

//Attack animation and hitbox
function attackFunc() {
    knight.attacking = true;
    var x2 = -30;//if facing right
    if(knight.scale.x < 0)//facing left
        x2 = -180;
    //Make knightBox appear
    knightBox.body.setSize(200, 220, x2, -110);
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
    canTele = false;
    teleTimer = 0;
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
    blinkCount--;
    canBlink = false;
    blinkTimer = 0;
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
        knight.body.x = newX;
        knight.body.y = newY;
        //Make teleporting look like actual teleporting
        knight.visibile = false;
        game.time.events.add(Phaser.Time.SECOND, this);
}

//Giant swinging attack
function giantSwing(bossOrientation){
    giant.swinging = true;
    giant.animations.play('swing');
    var giantBoxTimer = game.time.create(true);
    //Coordiantes for hitboxes
    var x1L = [300, 300, 300], x1R = [300, 300, 300];
    var y1L = [200, 300, 150], y1R = [200, 300, 150];
    var x2L = [-200, -400, -335], x2R = [-85, 100, 35];
    var y2L = [-270, -200, 100], y2R = [-260, -200, 100];
    //1st hitbox
    giantBoxTimer.add(500, function(){
        if(bossOrientation > 0)//Left
            swingBox1.body.setSize(x1L[0], y1L[0], x2L[0], y2L[0]);
        else if(bossOrientation <= 0)//Right
            swingBox1.body.setSize(x1R[0], y1R[0], x2R[0], y2R[0]);
        swingBox1.body.enable = true;
    });
    //2nd hitbox made after 1 second, get rid of 1st
    giantBoxTimer.add(1000, function(){
        swingBox1.body.enable = false;
        swingBox1.body.setSize(0, 0, 0, 0);
        swingBox2.body.enable = true;
        if(bossOrientation > 0)//Left
            swingBox2.body.setSize(x1L[1], y1L[1], x2L[1], y2L[1]);
        else//Right
            swingBox2.body.setSize(x1R[1], y1R[1], x2R[1], y2R[1]);
    });
    //3rd hitbox made after .1 second after 2nd was made, get rid of 2nd
    giantBoxTimer.add(1100, function(){
        swingBox2.body.enable = false;
        swingBox2.body.setSize(0, 0, 0, 0);
        swingBox3.body.enable = true;
        if(bossOrientation > 0)//Left
            swingBox3.body.setSize(x1L[2], y1L[2], x2L[2], y2L[2]);
        else//Right
            swingBox3.body.setSize(x1R[2], y1R[2], x2R[2], y2R[2]);
    });
    //Get rid of 3rd hitbox after another .3 seconds
    giantBoxTimer.add(1400, function(){
        swingBox3.body.enable = false;
        swingBox3.body.setSize(0, 0, 0, 0);
    });
    giantBoxTimer.add(1800, function(){
        giant.swinging = false;
    });
    giantBoxTimer.start();
}

//Giant Stomp, make ground hurt knight & camera shake
function giantStomp(touchingGround){
    giant.animations.play('stomp');
    var stompTimer = game.time.create(true);
    stompTimer.add(900, function (){
        giant.stomping = true;
    });
    stompTimer.add(1200, function(){
        giant.stomping = false;
    });
    stompTimer.start();
    if(giant.stomping) {
        // You can set your own intensity and duration
        game.camera.shake(0.05, 100);
        // knight touching ground
        if (knight.body.touching.down && touchingGround) {
            knightDamage();
        }
    }
}

//Giant turn's left or right, a pause is added when turning
function giantTurn(magicBossPivotNumber, scaleX, bossOrientation){
    if(bossOrientation != scaleX){//Pivot turning
        giant.turning = true;
        giant.newScaleX = scaleX;
    }
}

//Timer for giant to wait until he can turn again
function giantTurnTimerFunc(magicBossPivotNumber){
    if(giant.turning){
        giant.frame = 1;
        giant.body.velocity.x = 0;
        bossTurnTimer -= 1;
    }
    if(bossTurnTimer == 0){
        giant.turning = false;
        bossTurnTimer = 100;
        giant.scale.setTo(giant.newScaleX, 1);
        //giant.body.x += -giant.newScaleX * magicBossPivotNumber;
    }
}

//Giant's movement in response to knight
function giantAI(distanceFromBoss, touchingGround){
    var currentTime = game.time.totalElapsedSeconds();
    var bossOrientation = giant.scale.x, magicBossPivotNumber = 200;
    giantTurnTimerFunc(magicBossPivotNumber);
    
    //Swing if in close range
    if (!giant.turning && !giant.swinging && !giant.stomping && (distanceFromBoss < 0) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on right
        giant.body.velocity.x = 0;
        giantTurn(magicBossPivotNumber, -1, bossOrientation);
        giantSwing(bossOrientation);
    } else if (!giant.turning && !giant.swinging && !giant.stomping && (distanceFromBoss > 0) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on left
        giant.body.velocity.x = 0;
        giantTurn(magicBossPivotNumber, 1, bossOrientation);
        giantSwing(bossOrientation);
    }

    //Stomp if further from the player than swing range, around every bossStompTime seconds
    else if (!giant.turning && !giant.swinging && (distanceFromBoss > thresholdFromBossWalk) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giantTurn(magicBossPivotNumber, 1, bossOrientation);
        giantStomp(touchingGround);
    } else if (!giant.turning && !giant.swinging && (distanceFromBoss < (-1 * thresholdFromBossWalk)) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giantTurn(magicBossPivotNumber, -1, bossOrientation);
        giantStomp(touchingGround);
    }

    //Follow/track player
    else if (!giant.turning && !giant.swinging && !giant.stomping && distanceFromBoss > thresholdFromBossWalk) {
        giant.body.velocity.x = -100;
        giantTurn(magicBossPivotNumber, 1, bossOrientation);
        giant.animations.play('walk');
    } else if (!giant.turning && !giant.swinging && !giant.stomping && distanceFromBoss < (-1 * thresholdFromBossWalk)) {
        giant.body.velocity.x = 100;
        giantTurn(magicBossPivotNumber, -1, bossOrientation);
        giant.animations.play('walk');
    }
    
}

//Damage timers, for damage functions to work properly
function hurt(){
    //Knight getting hurt, wait  to reset variable
    if(!knight.hurtOnce){
        knightHurtTimer += 1;
    }
    if(knightHurtTimer === 100){
        knight.hurtOnce = true;
        knightHurtTimer = 0;
    } 
    //Giant hurt
    if(!giant.hurtOnce){
        giantHurtTimer += 1;
    }
    if(giantHurtTimer === 30){
        giant.hurtOnce = true;
        giantHurtTimer = 0;
    } 
}

//Player loses health
function knightDamage() {
    if(knight.hurtOnce){
        knight.hurtOnce = false;
        health -= 1;

        //make player jump a little when hit
        knight.body.velocity.y  = -500;
        // move player back when hit
        if (giant.body.velocity.x > knight.body.x) {

            knight.body.velocity.x -= 1000;

        } else {

            knight.body.velocity.x += 1000;

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
            knight.kill();
            gameOver();
        }
    }
}

//Boss loses health
function giantDamage(){
    if(giant.hurtOnce){
        giant.hurtOnce = false;
        bossHealth -= 1;
        
        //Make giant slide in direction of knight hit
        if(knight.body.x < giant.body.x)
            giant.body.velocity.x += 500;
        else
            giant.body.velocity.x -= 500;
        
        if (bossHealth == 9) {
            evilHeart5.kill();
            evilHeart5 = game.add.image(1430, 10, 'evil_half_heart');
        } else if (bossHealth == 8) {
            evilHeart5.kill();
        } else if (bossHealth == 7) {
            evilHeart4.kill();
            evilHeart4 = game.add.image(1545, 10, 'evil_half_heart');
        } else if (bossHealth == 6) {
            evilHeart4.kill();
        } else if (bossHealth == 5) {
            evilHeart3.kill();
            evilHeart3 = game.add.image(1660, 10, 'evil_half_heart');
        } else if (bossHealth == 4) {
            evilHeart3.kill();
        } else if (bossHealth == 3) {
            evilHeart2.kill();
            evilHeart2 = game.add.image(1775, 10, 'evil_half_heart');
        } else if (bossHealth == 2) {
            evilHeart2.kill();
        } else if (bossHealth == 1) {
            evilHeart1.kill();
            evilHeart1 = game.add.image(1890, 10, 'evil_half_heart');
        } else if (bossHealth <= 0) {
            evilHeart1.kill();
            // add in animation when boss dies
            giant.kill();
            victory();
            level2Locked = false;
        }
            
    }
}

function victory(){
    var victoryText = game.add.image(centerX, centerY-100, 'victoryText');
    victoryText.anchor.setTo(0.5, 0.5);
    victoryText.scale.setTo(1.5, 1.5);
    
    var mainMenuButton = game.add.button(centerX + 250, centerY+150, 'mainMenuButton', startLevelSelect, this);
    mainMenuButton.scale.setTo(1.3, 1.3);
    mainMenuButton.anchor.setTo(0.5, 0.5);
    
    var nxtLvlButton = game.add.button(centerX - 250, centerY+150, 'nextLevelButton', startLevel2, this);
    nxtLvlButton.scale.setTo(1.3, 1.3);
    nxtLvlButton.anchor.setTo(0.5, 0.5);
}

function gameOver(){
    var gameOverText = game.add.image(centerX, centerY-100, 'gameOverText')
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.scale.setTo(1.5, 1.5);
    
    var mainMenuButton = game.add.button(centerX + 250, centerY+150, 'mainMenuButton', startLevelSelect, this);
    mainMenuButton.scale.setTo(1.3, 1.3);
    mainMenuButton.anchor.setTo(0.5, 0.5);
    
    var tryAgainButton = game.add.button(centerX - 250, centerY+150, 'tryAgainButton', restartLevel, this);
    tryAgainButton.scale.setTo(1.3, 1.3);
    tryAgainButton.anchor.setTo(0.5, 0.5);
}

function restartLevel(){
    console.log('restart');
    fadeAll()
    game.time.events.add(500, function() {
        this.game.state.restart();
    }, this);
}

function debugF(knightSlash){
    var distanceFromBoss = (giant.body.center.x - knight.body.center.x);
    debug.text = 'BossHealth '+bossHealth+'\ngiant.hurt: '+giant.hurtOnce+'\ntimer '+giantHurtTimer;
    
    game.debug.body(knight);
    game.debug.body(knightBox);
    game.debug.body(giant);
    game.debug.body(swingBox1);
    game.debug.body(swingBox2);
    game.debug.body(swingBox3);
    game.debug.body(ground);
}
