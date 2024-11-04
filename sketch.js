//example using the example from The Coding Train: https://www.youtube.com/watch?v=mhjuuHl6qHM&t=386s
//Music is Taker by DIIV

let flock = [];
let flock_outside = [];

//UI Elements.
let alignSlider, cohesionSlider, separationSlider;

//Visualizer
let audio;
let fft;
let visualizer;
let spectrum;

//Check part of the song.
let part = 0;

function preload() {
  audio = new loadSound("media/song.m4a");
}

function setup() {
  //Variables for visualizer
  angleMode(RADIANS);
  fft = new p5.FFT(0.9, 512);
  visualizer = new Visualizer();

  createCanvas(windowWidth, windowHeight);
  /*   alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  separationSlider = createSlider(0, 5, 1, 0.1); */

  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
    flock_outside.push(new Boid());
  }

  //Adjust window to screen size.
  windowResized();
}

function draw() {
  background(0, 10);
  spectrum = fft.analyze();
  //Not render until fun part of the song comes, since this will lag it a lot.
  if (
    part == 1 ||
    part == 2 ||
    part == 3 ||
    part == 4 ||
    part == 5 ||
    part == 6
  ) {
    //Show boids that are inside.
    for (let boid of flock) {
      boid.edges();
      boid.flock(flock);

      //Avoid boids from going out from the borders of the screen.
      boid.update();
      boid.show();
      /*     if (mouseIsPressed) {
      //Check if mouse is inside canvas.
      if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        boid.move_to_mouse();
      }
    } */
    }
  }

  if (part == 3 || part == 4 || part == 5 || part == 6) {
    for (let boid of flock_outside) {
      boid.edges();
      boid.flock(flock_outside);

      //Avoid boids from going out from the borders of the screen.
      boid.update();
      boid.show();
      /*     if (mouseIsPressed) {
      //Check if mouse is inside canvas.
      if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        boid.move_to_mouse();
      }
    } */
    }
  }

  visualizer.display(spectrum);

  //Check which pattern to start according to sound.
  checkAudioTime();
}

//Please work.
function touchStarted() {
  mouseClicked();
  return false;
}

function touchMoved() {
  mouseClicked();
  return false;
}

function mousePressed() {
  if (audio.isPlaying()) {
    //
  } else {
    audio.play();
  }
}

//For some reason it will not respond to touches on mobile if I do not copy it like this.
function mouseClicked() {
  if (audio.isPlaying()) {
    //
  } else {
    audio.play();
  }
}

//Used as testing grounds.
function keyPressed() {
  if (key === "z") {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 0.0;
      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 1;
      boid.acceleration.add(random(-2, 2), random(-0.5, 0.5));
      boid.update_values(1); //Updates the boundaries to the first phase values.
      part = 1;
    }
  }

  if (key === "x") {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.01;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 10;
      boid.acceleration.add(random(1, 3), random(-1, 1));
      boid.update_values(2); //Updates the boundaries to the first phase values.
      part = 2;
    }
  }

  if (key === "c") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.1;
      boid.maxSpeed = 20;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 10;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (key === "v") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);
      //Assign maxForce
      boid.maxForce = 0;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 2;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
    }

    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 0;
      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 2;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
    }
    part = 4;
  }

  if (key === "b") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.5;
      boid.maxSpeed = 1;
      boid.perception_radius = 100;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (key === "n") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.05;
      boid.maxSpeed = 1;
      boid.perception_radius = 100;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(4); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (key === "m") {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.01;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(5); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (key === "a") {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.5;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 20;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }

    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.5;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (key === ",") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.01;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(6); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (key === "s") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 1;
      boid.transparency = 5;
      boid.acceleration.add(random(0), random(10));
    }

    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 1;
      boid.transparency = 5;
      boid.acceleration.add(random(0), random(10));
    }
  }

  if (key === "d") {
    for (let boid of flock_outside) {
      //Reset value.
      boid.update_values(7);
    }

    for (let boid of flock) {
      //Reset value.
      boid.update_values(7);
    }
    part = 6;
  }
}

function startPart(value) {
  if (value == 1) {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 0.0;
      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 1;
      boid.acceleration.add(random(-2, 2), random(-0.5, 0.5));
      boid.update_values(1); //Updates the boundaries to the first phase values.
      part = 1;
    }
  }

  if (value == 2) {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.01;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 10;
      boid.acceleration.add(random(1, 3), random(-1, 1));
      boid.update_values(2); //Updates the boundaries to the first phase values.
      part = 2;
    }
  }

  if (value == 3) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.1;
      boid.maxSpeed = 20;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 10;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (value == 4) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);
      //Assign maxForce
      boid.maxForce = 0;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 2;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
    }

    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 0;
      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 2;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
    }
    part = 4;
  }

  if (value == 5) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.5;
      boid.maxSpeed = 1;
      boid.perception_radius = 100;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (value == 6) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.05;
      boid.maxSpeed = 1;
      boid.perception_radius = 100;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(4); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (value == 7) {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.01;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(5); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (value == 8) {
    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.5;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 20;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }

    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.5;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(3); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (value == 9) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);

      //Assign maxForce
      boid.maxForce = 0.01;
      boid.maxSpeed = 1;
      boid.perception_radius = 50;

      //Avoid boids from going out from the borders of the screen.
      boid.transparency = 50;
      boid.acceleration.add(random(-1, 1), random(-1, 1));
      boid.update_values(6); //Updates the boundaries to the first phase values.
      part = 3;
    }
  }

  if (value == 10) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 1;
      boid.transparency = 5;
      boid.acceleration.add(random(0), random(10));
    }

    for (let boid of flock) {
      //Reset value.
      boid.velocity.mult(0);
      boid.maxForce = 1;
      boid.transparency = 5;
      boid.acceleration.add(random(0), random(10));
    }
  }

  if (value == 11) {
    for (let boid of flock_outside) {
      //Reset value.
      boid.update_values(7);
    }

    for (let boid of flock) {
      //Reset value.
      boid.update_values(7);
    }
    part = 6;
  }
}

function checkAudioTime() {
  if (round(audio.currentTime(), 0) == 6) {
    startPart(1);
  }

  if (round(audio.currentTime(), 0) == 14) {
    startPart(2);
  }

  if (round(audio.currentTime(), 0) == 46) {
    startPart(3);
  }

  if (round(audio.currentTime(), 0) == 61) {
    startPart(4);
  }

  if (round(audio.currentTime(), 0) == 74) {
    startPart(5);
  }

  if (round(audio.currentTime(), 0) == 83) {
    startPart(6);
  }

  if (round(audio.currentTime(), 0) == 90) {
    startPart(7);
  }

  if (round(audio.currentTime(), 0) == 96) {
    startPart(8);
  }

  if (round(audio.currentTime(), 0) == 100) {
    startPart(10);
  }

  if (round(audio.currentTime(), 0) == 106) {
    startPart(11);
  }

  if (round(audio.currentTime(), 1) == 114.3) {
    startPart(4);
  }

  if (round(audio.currentTime(), 0) == 130) {
    audio.setVolume(0, 10, 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
