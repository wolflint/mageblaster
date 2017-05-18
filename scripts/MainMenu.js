BasicGame.MainMenu = function (game) { };

var startButton;
var starfield;
var logo;

BasicGame.MainMenu.prototype = {

	create: function () {
		//We've already loaded the assets so we'll move straight into the MainMenu
		//Here all we are doing is playing, music, adding a pic and button
		//I will modify the MainMeny to suit your game

		//Output sky, ship, scire, lives, total and Start Time to the screen
		//The scrolling starfield background
		starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield');
		logo = this.add.sprite((this.world.width / 2), (this.world.height / 2) - 150, 'logo');
		logo.anchor.setTo(0.5,0.5);
		startButton = this.add.button((this.world.width /2), (this.world.height / 2) + 50, 'startButton', this.startGame);
		startButton.anchor.setTo(0.5,0.5);
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	startGame: function () {
		//Start actual game
		this.game.state.start('Game');
	}

};
