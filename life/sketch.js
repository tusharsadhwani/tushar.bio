let w;
let h;
let canvas;
let speed_slider;
let density_slider;
let reset_button;

let resizeTimeout;
let resizing = false;

let pixels = {
  list: [],

  life: function () {
    let neighbours_list = [];

    for (let i = 0; i < w; i++) {
      neighbours_list.push([]);
      for (let j = 0; j < h; j++) {
        neighbours = 0;

        if (i == 0) {
          neighbours += this.list[i + 1][j];

          if (j > 0) {
            neighbours += this.list[i][j - 1];
            neighbours += this.list[i + 1][j - 1];
          }
          if (j < h - 1) {
            neighbours += this.list[i][j + 1];
            neighbours += this.list[i + 1][j + 1];
          }
        } else if (i == w - 1) {
          neighbours += this.list[i - 1][j];

          if (j > 0) {
            neighbours += this.list[i][j - 1];
            neighbours += this.list[i - 1][j - 1];
          }
          if (j < h - 1) {
            neighbours += this.list[i][j + 1];
            neighbours += this.list[i - 1][j + 1];
          }
        } else {
          neighbours += this.list[i + 1][j];
          neighbours += this.list[i - 1][j];

          if (j > 0) {
            neighbours += this.list[i + 1][j - 1];
            neighbours += this.list[i][j - 1];
            neighbours += this.list[i - 1][j - 1];
          }
          if (j < h - 1) {
            neighbours += this.list[i + 1][j + 1];
            neighbours += this.list[i][j + 1];
            neighbours += this.list[i - 1][j + 1];
          }
        }

        neighbours_list[i].push(neighbours);
      }
    }

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (neighbours_list[i][j] == 3) {
          this.list[i][j] = 1;
        } else if (neighbours_list[i][j] != 2) {
          this.list[i][j] = 0;
        }
      }
    }
  },

  show: function () {
    fill(224);
    if (pixels.list.length > 0)
      for (let i = 0; i < pixels.list.length; i++) {
        for (let j = 0; j < pixels.list[0].length; j++) {
          if (this.list[i][j]) {
            rect(8 * i + 1, 8 * j + 1, 6, 6);
          }
        }
      }
  },
};

function count_grid(canvas_width, canvas_height) {
  let pixels_width = Math.floor(canvas_width / 8);
  let pixels_height = Math.floor(canvas_height / 8);
  return [pixels_width, pixels_height];
}

function setup_pixels() {
  pixels.list = [];
  for (let i = 0; i < w; i++) {
    pixels.list.push([]);
    for (let j = 0; j < h; j++) {
      if (random() < density_slider.value()) {
        pixels.list[i].push(1);
      } else {
        pixels.list[i].push(0);
      }
    }
  }
}

function setup() {
  if (!canvas) canvas = createCanvas(windowWidth, windowHeight);
  if (!speed_slider) speed_slider = createSlider(1, 60, 15);
  speed_slider.position(width - 220, 40);
  speed_slider.style("max-width", "200px");
  speed_slider.style("width", "100%");

  if (!density_slider) density_slider = createSlider(0.1, 0.3, 0.15, 0.01);
  density_slider.position(width - 220, 120);
  density_slider.style("max-width", "200px");
  density_slider.style("width", "100%");

  if (!reset_button) reset_button = createButton("Regenerate");
  reset_button.position(width - 170, 160);
  reset_button.style("width", "100px");
  reset_button.mousePressed(() => {
    setup_pixels();
    draw();
  });

  clearTimeout(resizeTimeout);
  resizing = true;
  resizeTimeout = setTimeout(() => {
    [w, h] = count_grid(width, height);
    setup_pixels();
    resizing = false;
  }, 50);
}

function draw() {
  frameRate(speed_slider.value());
  background(26, 34, 49);

  if (!resizing) pixels.life();
  pixels.show();

  fill(255);
  textSize(24);
  textAlign(LEFT, CENTER);
  stroke(0);
  strokeWeight(4);
  text("Speed:", width - 215, 20);
  text("Density:", width - 215, 100);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
