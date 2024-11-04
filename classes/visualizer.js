class Visualizer {
  constructor() {
    this.position = createVector();
    this.play = 0;
  }

  display(spectrum) {
    //First half circle
    push();
    noFill();
    stroke(255, 255, 255, 10);

    //First half
    beginShape();
    translate(width / 2, height / 2);
    for (let i = 0; i < spectrum.length; i++) {
      let angle = map(i, 0, spectrum.length, 0, PI);
      let amplitude = spectrum[i];
      let r = map(amplitude, 0, 100, 50, 110);
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    //Second half
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      let angle = map(i, 0, spectrum.length, 0, PI);
      let amplitude = spectrum[i];
      let r = map(amplitude, 0, 100, 50, 110);
      let x = r * cos(angle) * -1;
      let y = r * sin(angle) * -1;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}
