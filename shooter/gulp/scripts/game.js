var game = new Phaser.Game(screen.width,screen.height,Phaser.AUTO);

//game.state.add(scenes.states[MENUSCENE], scenes.menu);
game.state.add(scenes.states[MAINSCENE], scenes.main);
//game.state.add(scenes.states[SCORESCENE], scenes.score);

//START the first scene
game.state.start(scenes.states[MAINSCENE]);
