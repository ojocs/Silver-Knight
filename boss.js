//Boss file with general aspects for all bosses. Specifics inside their respective state files
function preloadBoss(){
    game.load.image('blank', 'Assets/blankBoss.png');
    game.load.image('evil_heart', 'Assets/Evil Heart 100 v2.png');
    game.load.image('evil_half_heart', 'Assets/Evil Half Heart 100 v2.png');
}

//Boss variables
var boss, bossHitboxes, bossSpecialTime, bossTurnTimer, thresholdFromBossWalk, onBoss;
var currentLvl;

//Knight variables
var hitPlatform;

function createBoss(){
    //Set global constants, change if needed inside each respective state. Essentially placeholders
    boss = game.add.sprite(centerX, game.world.height, 'blankBoss');
    
    //Movement
    boss.speed = 0, bossTurnTimer = 0, boss.turning = false;
    bossHitboxes = game.add.group();
    bossHitboxes.enableBody = true;
    
    //Attacks' booleans. Means that boss is performing attack if true
    boss.attack1 = false, boss.attack2 = false;
    
    //Health Display and variables
    boss.health = 10, boss.hurtOnce = false, bossHurtTimer = 0;
    evilHeart1Half = game.add.image(1890, 10, 'evil_half_heart');
    evilHeart1 = game.add.image(1890, 10, 'evil_heart');
    evilHeart2Half = game.add.image(1775, 10, 'evil_half_heart');
    evilHeart2 = game.add.image(1775, 10, 'evil_heart');
    evilHeart3Half = game.add.image(1660, 10, 'evil_half_heart');
    evilHeart3 = game.add.image(1660, 10, 'evil_heart');
    evilHeart4Half = game.add.image(1545, 10, 'evil_half_heart');
    evilHeart4 = game.add.image(1545, 10, 'evil_heart');
    evilHeart5Half = game.add.image(1430, 10, 'evil_half_heart');
    evilHeart5 = game.add.image(1430, 10, 'evil_heart');
    
    //For attacking knight
    hitPlatform = false;
}

function updateBoss(distanceFromBoss){
    //Hurt timer
    bossHurt();
    
    //Boss loses health when hit by sword
    game.physics.arcade.overlap(boss, knightBox, bossDamage, null, this);
    
    //Movements and attacks based on knight
    bossAI(distanceFromBoss)
}

//Damage timers, for damage functions to work properly
function bossHurt(){ 
    //Boss hurt
    if(!boss.hurtOnce){
        bossHurtTimer += 1;
    }
    if(bossHurtTimer === 30){
        boss.hurtOnce = true, bossHurtOnce = true;
        bossHurtTimer = 0;
    } 
}

//Boss turn's left or right, a pause is added when turning
function bossTurn(scaleX, bossOrientation){
    if(bossOrientation != scaleX){//Pivot turning
        boss.turning = true;
        boss.newScaleX = scaleX;
    }
}

//Timer for boss to wait until he can turn again
function bossTurnTimerFunc(){
    if(boss.turning){
        boss.frame = 1;
        boss.body.velocity.x = 0;
        bossTurnTimer -= 1;
    }
    if(bossTurnTimer == 0){
        boss.turning = false;
        bossTurnTimer = currentLvl === 1 ? 30 : 10;
        boss.scale.setTo(boss.newScaleX, 1);
    }
}

//Boss's movement in response to knight
function bossAI(distanceFromBoss){
    var currentTime = game.time.totalElapsedSeconds();
    var bossOrientation = boss.scale.x, magicBossPivotNumber = 200;
    bossTurnTimerFunc();
    
    //Attack1 if in close range
    if ((vertFromBoss < 0 ) && !boss.turning && !boss.attack1 && !boss.attack2 && (distanceFromBoss < 0) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk)) ) { //Player on right
        boss.body.velocity.x = 0;
        bossTurn(-1, bossOrientation);
        determineAttack1();
    } else if ((vertFromBoss < 0 ) && !boss.turning && !boss.attack1 && !boss.attack2 && (distanceFromBoss > 0) && !(distanceFromBoss > thresholdFromBossWalk) && !(distanceFromBoss < (-1 * thresholdFromBossWalk)) ) { //Player on left
        boss.body.velocity.x = 0;
        bossTurn(1, bossOrientation);
        determineAttack1();
    }

    //Perform stomp if further from the player than attack1 range, around every bossSpecialTime seconds
    else if ((distanceFromBoss >= 0) && !boss.turning && !boss.attack1 && (hitPlatform && vertFromBoss >= 0 && currentTime % bossSpecialTime > bossSpecialTime - 1) || (currentTime % bossSpecialTime > bossSpecialTime - 1)) {//Left
        boss.body.velocity.x = 0;
        bossTurn(1, bossOrientation);
        determineAttack2();
    } else if ((distanceFromBoss < (-1 * 0)) && !boss.turning && !boss.attack1 && (hitPlatform && vertFromBoss >= 0 && (currentTime % bossSpecialTime > bossSpecialTime - 1)) || (currentTime % bossSpecialTime > bossSpecialTime - 1)) {//Right
        boss.body.velocity.x = 0;
        bossTurn(-1, bossOrientation);
        determineAttack2();
    }
    
