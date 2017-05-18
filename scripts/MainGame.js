BasicGame.Game = function (game) {};

//Graphical objects
var ship;

BasicGame.Game.prototype = {

	create: function () {
       //Specify the physics of the Game to arcade
			 this.physics.startSystem(Phaser.Physics.ARCADE);
			 //Add the star field and logo on screen
			 this.starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield');
			 //Add the ship onto the screen, set physics and the boundaries
			 ship = this.add.sprite((this.world.width / 2), this.world.height -50, 'ship');
			 ship.anchor.setTo(0.5,0);
			 this.physics.enable(ship, Phaser.Physics.ARCADE);
			 ship.body.collideWorldBounds = true;

	},

	update: function () {
		//execute 'createUfo','createLife','moveShip','collisionDetection' function

	}

};
