var game = new Phaser.Game(2000, 1000, Phaser.AUTO);//new Phaser.Game(2600, 1600, Phaser.AUTO); // Bigger game world = crisper world
game.state.add('startScreen', startScreen);
game.state.add('tutorial', demo.tutorial);
game.state.add('state0', state0);
game.state.start('startScreen');