import Enemy from 'Enemy';

// Semi Advanced Generic example: http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015/
// Basic Phaser Example: https://phaser.io/examples/v2/games/tanks

class BasicEnemy extends Enemy {

	constructor(game) {
		super(game); // // Setup the generic Enemy class
		//this.animations.add("yellow", ["ripperYellow"]); // The "animation" consists of only on frame in this case
		//this.animations.add("red", ["ripperRed"]); // The red type of rippers
		//this.animations.add("frozen", ["ripperFrozen"]); // A frozen ripper

		this.vulnerabilities = {
			normal: 1,
			ice: 1,
			fire: 1,
			bomb: 1,
			missile: 1,
		};
	}

	spawn(x, y, type) {
		this.stdReset(x,y); // Reset everything from Enemy class
		this.color = type; // there is two types, yellow and red
		/*
		if(this.color === "red") {
			// The red ones can be killed with missiles and screw attack
			this.vulnerabilities.missile = 1000;
			this.vulnerabilities.screw = 1000;
		}
		else {
			// The yellow ones is indestructible
			this.vulnerabilities.missile = 0;
			this.vulnerabilities.screw = 0;
		}
		*/
		//this.play(this.color);
		// start in a random direction
		/*
		if (Math.random() < 0.5) {
			this.body.velocity.x = -this.speed;
		} else {
			this.body.velocity.x = this.speed;
		}
		*/
	}

	/* The update method will be called automatically by Phaser, just as in the pure Phaser.Sprite class */
	update() {
		if(!this.stdUpdate()){return;}; // Do a standard update from Enemy class to check if update should even be done
		this.game.physics.arcade.collide(this, this.game.collisionLayer);

		/*
		if (this.body.blocked.right) {
			this.scale.x = -1;
			this.body.velocity.x = -this.speed;
		} else if (this.body.blocked.left) {
			this.scale.x = 1;
			this.body.velocity.x = this.speed;
		}
		*/
	}
}

export default BasicEnemy;
