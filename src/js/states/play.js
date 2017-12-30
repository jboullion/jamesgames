import Player from '../prefabs/player';
import Enemy from '../prefabs/enemy';
import HUD from '../prefabs/hud';

export default class Play extends Phaser.State {

	create() {

		//addStateListeners();
		//showFPS();

		bullets = this.game.add.group();
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

		player.sprite = this.game.add.sprite(screen.centerX,screen.centerY, 'cannon_base');
		player.sprite.anchor.setTo(0.5, 0.5);

		//enable physics on dude
		this.game.physics.enable(player.sprite);
		player.sprite.body.collideWorldBounds = true;

		this.game.camera.follow(player.sprite);
		this.game.camera.deadzone = new Phaser.Rectangle(screen.centerX - 100, 0, 200, 200);

		barrel = this.game.add.sprite(0, 0, 'cannon_barrel');
		player.sprite.addChild(barrel);
		barrel.anchor.setTo(0.5, 0.5);

		player.sprite.bringToTop();
		barrel.bringToTop();

		enemyGroup = this.game.add.group();
		enemyGroup.classType = BasicEnemy;
		enemyGroup.createMultiple(numEnemies);

		this.game.physics.enable([player.sprite, enemyGroup]);

		//create our enemies!

		for(var i = 0; i < numEnemies; i++){
			enemies.push(new EnemyTank(i, game, tank, enemyBullets));
			//this.createEnemy();
		}

		//https://phaser.io/examples/v2/virtualjoystick/dual-sticks
		pad = this.game.plugins.add(Phaser.VirtualJoystick);

		stick1 = pad.addStick(0, 0, 100, 'arcade');
		stick1.scale = 0.6;
		stick1.alignBottomLeft(48);

		stick2 = pad.addStick(0, 0, 100, 'arcade');
		stick2.scale = 0.6;
		stick2.alignBottomRight(48);

	}

	update() {

		//enemies collide with player
		this.game.physics.arcade.collide(player.sprite, enemyGroup, this.takeDamage, null, this);

		//enemies collide with themselves
		this.game.physics.arcade.collide(enemyGroup);

		//bullets collide with enemies
		this.game.physics.arcade.overlap(bullets, largeEnemy.sprite, this.hitEnemy);
		//game.physics.arcade.collide(bullets, enemyGroup, this.hitGroup);

		if (stick1.isDown)
		{
			this.game.physics.arcade.velocityFromRotation(stick1.rotation, stick1.force * player.speed * 50, player.sprite.body.velocity);
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

		 this.moveEnimies();

	}

	fireBullet(){
		if(this.game.time.now > nextFire){
			nextFire = this.game.time.now + bulletRate;

			bullet = bullets.getFirstDead();
			if(bullet){
				bullet.reset(player.sprite.x, player.sprite.y);
				bullet.rotation = stick2.rotation;
				player.sprite.rotation = stick2.rotation;
				this.game.physics.arcade.velocityFromRotation(stick2.rotation, bullet_velocity, bullet.body.velocity);
				//game.physics.arcade.moveToPointer(bullet, bullet_velocity);
				//bullet.rotation = game.physics.arcade.angleToPointer(bullet);
			}
		}
	}

	hitEnemy(){
		largeEnemy.sprite.kill();
		bullet.kill();
	}

	hitGroup(b,e){
		//game.debug.body(b);
		//game.debug.body(e);

		kills = kills + 1;
		points = points + enemies[e.key].points;

		e.kill();
		b.kill();

		scenes.main.prototype.createEnemy();
	}

	moveEnimies() {
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
	}
	/*
	createEnemy() {
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

	takeDamage(p, enemy) {

		if(this.game.time.now > nextDamage){
			nextDamage = this.game.time.now + damageRate;

			player.health = player.health - enemies[enemy.key].damage;
		}


		if(player.health <= 0){
			//debugLog('DIE!');
		}
	}

	render(){
		//game.debug.body(barrel);
		this.game.debug.text('Enemy kills: ' + kills, 32, 50);
		this.game.debug.text('Points: ' + points, 32, 80);
		this.game.debug.text('Health: ' + player.health, 32, 110);
	}

}
