/*
var game = new Phaser.Game(screen.width,screen.height,Phaser.AUTO);

//game.state.add(scenes.states[MENUSCENE], scenes.menu);
game.state.add(scenes.states[MAINSCENE], scenes.main);
//game.state.add(scenes.states[SCORESCENE], scenes.score);

//START the first scene
game.state.start(scenes.states[MAINSCENE]);
*/


import GameState from 'scripts/states/GameState';

class Game extends Phaser.Game {

	constructor() {
		super(1200, 800, Phaser.AUTO, 'content', null);
		this.state.add('GameState', GameState, false);
		this.state.start('GameState');
		this.DEBUG = true;
	}

}

new Game();
