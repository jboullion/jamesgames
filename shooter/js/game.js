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

var game = new Phaser.Game(screen.width,screen.height,Phaser.AUTO);

//game.state.add(scenes.states[MENUSCENE], scenes.menu);
game.state.add(scenes.states[MAINSCENE], scenes.main);
//game.state.add(scenes.states[SCORESCENE], scenes.score);

//START the first scene
game.state.start(scenes.states[MAINSCENE]);
