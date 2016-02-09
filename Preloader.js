Alphab.Preloader = function(game){
	// define width and height of the game
	Alphab.GAME_WIDTH = 1368;
	Alphab.GAME_HEIGHT = 864;
};
Alphab.Preloader.prototype = {
	preload: function(){
		// set background color and preload image
		this.stage.backgroundColor = '#9FCBF0';
		this.preloadBar = this.add.sprite((Alphab.GAME_WIDTH-311)/2, (Alphab.GAME_HEIGHT-27)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
		// load images
		this.load.image('background', 'img/Backrocket.png');
		// load spritesheets
		this.load.spritesheet('alphabets', 'img/ATOZsmallf.png', 50, 50);
		this.load.spritesheet('button-start', 'img/button-start.png', 401, 143);
	},
	create: function(){
		// start the MainMenu state
		this.state.start('MainMenu');
	}
};