Alphab.Game = function(game){
    SHOT_DELAY = 2000;
    BALL_SPEED = 250;
    TOTAL_BALLS = 250;
    mov_ball = null;
    mov_ballGroup = null;
    ammo_ball = null;
    ammo_ball_next = null;
    ammo_ballType = 0;
    counter = 0;
    text = 0;
    path = [];
    new_path = [];
    balls_left = TOTAL_BALLS;
    spacer = 30;
    overlap = [];
    k = 0;
    score = 0;
};

Alphab.Game.prototype = {
	create: function() {
        this.add.sprite(0, 0, 'backgame');
        
        this.cannon = this.game.add.sprite(Alphab.GAME_WIDTH/2, Alphab.GAME_HEIGHT/2, 'arrow');
        this.cannon.pivot.x = -70;
        this.cannon.anchor.set(0.5);
        
        mov_ballGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        
        mov_ball = this.add.sprite(-50, 150, 'balls');
        var mov_ballType = Math.floor(Math.random()*26);
		mov_ball.animations.add('anim', [mov_ballType], 10, true);
		mov_ball.animations.play('anim');
        mov_ball.anchor.set(0.5);
        mov_ball.type = String.fromCharCode(mov_ballType + 65);
        mov_ballGroup.add(mov_ball);
        
        for (var i = 1; i < TOTAL_BALLS; i++){
            new_mov_ball = this.add.sprite(-50, 150, 'balls');
            var new_mov_ballType = Math.floor(Math.random()*26);
            new_mov_ball.animations.add('anim', [new_mov_ballType], 10, true);
            new_mov_ball.animations.play('anim');
            new_mov_ball.anchor.set(0.5);
            new_mov_ball.type = String.fromCharCode(new_mov_ballType + 65);
            mov_ballGroup.add(new_mov_ball);
        }
        
        for (var i = 0; i < TOTAL_BALLS * spacer; i++){
            new_path[i] = new Phaser.Point(-50, 200);
        }
        
        mov_ballGroup.setAll('body.immovable', true);
        mov_ballGroup.enableBody = true;
        
        ammo_ballGroup = this.game.add.group();
        ammo_ballGroup.enableBody = true;
        
        ammo_ball_next = this.game.add.sprite(Alphab.GAME_WIDTH/2 - 25, Alphab.GAME_HEIGHT/2 - 25, 'balls');
        ammo_ballType = this.weighted_random();
        ammo_ball_next.animations.add('anim', [ammo_ballType], 10, true);
        ammo_ball_next.animations.play('anim');    
    
        textCounter = this.game.add.text(1150, 20, 'Counter: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });
        textScore = this.game.add.text(50, 20, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });
        this.game.time.events.loop(1000, this.updateCounter, this);
        
    },

    weighted_random: function() {
        var fruits=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 
                14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        var fruitweight=[5, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1,
                         1, 5, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1];
        var totalweight=eval(fruitweight.join("+"))
        var weighedfruits=new Array();
        var currentfruit=0;
     
        while (currentfruit<fruits.length){
            for (i=0; i<fruitweight[currentfruit]; i++)
                weighedfruits[weighedfruits.length]=fruits[currentfruit];
            currentfruit++;
        }

        var randomnumber=Math.floor(Math.random()*totalweight);
        return weighedfruits[randomnumber];
    },
    
    updateCounter: function() {
        counter++;
        textCounter.setText('Counter: ' + counter);
        textScore.setText('Score: ' + score);
    },
    
    shootball: function() {
        if (this.lastballShotAt === undefined) 
            this.lastballShotAt = 0;
        if (this.game.time.now - this.lastballShotAt < SHOT_DELAY) 
            return;
        this.lastballShotAt = this.game.time.now;
        
        
        ammo_ball = this.game.add.sprite(Alphab.GAME_WIDTH/2 - 25, Alphab.GAME_HEIGHT/2 - 25, 'balls');
        
        ammo_ball.animations.add('anim', [ammo_ballType], 10, true);
        ammo_ball.animations.play('anim');      
        ammo_ball.anchor.setTo(0.5, 0.5);
        ammo_ball.type = String.fromCharCode(ammo_ballType + 65);
        
        this.game.physics.enable(ammo_ball, Phaser.Physics.ARCADE);
        ammo_ball.checkWorldBounds = true;
        ammo_ball.outOfBoundsKill = true;
        var rotation = this.cannon.rotation;
        ammo_ball.reset(this.cannon.x, this.cannon.y);

        ammo_ball.body.velocity.x = Math.cos(rotation) * BALL_SPEED;
        ammo_ball.body.velocity.y = Math.sin(rotation) * BALL_SPEED;
        ammo_ballGroup.add(ammo_ball);
        
        ammo_ball_next = this.game.add.sprite(Alphab.GAME_WIDTH/2 - 25, Alphab.GAME_HEIGHT/2 - 25, 'balls');
        ammo_ballType = this.weighted_random();
        ammo_ball_next.animations.add('anim', [ammo_ballType], 10, true);
        ammo_ball_next.animations.play('anim'); 
        
    },
  
    collision: function(a, m) {
        ammo_ballGroup.remove(a);
        
        k++;
        
        if(k > 1){
            k = 0;
            return;
        }

        j =  mov_ballGroup.getChildIndex(m);
         
        if (j == 0){
            mov_ballGroup.addChildAt(a, 1);
            console.log("Index: " + j+1);
            var temp = [];
            for(l=0,i=j+1;i<=j+7;i++,l++){
                temp[l] = mov_ballGroup.children[i].type;
            }
            var str = temp.join("");
            console.log(str);
            console.log("Word: " + this.findWord(temp,j+1));
            return;
        }
        
        var dist1 = this.game.math.distance(mov_ballGroup.children[j+1].x, mov_ballGroup.children[j+1].y, mov_ballGroup.children[j].x, mov_ballGroup.children[j].y);
        var dist2 = this.game.math.distance(mov_ballGroup.children[j-1].x, mov_ballGroup.children[j-1].y, mov_ballGroup.children[j].x, mov_ballGroup.children[j].y);
                                
        if (dist2 < dist1){
            mov_ballGroup.addChildAt(a, j);
            console.log("Index: " + j);
            var temp = [];
            if (j<5)
                j_start = 0;
            else
                j_start = j-5;
            for(l=0,i=j_start;i<=j+5;i++,l++){
                temp[l] = mov_ballGroup.children[i].type;
            }
            var str = temp.join("");
            console.log(str);
            console.log("Word: " + this.findWord(temp,j_start));
        }
        
        else{
            mov_ballGroup.addChildAt(a, j+1);
            console.log("Index: " + j+1);
            var temp = [];
            if (j<4)
                j_start = 0;
            else
                j_start = j-4;
            for(l=0,i=j_start;i<=j+6;i++,l++){
                temp[l] = mov_ballGroup.children[i].type;
            }
            var str = temp.join("");
            console.log(str);
            console.log("Word: " + this.findWord(temp,j_start));
        }
    },
    
     findWord: function(letters,j) {
        // Clone the array for manipulation
        var curLetters = letters.slice( 0 ), word = "";
        // console.log(letters[0]);

        // Make sure the word is at least 3 letters long
        while (true) {
            if( curLetters.length > 2){
                // Get a word out of the existing letters
                word = curLetters.join("");
                //console.log(word);

                // And see if it's in the dictionary
                if ( dict[ word ] ) {
                    // If it is, return that word
                    for(i=0;i<word.length;i++){
                        console.log("Word removed");
                        score++;
                        console.log(mov_ballGroup.children[j].type);
                        mov_ballGroup.remove(mov_ballGroup.children[j]);
                        //mov_ballGroup.children[j].kill();
                    }
                    return word;
                }

                // Otherwise remove another letter from the end
                curLetters.pop();

                }
            else if(letters.length > 3){
                letters.splice(0,1);
                console.log(letters);
                this.findWord(letters,j+1);
            }
            else{
                console.log("Undefined");
                break;
            }
        }
     },
    
    checkOverlap: function(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },
    
	update: function(){
        this.cannon.rotation = this.game.physics.arcade.angleToPointer(this.cannon);
        
        if (this.game.input.activePointer.isDown) {
            this.shootball();
        }
        
        if (counter <= 2){
            mov_ball.body.velocity.x = 100;
            mov_ball.body.velocity.y = -20; 
        }
        else if(counter <= 9){
            mov_ball.body.velocity.x = 100;
            mov_ball.body.velocity.y = 0;
        }
        else if(counter <= 11){
            mov_ball.body.velocity.x = 100;
            mov_ball.body.velocity.y = 20;
        }
        else if(counter <= 13){
            mov_ball.body.velocity.x = 70;
            mov_ball.body.velocity.y = 70;
        }
        else if(counter <= 16){
            mov_ball.body.velocity.x = 0;
            mov_ball.body.velocity.y = 100;
        }
        else if(counter <= 18){
            mov_ball.body.velocity.x = -70;
            mov_ball.body.velocity.y = 70;
        }
        else if(counter <= 20){
            mov_ball.body.velocity.x = -100;
            mov_ball.body.velocity.y = 20;
        }
        else if(counter <= 25){
            mov_ball.body.velocity.x = -100;
            mov_ball.body.velocity.y = 0;
        }
        else if(counter <= 27){
            mov_ball.body.velocity.x = -100;
            mov_ball.body.velocity.y = -20;
        }
        else if(counter <= 29){
            mov_ball.body.velocity.x = -70;
            mov_ball.body.velocity.y = -70;
        }
        else if(counter <= 32){
            mov_ball.body.velocity.x = 0;
            mov_ball.body.velocity.y = -100;
        }
        else if(counter <= 40){
            mov_ball.body.velocity.x = -100;
            mov_ball.body.velocity.y = -70;
        }
        
        part = new_path.pop();
        part.setTo(mov_ball.x, mov_ball.y);
        new_path.unshift(part);  
        
        balls_left = mov_ballGroup.children.length; 
        if((balls_left - 1) > TOTAL_BALLS)
            new_path.push(new Phaser.Point(-50, 200));
            
        /*for(i=0; i < balls_left-1; i++){
            overlap[i] = this.checkOverlap(section[i], section[i+1]);
        }*/
        for (var i = 1; i < balls_left - 1; i++){
            /*if(!overlap[i-1]){
                section[i].x = (new_path[i * spacer]).x;
                section[i].y = (new_path[i * spacer]).y;
            }*/
            mov_ballGroup.children[i].x = (new_path[i * spacer]).x;
            mov_ballGroup.children[i].y = (new_path[i * spacer]).y;
        }
        
        this.game.physics.arcade.collide(ammo_ballGroup, mov_ballGroup);
        this.game.physics.arcade.overlap(ammo_ballGroup, mov_ballGroup, this.collision, null, this);
        this.game.physics.arcade.collide(mov_ballGroup);
    }
};