var state1 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    preloadKnight();
    preloadBoss();
    //Level
    game.load.image('background', 'Assets/Level 2/Level 2 BG.png');
    game.load.image('platform2.1', 'Assets/Level 2/Platform 2.1.png');
    game.load.image('platform2.2', 'Assets/Level 2/Platform 2.2.png');
    game.load.image('platform2.3', 'Assets/Level 2/Platform 2.3.png');
    //Boss
    game.load.image('treeProjectile', 'Assets/Level 2/Tree Projectile 2.png');
    game.load.spritesheet('treeSpike', 'Assets/Level 2/Tree Spike.png', 729, 490);
    game.load.spritesheet('tree', 'Assets/Level 2/Tree Spritesheet.png', 219, 300);
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

//Objects for tree's attack
var spike, spikeDist = 270, projectiles, treeHand;

var platforms2;
var debug;

function create() {
    console.log('level 2');
    
    var bg = game.add.image(0, 0, 'background');
    
    //Platforms
    platforms2 = game.add.group(), platforms2.enableBody = true;
    
    var ledge = platforms2.create(60, 300, 'platform2.1');
    ledge.body.immovable = true;
    ledge = platforms2.create(1100, 320, 'platform2.2');
    ledge.body.immovable = true;
    ledge = platforms2.create(580, 480, 'platform2.3');
    ledge.body.immovable = true;
    ledge = platforms2.create(1550, 450, 'platform2.3');
    ledge.body.immovable = true;
    
    //Prevent getting stuck in ground
    platforms2.antiStuck = ledge.body.height;
    
    //Add Tree Boss
    createBoss();
    boss = game.add.sprite(centerX, game.world.height - 310, 'tree');
    boss.speed = 200, boss.health = 10;
    boss.anchor.setTo(0.6, 0.5);
    game.physics.enable(boss), boss.body.gravity.y = 400;
    boss.frame = 1, boss.body.collideWorldBounds = true;
    boss.newScaleX = 1, bossTurnTimer = 10;
    
    //Add walk animation
    boss.animations.add('treeWalk', [23, 24, 25 , 26], 17);
    
    //Set variables for attacks
    boss.addChild(bossHitboxes), thresholdFromBossWalk = 450, bossSpecialTime = 2;
    
    //Add attack1 animation, aka spike
    boss.attack1 = false;
    boss.treeSpikeAni = boss.animations.add('treeGroundAttack', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 15);
    boss.treeSpikeAni.onComplete.add(function(){
        boss.attack1 = false;
    });
    //Add spike
    spike = game.add.sprite(boss.body.x, boss.body.y + boss.body.height, 'treeSpike');
    game.physics.enable(spike), spike.enableBody = false, spike.visibile = false;
    spike.scale.setTo(.5, .5);
    //boss.addChild(spike), spike.anchor.setTo(0.5, 0.5);
    spike.ani = spike.animations.add('spike', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 20);
    //So that spike will be blank at start of first run through attack1
    spike.frame = 11;
        
    //Add attack2 animation, aka projectile
    boss.attack2 = false;
    boss.treeProjectileAni = boss.animations.add('treeProjectileAttack', [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], 25);
    boss.treeProjectileAni.onComplete.add(function(){
        boss.attack2 = false;
    });
    //Add projectiles, fires 1 bullet at a time
    projectiles = game.add.weapon(1, 'treeProjectile'), projectiles.enableBody = true;
    //Speed and firerate. Latter is every 1/2 second
    projectiles.bulletSpeed = 800, projectiles.fireRate = 500;
    //Add some extra physics
    projectiles.bulletRotateToVelocity = true, projectiles.bulletGravity = true;
    //Bullets killed if out of bounds
    projectiles.outOfBoundsKill = true, projectiles.lifespan = 1000;
    //Projectiles launched from boss, offest to its hand
    treeHand = bossHitboxes.create(0, 0, null), treeHand.body.enable = true;
    treeHand.anchor.setTo(0.5, 0.5), treeHand.body.setSize(10, 10, 10, 10);
    
    //Make knight
    createKnight(2);
    
    // play level 1 music
    playLevelMusic(2);
    
    //Debugging
    debug = game.add.text(1500, 16, ' ', {
        fontSize: '50px', fill: '#000' });
}

