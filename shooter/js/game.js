var DEBUG = 1;

//setup screen
var screen = {};
screen.width = 1200;
screen.height = 800;
screen.centerX = screen.width / 2;
screen.centerY = screen.height / 2;

//setup scenes
var scenes = {},
	MENUSCENE = Phaser.Keyboard.ONE,
	MAINSCENE = Phaser.Keyboard.TWO;
	SCORESCENE = Phaser.Keyboard.THREE;

scenes.states = [];
scenes.states[MENUSCENE] = 'menu';
scenes.states[MAINSCENE] = 'main';
scenes.states[SCORESCENE] = 'score';


/**
 * Player and enemies
 */
//setup enemies
var enemies = {};
enemies.dude = {};
enemies.dude.sprite = null;
enemies.dude.speed = 6;
enemies.dude.isJumping = false;
enemies.dude.jumpTimer = 0;
enemies.dude.tilemap = 300;
enemies.dude.velocity = 25;

var player = {},
	barrel = null,
	bullets = null,
	bullet_velocity = 250,
	nextFire = 0, //next game.time to fire at
	bulletRate = 150, //millisecond delay on bullet shots
	largeEnemy = {},
	enemyGroup = null,
	bullet = null,
	frameNames = null;

player.sprite = null;
player.speed = 6;
player.velocity = 350;


/**
 * SAVE any value to local storage
 * @param string Storage name
 * @param mixed Storage Value
 */
function storeLocal(name, value){
   if (typeof(Storage) !== "undefined") {
	   localStorage.setItem(name, JSON.stringify(value));
   }else{
	   //if we do not have local storage for some reason try to use cookies
	   //we are just saving for 1 day for now
	   setCookie(name, JSON.stringify(value), 1);
   }
}

/**
 * GET any value to local storage
 * @param  string cname  Storage Name
 * @return string        Storage Value
 */
function getLocal(name){

   if (typeof(Storage) !== "undefined") {
	   return JSON.parse(localStorage.getItem(name));
   }else{
	   //if we do not have local storage for some reason try to use cookies
	   return JSON.parse(getCookie(name));
   }

}

/**
 * Set a Cookie
 * @param string cname  Cookie Name
 * @param mixed cvalue  Cookie Value
 * @param int exdays How many days before expire
 */
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Get a cookie
 * @param  string cname  Cookie Name
 * @return string        Cookie Value
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
}

/**
 * Delete a Cookie
 * @param string cname  Cookie Name
 */
function deleteCookie(cname) {
	setCookie(cname, '', -1);
}

/**
 * Use for debugging information
 * @param mixed data any value you would like to log to the console
 */
function debugLog(data){
    if(DEBUG !== 1) return false;

	console.log(data);
}

/**
 * Setup the state listeners to move between the states on keypress
 */
function addStateListeners(){
	if(DEBUG !== 1) return false;

	for(var s in scenes.states){
		addKeyCallback(s, changeState, s);
	}
}

/**
 * Change the game state
 * @param event event the change event
 * @param int the state to change to
 */
function changeState(event, stateNum){
	debugLog('Change State: '+scenes.states[stateNum]);
	game.state.start(scenes.states[stateNum]);
}

/**
 * Helper function to take action on key press
 * https://phaser.io/docs/2.4.4/Phaser.Key.html#onDown
 * @param int key the keycode for the key pressed
 * @param string fn the name of the function to be called on key press (do not include quotes)
 * @param mixed the first argument passed to the added function
 */
function addKeyCallback(key, fn, args){
	game.input.keyboard.addKey(key).onDown.add(fn, null, null, args);
}


/**
 * Get a random integer between min and max
 * @param int min
 * @param int max
 */
function getRandomInt(min,max)
{
	return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 * Setup arrays to have a random function to return one of their elements at random
 */
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

/**
 * Show the game fps. Only displays if DEBUG is true
 */
function showFPS(){
	if(! DEBUG) return;

	//SETTING UP THE DEBUG PLUGIN. THIS WILL RUN ON ALL SCENES
	game.debug.font = "24px monospace";
	game.debug.lineHeight = 20;
	if (!game.timing) {
		game.timing = game.plugins.add(Phaser.Plugin.AdvancedTiming);
	}
	//this affects the game physics and not the actual displayed FPS. Setting this to our desired frame rate will allow catchup mechanics in the physics to work better in instances where the framerate drops below this desired rate
	game.time.desiredFps = 30;
	game.time.advancedTiming = true;
}

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

var game = new Phaser.Game(screen.width,screen.height,Phaser.AUTO);

//game.state.add(scenes.states[MENUSCENE], scenes.menu);
game.state.add(scenes.states[MAINSCENE], scenes.main);
//game.state.add(scenes.states[SCORESCENE], scenes.score);

//START the first scene
game.state.start(scenes.states[MAINSCENE]);