//    //Perform projectile if further from the player than attack1 range, around every bossSpecialTime seconds
//    else if (currentLvl === 2 && (distanceFromBoss >= thresholdFromBossWalk) && !boss.turning && !boss.attack1 && (hitPlatform && vertFromBoss >= 0 && (currentTime % bossSpecialTime > bossSpecialTime - 1))|| !boss.turning && !boss.attack1 && (currentTime % bossSpecialTime > bossSpecialTime - 1)) {//Left
//        boss.body.velocity.x = 0;
//        bossTurn(1, bossOrientation);
//        determineAttack2();
//    } else if (currentLvl === 2 && hitPlatform && vertFromBoss >= 0 && !boss.turning && !boss.attack1 && (currentTime % bossSpecialTime > bossSpecialTime - 1) || !boss.turning && !boss.attack1 && (currentTime % bossSpecialTime > bossSpecialTime - 1) 
//              // && (distanceFromBoss < (-1 * thresholdFromBossWalk))
//              ) {//Right
//        boss.body.velocity.x = 0;
//        bossTurn(-1, bossOrientation);
//        determineAttack2();
//    }
    
    //Follow player
    else
        bossMove(bossOrientation);
}

//Follow/track player
function bossMove(bossOrientation){
    if (!boss.turning && !boss.attack1 && !boss.attack2 && distanceFromBoss >= 0){
        boss.body.velocity.x = -boss.speed;//Left
        bossTurn(1, bossOrientation);
        determineWalk();
    } else if (!boss.turning && !boss.attack1 && !boss.attack2 && distanceFromBoss < 0){
        boss.body.velocity.x = boss.speed;//Right
        bossTurn(-1, bossOrientation);
        determineWalk();
    }
}

function determineWalk(){
    if(currentLvl === 1){
        boss.animations.play('walk');
        console.log('giant walk');
    }
    if(currentLvl === 2){
        boss.animations.play('treeWalk');
    }
}

//Determine attack1 based on current level
function determineAttack1(){
    if(currentLvl === 1){
        giantSwing();
        console.log('giant swing');
    }
    if(currentLvl === 2){
        treeSpike();
    }
}

//Determine attack2 based on current level
function determineAttack2(){
    if(currentLvl === 1)
        giantStomp();
        console.log('giant stomp');
    if(currentLvl === 2)
        treeProjectile();
}

//Boss loses health
function bossDamage(){
    if(boss.hurtOnce){
        boss.hurtOnce = false, bossHurtOnce = false;
        boss.health -= 1;
        
        //Make boss slide in direction of knight hit
        if(knight.body.x < boss.body.x)
            boss.body.velocity.x += 250;
        else if(knight.body.x > boss.body.x)
            boss.body.velocity.x -= 250;
        
        if (boss.health == 9) {
            evilHeart5.kill();
        } else if (boss.health == 8) {
            evilHeart5Half.kill();
        } else if (boss.health == 7) {
            evilHeart4.kill();
        } else if (boss.health == 6) {
            evilHeart4Half.kill();
        } else if (boss.health == 5) {
            evilHeart3.kill();
        } else if (boss.health == 4) {
            evilHeart3Half.kill();
        } else if (boss.health == 3) {
            evilHeart2.kill();
        } else if (boss.health == 2) {
            evilHeart2Half.kill();
        } else if (boss.health == 1) {
            evilHeart1.kill();
        } else if (boss.health <= 0) {
            evilHeart1Half.kill();
            // add in animation when boss dies
            boss.kill();
            victory();
            //Unlock next level based on current
            if(currentLvl === 1)
                level2Locked = false;
            if(currentLvl === 2)
                level3Locked = false;
        }
            
    }
}