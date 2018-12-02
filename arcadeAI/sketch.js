let w;
let h;

let pixel_size = 10;

let portrait;
let screen_width;
let screen_height;
let player;
let walls;

let game;
let mode;
let score;

let pixels = {
    list: [],
    
    life: function() {
        let neighbours_list = [];
        
        for (let i = 0; i < w; i++) {
            neighbours_list.push([])
            for (let j = 0; j < h; j++) {
                neighbours = 0;
        
        if (i == 0) {
                    neighbours += this.list[i+1][j];
          
          if (j > 0) {
                        neighbours += this.list[i][j-1];
                        neighbours += this.list[i+1][j-1];
          }
          if (j < h - 1) {
            neighbours += this.list[i][j+1];
                        neighbours += this.list[i+1][j+1];
          }
        }
        
                else if (i == w - 1) {
                    neighbours += this.list[i-1][j];
          
            if (j > 0) {
                        neighbours += this.list[i][j-1];
                        neighbours += this.list[i-1][j-1];
          }
          if (j < h - 1) {
            neighbours += this.list[i][j+1];
            neighbours += this.list[i-1][j+1];
          }
        }
        else {
                    neighbours += this.list[i+1][j];
                    neighbours += this.list[i-1][j];
          
          if (j > 0) {
                        neighbours += this.list[i+1][j-1];
                        neighbours += this.list[i][j-1];
                        neighbours += this.list[i-1][j-1];
          }
          if (j < h - 1) {
            neighbours += this.list[i+1][j+1];
            neighbours += this.list[i][j+1];
            neighbours += this.list[i-1][j+1];
          }
        }
        
        neighbours_list[i].push(neighbours)
      }
    }
    
    for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
        if (neighbours_list[i][j] == 3) {
          this.list[i][j] = 1;
        } else if (neighbours_list[i][j] != 2){
          this.list[i][j] = 0;
        }
      }
    }
    },
    
    show: function() {
      fill(184);
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if(this.list[i][j]) {
                    rect( 8 * i + 1, 8 * j + 1, 6, 6);
                }
            }
        }
    }
};

function count_grid(canvas_width, canvas_height) {
    let pixels_width = Math.floor(canvas_width / 8);
    let pixels_height = Math.floor(canvas_height / 8);
    return [pixels_width, pixels_height]
}

function center_dist(i, j) {
    i_dist = Math.abs((w / 2 - i) / w)
    j_dist = Math.abs((h / 2 - j) / h)

    return (i_dist + j_dist) / 2
}

function setup_pixels() {
    pixels.list = []
    for (let i = 0; i < w; i++) {
        pixels.list.push([])
        for (let j = 0; j < h; j++) {
            if (random() * center_dist(i, j) < 0.05) {
                pixels.list[i].push(1)
            } else {
                pixels.list[i].push(0)
            }
        }
    }
}

function setup_bg() {
  if (!(frameCount % 400)) {
    setup_pixels();
  }
  frameRate(15);
  background(26, 34, 49);
  pixels.life();
  pixels.show();
}

// screen = {
//   list: [],

//   show: function() {
//     fill(255);
//     for (let i = 1; i < screen_width - 1; i++) {
//       for (let j = 1; j < screen_height - 2; j++) {
//         rect(width / 4 + 10 * i, height / 6 + 10 * j, 8, 8);
//       }
//     }
//   }
// }

function Player() {
  this.pos = [floor(screen_width / 2), screen_height - 2]

  this.move = function(value) {
    if (this.pos[0] + value < screen_width - 1 && this.pos[0] + value > 0) {
      this.pos[0] += value;
    }
    // console.log(this.pos);
  }

  this.show = function() {
    fill(255);
    for(let i = 0; i < 2; i++) {
      for(let j = 0; j < 2; j++) {
        if (portrait) {
          rect(width / 4 + pixel_size * (i+this.pos[0]), height / 6 + pixel_size * (this.pos[1]+j), pixel_size - 2, pixel_size - 2);
        } else {
          // rect(width / 4, height / 6, width / 2, height * 3 / 4);
          // rect(width / 2 - height * 3 / 8, height / 6, height * 3 / 4, height * 3 / 4);
          rect(width / 2 - height * 3 / 8 + pixel_size * (i+this.pos[0]), height / 6 + pixel_size * (this.pos[1]+j), pixel_size - 2, pixel_size - 2);
        }
      }
    }
  }
}

function check_move() {
  if (keyIsDown(LEFT_ARROW)) {
    player.move(-2);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.move(2)
  }
}

function ai_move() {
  if (Math.abs(walls[0].x - player.pos[0]) >= 3) {
    if (walls[0].x > player.pos[0]) {
      player.move(2);
    } else {
      player.move(-2);
    }
  }
}

