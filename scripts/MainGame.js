BasicGame.Game = function(game) {};

//Graphical objects
var ship;
var ufos; //Group of enemies drop from top of screen
var lives; //Group of lives which can be collected
var timeup; //Group of clocks which can be collected to add 10s to timer

var bullets; //projectiles shot by the ship
var fireRate = 100; //Rate at which the bullets are fires
var nextFire = 0;

//Misc. Variables
var cursors; //Keyboard control
var gameOverText;
var restartButton;
var gameOver;

//Timer variable
var seconds; //Time in seconds that the game has been running
var timer;
var timerText;

//Audio Variables
var music;
var bulletAudio;
var explosionAudio;

//HUD
var health;
var score;
var scoreText;
var healthText;
var showDebug = false;
var debugToggle;


BasicGame.Game.prototype = {

  create: function() {
    //Specify the physics of the Game to arcade
    this.physics.startSystem(Phaser.Physics.ARCADE);
    //Add the star field and logo on screen
    this.grass = this.add.tileSprite(0, 0, 800, 600, 'grass');
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

    //TIMEUP
    //Create the group of timeup, set their physics and boundaries
    timeup = this.add.group();
    this.physics.enable(timeup, Phaser.Physics.ARCADE);

    timeup.setAll('outOfBoundsKill', true);
    timeup.setAll('checkWorldBounds', true);
    timeup.setAll('anchor.x', 0.5);
    timeup.setAll('anchor.y', 0.5);

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
		scoreText = this.add.text(16, 16, "Score: 0", {
			font: '32px Arial',
			fill: '#fff'
		});
		//Sets value of score to 0 and outputs to the screen
		score = 0;
		scoreText.text = "Score: " + score;

		healthText = this.add.text(this.world.width - 150, 16, "Lives: 3", {
			font: '32px Arial',
			fill: '#fff'
		});
		//Sets value of health to 3 and outputs to screen
		health = 3;
		healthText.text = "Lives: " + health;

		//Setup the timer
		timerText = this.add.text(350, 16, 'Time: 0', {
			font: '32px Arial',
			fill: '#fff'
		});
		timer = this.time.create(false);
		seconds = 60;
		timerText.text = "Time: " + seconds;

    //GAME OVER
    gameOverText = this.add.text(this.world.centerX, this.world.centerY - 50, "GAME OVER", {
      font: '96px Impact',
      fill: '#ff0',
      align: 'center'
    });
    gameOverText.anchor.set(0.5);
    //Hides GAME OVER text
    gameOverText.visible = false;
    gameOver = false;

    //RESTART
    //Creates a restart button and hides it
    restartButton = this.add.button((this.world.width / 2), (this.world.height / 2) + 50, 'startButton', this.restartGame);
    restartButton.anchor.set(0.5);
    restartButton.visible = false;

    //CONTROLS
    //Allow Left arrow, Right arrow and Space
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
    cursors = this.input.keyboard.createCursorKeys();

    //Debug toggle
    /*debugToggle = this.input.keyboard.addKey(Phaser.Keyboard.F3);
    this.debugToggle.onDown.add(toggle, this);*/

    //Load audio into memory, start music
    bulletAudio = this.add.audio('bullet');
    explosionAudio = this.add.audio('explosion');
    music = this.add.audio('music', 1, true);
    music.play('', 0, 1, true);

		//Set TimerEvent to occur every second
		timer.loop(1000, this.updateTimer, this);
		timer.start();
	  },

  update: function() {
    //Scroll background
    this.grass.tilePosition.y += 2;

    //execute trueGameOver function when one of the requirements is met
    if (health < 1 || seconds == 0 || gameOver === true) {
      this.trueGameOver();
    }
    //else execute 'createUfo','createLife','moveShip','collisionDetection' function
    else {
    this.createUfo();
    this.createLife();
    this.createTimeUp();
    this.moveShip();
    this.collisionDetection();
  }
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
      ufo.animations.add('ufoAnimation', [0,1], 20, true);
      ufo.play('ufoAnimation');
      //Generate random velocity
      ufo.body.velocity.y = this.rnd.integerInRange(100, 600);
    /*  //Animate UFOs
      animation = this.add.sprite(ufo.body.x, ufo.body.y, 'ufoAnimation');
      animation.animations.add('ufoAnimation');
      animation.animations.play('ufoAnimation', 15, true);*/
    }
  },

  createLife: function() {
    //Function which spawns life, for the player to collected

    //Generate random number between 0 and 500
    var random = this.rnd.integerInRange(0, 750);
    //If random = 0 spawn a life at a random X position
    if (random === 0) {
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);

      //Create life from lives group and set the velocity
      var life = lives.create(randomX, -50, 'life');
      this.physics.enable(life, Phaser.Physics.ARCADE);
      life.body.velocity.y = 200;
    }
  },

  createTimeUp: function() {
    //Function which spawns timeup, for the player to collected

    //Generate random number between 0 and 500
    var random = this.rnd.integerInRange(0, 600);
    //If random = 0 spawn a timeup at a random X position
    if (random === 300) {
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);

      //Create extratime from timeup group and set the velocity
      var extratime = timeup.create(randomX, -50, 'timeup');
      this.physics.enable(extratime, Phaser.Physics.ARCADE);
      extratime.body.velocity.y = 300;
    }
  },

  fireBullet: function() {
    //Generates the bullet and it's position, then sets the velocity and plays the audio
    if (this.time.now > nextFire && bullets.countDead() > 0) {
      nextFire = this.time.now + fireRate;
      var bullet = bullets.getFirstExists(false);
      bullet.reset(ship.x, ship.y);
      bullet.body.velocity.y = -400;
      bulletAudio.play();
    }
  },

  collisionDetection: function() {
    //Function executed during gameplay, checks for collisions
    this.physics.arcade.overlap(ship, ufos, this.collideUfo, null, this);
    this.physics.arcade.overlap(ship, lives, this.collectLife, null, this);
    this.physics.arcade.overlap(ship, timeup, this.collectTimeUp, null, this);
    this.physics.arcade.overlap(bullets, ufos, this.destroyUfo, null, this);
  },

  collideUfo: function(ship, ufo) {
    //Executed if there is a collision between the ship and ufos
    //Ufo is destroyes, player looses 1 life and animations are played
    explosionAudio.play();
    ufo.kill();
    var animation = this.add.sprite(ufo.body.x, ufo.body.y, 'kaboom');
    animation.animations.add('explode');
    animation.animations.play('explode', 30, false, true);
		health--;
		healthText.text = "Lives: " + health;
  },

  destroyUfo: function(bullet, ufo) {
		//Executed if there is a colllision between a UFO and a bullet
		//UFO is destroyed, plays sound and animation, increases score
    explosionAudio.play();
    ufo.kill();
		bullet.kill();
    var animation = this.add.sprite(ufo.body.x, ufo.body.y, 'kaboom');
    animation.animations.add('explode');
    animation.animations.play('explode', 30, false, true);
		score += 100;
		scoreText.text = "Score: " + score;
	},

	collectLife: function(ship, life) {
		//Executed when there is a collision between the player and life
		//Life is destroyed, animation and sound played, increased health
		life.kill();
		health++;
		healthText.text = "Lives: " + health;
    var animation = this.add.sprite(life.body.x, life.body.y, 'lifeAnimation');
    animation.animations.add('lifeAnimation');
    animation.animations.play('lifeAnimation', 30, false, true);
	},

  collectTimeUp: function(ship, extratime) {
		//Executed when there is a collision between the player and life
		//Life is destroyed, animation and sound played, increased health
		extratime.kill();
		seconds = seconds + 10;
		timerText.text = "Time: " + seconds;
    var animation = this.add.sprite(extratime.body.x, extratime.body.y, 'timeAnimation');
    animation.animations.add('timeAnimation');
    animation.animations.play('timeAnimation', 30, false, true);
	},

	updateTimer: function(){
		//Updates timer and outputs to the screen
		seconds--;
		timerText.text = "Time: " + seconds;
	},

  trueGameOver: function () {
    //Executed when game ends, kills all objects, stops timer and displays game over screen
    ship.body.velocity.x = 0;
    ship.body.x = (this.world.width / 2) - (ship.body.width / 2);
    ufos.callAll('kill');
    lives.callAll('kill');
    bullets.callAll('kill');
    music.stop();
    gameOverText.visible = true;
    restartButton.visible = true;
    timer.stop();
  },

restartGame: function () {
  //executed when restart button is pressed
  this.game.state.start('Game');
},

toggle: function() {
  showDebug = (showDebug) ? false : true;
  if (!showDebug) {
    game.debug.reset();
  }
},

render: function () {
  //Sprite debug info
  if (showDebug) {
  this.game.debug.bodyInfo(ship,32, 100);
  this.game.debug.spriteBounds(ship);
}
},

};
