var game = new Phaser.Game(2000, 1000, Phaser.AUTO); // Bigger game world = crisper world
game.state.add('state0', state0);
game.state.start('state0');
