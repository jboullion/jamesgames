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
enemies.dude.velocity = 100;

var player = {},
	barrel = null,
	bullets = null,
	bullet_velocity = 1000,
	nextFire = 0, //next game.time to fire at
	bulletRate = 100, //millisecond delay on bullet shots
	largeEnemy = {},
	enemyGroup = null,
	bullet = null;

player.sprite = null;
player.speed = 6;
player.velocity = 350;
