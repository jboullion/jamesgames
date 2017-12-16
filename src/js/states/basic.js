export default class BasicState extends Phaser.State {

	create() {

		this.farback = this.add.tileSprite(0, 0, 800, 2380, 'farback');

		this.enemies = this.add.group();
		this.enemies.enableBody = true;

		this.player = new Player({
			game: this.game,
			x: this.game.world.centerX,
			y: 0.92 * this.game.world.height,
			health: 100,
			asset: 'smallfighter',
			frame: 1
		});

		this.game.stage.addChild(this.player);

		this.hud = new HUD({
			game: this.game,
			player: this.player
		});
		this.music = this.game.add.audio('playMusic');
		this.music.loopFull();
	}

}
