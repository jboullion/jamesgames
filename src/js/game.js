import * as states from './states';

class Game extends Phaser.Game {

	constructor() {
		super(1200, 800, Phaser.AUTO, 'content', null);
		//this.state.add('GameState', GameState, false);
		Object.keys(states).forEach(state => this.state.add(state, states[state]));
		this.DEBUG = true;
		this.state.start('Boot');
	}

}

new Game();
