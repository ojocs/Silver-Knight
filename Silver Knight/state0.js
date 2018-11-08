var state0 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    preloadKnight();
    game.load.spritesheet('giant', 'assets/state0/Giant Spritesheet.png', 497, 630);
    game.load.image('background', 'assets/state0/Level 1 Background.png');
    game.load.image('evil_heart', 'Assets/Evil Heart 100.png');
    game.load.image('evil_half_heart', 'Assets/Evil Half Heart 100.png');
    game.load.image('ground', 'assets/state0/Platform 1.1.png');
}

var demo = {},
    centerX = 2000 / 2,
    centerY = 1000 / 2;

//Hitboxes for giant
var giantHitboxes;
var swingBox1, swingBox2, swingBox3;

//Giant Variables
var giant;
var giantSpeed = 150;
var giantMoves;
var bossStompTime = 5, bossTurnTimer;
var thresholdFromBossWalk = 300;

var bossHealth = 10;//Giant has health by points. Dies at 0
//var change = game.rnd.integerInRange(1, 3);
var giantHurtTimer = 0;

var platforms, ledge;

var hitPlatform, lineCollide, onPlatform;

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
    bossTurnTimer = 30; 
    
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
 
    // giant health display
    bossHealth = 10;
    evilHeart1 = game.add.image(1890, 10, 'evil_heart');
    evilHeart2 = game.add.image(1775, 10, 'evil_heart');
    evilHeart3 = game.add.image(1660, 10, 'evil_heart');
    evilHeart4 = game.add.image(1545, 10, 'evil_heart');
    evilHeart5 = game.add.image(1430, 10, 'evil_heart');
     
    createKnight(1);
    
    //Decode sounds
//    game.sound.setDecodedCallback([ teleAudio, teleAudio2, swordHitAudio ], updateKnight, this);
 
    //Debugging
    debug = game.add.text(1500, 16, ' ', {
        fontSize: '50px', fill: '#000' });
}

function update() {
    //Giant hurt timer
    giantHurt();
    
    //----Environment collisions----//
    hitPlatform = game.physics.arcade.collide(knight, platforms);
    lineCollide = game.physics.arcade.collide(knight, ground);
    onPlatform = game.physics.arcade.overlap(knight, platforms);
    
    //To prevent falling through platforms when you teleport to one, seems unfair if not
    if(onPlatform && knight.teleporting){//Only when he's teleporting
        //put knight above platform
        knight.body.y = knight.body.y - platforms.antiStuck/2;
    }
    
    //---Character collisions----//
    //Giant loses health when hit by sword
    game.physics.arcade.overlap(giant, knightBox, giantDamage, null, this);
    //Knight loses health when hit by club
    if(!giant.turning){
        livesTaken = 2;
        game.physics.arcade.overlap(giantHitboxes, knight, knightDamage, null, this);
    }
    
    //--------------GIANT AI-----------------------------//
    var distanceFromBoss = giant.body.center.x - knight.body.center.x;
    if(giant.alive)
        giantAI(distanceFromBoss);
    
    //--------------END GIANT AI-----------------------------//
    
    //Call knight's update
    updateKnight(distanceFromBoss, lineCollide);

    //Debugging
    //debugF();    
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

//Giant Stomp, make ground/platforms hurt knight & camera shake
function giantStomp(){
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
        if (knight.body.touching.down) {
            livesTaken = 1;
            knightDamage();
        }
    }
}

//Giant turn's left or right, a pause is added when turning
function giantTurn(scaleX, bossOrientation){
    if(bossOrientation != scaleX){//Pivot turning
        giant.turning = true;
        giant.newScaleX = scaleX;
    }
}

//Timer for giant to wait until he can turn again
function giantTurnTimerFunc(){
    if(giant.turning){
        giant.frame = 1;
        giant.body.velocity.x = 0;
        bossTurnTimer -= 1;
    }
    if(bossTurnTimer == 0){
        giant.turning = false;
        bossTurnTimer = 30;
        giant.scale.setTo(giant.newScaleX, 1);
    }
}

//Giant's movement in response to knight
function giantAI(distanceFromBoss){
    var currentTime = game.time.totalElapsedSeconds();
    var bossOrientation = giant.scale.x, magicBossPivotNumber = 200;
    giantTurnTimerFunc();
    
    //Swing if in close range
    if (!giant.turning && !giant.swinging && !giant.stomping && (distanceFromBoss < 0) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on right
        giant.body.velocity.x = 0;
        giantTurn(-1, bossOrientation);
        giantSwing(bossOrientation);
    } else if (!giant.turning && !giant.swinging && !giant.stomping && (distanceFromBoss > 0) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk))) { //Player on left
        giant.body.velocity.x = 0;
        giantTurn(1, bossOrientation);
        giantSwing(bossOrientation);
    }

    //Stomp if further from the player than swing range, around every bossStompTime seconds
    else if (!giant.turning && !giant.swinging && (distanceFromBoss > thresholdFromBossWalk) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giantTurn(1, bossOrientation);
        giantStomp();
    } else if (!giant.turning && !giant.swinging && (distanceFromBoss < (-1 * thresholdFromBossWalk)) && (currentTime % bossStompTime > bossStompTime - 1)) {
        giant.body.velocity.x = 0;
        giantTurn(-1, bossOrientation);
        giantStomp();
    }

    //Follow/track player
    else if (!giant.turning && !giant.swinging && !giant.stomping && distanceFromBoss > thresholdFromBossWalk) {
        giant.body.velocity.x = -100;
        giantTurn(1, bossOrientation);
        giant.animations.play('walk');
    } else if (!giant.turning && !giant.swinging && !giant.stomping && distanceFromBoss < (-1 * thresholdFromBossWalk)) {
        giant.body.velocity.x = 100;
        giantTurn(-1, bossOrientation);
        giant.animations.play('walk');
    }
    
}

//Damage timers, for damage functions to work properly
function giantHurt(){ 
    //Giant hurt
    if(!giant.hurtOnce){
        giantHurtTimer += 1;
    }
    if(giantHurtTimer === 30){
        giant.hurtOnce = true;
        giantHurtTimer = 0;
    } 
}

//Boss loses health
function giantDamage(){
    if(giant.hurtOnce){
        giant.hurtOnce = false;
        bossHealth -= 1;
        
        //Make giant slide in direction of knight hit
        if(knight.body.x < giant.body.x)
            giant.body.velocity.x += 50;
        else if(knight.body.x > giant.body.x)
            giant.body.velocity.x -= 50;
        
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

function debugF(){
    //var distanceFromBoss = (giant.body.center.x - knight.body.center.x);
    debug.text = 'Health '+health;
    
    game.debug.body(knight);
    game.debug.body(knightBox);
    game.debug.body(giant);
    game.debug.body(swingBox1);
    game.debug.body(swingBox2);
    game.debug.body(swingBox3);
    game.debug.body(ground);
}
