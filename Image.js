class ImageMatter {
  constructor(x, y, width, height, imageDir, index) {
    this.index = index;
    this.image = loadImage(imageDir);
    this.body = Bodies.rectangle(x, y, width, height);
    Body.setMass(this.body, 7);
    Composite.add(world, this.body);
  }

  applyForce() {
    Body.applyForce(
      this.body,
      { x: this.body.position.x, y: this.body.position.y },
      forces[roundCount - 1][this.index]
    );
  }

  draw() {
    image(
      this.image,
      this.body.position.x,
      this.body.position.y,
      boxWidth,
      boxHeight
    );
  }

  drawCorrect() {
    this.image = correctAnswerImage;
  }

  drawIncorrect() {
    this.image = incorrectAnswerImage;
  }

  // replace() {
  //   this.image = randomSelection(dict[selectedDictKeys[this.index]], 1)[0];

  //   let x = this.body.position.x;
  //   let y = canvasHeight;

  //   Composite.remove(world, this.body);
  //   this.body = Bodies.rectangle(x, y, boxWidth, boxHeight);
  //   Body.setMass(this.body, 7);
  //   Body.applyForce(this.body, { x, y }, { x: 0, y: -0.3 });
  //   Composite.add(world, this.body);
  // }

  isClickedInside(x, y) {
    return (
      x >= this.body.position.x &&
      y >= this.body.position.y &&
      x <= this.body.position.x + boxWidth &&
      y <= this.body.position.y + boxHeight
    );
  }

  isOffScreen() {
    // return false;
    return (
      this.body.position.y > canvasHeight
      // this.body.position.y < 0 ||
      // this.body.position.x < 0 ||
      // this.body.position.x > canvasWidth
    );
  }

  static destroy() {
    for (let body of Composite.allBodies(world)) Composite.remove(world, body);
  }
}
