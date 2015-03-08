// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

//stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function() {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function(){
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;
var stone = {};
var monster = {
	speed:34
};
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var monstermove = function(modifier){
	
	//Movimientos del monstruo
	if(hero.x > monster.x){
		monster.x += monster.speed * modifier;
	}else if( hero.x < monster.x){
		monster.x -= monster.speed * modifier;
	}else{
		monster.x += 0 * modifier;
	}
	
	if(hero.y > monster.y){
		monster.y += monster.speed * modifier;
	}else if( hero.y < monster.y){
		monster.y -= monster.speed * modifier;
	}else{
		monster.y += 0 * modifier;
	}
}
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	//la princesa nunca sale donde los árboles.
	princess.x = Math.floor(Math.random() * (455 - 25 + 1)) + 25;//455 25
	princess.y = Math.floor(Math.random() * (415 - 25 + 1)) + 25;//25 415
	
	if(princessesCaught > 4){
		stone.x = 0;
		stone.y = 0;
		//bucles para que la piedra no esté nunca muy cerca de la princesa ni de la posicion inicial del heroe.
		stone.x = hero.x;//455 25
		while((-30 < (princess.x - stone.x)) && ((princess.x - stone.x) < 30) || 
		(-30 < (hero.x - stone.x)) && ((hero.x - stone.x) < 30)){
			stone.x = Math.floor(Math.random() * (455 - 25 + 1)) + 25;//455 25
		}
		stone.y = hero.y;//25 415
		while((-30 < (princess.y - stone.y)) && ((princess.y - stone.y) < 30) ||
		(-30 < (hero.y - stone.y)) && ((hero.y - stone.y) < 30)){
			stone.y = Math.floor(Math.random() * (415 - 25 + 1)) + 25;//25 415
		}
		
		
	}
	if(princessesCaught > 5){
		monster.x = Math.floor(Math.random() * (455 - 25 + 1)) + 25;
		monster.y = Math.floor(Math.random() * (415 - 25 + 1)) + 25;
		monster.speed = (monster.speed + ((princessesCaught - 5)));
	}
};

// Update game objects
var update = function (modifier) {
	//en esta funcion controlamos que el hero no se salga de los árboles.
	if (38 in keysDown) { // Player holding up
		if((hero.y < 25) || 
		(((-30 < (stone.x - hero.x)) && ((stone.x - hero.x) < 30)) &&((stone.y+30) > hero.y) && (stone.y +30 < hero.y +30))){
			hero.y -= 0 * modifier;
		}else{
			hero.y -= hero.speed * modifier;
		}
		
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y > 415 ||
		(((-30 < (stone.x - hero.x)) && ((stone.x - hero.x) < 30)) &&((stone.y-30) < hero.y) && (stone.y-30 > hero.y-30))){
			hero.y += 0 * modifier;
		}else{
			hero.y += hero.speed * modifier;
			
		}
	
		
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x < 25 ||
		(((-30 < (stone.y - hero.y)) && ((stone.y - hero.y) < 30)) &&((stone.x+30) > hero.x) && (stone.x+30 < hero.x+30))){
			hero.x -= 0 * modifier;
		}else{
			hero.x -= hero.speed * modifier;
		}
		
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x > 455 ||
		(((-30 < (stone.y - hero.y)) && ((stone.y - hero.y) < 30)) &&((stone.x-30) < hero.x) && (stone.x-30 > hero.x-30))){
			hero.x += 0 * modifier;
		}else{
			hero.x += hero.speed * modifier;
		}
		
			
	}
	if(princessesCaught >5){
		monstermove(modifier);
	}
	
	// Are they touching princess and hero
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}
	if (
		hero.x <= (monster.x + 16)
		&& monster.x <= (hero.x + 16)
		&& hero.y <= (monster.y + 16)
		&& monster.y <= (hero.y + 32)
	) {
		princessesCaught = 0;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
			ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}
	if (princessesCaught > 4){
		if (stoneReady){
			ctx.drawImage(stoneImage,stone.x,stone.y);
		}
		
	}
	if(princessesCaught > 5){
		if (monsterReady){
			ctx.drawImage(monsterImage,monster.x,monster.y);
		}
	
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
