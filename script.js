const ROUND = 5;
let roundCount;
let roundCorrect;

const SEC = 3;
let VEL_Y; // -0.4
let GRAV_Y; // 0.2
let isPlaying = false;

let Engine = Matter.Engine;
let Render = Matter.Render;
let Composite = Matter.Composite;
let Bodies = Matter.Bodies;
let Body = Matter.Body;

let engine;
let world;
let box;
let boxes = [];

let canvasWidth;
let canvasHeight;
let boxWidth, boxHeight;

const imgDir = "assets/images";
let admission = [];
let blackstock_stadium = [];
let campus_farm = [];
let east_college = [];
let lilly = [];
let longden = [];
let olin = [];
let pccm = [];
let reese = [];
let roy = [];
let correctAnswerImage, incorrectAnswerImage;

let dictKeys = [];
let selectedDictKeys = [];
let dict = {};
let buildingNames = [];
let correctSelectedIndex;
let correctAnswerDir;
let correctAnswer;
let correctness;

let forces;

let alreadyChose;

let left, right;

function preload() {
  admission = [`${imgDir}/admission/1.jpg`, `${imgDir}/admission/2.jpg`];
  blackstock_stadium = [
    `${imgDir}/blackstock_stadium/1.jpg`,
    `${imgDir}/blackstock_stadium/2.jpg`,
  ];
  campus_farm = [`${imgDir}/campus_farm/1.jpg`, `${imgDir}/campus_farm/2.jpg`];
  east_college = [
    `${imgDir}/east_college/1.jpg`,
    `${imgDir}/east_college/2.jpg`,
  ];
  lilly = [`${imgDir}/lilly/1.jpg`, `${imgDir}/lilly/2.jpg`];
  longden = [`${imgDir}/longden/1.jpg`, `${imgDir}/longden/2.jpg`];
  olin = [`${imgDir}/olin/1.jpg`, `${imgDir}/olin/2.jpg`];
  pccm = [`${imgDir}/pccm/1.jpg`, `${imgDir}/pccm/2.jpg`];
  reese = [`${imgDir}/reese/1.jpg`, `${imgDir}/reese/2.jpg`];
  roy = [`${imgDir}/roy/1.jpg`, `${imgDir}/roy/2.jpg`];
  correctAnswerImage = loadImage(`${imgDir}/check.png`);
  incorrectAnswerImage = loadImage(`${imgDir}/cross.png`);

  dictKeys = [
    "admission",
    "blackstock_stadium",
    "campus_farm",
    "east_college",
    "lilly",
    "longden",
    "olin",
    "pccm",
    "reese",
    "roy",
  ];
  buildingNames = [
    "Admission Office",
    "Blackstock Stadium",
    "Campus Farm",
    "East College",
    "Lilly Center",
    "Longden Hall",
    "Olin Biological Sciences Building",
    "Pulliam Center For Contemporary Media",
    "Reese Hall",
    "Roy O. West Library",
  ];
  dict = {
    admission,
    blackstock_stadium,
    campus_farm,
    east_college,
    lilly,
    longden,
    olin,
    pccm,
    reese,
    roy,
  };
  // console.log(dict);
}

function setup() {
  // get width + height
  let b = document.getElementById("canvas");
  let w = b.clientWidth;
  let h = b.clientHeight;
  canvasWidth = w;
  canvasHeight = h;
  boxWidth = w / 9;
  boxHeight = w / 9;

  // idk why
  VEL_Y = -h / (821 / 0.33);
  GRAV_Y = h / ((821 / 0.33) * 2);

  let canvas = createCanvas(w, h);
  canvas.parent("canvas");

  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0;
  Engine.run(engine);
}

function mousePressed() {
  for (let i = 0; i < boxes.length; i++) {
    let inside = boxes[i].isClickedInside(mouseX, mouseY);
    if (inside && !alreadyChose) {
      // if click is correct
      if (boxes[i].index === correctSelectedIndex) {
        boxes[i].drawCorrect();
        correctness = true;
        roundCorrect++;
      } else {
        boxes[i].drawIncorrect();
        correctness = false;
      }
      alreadyChose = true;
    }
  }
}

function draw() {
  if (!isPlaying) return;
  background(51);

  if (boxes.length === 0) {
    console.log("stop");
    if (roundCount < ROUND) {
      // console.log(roundCount);
      nextRound();
    } else showResult();
  }

  for (let i = 0; i < boxes.length; i++) boxes[i].draw();

  for (let i = 0; i < boxes.length; i++)
    if (boxes[i].isOffScreen()) {
      boxes.splice(i, 1);
    }
}

// ============================= DOM ============================= //

document.getElementById("play_button").addEventListener("click", () => {
  document.querySelector(".menu").style.visibility = "hidden";
  document.querySelector(".countdown").style.visibility = "visible";
  initGame();
  document.getElementById("round").innerHTML = `Round ${roundCount}`;
  document.getElementById(
    "question"
  ).innerHTML = `Which picture depicts ${correctAnswer}?`;
  let seconds = SEC;

  // Update the count down every 1 second
  let x = setInterval(function () {
    if (seconds < 0) {
      clearInterval(x);
      world.gravity.y = GRAV_Y;
      document.getElementById("second").innerHTML = "";
      isPlaying = true;
      for (let i = 0; i < boxes.length; i++) boxes[i].applyForce();
      document.querySelector(".countdown").style.visibility = "hidden";

      return;
    }

    document.getElementById("second").innerHTML = seconds;
    seconds--;
  }, 1000);
});

document.getElementById("replay_button").addEventListener("click", () => {
  document.querySelector(".result").style.visibility = "hidden";

  initGame();
  document.getElementById(
    "question"
  ).innerHTML = `Which picture depicts ${correctAnswer}?`;
  let seconds = SEC;
  document.querySelector(".countdown").style.visibility = "visible";
  document.getElementById("round").innerHTML = `Round ${roundCount}`;
  // Update the count down every 1 second
  let x = setInterval(function () {
    if (seconds < 0) {
      clearInterval(x);
      world.gravity.y = GRAV_Y;
      document.getElementById("second").innerHTML = "";

      isPlaying = true;
      for (let i = 0; i < boxes.length; i++) boxes[i].applyForce();
      document.querySelector(".countdown").style.visibility = "hidden";

      return;
    }

    document.getElementById("second").innerHTML = seconds;
    seconds--;
  }, 1000);
});

document.getElementById("howto_button").addEventListener("click", () => {
  document.querySelector(".howto").style.visibility = "visible";
  document.querySelector(".menu").style.visibility = "hidden";
});

document.getElementById("howto_back").addEventListener("click", () => {
  document.querySelector(".menu").style.visibility = "visible";
  document.querySelector(".howto").style.visibility = "hidden";
});

document.getElementById("backto_menu").addEventListener("click", () => {
  document.querySelector(".menu").style.visibility = "visible";
  document.querySelector(".result").style.visibility = "hidden";
});

document.getElementById("quit").addEventListener("click", () => {
  window.close();
});
