var startScreen = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'Assets/startScreen/Landscape.png');
    game.load.image('logo', 'Assets/startScreen/Silver Knight Logo v2.png');
    game.load.spritesheet('startButton', 'Assets/startScreen/Start Button.png', 640, 320);
    game.load.image('black', 'Assets/Black Screen.png');
    game.load.audio('intro', 'Assets/Audio/Music/Intro Music 2.wav');
}

var demo = {};
var centerX = 1000, centerY = 500;
var bg, logo, startButton, tutButton, black;
var isTutorial = false; // Variable for the exit button
var introMusic;
var needIntro = true; //Boolean to know if we need to play intro or not

function create() {
    ///////////////////////////////////////////////
    //game.sound.mute = true;
    /////////////////////////////////////////////////
    
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
    startButton = game.add.button(centerX, centerY + 320, 'startButton');
    startButton.frame = 1;
    startButton.alpha = 0;
    game.time.events.add(1600, function() { //Waits for logo to fade-in
        game.add.tween(startButton).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);
    }, this);
    startButton.anchor.setTo(0.5, 0.5);
    startButton.scale.setTo(0.5, 0.5);
    startButton.inputEnabled = true;
    game.time.events.add(2000, function() {
        if (needIntro){
            startButton.onInputUp.add(startIntroScreen, this);
        } else{
            startButton.onInputUp.add(startLevelSelect, this);   
        }
    }, this); //Waits for fade-i to activate clicking function
}

function update() {
    resumeIntro();
    
    //Start Button highlights when hovered over
    game.time.events.add(2500, function() {
        if (startButton.input.pointerOver()){
            startButton.frame = 0;
        }
        else{
            startButton.frame = 1;
        }
    }, this)
}

function startIntroScreen(){
    fadeAll();
    game.state.start('introScreen');
}

//Play intro music if it's not already playing
function resumeIntro(){
    if (introMusic == null){ //Adds 'intro' only once
        introMusic = game.add.audio('intro');
        introMusic.loopFull();
    };
    if (introMusic.volume < 1){
//        console.log('intro not palying');
        introMusic.volume = 1;
        introMusic.loopFull();
    }
}

//Fades out introMusic; introMusic should not be playing during levels nor tutorial
function fadeOutIntro(){
    game.add.tween(introMusic).to( { volume: 0}, 100, Phaser.Easing.Linear.None, true);
    //console.log(introMusic.volume);
}

//Takes you to Level Select
function startLevelSelect(){
    game.camera.shake(0, 0);
    teleMode = false;
    console.log('startLevelSelect');
    fadeAll();
    game.state.start('levelSelect');
}

//Takes you to Tutorial
function startTutorial(){
    teleMode = false;
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