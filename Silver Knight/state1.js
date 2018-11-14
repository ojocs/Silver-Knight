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
    game.load.image('tree', 'assets/Level 2/Tree Spritesheet.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

function create() {
    console.log('level 2');
    
    var bg = game.add.image(0, 0, 'background');
    
    //Add Tree Boss
    createBoss();
    boss = game.add.sprite(centerX, centerY, 'tree');
    boss.speed = 140, boss.health = 10;
    boss.anchor.setTo(0.8, 0.5);
    game.physics.enable(boss), boss.body.gravity.y = 400;
    boss.frame = 1, boss.body.collideWorldBounds = true;
    boss.newScaleX = 1;
    
    //Add walk animation
    boss.animations.add('treeWalk', [23, 24, 25 , 26], 5);
    
    //Add attack1 animation
    
    
    //Add attack2 animation
    
    
    //Make knight
    createKnight(2);
}

function update() {
    var distanceFromBoss = boss.body.center.x - knight.body.center.x;
    updateKnight();
    updateBoss(distanceFromBoss);
}