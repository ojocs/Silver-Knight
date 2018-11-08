var startScreen = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/startScreen/landscape.png');
    game.load.image('logo', 'assets/startScreen/silver knight logo.png');
    game.load.spritesheet('startButton', 'assets/startScreen/start button.png', 640, 320);
    game.load.spritesheet('tutButton', 'assets/startScreen/tutorial button.png', 640, 320);
    game.load.image('black', 'assets/black screen.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;

function create() {
    console.log('startScreen');
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Screen adjust
    
    bg = game.add.image(0, 0, 'background');
    bg.alpha = 0;
    game.add.tween(bg).to( { alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
    
    //Logo
    logo = game.add.image(centerX, centerY-150, 'logo');
    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = 0;
    game.add.tween(logo).to( { alpha: 1}, 2000, Phaser.Easing.Linear.None, true); //Logo fades in
    
    //Start Button
    startButton = game.add.button(centerX - 250, centerY + 300, 'startButton');
    startButton.frame = 1;
    startButton.alpha = 0;
    game.time.events.add(1600, function() { //Waits for logo to fade-in
        game.add.tween(startButton).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);
    }, this);
    startButton.anchor.setTo(0.5, 0.5);
    startButton.scale.setTo(0.5, 0.5);
    startButton.inputEnabled = true;
    game.time.events.add(2000, function() {
        startButton.onInputUp.add(startLevelSelect, this);
    }, this); //Waits for fade-i to activate clicking function

    
    //Tutorial Button
    tutButton = game.add.button(centerX + 250, centerY + 300, 'tutButton');
    tutButton.frame = 1
    tutButton.alpha = 0;
    game.time.events.add(1600, function() {
        game.add.tween(tutButton).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    }, this);
    tutButton.anchor.setTo(0.5, 0.5);
    tutButton.scale.setTo(0.5, 0.5);
    tutButton.inputEnabled = true;
    game.time.events.add(2000, function() {
        tutButton.onInputUp.add(startTutorial, this);
    }, this);
}

function update() {
    //Start Button highlights when hovered over
    game.time.events.add(2500, function() {
        if (startButton.input.pointerOver()){
            startButton.frame = 0;
        }
        else{
            startButton.frame = 1;
        }
    }, this)
    
    //Tutorial Button highlights when hovered over
    game.time.events.add(3000, function() {
        if (tutButton.input.pointerOver()){
            tutButton.frame = 0;
        }
        else{
            tutButton.frame = 1;
        }
    }, this)   
}

//Takes you to Level Select
function startLevelSelect(){
    console.log('startLevelSelect');
    fadeAll();
//    game.time.events.add(500, function() {
//        game.state.start('levelSelect');
//    }, this);
    game.state.start('levelSelect');
}

//Takes you to Tutorial
function startTutorial(){
    fadeAll();
    game.time.events.add(500, function() {
        game.state.start('tutorial');
    }, this);
}

//Screen fades to black
function fadeAll(){
    console.log('fade');
    black = game.add.image(0, 0, 'black');
    black.scale.setTo(10, 10);
    black.alpha = 0;
    game.add.tween(black).to( { alpha: 1}, 500, Phaser.Easing.Linear.None, true);
}