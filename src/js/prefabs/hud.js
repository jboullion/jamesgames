import TextButton from '../extensions/textbutton';

export default class Hud extends Phaser.Group {
	constructor({ game, player, music }) {
		super(game);
		this.game = game;

		//PLAYER STATS
		this.player = player;
		this.bg = new Phaser.Image(this.game, 0, 0, 'hudBg');
		this.width = 800;
		this.healthbar = new Phaser.Sprite(this.game, 2, 2, 'healthbar');
		this.healthbar.scale.setTo(0.995, 11);

		//MUSIC
		this.music = this.game.add.audio('playMusic');
		this.music.loopFull();
		this.mute = new TextButton({
			game: this.game,
			x: 100,
			y: 100,
			asset: 'button',
			overFrame: 2,
			outFrame: 1,
			downFrame: 0,
			upFrame: 1,
			label: 'Mute',
			style: {
				font: '16px Verdana',
				fill: 'white',
				align: 'center'
			}
		});

		this.mute.onInputDown.add(()=>{
			if(this.music.isPlaying){
				this.mute.label = 'UnMute';
				this.music.pause();
			}else{
				this.mute.label = 'Mute';
				this.music.play();
			}
		});

		this.volumeUp = new TextButton({
			game: this.game,
			x: 100,
			y: 200,
			asset: 'button',
			overFrame: 2,
			outFrame: 1,
			downFrame: 0,
			upFrame: 1,
			label: '+',
			style: {
				font: '16px Verdana',
				fill: 'white',
				align: 'center'
			}
		});

		//this.volumeUp.onInputDown.add(this.volumeUp, this);
		this.volumeUp.onInputDown.add(()=>{
			if(this.music.volume < 1.8){
				//due to weird JS rounding issues this doesn't increase the volume by exactly 0.2
				this.music.volume += 0.2;
			}else{
				this.music.volume = 2;
			}
		});

		this.volumeDown = new TextButton({
			game: this.game,
			x: 100,
			y: 250,
			asset: 'button',
			overFrame: 2,
			outFrame: 1,
			downFrame: 0,
			upFrame: 1,
			label: '-',
			style: {
				font: '16px Verdana',
				fill: 'white',
				align: 'center'
			}
		});

		//this.volumeDown.onInputDown.add(this.volumeDown, this);
		this.volumeDown.onInputDown.add(()=>{
			if(this.music.volume > 0.2){
				//due to weird JS rounding issues this doesn't reduce the volume by exactly 0.2
				this.music.volume -= 0.2;
			}else{
				this.music.volume = 0;
			}
		});

		//SCORE
		this.score = 0;
		this.scoreLabel = 'Score: ';
		this.scoreText = new Phaser.Text(this.game, 20, 14, this.scoreLabel + this.score, {
			font: '13px Verdana',
			fill: 'white',
			align: 'center'

		});

		this.add(this.bg);
		this.add(this.healthbar);
		this.add(this.scoreText);
		this.add(this.mute);
		this.add(this.volumeUp);
		this.add(this.volumeDown);
	}

	updateHealth() {
		this.healthbar.crop(new Phaser.Rectangle(0, 0, (this.player.health / this.player.maxHealth) * this.width, 10));
		this.healthbar.updateCrop();
	}

	updateScore(amount) {
		this.score += amount;
		this.scoreText.text = this.scoreLabel + (this.score * 10);
	}

	render() {
		game.debug.soundInfo(music, 20, 32);
	}

	gameOver(){
		this.music.stop();
	}

	volumeUp() {
		this.music.volume += 0.1;
	}

	volumeDown() {
		this.music.volume -= 0.1;
	}
};
