Alphab.Preloader = function(game){
	// define width and height of the game
	Alphab.GAME_WIDTH = 1368;
	Alphab.GAME_HEIGHT = 864;
    // The dictionary lookup object
    dict = {};
    allText = "";
    words = [];
};

Alphab.Preloader.prototype = {
    

	preload: function(){
		// set background color and preload image
		this.stage.backgroundColor = '#9FCBF0';
		this.preloadBar = this.add.sprite((Alphab.GAME_WIDTH-311)/2, (Alphab.GAME_HEIGHT-27)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
		// load images
		this.load.image('background', 'img/Backrocket.png');
		this.load.image('backgame', 'img/Back_game.png');
		// load spritesheets
		this.load.spritesheet('balls', 'img/ATOZsmallf.png', 50, 50);
		this.load.spritesheet('button-start', 'img/button-start.png', 401, 143);
	},
    
    readTextFile: function(file){
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    allText = rawFile.responseText;
          //          alert(allText);
                }
            }
        }
        rawFile.send(null);
    },
    
	create: function(){
        console.log("Working");
        this.readTextFile("https://raw.githubusercontent.com/jonbcard/scrabble-bot/master/src/dictionary.txt");
        
    //    $.get( "https://raw.githubusercontent.com/jonbcard/scrabble-bot/master/src/dictionary.txt", function( txt ) {
        // Get an array of all the words
        words = allText.split( "\n" );

        // And add them as properties to the dictionary lookup
        // This will allow for fast lookups later
        for ( var i = 0; i < words.length; i++ ) {
            dict[ words[i] ] = true;
           // console.log(words[i]);
        }

        // The game would start after the dictionary was loaded
        // startGame();
//        })
  
        // start the MainMenu state
		this.state.start('MainMenu');
	}
};