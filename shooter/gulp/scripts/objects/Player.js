/*
 * Player.js
 * @link http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015
 */
class Player extends Phaser.Sprite {
	constructor(game) {
		super(game, 0, 0, "sprites"); // Setup Phaser.Sprite. It's coordinates is unimportant and I just set them to zero. "Sprites" is a spriteatlas with sprites for all enemies.
		this.alive = true;
		this.anchor.setTo(0.5, 0.5);
		// Body
		this.game.physics.enable(this);
		this.body.allowGravity = false;
		this.body.immovable = false;
		this.maxHealth = 1;
		this.vulnerabilities = {
			normal: 1,
			ice: 10,
			fire: 10,
			bomb: 100,
			missile: 100,
		};
		//let anim = this.animations.add("deathAnimation", ["boom0", "boom1", "boom2"], 15, false); // generic explosion when killed, can be overrided of course
		//anim.onComplete.add(this.death, this);
	}

	/* Standard reset is called from the spawn-function */
	stdReset(x, y) {
		this.reset(x, y);
		this.health = this.maxHealth;
		this.alive = true;
		this.dying = false;
		this.frozen = false;
	}

	/* stdUpdate is called from the enemies' update methods to do generic stuff. If it return false the update loop in the enemy calling stdUpdate should be broken. */
	stdUpdate() {
		if (!this.exists && this.frozen) {
			return false;
		}

		return true; // Continue update-loop
	}

	hit(enemy) {
		if (this.dying) { // While the enemy sprite plays it's death animation it should ignore all bullets
			return;
		}
		if (enemy.type === "ice" && !this.frozen) { // Ice will freeze if not frozen, but defrost if the enemy is frozen
			this.frozen = true;
			//this.play("frozen");
		} else {
			this.frozen = false;
			this.health -= 1; //this.vulnerabilities[enemy.type];
			if (this.vulnerabilities[enemy.type] === 0) { // A metallic "klonk" when there is no damage
				//this.game.sound.play('ricochetShort');
			}
		}

		if (this.health < 1) {
			this.dying = true;
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
			//this.play("deathAnimation");
		}
	}

	death() {
		//this.game.pickups.createNew(this.x, this.y, "random"); // The enemies randomly drops an energy dot or missile
		this.alive = false;
	}
}

export default Player;
