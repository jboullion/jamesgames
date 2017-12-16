scenes.main = function(){};

scenes.main.prototype = {
	init: function() {


	},
	preload: function(){
		game.load.image('cannon_base', 'assets/sprites/cannon_base.png');
		game.load.image('cannon_barrel', 'assets/sprites/cannon_barrel.png');
		game.load.image('bullet', 'assets/sprites/bullet.png');
		game.load.spritesheet('dude', 'assets/spritesheets/dudeSheet.png', 159, 250);
		game.load.image('tiles', 'assets/spritesheets/tiles.png');
		this.load.atlas('arcade', 'assets/spritesheets/virtualjoystick/arcade-joystick.png', 'assets/spritesheets/virtualjoystick/arcade-joystick.json');
	},
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = "#006666";
		game.world.setBounds(0,0,screen.width, screen.height);

		//game.world.setBounds(world.x1, world.y1, world.x2, world.y2);
		//land = game.add.tileSprite(world.x1, world.y1, world.x2, world.y2, 'tiles');

		//land.fixedToCamera = true;
		//game.physics.arcade.gravity.y = 0;

		//addStateListeners();
		showFPS();

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(numBullets,'bullet');

		//remove bullets outside of world bounds
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);

		//remove bullets off screen
		//bullets.setAll('autoCull', true);
		//bullets.setAll('outOfCameraBoundsKill', true);

		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		//bullets.setAll('scale.x', 0.7);
		//bullets.setAll('scale.y', 0.7);

		player.sprite = game.add.sprite(screen.centerX,screen.centerY, 'cannon_base');
		player.sprite.anchor.setTo(0.5, 0.5);

		//enable physics on dude
		game.physics.enable(player.sprite);
		player.sprite.body.collideWorldBounds = true;

		game.camera.follow(player.sprite);
		game.camera.deadzone = new Phaser.Rectangle(screen.centerX - 100, 0, 200, 200);

		barrel = game.add.sprite(0, 0, 'cannon_barrel');
		player.sprite.addChild(barrel);
		barrel.anchor.setTo(0.5, 0.5);

		player.sprite.bringToTop();
		barrel.bringToTop();

		//largeEnemy.sprite = game.add.sprite(screen.centerX / 2, screen.centerY, 'dude');
		//largeEnemy.sprite.anchor.setTo(0.5, 0.5);
		//game.physics.enable(largeEnemy.sprite);
		/*
		enemyGroup = game.add.group();
		enemyGroup.enableBody = true;
		enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
		*/
		enemyGroup = game.add.group();
		enemyGroup.classType = BasicEnemy;
		enemyGroup.createMultiple(numEnemies);

		game.physics.enable([player.sprite, enemyGroup]);

		//create our enemies!

		for(var i = 0; i < numEnemies; i++){
			enemies.push(new EnemyTank(i, game, tank, enemyBullets));
			//this.createEnemy();
		}

		//https://phaser.io/examples/v2/virtualjoystick/dual-sticks
		pad = game.plugins.add(Phaser.VirtualJoystick);

		stick1 = pad.addStick(0, 0, 100, 'arcade');
		stick1.scale = 0.6;
		stick1.alignBottomLeft(48);

		stick2 = pad.addStick(0, 0, 100, 'arcade');
		stick2.scale = 0.6;
		stick2.alignBottomRight(48);

	},
	update: function(){
		//enemies collide with player
		game.physics.arcade.collide(player.sprite, enemyGroup, this.takeDamage, null, this);

		//enemies collide with themselves
		game.physics.arcade.collide(enemyGroup);

		//bullets collide with enemies
		game.physics.arcade.overlap(bullets, largeEnemy.sprite, this.hitEnemy);
		//game.physics.arcade.collide(bullets, enemyGroup, this.hitGroup);

		if (stick1.isDown)
		{
			game.physics.arcade.velocityFromRotation(stick1.rotation, stick1.force * player.speed * 50, player.sprite.body.velocity);
			//player.sprite.rotation = stick1.rotation;
		}
		else
		{
			player.sprite.body.velocity.set(0);
		}

		if (stick2.isDown)
		{
			this.fireBullet();
		}


/*		KEYBOARD MOVEMENTS

		//rotate player
		player.sprite.rotation = game.physics.arcade.angleToPointer(player.sprite);

		if(game.input.activePointer.isDown){
			this.fireBullet();
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
*/
		 this.moveEnimies();

		//bullets.forEachAlive(game.debug.body,game.debug,"red",false);
 		//bullets.forEachAlive(game.debug.spriteBounds,game.debug,"blue",false);

	},
	fireBullet: function(){
		if(game.time.now > nextFire){
			nextFire = game.time.now + bulletRate;

			bullet = bullets.getFirstDead();
			if(bullet){
				bullet.reset(player.sprite.x, player.sprite.y);
				bullet.rotation = stick2.rotation;
				player.sprite.rotation = stick2.rotation;
				game.physics.arcade.velocityFromRotation(stick2.rotation, bullet_velocity, bullet.body.velocity);
				//game.physics.arcade.moveToPointer(bullet, bullet_velocity);
				//bullet.rotation = game.physics.arcade.angleToPointer(bullet);
			}
		}
	},
	/*
	fireBullet: function(){
		if(game.time.now > nextFire){
			nextFire = game.time.now + bulletRate;

			bullet = bullets.getFirstDead();
			if(bullet){
				bullet.reset(player.sprite.x, player.sprite.y);

				game.physics.arcade.moveToPointer(bullet, bullet_velocity);
				bullet.rotation = game.physics.arcade.angleToPointer(bullet);
			}
		}
	},
	*/
	hitEnemy: function(){
		largeEnemy.sprite.kill();
		bullet.kill();
	},
	hitGroup: function(b,e){
		//game.debug.body(b);
		//game.debug.body(e);

		kills = kills + 1;
		points = points + enemies[e.key].points;

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
	/*
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
	*/
	takeDamage: function(p, enemy) {

		if(game.time.now > nextDamage){
			nextDamage = game.time.now + damageRate;

			player.health = player.health - enemies[enemy.key].damage;
		}


		if(player.health <= 0){
			//debugLog('DIE!');
		}
	},
	render: function(){
		//game.debug.body(barrel);
		game.debug.text('Enemy kills: ' + kills, 32, 50);
		game.debug.text('Points: ' + points, 32, 80);
		game.debug.text('Health: ' + player.health, 32, 110);
	}
}
