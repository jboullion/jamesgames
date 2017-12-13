var DEBUG = 1;

//setup screen
var screen = {};
screen.width = 1200;
screen.height = 800;
screen.centerX = screen.width / 2;
screen.centerY = screen.height / 2;

/*
var world = {};
world.x1 = -screen.width,
world.y1 = -screen.height,
world.x2 = screen.width*2,
world.y2 = screen.height*2;
*/

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
enemies.dude.damage = 5;
enemies.dude.points = 5;

var player = {},
	barrel = null,
	bullets = null,
	numBullets = 30, //this is the maximum number of bullets we will have in our group
	bullet_velocity = 400,
	nextFire = 0, //next game.time to fire at
	bulletRate = 150, //millisecond delay on bullet shots
	largeEnemy = {},
	enemyGroup = null,
	bullet = null,
	frameNames = null,
	kills = 0,
	points = 0,
	nextDamage = 0,
	damageRate = 300,
	land = null,
	pad = null,
	stick1 = null,
	stick2 = null;

player.sprite = null;
player.speed = 6;
player.velocity = 300;
player.health = 100;
