var state0 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    preloadKnight();
    preloadBoss();
    //Giant's preload
    game.load.spritesheet('giant', 'assets/state0/Giant Spritesheet.png', 497, 630);
    //Giant sounds
    game.load.audio('stompThud', 'assets/audio/giant audio/stomp 1.wav');
    game.load.audio('bossStep', 'assets/audio/giant audio/Boss Step 2.wav');
    //Level preload
    game.load.image('background', 'assets/state0/Level 1 Background.png');
    game.load.image('ground', 'assets/state0/Platform 1.1.png')
}

var demo = {},
    centerX = 2000 / 2,
    centerY = 1000 / 2;

//Hitboxes for giant's club
var swingBox1, swingBox2, swingBox3;

//Giant sounds
var stompThud, bossStep;

//var change = game.rnd.integerInRange(1, 3);
var platforms, ledge;

var hitPlatform, groundCollide, onPlatform;

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

    //  The platforms group contains the ground and the ledges we can jump on
    platforms = game.add.group();
    platforms.enableBody = true;
    // Here we create the ground.
    ground = platforms.create(0, game.world.height - 64, 'ground');
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
    createBoss();
    boss = game.add.sprite(centerX, centerY + 120, 'giant');
    boss.speed = 140, boss.health = 1;
    boss.anchor.setTo(0.8, 0.5);
    game.physics.enable(boss);
    boss.body.gravity.y = 400;
    boss.frame = 1;
    //Adjust size of sprite's body, aka built in hitbox
    boss.body.setSize(200, 520, 280, 170);
    boss.body.collideWorldBounds = true;
    
    //Set variables for attacks
    boss.turning = false, bossTurnTimer = 30, bossSpecialTime = 5, thresholdFromBossWalk = 300;
    
    //Make hitboxes for weapons
    bossHitboxes = game.add.group();
    bossHitboxes.enableBody = true;
    boss.addChild(bossHitboxes);
    
    //Make hitBoxes for club
    swingBox1 = bossHitboxes.create(0, 0, null);
    swingBox1.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    swingBox1.body.enable = false;

    swingBox2 = bossHitboxes.create(0, 0, null);
    swingBox2.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    swingBox2.body.enable = false;

    swingBox3 = bossHitboxes.create(0, 0, null);
    swingBox3.anchor.setTo(0.5, 0.5);
    //So hitbox won't be active unless giant is swinging
    swingBox3.body.enable = false;
    
    boss.newScaleX = 1;
    boss.animations.add('walk', [1, 2, 3, 4], 3);
    
    //Stomping
    boss.attack2 = false;
    boss.stompAni = boss.animations.add('stomp', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23, 23, 23, 23, 23, 23], 12);
    boss.stompAni.onComplete.add(function(){
        boss.attack2 = false;
    });
        
    //Swinging club
    boss.attack1 = false;
    boss.swingAni = boss.animations.add('swing', [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 16);
 
    //Giant Audio
    stompThud = game.add.audio('stompThud'), bossStep = game.add.audio('bossStep', 15);
     
    createKnight(1);
   
    //Debugging
    debug = game.add.text(1500, 16, ' ', {
        fontSize: '50px', fill: '#000' });
}

function update() {    
    isLevel1 = true;
    fadeOutIntro();
    
    //----Environment collisions----//
    hitPlatform = game.physics.arcade.collide(knight, platforms);
    //Complicated but actually works unlike arcade.collide for  some reason. Also 4 is random number that helps get it perfect
    groundCollide = (knight.body.y + knight.body.height) === (game.world.height - platforms.antiStuck - 4);
    onPlatform = game.physics.arcade.overlap(knight, platforms);
    
    //To prevent falling through platforms when you teleport to one, seems unfair if not
    if(onPlatform && knight.teleporting){//Only when he's teleporting
        //put knight above platform
        knight.body.y = knight.body.y - platforms.antiStuck/2;
    }
    
    //---Character collisions----//
    //Knight loses health when hit by club
    if(!boss.turning && boss.alive){
        livesTaken = 2, knightStaggerJump = 500, knightStaggerSlide = 2000;
        game.physics.arcade.overlap(bossHitboxes, knight, knightDamage, null, this);
    }
    
    var distanceFromBoss = boss.body.center.x - knight.body.center.x;
    var vertFromBoss = boss.body.y - (knight.body.y + knight.body.height);
    
    //--------------GIANT AI-----------------------------//
    if(boss.alive)
        updateBoss(distanceFromBoss);    
    
    //Call knight's update
    updateKnight(distanceFromBoss, vertFromBoss, groundCollide);

    //Debugging
    debugF();    
}

//Giant swinging attack
function giantSwing(bossOrientation){
    boss.attack1 = true;
    boss.animations.play('swing');
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
        boss.attack1 = false;
    });
    giantBoxTimer.start();
}

//Giant Stomp, make ground/platforms hurt knight & camera shake
function giantStomp(){
    boss.animations.play('stomp');
    var stompTimer = game.time.create(true);
    stompTimer.add(900, function (){
        boss.attack2 = true;
    });
    stompTimer.add(1200, function(){
        boss.attack2 = false;
    });
    stompTimer.start();
    if(boss.attack2) {
        //Thud sound
        stompThud.play();
        // You can set your own intensity and duration
        game.camera.shake(0.05, 100);
        // knight touching ground or platform
        if (knight.body.touching.down) {
            //If touching ground, decrement life by 1, else only make him stagger
            livesTaken = groundCollide ? 1 : 0;
            kngihtStaggerJump = 500, knightStaggerSlide = 2000, knightDamage();
        }
    }
}

function debugF(){
    //var distanceFromBoss = (boss.body.center.x - knight.body.center.x);
    debug.text = 'Livestaken '+livesTaken;
    
    game.debug.body(knight);
    game.debug.body(knightBox);
    game.debug.body(boss);
    game.debug.body(swingBox1);
    game.debug.body(swingBox2);
    game.debug.body(swingBox3);
    game.debug.body(ground);
}