function update() {//game.debug.body(projectiles.bullets);
    fadeOutIntro();
    
    //Knight collide with platforms
    hitPlatform = game.physics.arcade.collide(knight, platforms2);
    //Complicated but actually works unlike arcade.collide for  some reason. Also 4 is random number that helps get it perfect
    groundCollide = (knight.body.y + knight.body.height) === (game.world.height - platforms2.antiStuck - 4);
    onPlatform = game.physics.arcade.overlap(knight, platforms2);
    
    //To prevent falling through platforms when you teleport to one, seems unfair if not
    if(onPlatform && knight.teleporting){//Only when he's teleporting
        //put knight above platform
        knight.body.y = knight.body.y - platforms2.antiStuck/2;
    }
    
    //Update knight
    var distanceFromBoss = boss.body.center.x - knight.body.center.x;
    var vertFromBoss = boss.body.y - (knight.body.y + knight.body.height);
    updateKnight(distanceFromBoss, vertFromBoss, groundCollide);
    
    //Destroy bullet if it collides with knight, take away health
    game.physics.arcade.collide(projectiles.bullets, knight, function(knight, bullet){
        bullet.kill(); 
        livesTaken = 1, knightStaggerJump = 100, knightStaggerSlide = 1200;
        knightDamage();
    });
    
    //To prevent unwanted post victory death, destroy attack objects
    if(boss.alive){
        updateBoss(distanceFromBoss);
    }
    if(!boss.alive){
        spike.kill();//, projectiles.destroy();
    }
    
    //Debugging
    //debug.text = 'onBoss '+ onBoss+'\nattack1 '+boss.attack1+'\nattack2 '+boss.attack2;
}

//Detect spike and knight collision
function spikeHitKnight(){
    livesTaken = 2, knightStaggerJump = 1200, knightStaggerSlide = 1500;
    game.physics.arcade.overlap(spike, knight, knightDamage, null, this);
}

//Tree spike attack
function treeSpike(){
    //Only do if knight is on ground
    if(knight.body.touching.down || touchGround){
        boss.attack1 = true;
        boss.animations.play('treeGroundAttack');
        //Make spike appear next to the tree on the ground
        spike.body.y = game.world.height - spike.body.height;
        //Decide where to appear based on tree orientation
        spike.body.x = boss.body.x;
        if(distanceFromBoss < 0){
            spike.body.x += spikeDist;
        }
        else if(distanceFromBoss > 0){
            spike.body.x -= spikeDist;
        }
        //Wait for a bit and enable the spike's body
        var treeSpikeTimer = game.time.create(true);
        treeSpikeTimer.add(800, function(){
            spike.animations.play('spike');
            spike.enableBody = true, spike.visibile = true;
            spike.body.setSize(0, 0, 0, 0);
            //Detect collision with knight, -2 lives
            spikeHitKnight();
        });
        //Set spike's body to different sizes based on current frame        
        treeSpikeTimer.add(810, function(){
            spike.body.setSize(354, 157, 170, 330), spikeHitKnight();
        });
        treeSpikeTimer.add(820, function(){
            spike.body.setSize(454, 263, 198, 224), spikeHitKnight();
        });
        treeSpikeTimer.add(830, function(){
            spike.body.setSize(582, 310, 224, 180), spikeHitKnight();
        });
        treeSpikeTimer.add(840, function(){
            spike.body.setSize(600, 480, 30, 10), spikeHitKnight();
        });
        treeSpikeTimer.add(850, function(){
            spike.body.setSize(410, 490, 170, 0), spikeHitKnight();
        });
        treeSpikeTimer.add(860, function(){
            spike.body.setSize(100, 490, 170, 0), spikeHitKnight();
        });
        treeSpikeTimer.add(870, function(){
            spike.body.setSize(410, 490, 170, 0), spikeHitKnight();
        });
        treeSpikeTimer.add(890, function(){
            spike.body.setSize(377, 422, 192, 72), spikeHitKnight();
        });
        //Get rid of spike
        treeSpikeTimer.add(900, function(){
            spike.enableBody = false, spike.visibile = false;
        });
        treeSpikeTimer.start();
    }
}

//Tree projectile attack
function treeProjectile(){
    var treeOffsetX = boss.scale.x === 1 ? boss.body.x: boss.body.x + 200;
    var treeOffsetY = boss.body.y + 200;
    //Projectiles launched from boss, offest to its hand
    treeHand = bossHitboxes.create(treeOffsetX, treeOffsetY, null), treeHand.body.enable = true;
    treeHand.anchor.setTo(0.5, 0.5), treeHand.body.setSize(10, 10, 10, 10);
    
    //Boss animation and orientation
    //boss.scale.x = distanceFromBoss > 0 ? 1 : -1;
    boss.attack2 = true;
    boss.animations.play('treeProjectileAttack');
    
    //Fire in direction of sprite
    var offsetOfKnight = 100;
    projectiles.fire(treeHand, knight.body.x - offsetOfKnight, knight.body.y + offsetOfKnight);
}