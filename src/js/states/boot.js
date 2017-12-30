export default class Boot extends Phaser.State {

	preload() {
		this.game.stage.backgroundColor = '#000';
		this.load.image('loaderBg', 'img/loader-bg.png');
		this.load.image('loaderBar', 'img/loader-bar.png');
	}

	create() {
		//scale the game to fit the maximum space possible
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		//center the game inside the browser
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.stage.backgroundColor = "#006666";
		this.game.world.setBounds(0,0,screen.width, screen.height);

		this.state.start('Preload');
	}

}
