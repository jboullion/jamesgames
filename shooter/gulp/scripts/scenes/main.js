scenes.main = function(){};

scenes.main.prototype = {
	init: function() {


	},
	preload: function(){
		game.load.image('cannon_base', 'assets/sprites/cannon_base.png');
		game.load.image('cannon_barrel', 'assets/sprites/cannon_barrel.png');
		game.load.image('bullet', 'assets/sprites/bullet.png');
		game.load.spritesheet('dude', 'assets/spritesheets/dudeSheet.png', 159, 250);
	},
	create: function(){
		game.stage.backgroundColor = "#006666";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.physics.arcade.gravity.y = 0;

		//addStateListeners();
		showFPS();

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		player.sprite = game.add.sprite(screen.centerX,screen.centerY, 'cannon_base');
		player.sprite.anchor.setTo(0.3, 0.5);

		//enable physics on dude
		game.physics.enable(player.sprite);
		player.sprite.body.collideWorldBounds = true;

		game.camera.follow(player.sprite);
		game.camera.deadzone = new Phaser.Rectangle(screen.centerX - 100, 0, 200, 200);

		barrel = game.add.sprite(0, 0, 'cannon_barrel');
		player.sprite.addChild(barrel);
		barrel.anchor.setTo(0.1, 0.5);

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(20,'bullet');
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		//bullets.setAll('scale.x', 0.7);
		//bullets.setAll('scale.y', 0.7);



		//largeEnemy.sprite = game.add.sprite(screen.centerX / 2, screen.centerY, 'dude');
		//largeEnemy.sprite.anchor.setTo(0.5, 0.5);
		//game.physics.enable(largeEnemy.sprite);

		enemyGroup = game.add.group();
		enemyGroup.enableBody = true;
		enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

		game.physics.enable([player.sprite, enemyGroup]);

		//create our enemies!
		var numEnemies = 5;
		for(var i = 0; i < numEnemies; i++){
			this.createEnemy();
		}

	},
	update: function(){
		game.physics.arcade.collide(player.sprite, enemyGroup, this.takeDamage, null, this);

		player.sprite.rotation = game.physics.arcade.angleToPointer(player.sprite);
		bullets.forEachAlive(game.debug.body,game.debug,"red",false);
		bullets.forEachAlive(game.debug.spriteBounds,game.debug,"blue",false);


		//game.physics.arcade.overlap(bullets, largeEnemy.sprite, this.hitEnemy);
		game.physics.arcade.overlap(bullets, enemyGroup, this.hitGroup);

		if(game.input.activePointer.isDown){
			this.fire();
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
			game.input.keyboard.isDown(Phaser.Keyboard.D)){
			//player.sprite.x += player.speed;
			player.sprite.body.velocity.x = player.velocity;
			//turn around when walking
			//player.sprite.scale.setTo(0.5, 0.5);
			//walk
			//player.sprite.animations.play('walk', 12, true);
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
			game.input.keyboard.isDown(Phaser.Keyboard.A)){
			//player.sprite.x += -player.speed;
			player.sprite.body.velocity.x = -player.velocity;
			//turn around when walking
			//player.sprite.scale.setTo(-0.5, 0.5);
			//player.sprite.animations.play('walk', 12, true);
		}else{
			player.sprite.body.velocity.x = 0;
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
			game.input.keyboard.isDown(Phaser.Keyboard.W)){
			//player.sprite.y += -player.speed;

			player.sprite.body.velocity.y = -player.velocity;
			//turn around when walking
			//player.sprite.scale.setTo(0.5, 0.5);
			//walk
			//player.sprite.animations.play('walk', 12, true);
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
			game.input.keyboard.isDown(Phaser.Keyboard.S)){
			//player.sprite.y += player.speed;
			player.sprite.body.velocity.y = player.velocity;
			//turn around when walking
			//player.sprite.scale.setTo(-0.5, 0.5);
		//	player.sprite.animations.play('walk', 12, true);
		}else{
			player.sprite.body.velocity.y = 0;
		}

		if(! game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
 		 && ! game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
	 	 && ! game.input.keyboard.isDown(Phaser.Keyboard.UP)
  		 && ! game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			 //player.sprite.body.velocity.y = 0;
			 //player.sprite.body.velocity.x = 0;
			 //stop animation and set player into first frame
			 //player.sprite.animations.stop();
			 //player.sprite.frame = 0;
		 }

		 this.moveEnimies();
	},
	fire: function(){
		if(game.time.now > nextFire){
			nextFire = game.time.now + bulletRate;

			bullet = bullets.getFirstDead();
			bullet.reset(player.sprite.x, player.sprite.y);

			game.physics.arcade.moveToPointer(bullet, bullet_velocity);
			bullet.rotation = game.physics.arcade.angleToPointer(bullet);
		}
	},
	hitEnemy: function(){
		largeEnemy.sprite.kill();
		bullet.kill();
	},
	hitGroup: function(b,e){
		//game.debug.body(b);
		//game.debug.body(e);
		e.kill();
		b.kill();
		scenes.main.prototype.createEnemy();
	},
	moveEnimies: function() {
		var t = player.sprite.body;
		enemyGroup.forEachAlive(function(enemy) {

			var rotation = this.game.math.angleBetween(enemy.x, enemy.y, t.x, t.y);
			enemy.body.velocity.x = Math.cos(rotation) * enemies.dude.velocity;
			enemy.body.velocity.y = Math.sin(rotation) * enemies.dude.velocity;

			if(enemy.body.velocity.x > 0){
				enemy.scale.setTo(0.5, 0.5);
				//enemy.anchor.x = -0.5;
			}else{
				enemy.scale.setTo(-0.5, 0.5);
				//enemy.anchor.x = 0.5;
			}
		}, this);

		//enemyGroup.forEachAlive(game.debug.body,game.debug,"#ff9090",false);
	},
	createEnemy: function() {
		var newEnemy = enemyGroup.create(getRandomInt(50,screen.width - 75), getRandomInt(50,screen.height - 75), 'dude');
		newEnemy.anchor.x = 0.5;
		newEnemy.anchor.y = 0.5;
		newEnemy.scale.x =  0.5;
		newEnemy.scale.y = 0.5;
		newEnemy.body.velocity.x = enemies.dude.velocity;
		newEnemy.body.velocity.y = enemies.dude.velocity;

		//for some reason calling animate on the individual enemies does not work past the first animation cycle
		newEnemy.animations.add('walk', [0,1,2]);
		newEnemy.animations.play('walk', 12, true);

	},
	takeDamage: function(player, enemy) {
		console.log('DAMAGE!');
	}
}
