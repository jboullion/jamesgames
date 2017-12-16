/**
 * The only game state for this game. Could / Should be split into a generic state and a child state
 */
class GameState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.stage.backgroundColor = "#006666";
		this.game.world.setBounds(0,0,this.game.world.width, this.game.world.height);
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.showFPS();
	}

	/**
	 * Show the game fps. Only displays if DEBUG is true
	 */
	function showFPS(){
		if(! this.game.DEBUG) return;

		//SETTING UP THE DEBUG PLUGIN. THIS WILL RUN ON ALL SCENES
		this.game.debug.font = "24px monospace";
		this.game.debug.lineHeight = 20;
		if (!this.game.timing) {
			this.game.timing = game.plugins.add(Phaser.Plugin.AdvancedTiming);
		}
		//this affects the game physics and not the actual displayed FPS. Setting this to our desired frame rate will allow catchup mechanics in the physics to work better in instances where the framerate drops below this desired rate
		this.game.time.desiredFps = 30;
		this.game.time.advancedTiming = true;
	}

}

export default GameState;
