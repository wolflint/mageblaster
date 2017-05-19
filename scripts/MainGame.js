BasicGame.Game = function(game) {};

//Graphical objects
var ship;
var ufos; //Group of enemies drop from top of screen
var lives; //Group of lives which can be collected

var bullets; //projectiles shot by the ship
var fireRate = 100; //Rate at which the bullets are fires
var nextFire = 0;

//Misc. Variables
var cursors; //Keyboard control

//Timer variable
var seconds; //Time in seconds that the game has been running
var timer;
var timerText;

BasicGame.Game.prototype = {

  create: function() {
    //Specify the physics of the Game to arcade
    this.physics.startSystem(Phaser.Physics.ARCADE);
    //Add the star field and logo on screen
    this.starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield');
    //Add the ship onto the screen, set physics and the boundaries
    ship = this.add.sprite((this.world.width / 2), this.world.height - 50, 'ship');
    ship.anchor.setTo(0.5, 0);
    this.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;

    //Creating Groups

    //UFOs
    //Create the UFO groups, set theirs physics and boundaries
    ufos = this.add.group();
    this.physics.enable(ufos, Phaser.Physics.ARCADE);

    ufos.setAll('outOfBoundsKill', true);
    ufos.setAll('checkWorldBounds', true);
    ufos.setAll('anchor.x', 0.5);
    ufos.setAll('anchor.y', 0.5);

    //LIVES
    //Create the group of lives, set their physics and boundaries
    lives = this.add.group();
    this.physics.enable(lives, Phaser.Physics.ARCADE);

    lives.setAll('outOfBoundsKill', true);
    lives.setAll('checkWorldBounds', true);
    lives.setAll('anchor.x', 0.5);
    lives.setAll('anchor.y', 0.5);

    //BULLETS
    //Create the bullets group, set their physics, multiples and boundaries
    bullets = this.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

		//Score, Timer and Life HUD setup
		scoreText = this.add.text(16, 16, 'Score: 0', {
			font: '32px Arial',
			fill: '#fff'
		});
		//Sets value of score to 0 and outputs to the screen
		score = 0;
		scoreText.text = "Score: " + score;

		lifeTotalText = this.add.text(this.world.width - 150, 16, 'Lives: 3', {
			font: '32px Arial',
			fill: '#fff'
		});
		//Sets value of lifeTotal to 3 and outputs to screen
		lifeTotal = 3;
		lifeTotalText = "Lives: " + lifeTotal;

		//Setup the timer
		timerText = this.add.text(350, 16, 'Time: 0', {
			font: '32px Arial',
			fill: '#fff'
		});
		timer = this.time.create(false);
		seconds = 0;
		timerText.text = "Time: " + seconds;

    //CONTROLS
    //Allow Left arrow, Right arrow and Space
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
    cursors = this.input.keyboard.createCursorKeys();

		//Set TimerEvent to occur every second
		timer.loop(1000, this.updateTimer, this);
		timer.start();
	  },

  update: function() {
    //execute 'createUfo','createLife','moveShip','collisionDetection' function
    this.createUfo();
    this.createLife();
    this.moveShip();
    this.collisionDetection();
  },

  moveShip: function() {
    //Moves ship and fires the bullets using keyboard controls

    //When Left Arrow pressed, moves ship Left
    if (cursors.left.isDown) {
      ship.body.velocity.x = //When Right Arrow pressed, moves ship Right
      -200;
    } else if (cursors.right.isDown) {
      ship.body.velocity.x = //No button pressed, stops horizontal movement
      200;
    } else {
      ship.body.velocity.x = 0;
    }

    //When Left Arrow pressed, moves ship Left
    if (cursors.left.isDown) {
      ship.body.velocity.x = //When Right Arrow pressed, moves ship Right
      -200;
    } else if (cursors.right.isDown) {
      ship.body.velocity.x = //No button pressed, stops horizontal movement
      200;
    } else {
      ship.body.velocity.x = 0;
    }

    //SHOOTING
    //If SpaceBar is pressed, execute the 'fireBullet' function
    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.fireBullet();
    }
  },

  createUfo: function() {
    //When executed, creates new UFO enemies

    //Randomly generates a number between 0 and 20
    var random = this.rnd.integerInRange(0, 20);
    //If random = 0 , then create UFO in a random x position and a random y velocity
    if (random === 0) {
      //Generate random X position
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);

      //Create UFO from the UFOs group and set the physics
      var ufo = ufos.create(randomX, -50, 'ufo');
      this.physics.enable(ufo, Phaser.Physics.ARCADE);
      //Generate random velocity
      ufo.body.velocity.y = this.rnd.integerInRange(100, 600);
    }
  },

  createLife: function() {
    //Function which spawns life, for the player to collected

    //Generate random number between 0 and 500
    var random = this.rnd.integerInRange(0, 500);
    //If random = 0 spawn a life at a random X position
    if (random === 0) {
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);

      //Create life from lives group and set the velocity
      var life = lives.create(randomX, -50, 'life');
      this.physics.enable(life, Phaser.Physics.ARCADE);
      life.body.velocity.y = 150;
    }
  },

  fireBullet: function() {
    //Generates the bullet and it's position, then sets the velocity and plays the audio
    if (this.time.now > nextFire && bullets.countDead() > 0) {
      nextFire = this.time.now + fireRate;
      var bullet = bullets.getFirstExists(false);
      bullet.reset(ship.x, ship.y);
      bullet.body.velocity.y = -400;
    }
  },

  collisionDetection: function() {
    //Function executed during gameplay, checks for collisions
    this.physics.arcade.overlap(ship, ufos, this.collideUfo, null, this);
    this.physics.arcade.overlap(ship, lives, this.collectLife, null, this);
    this.physics.arcade.overlap(bullets, ufos, this.destroyUfo, null, this);
  },

  collideUfo: function(ship, ufo) {
    //Executed if there is a collision between the ship and ufos
    //Ufo is destroyes, player looses 1 life and animations are played
		lifeTotal --;
		lifeTotalText.text = "Lives: " + lifeTotal;
		ufo.kill();
  },

  destroyUfo: function(bullet, ufo) {
		//Executed if there is a colllision between a UFO and a bullet
		//UFO is destroyed, plays sound and animation, increases score
		ufo.kill();
		bullet.kill();
		score += 100;
		scoreText.text = "Score: " + score;
	},

	collectLife: function(ship, life) {
		//Executed when there is a collision between the player and life
		//Life is destroyed, animation and sound played, increased lifeTotal
		life.kill();
		lifeTotal ++;
		lifeTotalText.text = "Lives: " + lifeTotal;
	},

	updateTimer: function(){
		//Updates timer and outputs to the screen
		seconds ++;
		timerText.text = "Time: " + seconds;
	},


};
