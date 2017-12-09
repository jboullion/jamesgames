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
