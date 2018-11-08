//Call in preload
function preloadKnight(){
    game.load.spritesheet('knight', 'assets/knight/Silver Knight Spritesheet.png', 354, 230);
    game.load.image('heart', 'assets/knight/heart 100.png');
    game.load.image('half_heart', 'assets/knight/half heart 100.png');
    //Audio
//    game.load.audio('teleAudio', 'assets/audio/Teleport Sound 5.wav');
//    game.load.audio('teleAudio2', 'assets/audio/Teleport Sound.wav');    
//    game.load.audio('swordHitAudio', 'assets/audio/Sword3.wav');
}

//Knight
var knight;

//Health
var health = 6, knightHurtTimer = 0; //Knight has 6 lives

//Hitboxes for attacks/weapons
var hitboxes, knightBox;

//Movement variables
var moveBinds;
var ground;

//Blink Variables
var blink, blinkDist = 450, blinkTimer = 0, blinkCount = 3, canBlink, blinkAni;

//Long teleport
var canTele, teleKey, teleMode, teleTimer = 0, timerSprite;

//Attack
var attack;

// Momentum
var speed, drag = 25, walkSpeed = 600;

//Sounds
var teleAudio, teleAudio2, wooshAudio, swordHitAudio;

//Call in create
function createKnight(){
    //Teleport Timer Display
    timerSprite = game.add.sprite(355, 10, 'timer');
    timerSprite.visibile = false;
    
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
    
    //Sounds
//    teleAudio = game.add.audio('teleAudio'), teleAudio2 = game.add.audio('teleAudio2');
//    swordHitAudio = game.add.audio('swordHitAudio');
}

//Call in update
function updateKnight(){
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
    
    //--------------SOUNDS-----------------------------//
//    //Teleport
//    if(knight.teleporting && (canBlink || canTele)){
//        teleAudio.play();
//        teleAudio2.play();
//        //wooshAudio.play();
//    }
//    
//    //Sword hit
//    if(knight.attacking){
//        if(!giant.hurtOnce)
//        swordHitAudio.play();
//    }
    
    //--------------END SOUNDS-----------------------------//
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
    if (moveBinds.upW.isDown) {
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
            game.add.text(centerX, centerY, 'GAME OVER', {
                fontSize: '90px',
                fill: '#000'
            });
        }
    }
}