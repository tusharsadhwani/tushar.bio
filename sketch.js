let arrow;			// Arrow object, what the player controls  
let obj;			// Obj is a superclass for the blocks and trails,
				// As they move together with the same velocity and acceleration
let trails;			// List for the trail circles behind the arrow
let blocks;			// List for the blocks appearing on screen
let score;			// ...the score.
let song;			// Variable for the background song
let started;			// For showing the starting screen
let died;			// For displaying the game over screen
let timer;			// Countdown for not pressing the mouse for too long
let textbox;			// The textbox for typing your name in to store scores
let leaderboard;
let highscores;
let leaderboard_timer;

function preload() {
	song = loadSound("sineline.mp3");
}

function setup() {
	fill(50, 125, 255);
	noStroke();
	ellipseMode(RADIUS);
	started = false;
	highscores = [];
	createCanvas(constrain(windowWidth, 0, windowHeight * 2 / 3), windowHeight); // To get min. aspect ratio of 2 : 3
	refresh();

	textbox = createInput('');
	textbox.position(windowWidth / 2, windowHeight * 0.52);
	textbox.size(width / 4);
	textbox.hide();
}

function refresh() {
	died = false;
	leaderboard = false;
	score = 0;
	timer = 180;

	song.stop();
	song.setVolume(1, 0.6);
	if (started) {
		song.loop();
	}
	arrow = new Arrow();
	obj = new Obj();
	blocks = [];
	trails = [];
	blocks.push(new Block(
		obj,
		'disc',
		random(- width * 5 / 24, width * 5 / 24), 
		float(height) * - 5 / 6 - width / 6, 
		width / 6
		));
}

function draw() {

	background(0);

	if (!started) {
		fill(50, 125, 255);
		rect(width / 4, height * 0.45, width / 2, height * 0.1, height * 0.05);
		textSize(width * 0.08);
		textAlign(CENTER, CENTER);
		fill(255);
		text("Start", width / 2, height * 0.5);

		if (mouseIsPressed) {
			started = true;
			song.loop();
		} else {
			return;
		}
	}

	translate(width / 2 , height * 5 / 6);	// Using the arrow as origin

	// CREATING STUFF
	if (!died && !leaderboard){
		let mode;
		random() < 0.5 ? mode = 'disc' : mode = 'pipe';
			if (blocks[blocks.length - 1].y >= - height / 3) {	// New block pushed each time the previous block reaches halfway through
				blocks.push(new Block(
					obj,
					mode,
					random(- width * 5 / 24, width * 5 / 24), 
					float(height) * - 5 / 6 - width / 6, 
					width / 6
					));
			}

		}

		trails.push(new Trail(obj, arrow));

	// DELETING STUFF
	if (trails.length > 15) { 
		trails.splice(0, 1);
	}

	for (let i = trails.length - 1; i >= 0; i--) {
		if (trails[i].y > float(height) / 6 + trails[i].r) {	// Deleting trails that get past the screen
			trails.splice(i, 1);
		}
	}

	for (let i = blocks.length - 1; i >= 0; i--) {
		if (blocks[i].y > float(height) / 6 + blocks[i].r) {	// Deleting blocks that get past the screen  
			blocks.splice(i, 1);
		}
	}

	// CHECKING COLLISION OR TIMER OR DEATH
	if (died && !leaderboard) {
		gameOver();
	} else if (died && leaderboard) {
		scores();
	}

	if (timer < 0) {
		died = true;
	}

	if (!died && !leaderboard) {
		if (abs(blocks[0].r + width / 25) > blocks[0].y) {
			if (blocks[0].hits(arrow)) {
				gameOver();
			}
		}
	}

	// MOVING STUFF
	
	if (mouseIsPressed || touches.length !== 0) {	// Arrow moves as long as the mouse is pressed or screen is touched
		obj.vel = constrain(obj.vel + obj.acc, 0, height / 40.0);
		timer = 180;
	} else {	// Deceleration.
		obj.vel = constrain(obj.vel - obj.acc, 0, height / 40.0);
		if (!died && !leaderboard) {
			timer--;
		}
	}
	for (let trail of trails) {
		trail.move();
	}

	for (let block of blocks) {
		block.move();
	}

	arrow.update();

	// SHOWING STUFF
	for (let i = 1; i < trails.length; i++) {
		trails[i].show(trails[i-1]);
	}

	if (!died && !leaderboard) {
		for (let block of blocks) {
			block.show();
		}

		rect(- width / 2, height / 6, width * 0.03, - height);
		rect(width / 2, height / 6, - width * 0.03, - height);
	}

	arrow.show();

	textSize(width * 0.08);
	textAlign(LEFT);
	fill(50, 125, 255);
	noStroke();

	if (!died && !leaderboard) {
		score += int(map(obj.vel, 0, height / 40.0, 0, 20));
	}
	text(int(score / 100), - width * 0.47, - height * 0.79);  // Score on top

}

