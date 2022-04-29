const randomSelection = (originalArray, n) => {
  let newArr = [];
  if (n >= originalArray.length) {
    return originalArray;
  }
  for (let i = 0; i < n; i++) {
    let newElem =
      originalArray[Math.floor(Math.random() * originalArray.length)];
    while (newArr.includes(newElem)) {
      newElem = originalArray[Math.floor(Math.random() * originalArray.length)];
    }
    newArr.push(newElem);
  }
  return newArr;
};

const initGame = () => {
  console.log("init game");
  roundCount = 1;
  roundCorrect = 0;
  alreadyChose = false;
  correctness = undefined;
  world.gravity.y = 0;
  selectedDictKeys = randomSelection(dictKeys, 4);
  ImageMatter.destroy();
  boxes = [];

  left = Bodies.rectangle(1, 1, 1, 69420, { isStatic: true });
  right = Bodies.rectangle(canvasWidth - boxWidth / 4, 0, boxWidth / 2, 69420, {
    isStatic: true,
  });

  Composite.add(world, left);
  Composite.add(world, right);

  forces = [
    [
      { x: -0.1, y: VEL_Y },
      { x: 0, y: VEL_Y },
      { x: 0, y: VEL_Y },
      { x: 0.1, y: VEL_Y },
    ],
  ];
  for (let i = 0; i < ROUND - 1; i++) {
    forces.push([
      { x: -0.3 + Math.random() * 0.6, y: VEL_Y - Math.random() * 0.12 },
      { x: -0.3 + Math.random() * 0.6, y: VEL_Y - Math.random() * 0.12 },
      { x: -0.3 + Math.random() * 0.6, y: VEL_Y - Math.random() * 0.12 },
      { x: -0.3 + Math.random() * 0.6, y: VEL_Y - Math.random() * 0.12 },
    ]);
  }

  let correctAnswerDirs = [];

  for (let i = 0; i < 4; i++) {
    let dir = randomSelection(dict[selectedDictKeys[i]], 1)[0];
    correctAnswerDirs.push(dir);
    boxes.push(
      new ImageMatter(
        boxWidth * (2 * i + 1),
        canvasHeight,
        boxWidth,
        boxHeight,
        dir,
        i
      )
    );
  }

  let correctKey = randomSelection(selectedDictKeys, 1)[0];
  correctSelectedIndex = selectedDictKeys.indexOf(correctKey);
  correctAnswer = buildingNames[dictKeys.indexOf(correctKey)];
  correctAnswerDir = correctAnswerDirs[correctSelectedIndex];
  // console.log(boxes, selectedDictKeys, correctAnswer, correctAnswerDir);
};

const nextRound = () => {
  // show answer
  isPlaying = false;
  document.querySelector(".answer").style.visibility = "visible";
  document.getElementById("thisis").innerHTML = `This is ${correctAnswer}!`;
  document.getElementById("img_answer").src = correctAnswerDir;

  let seconds = SEC;
  let x = setInterval(function () {
    if (seconds < 0) {
      clearInterval(x);

      document.querySelector(".answer").style.visibility = "hidden";
      document.getElementById("img_answer").src = "";

      roundCount++;
      alreadyChose = false;
      correctness = undefined;
      world.gravity.y = 0;
      selectedDictKeys = randomSelection(dictKeys, 4);
      ImageMatter.destroy();
      boxes = [];

      left = Bodies.rectangle(1, 1, 1, 69420, { isStatic: true });
      right = Bodies.rectangle(
        canvasWidth - boxWidth / 4,
        0,
        boxWidth / 2,
        69420,
        {
          isStatic: true,
        }
      );

      Composite.add(world, left);
      Composite.add(world, right);

      let correctAnswerDirs = [];

      for (let i = 0; i < 4; i++) {
        let dir = randomSelection(dict[selectedDictKeys[i]], 1)[0];
        correctAnswerDirs.push(dir);
        boxes.push(
          new ImageMatter(
            boxWidth * (2 * i + 1),
            canvasHeight,
            boxWidth,
            boxHeight,
            dir,
            i
          )
        );
      }

      let correctKey = randomSelection(selectedDictKeys, 1)[0];
      correctSelectedIndex = selectedDictKeys.indexOf(correctKey);
      correctAnswer = buildingNames[dictKeys.indexOf(correctKey)];
      correctAnswerDir = correctAnswerDirs[correctSelectedIndex];
      // console.log(boxes, selectedDictKeys, correctAnswer, correctAnswerDir);

      document.querySelector(".countdown").style.visibility = "visible";

      document.getElementById(
        "question"
      ).innerHTML = `Which picture depicts ${correctAnswer}?`;
      document.getElementById("round").innerHTML = `Round ${roundCount}`;

      seconds = SEC;
      x = setInterval(function () {
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

      return;
    }
    seconds--;
  }, 1000);
};

const showResult = () => {
  isPlaying = false;
  console.log("show result");
  document.querySelector(".result").style.visibility = "visible";
  document.getElementById(
    "correctness"
  ).innerHTML = `You answered correctly ${roundCorrect}/${ROUND}`;
};
