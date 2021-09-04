const width = 500;
const height = 500;
let canvas, robot;
const robotWidth = 45;
const robotHeight = 60;

function preload() {
  robot = loadImage("r2d2.png");
}
function setup() {
  canvas = createCanvas(width, height);
  canvas.parent("canvas");
  noLoop();

  imageMode(CENTER, CENTER);
  textAlign(LEFT, BOTTOM);
}

let lines = [];
function runRobot() {
  background("#ccc");
  lines = [];
  const textArea = document.getElementById("commands");
  const text = textArea.value.split("\n");

  const commands = [];
  for (const line of text) {
    const [direction, value] = line.trim().split(" ");
    if (direction && value) {
      switch (direction.toLowerCase()) {
        case "up":
          commands.push([0, -parseInt(value)]);
          break;
        case "down":
          commands.push([0, parseInt(value)]);
          break;
        case "left":
          commands.push([-parseInt(value), 0]);
          break;
        case "right":
          commands.push([parseInt(value), 0]);
          break;
      }
    }
  }

  let x = 0;
  let y = 0;
  let _min = 0;
  let _max = 0;

  for (const [_x, _y] of commands) {
    lines.push([x, y, x + _x, y + _y]);
    x += _x;
    y += _y;

    _max = max(_max, x);
    _min = min(_min, x);
    _max = max(_max, y);
    _min = min(_min, y);
  }

  renderLines(_min, _max, _min, _max);
}

function renderLines(xMin, xMax, yMin, yMax) {
  strokeWeight(5);
  strokeCap("round");
  let x1, x2, y1, y2;

  stroke("orange");
  for (const [_x1, _y1, _x2, _y2] of lines) {
    x1 = map(_x1, xMin, xMax, 100, width - 100);
    x2 = map(_x2, xMin, xMax, 100, width - 100);
    y1 = map(_y1, yMin, yMax, 100, height - 100);
    y2 = map(_y2, yMin, yMax, 100, height - 100);
    line(x1, y1, x2, y2);
  }

  // line from beginning to end
  stroke("#3cf8");
  x1 = map(0, xMin, xMax, 100, width - 100);
  y1 = map(0, xMin, xMax, 100, height - 100);
  drawingContext.setLineDash([5, 15]);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);

  const [_, __, _x2, _y2] = lines[lines.length - 1];
  const distance = Math.sqrt(_x2 * _x2 + _y2 * _y2);
  const output = document.getElementById("output");
  output.innerText = "Distance: " + distance;

  // highlight start point
  stroke("green");
  point(x1, y1);

  image(robot, x2, y2, robotWidth, robotHeight);

  // Comment this block out to hide (x, y) text
  stroke("orange");
  x1 = map(0, xMin, xMax, 100, width - 100);
  y1 = map(0, xMin, xMax, 100, height - 100);
  text("(0, 0)", x1, y1 + 16);
  for (const [_x1, _y1, _x2, _y2] of lines) {
    x1 = map(_x1, xMin, xMax, 100, width - 100);
    x2 = map(_x2, xMin, xMax, 100, width - 100);
    y1 = map(_y1, yMin, yMax, 100, height - 100);
    y2 = map(_y2, yMin, yMax, 100, height - 100);
    text("(" + _x2 + ", " + _y2 + ")", x2, y2 + 16);
  }
}

function reset() {
  background("#ccc");
  const output = document.getElementById("output");
  output.innerText = "";
}
