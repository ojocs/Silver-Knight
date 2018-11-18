var state1 = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    preloadKnight();
    preloadBoss();
    //Level
    game.load.image('background', 'assets/Level 2/Level 2 BG.png');
    game.load.image('platform2.1', 'assets/Level 2/Platform 2.1.png');
    game.load.image('platform2.2', 'assets/Level 2/Platform 2.2.png');
    game.load.image('platform2.3', 'assets/Level 2/Platform 2.3.png');
    //Boss
    game.load.image('treeProjectile', 'assets/Level 2/Tree Projectile.png');
    game.load.spritesheet('treeSpike', 'assets/Level 2/Tree Spike.png', 729, 490);
    game.load.spritesheet('tree', 'assets/Level 2/Tree Spritesheet.png', 219, 300);
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

//Objects for tree's attack
var spike, spikeDist = 350, projectile;

var platforms2;
var debug;

function create() {
    console.log('level 2');
    
    var bg = game.add.image(0, 0, 'background');
    
    //Platforms
    
    //Add Tree Boss
    createBoss();
    boss = game.add.sprite(centerX, game.world.height - 310, 'tree');
    boss.speed = 200, boss.health = 10;
    boss.anchor.setTo(0.6, 0.5);
    game.physics.enable(boss), boss.body.gravity.y = 400;
    boss.frame = 1, boss.body.collideWorldBounds = true;
    boss.newScaleX = 1, bossTurnTimer = 10;
    
    //Add walk animation
    boss.animations.add('treeWalk', [23, 24, 25 , 26], 20);
    
    //For attacks
    boss.addChild(bossHitboxes), thresholdFromBossWalk = 450;
    
    //Add attack1 animation, aka spike
    boss.attack1 = false;
    boss.treeSpikeAni = boss.animations.add('treeGroundAttack', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 7);
    boss.treeSpikeAni.onComplete.add(function(){
        boss.attack1 = false;
    });
    //Add spike
    spike = game.add.sprite(boss.body.x, boss.body.y + boss.body.height, 'treeSpike');
    game.physics.enable(spike), spike.enableBody = false, spike.visibile = false;
    spike.scale.setTo(.5, .5);
    //boss.addChild(spike), spike.anchor.setTo(0.5, 0.5);
    spike.ani = spike.animations.add('spike', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 13);
    //So that spike will be blank at start of first run through attack1
    spike.frame = 11;
        
    //Add attack2 animation, aka projectile
    boss.attack2 = false;
    boss.treeProjectileAni = boss.animations.add('treeProjectileAttack', [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], 20);
    boss.treeProjectileAni.onComplete.add(function(){
        boss.attack2 = false;
    });
    //Add projectile
//    projectile = bossHitboxes.create(0, 0, 'treeProjectile');
//    projectile.anchor.setTo(0.5, 0.5);
//    projectile.enableBody = false;
    
    //Make knight
    createKnight(2);
    //Debugging
    debug = game.add.text(1500, 16, ' ', {
        fontSize: '50px', fill: '#000' });
}

function update() {
    var distanceFromBoss = boss.body.center.x - knight.body.center.x;
    updateKnight(distanceFromBoss);
    updateBoss(distanceFromBoss);
    
    //To have spike hitboxes work properly
    //spikeBoxes();
    
    //Debugging
    game.debug.body(spike), debug.text = 'attack1 '+boss.attack1+'\nattack2 '+boss.attack2+'\nspike enable? '+spike.enableBody;
}

//Tree spike attack
function treeSpike(){
    //Only do if knight is on ground
    if(knight.body.touching.down || touchGround){
        boss.attack1 = true;
        boss.animations.play('treeGroundAttack');
        //Make spike appear next to the tree on the ground
        spike.body.y = 300;//game.world.height - spike.body.height;
        //Decide where to appear based on tree orientation
        spike.body.x = boss.body.x;
        if(boss.scale.x < 0){
            spike.body.x += spikeDist - 100;
        }
        else if(boss.scale.x > 0){
            spike.body.x -= spikeDist;
        }
        //Wait for a bit and enable the spike's body
        var treeSpikeTimer = game.time.create(true);
        treeSpikeTimer.add(1300, function(){
            spike.animations.play('spike');
            spike.enableBody = true, spike.visibile = true;
            spike.body.setSize(0, 0, 0, 0);
        });//729, 490
        treeSpikeTimer.add(1310, function(){
            spike.body.setSize(354, 157, 170, 330);
        });
        treeSpikeTimer.add(1320, function(){
            spike.body.setSize(454, 263, 198, 224);
        });
        treeSpikeTimer.add(1330, function(){
            spike.body.setSize(582, 310, 224, 180);
        });
//        treeSpikeTimer.add(1340, function(){
//            spike.body.setSize(354, 157, 0, 0);
//        });
//        treeSpikeTimer.add(1350, function(){
//            spike.body.setSize(354, 157, 0, 0);
//        });
//        treeSpikeTimer.add(1360, function(){
//            spike.body.setSize(354, 157, 0, 0);
//        });
//        treeSpikeTimer.add(1370, function(){
//            spike.body.setSize(354, 157, 0, 0);
//        });
//        treeSpikeTimer.add(1380, function(){
//            spike.body.setSize(354, 157, 0, 0);
//        });
//        treeSpikeTimer.add(1390, function(){
//            spike.body.setSize(354, 157, 0, 0);
//        });
        //Get rid of spike
        treeSpikeTimer.add(1400, function(){
            spike.enableBody = false, spike.visibile = false;
        });
        treeSpikeTimer.start();
        //Detect collision with knight, -2 lives
            livesTaken = 2;
            game.physics.arcade.overlap(spike, knight, knightDamage, null, this);
    }
}

//Tree projectile attack
function treeProjectile(){
    boss.attack2 = true;
    boss.animations.play('treeProjectileAttack');
}