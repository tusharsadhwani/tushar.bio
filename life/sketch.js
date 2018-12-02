let w;
let h;
let speed_slider;
let density_slider;

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
    fill(224);
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if(this.list[i][j]) {
          rect( 8 * i + 1, 8 * j + 1, 6, 6)
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
      if (random() * center_dist(i, j) < density_slider.value()) {
        pixels.list[i].push(1)
      } else {
        pixels.list[i].push(0)
      }
    }
  }
}
    
function setup() {
  createCanvas(windowWidth, windowHeight);
  speed_slider = createSlider(1, 60, 15)
  speed_slider.position(width * 0.88, height * 0.1);
  speed_slider.style("width","10%");

  density_slider = createSlider(0.01, 0.05, 0.03, 0.001)
  density_slider.position(width * 0.88, height * 0.2);
  density_slider.style("width","10%");

  reset_button = createButton("Reset");
  reset_button.position(width * 0.905, height * 0.25);
  reset_button.style("width","5%");
  reset_button.mousePressed(setup_pixels);
  
  [w, h] = count_grid(width, height)
  setup_pixels()
}

function draw() {
  frameRate(speed_slider.value())
  background(26, 34, 49);
  
  pixels.life()
  pixels.show()
  
  fill(255);
  textSize(width / 50);
  stroke(0);
  strokeWeight(4);
  text("Speed:", width * 0.88, height * 0.08);
  text("Density:", width * 0.88, height * 0.18);
  noStroke();
}