function windowResized() {
	textbox.position(windowWidth / 2, windowHeight * 0.52);
}

function mousePressed() {
	if (died && mouseY > height * 0.6) {
		if (!leaderboard) {
			highscores.push([textbox.value() || 'Anonymous', int(score / 100)]);
			textbox.hide();
			leaderboard = true;
			leaderboard_timer = frameCount;
		} else {
			if (frameCount - leaderboard_timer > 30) {
				refresh();
			}
		}
	}
}

function keyPressed() {
	if (died && keyCode == RETURN) {
		if (!leaderboard) {
			highscores.push([textbox.value() || 'Anonymous', int(score / 100)]);
			textbox.hide();
			leaderboard = true;
		} else {
			refresh();
		}
	}
}

function gameOver() {
	song.setVolume(0, 0.3);
	died = true;
	blocks = [];

	fill(255);
	noStroke();
	textSize(height / 10.0);
	textAlign(CENTER, CENTER);
	text("Game Over", 0, - height / 2.5);
	
	textbox.show();

	textAlign(CENTER, CENTER);
	fill(50, 125, 255);
	textSize(width * 0.03);
	text("Enter name:", - width / 10, - height * 0.3);
	textSize(width * 0.05);
	text("Touch to show Leaderboard", 0, - height * 0.2);
}

function scores() {
	textAlign(CENTER, CENTER);
	fill(50, 125, 255);
	textSize(width * 0.08);
	text("Leaderboard", 0, - height * 0.7);
	textSize(width * 0.05);
	text("Touch to Restart", 0, - height * 0.2);

	textSize(width * 0.05);
	fill(255);

	for (let i = 0; i < highscores.length; i++) {
		for (let j = 1; j < highscores.length; j++) {
			let s1 = highscores[j][1]
			let s0 = highscores[j-1][1]

			if (s0 > s1) {
				let temp = highscores[j];
				highscores[j] = highscores[j-1];
				highscores[j-1] = temp;
			}
		}
	}
	while (highscores.length > 5) {
		highscores.splice(0, 1);
	}

	for (let i = 1; i <= 5; i++) {
		if (highscores.length >= i) {
			text(highscores[highscores.length - i][0] + ' - ' + highscores[highscores.length - i][1], 0, - height * (0.6 - 0.05 * i));
		}
	}
}

function Obj() {
	this.vel = 0.0;
	this.acc = float(width) / 800;  // Default acceleration/deceleration for every moving object
}

function Arrow() {
	this.x = 0.0;
	this.y = 0.0;

	this.update = function() {
		this.x = width * 7.0 / 16 * Math.sin(frameCount * 0.05);  // sin gives an oscillating value between -1 and 1
	};

	this.show = function() {
		noStroke();
		fill(255);
		beginShape();  // 3 vertices for triangle
		vertex(this.x, this.y - width / 20.0);
		vertex(this.x - height / 50.0, this.y + width / 40.0);
		vertex(this.x + height / 60.0, this.y + width / 40.0);
		endShape(CLOSE);
	};
}

function Trail(obj, arrow) {
	this.x = arrow.x;
	this.y = arrow.y + width / 40.0;
	this.r = width / 25.0;

	this.move = function() {
		this.y += obj.vel;
	};

	this.show = function(other) {
		stroke(50, 125, 255);
		strokeWeight(height / 100);
		line(this.x, this.y, other.x, other.y);	// Trail is just a bunch of lines joining points where the arrow has travelled
	};
}

function Block(obj, mode, x, y, r = 0) {
	this.x = x;
	this.y = y;
	this.r = r;

	this.show = function() {
		noStroke();
		fill(255);
		if (mode == 'disc') {
			ellipse(this.x, this.y, this.r);
		} else {
			if (this.x > 0) {
				this.w = - width / 2 - this.x; 
				rect(- width / 2, this.y - height / 15.0, - this.w, height / 15.0, 0, height / 30.0, height / 30.0, 0);
			} else {
				this.w = width / 2 - this.x;
				rect(this.x, this.y - height / 15.0, this.w, height / 15.0, height / 30.0, 0, 0, height / 30.0);
			}
		}
	};

	this.hits = function(arrow) {
		if (mode == 'disc') {
			return (((this.x - arrow.x) ** 2 + (this.y) ** 2) < (this.r + width / 25.0) ** 2);
		} else {
			if (this.w > 0) {
				return (arrow.x > this.x && (arrow.y - width / 25.0 < this.y && arrow.y + width / 25.0 > this.y - height / 15.0));
			} else {
				return (arrow.x < this.x && (arrow.y - width / 25.0 < this.y && arrow.y + width / 25.0 > this.y - height / 15.0));
			}
		}
	};

	this.move = function() {
		this.y += obj.vel;
	};
}
