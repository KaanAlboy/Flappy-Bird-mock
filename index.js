var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var scoreEle = document.getElementsByClassName("score");

var flag = true; // Start-stop-restart game (true = not running)
var circle = new circle(); // Our little pawn
var score = 0; // Score

//Jumping and starting game
document.addEventListener("keyup", event => {
  if (event.code === "Space") {
    if (flag) {
      flag = false;
      circle.y = canvas.height / 2; //Get pawn to initial position on restart

      init();
      animate();
    }
    //Jump
    circle.dy = circle.speed;
    circle.y += circle.dy;
  }
});

var g = 0.25; // Gravity

//Pawn creation and funcs
function circle() {
  this.x = 50; //x-coordinate
  this.y = canvas.height / 2; //y-coordinate
  this.r = 10; // r
  this.dy = 0; //Current speed of pawn
  this.speed = -4.5; // Jump speed

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fillStyle = "#900c3f";
    c.fill();
    c.closePath();
  };

  this.update = function() {
    this.dy += g;
    this.y += this.dy;
    this.draw();
  };
}

var colorArr = ["#2c003e", "#512b58", "#ffa372", "#ea9085"];
//Walls creation and update func (Each walls on seperate side are one element in rectArray)
function rect(x, y, dx, h, color) {
  this.x = x; // Left corner x-coordinate
  this.y = y; // y value
  this.dx = dx; // Horizontal speed
  this.h = h; // Height of the wall
  this.w = 40; // Width of the wall
  this.gaph = canvas.height / 4; // Height of the gap
  this.color = color;
  //Safe zone is the empty gap between two walls
  this.safeZoneTop = this.h; //Safe zone top coordinate
  this.safeZoneBottom = this.safeZoneTop + this.gaph; //Safe zone bottom coordinate

  this.draw = function() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.w, this.h); // Ceiling wall

    c.fillRect(
      this.x,
      this.h + this.gaph,
      this.w,
      canvas.height - this.h - this.gaph
    ); //Floor wall
  };

  this.update = function() {
    this.x = this.x - this.dx;
    this.draw();
  };
}

//Randomiser func
var randomFunc = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var rectArray = []; // Wall array
//Creates wall in the beginning
function init() {
  rectArray = [];
  let x = 100; // Initial start position of first wall

  for (let i = 0; i < 50; i++) {
    x += 250; // Gap between walls is 250px
    let y = 0; // Means ceiling
    let dx = 3; // Wall's speed
    let h = randomFunc(150, canvas.height - 150);
    let color = colorArr[randomFunc(0, 3)];

    rectArray.push(new rect(x, y, dx, h, color));
  }
}

//Where all the magic happens
function animate() {
  if (!flag) {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height); // Clear on every entry
    c.fillStyle = "#ffe8df";
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rectArray.length; i++) {
      //Hit conrols
      //if (sol taraftan temas) || ((içten temas sol || içten temas sağ) && alt-üst temas ) || (tabana veya tavana çarparsa)
      if (
        (circle.x + circle.r == rectArray[i].x &&
          (circle.y - circle.r < rectArray[i].safeZoneTop ||
            circle.y + circle.r > rectArray[i].safeZoneBottom)) ||
        (((rectArray[i].x + rectArray[i].w > circle.x &&
          circle.x > rectArray[i].x) ||
          (rectArray[i].x + rectArray[i].w > circle.x + circle.r &&
            circle.x + circle.r > rectArray[i].x)) &&
          (circle.y - circle.r < rectArray[i].safeZoneTop ||
            circle.y + circle.r > rectArray[i].safeZoneBottom)) ||
        circle.r + circle.y > canvas.height ||
        circle.y - circle.r < 0
      ) {
        gameover();
        flag = true; // If hits -> Stop the game
      }

      rectArray[i].update(); // Animate walls
    }

    score = 0; // Clear score

    //Calculate score
    for (let i = 0; i < rectArray.length; i++) {
      if (rectArray[i].x < 10) {
        score++;
      }
    }

    scoreEle[0].innerText = "Score: " + score;

    circle.update(); // Animate pawn
  }
}

function gameover() {
  //c.clearRect(0,0,canvas.width,canvas.height); // Clear on every entry
  c.font = "30px Arial";
  c.fillText("Game Over", 120, 50);
}
