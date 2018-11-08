var startScreen = {
    preload: preload,
    create: create,
    update: update
}

function preload() {
    game.load.image('background', 'assets/startScreen/landscape.png');
    game.load.image('logo', 'assets/startScreen/silver knight logo.png');
    game.load.image('startButton', 'assets/startScreen/start button.png');
    game.load.image('tutButton', 'assets/startScreen/tutorial button.png');
}

var demo = {};
var centerX = 1000, centerY = 500;
var startButton, tutButton;

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Screen adjust
    
    var bg = game.add.image(0, 0, 'background');
    bg.alpha = 0;
    game.add.tween(bg).to( { alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
    
    //Logo
    var logo = game.add.image(centerX, centerY-150, 'logo');
    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = 0;
    game.add.tween(logo).to( { alpha: 1}, 2000, Phaser.Easing.Linear.None, true); //Logo fades in
    
    //Start Button
    startButton = game.add.button(centerX - 250, centerY + 300, 'startButton');
    startButton.alpha = 0;
    game.time.events.add(1600, function() { //Waits for logo to fade-in
        game.add.tween(startButton).to( { alpha: 0.8 }, 500, Phaser.Easing.Linear.None, true);
    }, this);
    startButton.anchor.setTo(0.5, 0.5);
    startButton.scale.setTo(0.5, 0.5);
    startButton.inputEnabled = true;
    game.time.events.add(2000, function() {
        startButton.onInputUp.add(startGame, this);
    }, this); //Waits for fade-i to activate clicking function

    
    //Tutorial Button
    tutButton = game.add.button(centerX + 250, centerY + 300, 'tutButton');
    tutButton.alpha = 0;
    game.time.events.add(1600, function() {
        game.add.tween(tutButton).to( { alpha: 0.8 }, 500, Phaser.Easing.Linear.None, true);
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
            startButton.alpha = 1;
        }
        else{
            startButton.alpha = 0.8
        }
    }, this)
    
    //Tutorial Button highlights when hovered over
    game.time.events.add(3000, function() {
        if (tutButton.input.pointerOver()){
            tutButton.alpha = 1;
        }
        else{
            tutButton.alpha = 0.8
        }
    }, this)   
}

//Takes you to Level 1
function startGame(){
    game.state.start('state0')
}

//Takes you to Level 2
function startTutorial(){
    game.state.start('tutorial');
}