var game = new Phaser.Game(2600, 1600, Phaser.AUTO); // Bigger game world = crisper world
game.state.add('startScreen', startScreen);
game.state.add('state0', state0);
game.state.add('tutorial', tutorial);
game.state.start('startScreen');
//game.state.start('state0');
