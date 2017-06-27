var BasicGame = {};

BasicGame.Preloader = function (game) {
	this.ready = false;
};

BasicGame.Preloader.prototype = {

	preload: function () {
      //Displays a loading screen message while the assets are koaded into memory
			this.preloaderText = this.add.text(this.world.centerX, this.world.centerY, 'Loading...',
		{
			fontSize: '96px',
			fill: '#fff',
			align: 'center'
		});
		this.preloaderText.anchor.setTo(0.5,0.5);

		//preload the images, sprites and audio assets into memory
		this.load.image('logo', 'assets/PhaserLogo.png');
		this.load.image('grass', 'assets/grass.png');
		this.load.image('startButton', 'assets/startButton.png');
		this.load.image('life', 'assets/lives.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.image('timeup', 'assets/time.png');

		this.load.spritesheet('mage', 'assets/mage.png', 64, 64, 8);
		this.load.spritesheet('kaboom', 'assets/explode.png', 128, 128, 16);
		this.load.spritesheet('lifeAnimation', 'assets/lifeAnimation.png', 100, 100, 4);
		this.load.spritesheet('timeAnimation', 'assets/timeAnimation.png', 100, 100, 4);
		this.load.spritesheet('skellySprite', 'assets/skellySprite.png', 64, 64, 4);

		this.load.audio('music', ['assets/music.m4a', 'assets/music.mp3']);
		this.load.audio('bullet', ['assets/laser_human.mp3']);
		this.load.audio('explosion', ['assets/explosion.mp3']);

	},

	create: function () {

	},

	update: function () {
		//Wait for audio to decode before MainMenu
		if (this.cache.isSoundDecoded('music') && this.ready === false) {
			this.ready = true;
			this.game.state.start('MainMenu');
		}
	}

};
