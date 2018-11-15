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
    game.load.image('treeSpike', 'assets/Level 2/Tree Spike.png');
    game.load.spritesheet('tree', 'assets/Level 2/Tree Spritesheet.png', 219, 300);
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

var platforms2;

function create() {
    console.log('level 2');
    
    var bg = game.add.image(0, 0, 'background');
    
    //Platforms
    
    //Add Tree Boss
    createBoss();
    boss = game.add.sprite(centerX, centerY, 'tree');
    boss.speed = 20000, boss.health = 10;
    boss.anchor.setTo(0.6, 0.5);
    game.physics.enable(boss), boss.body.gravity.y = 400;
    boss.frame = 1, boss.body.collideWorldBounds = true;
    boss.newScaleX = 1;
    
    //Add walk animation
    boss.animations.add('treeWalk', [23, 24, 25 , 26], 20);
    
    //Add attack1 animation, aka spike
    boss.animations.add('spike', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 5);
    
    //Add attack2 animation, aka projectile
    boss.animations.add('projectile', [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], 5);
    
    //Make knight
    createKnight(2);
}

function update() {
    var distanceFromBoss = boss.body.center.x - knight.body.center.x;
    updateKnight();
    updateBoss(distanceFromBoss);
}

//Tree spike attack
function treeSpike(){
    boss.animations.play('spike');
}

//Tree projectile attack
function treeProjectile(){
    boss.animations.play('projectile');
}