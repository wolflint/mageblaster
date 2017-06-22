BasicGame.Game = function (game) {
};
//Graphical objects
var mage;
var skellys; //Group of enemies drop from top of screen
var lives; //Group of lives which can be collected
var timeup; //Group of clocks which can be collected to add 10s to timer
var bullets; //projectiles shot by the mage
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
  create: function () {
    //Specify the physics of the Game to arcade
    this.physics.startSystem(Phaser.Physics.ARCADE);
    //Add the star field and logo on screen
    this.grass = this.add.tileSprite(0, 0, 800, 600, 'grass');
    //Add the mage onto the screen, set physics and the boundaries
    mage = this.add.sprite((this.world.width / 2), this.world.height - 50, 'mage');
    mage.anchor.setTo(0.5, 0);
    this.physics.enable(mage, Phaser.Physics.ARCADE);
    mage.body.collideWorldBounds = true;
    //mage animations
    mage.animations.add('mageLeft', [4,5], 5, true);
    mage.animations.add('mageRight', [6,7], 5, true);
    mage.animations.add('mageBack', [0,1], 5, true);
    mage.animations.add('mageFront', [2,3], 2, true);
    //Creating Groups
    //skellys
    //Create the skelly groups, set theirs physics and boundaries
    skellys = this.add.group();
    this.physics.enable(skellys, Phaser.Physics.ARCADE);
    skellys.setAll('outOfBoundsKill', true);
    skellys.setAll('checkWorldBounds', true);
    skellys.setAll('anchor.x', 0.5);
    skellys.setAll('anchor.y', 0.5);
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
    scoreText = this.add.text(16, 16, 'Score: 0', {
      font: '32px Arial',
      fill: '#fff'
    });
    //Sets value of score to 0 and outputs to the screen
    score = 0;
    scoreText.text = 'Score: ' + score;
    healthText = this.add.text(this.world.width - 150, 16, 'Lives: 3', {
      font: '32px Arial',
      fill: '#fff'
    });
    //Sets value of health to 3 and outputs to screen
    health = 3;
    healthText.text = 'Lives: ' + health;
    //Setup the timer
    timerText = this.add.text(350, 16, 'Time: 0', {
      font: '32px Arial',
      fill: '#fff'
    });
    timer = this.time.create(false);
    seconds = 60;
    timerText.text = 'Time: ' + seconds;
    //GAME OVER
    gameOverText = this.add.text(this.world.centerX, this.world.centerY - 50, 'GAME OVER', {
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
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.SPACEBAR]);
    cursors = this.input.keyboard.createCursorKeys();
    //Debug toggle
    /*debugToggle = this.input.keyboard.addKey(Phaser.Keyboard.F3);

    this.debugToggle.onDown.add(toggle, this);*/
    //Load audio into memory, start music
    bulletAudio = this.add.audio('bullet');
    explosionAudio = this.add.audio('explosion');
    explosionAudio.volume = 0.5;
    music = this.add.audio('music', 1, true);
    music.play('', 0, 0.5, true);
    //Set TimerEvent to occur every second
    timer.loop(1000, this.updateTimer, this);
    timer.start();
  },
  update: function () {
    //Scroll background
    this.grass.tilePosition.y += 2;
    //execute trueGameOver function when one of the requirements is met
    if (health < 1 || seconds == 0 || gameOver === true) {
      this.trueGameOver();
    }    //else execute 'createUfo','createLife','movemage','collisionDetection' function
     else {
      this.createUfo();
      this.createLife();
      this.createTimeUp();
      this.movemage();
      this.collisionDetection();
    }
  },
  movemage: function () {
    //Moves mage and fires the bullets using keyboard controls
    //When Left Arrow pressed, moves mage Left
    if (cursors.left.isDown) {
      mage.body.velocity.x = //When Right Arrow pressed, moves mage Right
      - 200;
      mage.animations.play('mageLeft');
    } else if (cursors.right.isDown) {
      mage.body.velocity.x = //No button pressed, stops horizontal movement
      200;
      mage.animations.play('mageRight');
    } else {
      mage.body.velocity.x = 0;
      mage.animations.play('mageBack');
    }
    //SHOOTING
    //If SpaceBar is pressed, execute the 'fireBullet' function

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.fireBullet();
    }
  },
  createUfo: function () {
    //When executed, creates new skelly enemies
    //Randomly generates a number between 0 and 20
    var random = this.rnd.integerInRange(0, 20);
    //If random = 0 , then create skelly in a random x position and a random y velocity
    if (random === 0) {
      //Generate random X position
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);
      //Create skelly from the skellys group and set the physics
      var skelly = skellys.create(randomX, - 50, 'skellySprite');
      this.physics.enable(skelly, Phaser.Physics.ARCADE);
      skelly.animations.add('skellySprite', [0, 1], 5, true);
      skelly.play('skellySprite');
      //skelly.body.moves = true;
      //Generate random velocity
      skelly.body.velocity.y = this.rnd.integerInRange(100, 600);
      /*  //Animate skellys

        animation = this.add.sprite(skelly.body.x, skelly.body.y, 'skellySprite');

        animation.animations.add('skellySprite');

        animation.animations.play('skellySprite', 15, true);*/
    }
  },
  createLife: function () {
    //Function which spawns life, for the player to collected
    //Generate random number between 0 and 500
    var random = this.rnd.integerInRange(0, 750);
    //If random = 0 spawn a life at a random X position
    if (random === 0) {
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);
      //Create life from lives group and set the velocity
      var life = lives.create(randomX, - 50, 'life');
      this.physics.enable(life, Phaser.Physics.ARCADE);
      life.body.velocity.y = 200;
    }
  },
  createTimeUp: function () {
    //Function which spawns timeup, for the player to collected
    //Generate random number between 0 and 500
    var random = this.rnd.integerInRange(0, 600);
    //If random = 0 spawn a timeup at a random X position
    if (random === 300) {
      var randomX = this.rnd.integerInRange(0, this.world.width - 150);
      //Create extratime from timeup group and set the velocity
      var extratime = timeup.create(randomX, - 50, 'timeup');
      this.physics.enable(extratime, Phaser.Physics.ARCADE);
      extratime.body.velocity.y = 300;
    }
  },
  fireBullet: function () {
    //Generates the bullet and it's position, then sets the velocity and plays the audio
    if (this.time.now > nextFire && bullets.countDead() > 0) {
      nextFire = this.time.now + fireRate;
      var bullet = bullets.getFirstExists(false);
      bullet.reset(mage.x, mage.y);
      bullet.body.velocity.y = - 400;
      bulletAudio.play('', 0, 0.05);
    }
  },
  collisionDetection: function () {
    //Function executed during gameplay, checks for collisions
    this.physics.arcade.overlap(mage, skellys, this.collideUfo, null, this);
    this.physics.arcade.overlap(mage, lives, this.collectLife, null, this);
    this.physics.arcade.overlap(mage, timeup, this.collectTimeUp, null, this);
    this.physics.arcade.overlap(bullets, skellys, this.destroyUfo, null, this);
  },
  collideUfo: function (mage, skelly) {
    //Executed if there is a collision between the mage and skellys
    //skelly is destroyes, player looses 1 life and animations are played
    explosionAudio.play();
    skelly.kill();
    var animation = this.add.sprite(skelly.body.x, skelly.body.y, 'kaboom');
    animation.animations.add('explode');
    animation.animations.play('explode', 30, false, true);
    health--;
    healthText.text = 'Lives: ' + health;
  },
  destroyUfo: function (bullet, skelly) {
    //Executed if there is a colllision between a skelly and a bullet
    //skelly is destroyed, plays sound and animation, increases score
    explosionAudio.play();
    skelly.kill();
    bullet.kill();
    var animation = this.add.sprite(skelly.body.x, skelly.body.y, 'kaboom');
    animation.animations.add('explode');
    animation.animations.play('explode', 30, false, true);
    score += 100;
    scoreText.text = 'Score: ' + score;
  },
  collectLife: function (mage, life) {
    //Executed when there is a collision between the player and life
    //Life is destroyed, animation and sound played, increased health
    life.kill();
    health++;
    healthText.text = 'Lives: ' + health;
    var animation = this.add.sprite(life.body.x, life.body.y, 'lifeAnimation');
    animation.animations.add('lifeAnimation');
    animation.animations.play('lifeAnimation', 30, false, true);
  },
  collectTimeUp: function (mage, extratime) {
    //Executed when there is a collision between the player and life
    //Life is destroyed, animation and sound played, increased health
    extratime.kill();
    seconds = seconds + 10;
    timerText.text = 'Time: ' + seconds;
    var animation = this.add.sprite(extratime.body.x, extratime.body.y, 'timeAnimation');
    animation.animations.add('timeAnimation');
    animation.animations.play('timeAnimation', 30, false, true);
  },
  updateTimer: function () {
    //Updates timer and outputs to the screen
    seconds--;
    timerText.text = 'Time: ' + seconds;
  },
  trueGameOver: function () {
    //Executed when game ends, kills all objects, stops timer and displays game over screen
    mage.body.velocity.x = 0;
    mage.body.x = (this.world.width / 2) - (mage.body.width / 2);
    mage.animations.play('mageFront');
    skellys.callAll('kill');
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
  toggle: function () {
    showDebug = (showDebug) ? false : true;
    if (!showDebug) {
      game.debug.reset();
    }
  },
  render: function () {
    //Sprite debug info
    if (showDebug) {
      this.game.debug.bodyInfo(mage, 32, 100);
      this.game.debug.spriteBounds(mage);
    }
  },
};
