Alphab.Game = function(game){
    // Define constants
    this.SHOT_DELAY = 100; // milliseconds (10 balls/second)
    this.ball_SPEED = 500; // pixels/second
    this.NUMBER_OF_BALLS = 20;
    this.bmd = null;
    this.c_ball = null;
    this.points = {
        'x': [ 32, 128, 256, 384, 512, 608 ],
        'y': [ 240, 240, 240, 240, 240, 240 ]
    };
    this.pi = 0;
    this.path = [];
};

Alphab.Game.prototype = {
	create: function() {
        // Create an object representing our cannon
        this.cannon = this.game.add.sprite(Alphab.GAME_WIDTH/2, Alphab.GAME_HEIGHT/2, 'balls');
        
        // Set the pivot point to the center of the cannon
        this.cannon.anchor.setTo(0.5, 0.5);

        // Create an object pool of balls
        this.ballPool = this.game.add.group();
        for(var i = 0; i < this.NUMBER_OF_BALLS; i++) {
            // Create each ball and add it to the group.
            var ball = this.game.add.sprite(Alphab.GAME_WIDTH/2, Alphab.GAME_HEIGHT/2, 'balls');
            var ballType = Math.floor(Math.random()*26);
            // add new animation frame
            ball.animations.add('anim', [ballType], 10, true);
            // play the newly created animation
            ball.animations.play('anim')
            this.ballPool.add(ball);
            // Set its pivot point to the center of the ball
            ball.anchor.setTo(0.5, 0.5);
            // Enable physics on the ball
            this.game.physics.enable(ball, Phaser.Physics.ARCADE);
            // Set its initial state to "dead".
            ball.kill();
        }
        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        //this.game.input.activePointer.x = Alphab.GAME_WIDTH/2;
        //this.game.input.activePointer.y = Alphab.GAME_HEIGHT/2;
        this.bmd = this.add.bitmapData(Alphab.GAME_WIDTH, Alphab.GAME_HEIGHT);
        this.bmd.addToWorld();
        this.c_ball = this.add.sprite(0, 0, 'balls');
        var c_ballType = Math.floor(Math.random()*26);
        // add new animation frame
		this.c_ball.animations.add('anim', [c_ballType], 10, true);
		// play the newly created animation
		this.c_ball.animations.play('anim')
        this.c_ball.anchor.set(0.5);
        var py = this.points.y;
        for (var i = 0; i < py.length; i++)
        {
            py[i] = this.rnd.between(32, 432);
        }
        this.plot();
    },
    
    plot: function () {
        this.bmd.clear();
        this.path = [];
        var x = 1 / Alphab.GAME_WIDTH;
        for (var i = 0; i <= 1; i += x){
            var px = this.math.catmullRomInterpolation(this.points.x, i);
            var py = this.math.catmullRomInterpolation(this.points.y, i);
            this.path.push( { x: px, y: py });
            this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
        }
        for (var p = 0; p < this.points.x.length; p++){
            this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
        }
    },
    
    shootball: function() {
        /* Enforce a short delay between shots by recording
         the time that each ball is shot and testing if
         the amount of time since the last shot is more than
         the required delay.*/
        if (this.lastballShotAt === undefined) this.lastballShotAt = 0;
        if (this.game.time.now - this.lastballShotAt < this.SHOT_DELAY) return;
        this.lastballShotAt = this.game.time.now;

        // Get a dead ball from the pool
        var ball = this.ballPool.getFirstDead();

        // If there aren't any balls available then don't shoot
        if (ball === null || ball === undefined) 
            return;

        // Revive the ball
        // This makes the ball "alive"
        ball.revive();

        // balls should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the ball if
        // its x,y coordinates are outside of the world.
        ball.checkWorldBounds = true;
        ball.outOfBoundsKill = true;
        
        // Set the ball position to the cannon position.
        ball.rotation = this.cannon.rotation;
        ball.reset(this.cannon.x, this.cannon.y);

        // Shoot it in the right direction
        ball.body.velocity.x = Math.cos(ball.rotation) * this.ball_SPEED;
        ball.body.velocity.y = Math.sin(ball.rotation) * this.ball_SPEED;
    },

    // The update() method is called every frame
	update: function(){
	    // Aim the cannon at the pointer.
        // All this function does is calculate the angle using
        // Math.atan2(yPointer-ycannon, xPointer-xcannon)
        this.cannon.rotation = this.game.physics.arcade.angleToPointer(this.cannon);
        
        // Shoot a ball
        if (this.game.input.activePointer.isDown) {
            this.shootball();
        }
        this.c_ball.x = this.path[this.pi].x;
        this.c_ball.y = this.path[this.pi].y;
        this.pi++;
        if (this.pi >= this.path.length){
            this.pi = 0;
        }
	}
};