
//setup characters
var characters = {};
characters.dude = {};
characters.dude.sprite = null;
characters.dude.speed = 6;
characters.dude.isJumping = false;
characters.dude.jumpTimer = 0;
characters.dude.tilemap = 300;
characters.dude.velocity = 350;
characters.dude.velocity = 350;

var playerOne = null;

var barrel = null,
	bullets = null,
	bullet_velocity = 1000,
	nextFire = 0, //next game.time to fire at
	bulletRate = 100, //millisecond delay on bullet shots
	largeEnemy = {},
	enemyGroup = null,
	bullet = null;

scenes.main = function(){};

scenes.main.prototype = {
	init: function() {


	},
	preload: function(){
		game.load.image('cannon_base', 'assets/sprites/cannon_base.png');
		game.load.image('cannon_barrel', 'assets/sprites/cannon_barrel.png');
		game.load.image('bullet', 'assets/sprites/bullet.png');
		game.load.image('dude', 'assets/sprites/dude.png');
	},
	create: function(){
		game.stage.backgroundColor = "#006666";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 0;

		addStateListeners();
/*
		var sceneDescription = "Shoot bullets at dudes by clicking with the mouse!";
		game.add.text( 50,25, sceneDescription,{fontSize: '30px', fill: '#000' });

		//SETTING UP THE DEBUG PLUGIN. THIS WILL RUN ON ALL SCENES
		game.debug.font = "24px monospace";
		game.debug.lineHeight = 20;
		if (!game.timing) {
			game.timing = game.plugins.add(Phaser.Plugin.AdvancedTiming);
		}
*/
		//this affects the game physics and not the actual displayed FPS. Setting this to our desired frame rate will allow catchup mechanics in the physics to work better in instances where the framerate drops below this desired rate
		//game.time.desiredFps = 30;
		//game.time.advancedTiming = true;

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		var cannon = game.add.sprite(screen.centerX,screen.centerY, 'cannon_base');
		cannon.anchor.setTo(0.5, 0.5);

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(20,'bullet');
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('anchor.x', -1.4);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('scale.x', 0.8);
		bullets.setAll('scale.y', 0.8);

		barrel = game.add.sprite(screen.centerX,screen.centerY, 'cannon_barrel');
		barrel.anchor.setTo(0.3, 0.5);

		largeEnemy.sprite = game.add.sprite(screen.centerX / 2, screen.centerY, 'dude');
		largeEnemy.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(largeEnemy.sprite);

		enemyGroup = game.add.group();
		enemyGroup.enableBody = true;
		enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

		//create our enemies!
		for(var i = 0; i < 10; i++){
			enemyGroup.create(getRandomInt(50,screen.width - 75), getRandomInt(50,screen.height - 75), 'dude');
		}

		enemyGroup.setAll('anchor.x', 0.5);
		enemyGroup.setAll('anchor.y', 0.5);
		enemyGroup.setAll('scale.x', 0.5);
		enemyGroup.setAll('scale.y', 0.5);
	},
	update: function(){
		barrel.rotation = game.physics.arcade.angleToPointer(barrel);

		if(game.input.activePointer.isDown){
			this.fire();
		}

		game.physics.arcade.overlap(bullets, largeEnemy.sprite, this.hitEnemy);
		game.physics.arcade.overlap(bullets, enemyGroup, this.hitGroup);
	},
	fire: function(){
		if(game.time.now > nextFire){
			nextFire = game.time.now + bulletRate;

			bullet = bullets.getFirstDead();
			bullet.reset(barrel.x, barrel.y);

			game.physics.arcade.moveToPointer(bullet, bullet_velocity);
			bullet.rotation = game.physics.arcade.angleToPointer(bullet);
		}
	},
	hitEnemy: function(){
		largeEnemy.sprite.kill();
		bullet.kill();
	},
	hitGroup: function(b,e){
		e.kill();
		b.kill();
		enemyGroup.create(getRandomInt(50,screen.width - 75), getRandomInt(50,screen.height - 75), 'dude');

		enemyGroup.setAll('anchor.x', 0.5);
		enemyGroup.setAll('anchor.y', 0.5);
		enemyGroup.setAll('scale.x', 0.5);
		enemyGroup.setAll('scale.y', 0.5);
	},
	render: function() {
	  //var debug;
	  //debug = this.game.debug;
	  //if (debugSettings["debug.gameInfo()"]) {
		//debug.gameInfo(300, 20);
	  //}
	  //if (debugSettings["debug.gameTimeInfo()"]) {
		//debug.gameTimeInfo(300, 120);
	 // }
	}
}