function Wall() {
  this.x = floor(random(1, screen_width - 2))
  this.y = -1

  this.move = function() {
    // console.log(this.y)
    this.y += 1
  }

  this.out_of_bounds = function() {
    return this.y > screen_height - 3
  }

  this.show = function() {
    j = this.y
    for (let i = 1; i <= screen_width - 1; i++) {
      if (Math.abs(i - this.x) > 3) {
        if (portrait) {
          rect(width / 4 + pixel_size * (i), height / 6 + pixel_size * (1+j), pixel_size - 2, pixel_size - 2);
        } else {
          // rect(width / 4, height / 6, width / 2, height * 3 / 4);
          // rect(width / 2 - height * 3 / 8, height / 6, height * 3 / 4, height * 3 / 4);
          rect(width / 2 - height * 3 / 8 + pixel_size * (i), height / 6 + pixel_size * (1+j), pixel_size - 2, pixel_size - 2);
        }
      }
    }
  }
}

function wall_hit() {
  if (walls[0].y == screen_height - 3) {
    // noLoop();
    // console.log({'wall x': walls[0].x, 
    //             'player x': player.pos[0]})
    // console.log(walls[0].x - player.pos[0] >= 4 ||
    //         walls[0].x - player.pos[0] <= -3)
    return (walls[0].x - player.pos[0] >= 4 ||
            walls[0].x - player.pos[0] <= -3)
  }
}

function gameover() {
  fill(255);
  textSize(72);
  text("Game Over", width / 2, height * 0.56);
  textSize(48);
  text("Score: "+score, width / 2, height * 0.65);
  game = false;
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  
  [w, h] = count_grid(width, height)
  
  fill(224);
  noStroke();
  textAlign(CENTER);
  textFont('Helvetica');

  setup_pixels()

  game = true;

  screen_height = floor((height * 3 / 4) / pixel_size);
  screen_width = floor((width / 2) / pixel_size);
  if (screen_width > screen_height) {
    screen_width = screen_height;
    portrait = false;
  } else {
    portrait = true;
  }

  mode = 0;
  score = 0;

  player = new Player();
  walls = []
  walls.push(new Wall());
}

function mousePressed() {
  if (mode == 0) {
    if (mouseY < height / 2) {
      mode = 1;
    } else {
      mode = 2;
    }
  }
}

function draw() {
  setup_bg();

  fill(255);
  textSize(72);
  stroke(0);
  strokeWeight(6);
  text("ArcadeAI", width / 2, height * 0.125);
  noStroke();

  fill(0, 224);
  if (portrait) {
    rect(width / 4, height / 6, width / 2, height * 3 / 4);
  } else {
    rect(width / 2 - height * 3 / 8, height / 6, height * 3 / 4, height * 3 / 4);
  }

  // screen.show()
  // console.log(player);
  if (mode == 0) {
    textSize(36);
    if(mouseY < height / 2) {
      fill(0, 255, 0);
      text("Manual Mode", width / 2, height * 0.4);
      fill(255);
      text("AI Mode", width / 2, height * 0.65);
    } else {
      fill(255);
      text("Manual Mode", width / 2, height * 0.4);
      fill(0, 255, 0);
      text("AI Mode", width / 2, height * 0.65);
    }
  } else if (mode == 1) {
    if (game) {
      textSize(36);
      fill(255);
      if (portrait) {
        text(score, width * 0.28, height * 0.22);
      } else {
        text(score, width / 2 - height * 0.336, height * 0.22);
      }

      if (walls[walls.length-1].y > screen_height / 2) {
        walls.push(new Wall());
      }

      check_move();
      player.show();

      for (let i = walls.length - 1; i >= 0; i--) {
        if (walls[i].out_of_bounds()) {
          walls.splice(i, 1);
          score++;
        }
      }

      for (wall of walls) {
        wall.move();
        wall.show();
      }

    }

    if (wall_hit()) {
      gameover();
    }
  } else if (mode == 2) {
    if (game) {
      textSize(36);
      fill(255);
      if (portrait) {
        text(score, width * 0.28, height * 0.22);
      } else {
        text(score, width / 2 - height * 0.336, height * 0.22);
      }

      if (walls[walls.length-1].y > screen_height / 2) {
        walls.push(new Wall());
      }

      ai_move();
      player.show();

      for (let i = walls.length - 1; i >= 0; i--) {
        if (walls[i].out_of_bounds()) {
          walls.splice(i, 1);
          score++;
        }
      }

      for (wall of walls) {
        wall.move();
        wall.show();
      }
    }

    if (wall_hit()) {
      gameover();
    }
  } 
}