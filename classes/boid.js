class Boid {
  constructor() {
    this.position = createVector(width / 2, height / 2); //Every boid starts in the same direction.
    this.velocity = createVector();
    this.acceleration = createVector();
    this.maxForce = 0;
    this.maxSpeed = 20;
    this.perception_radius = 50;

    this.r = 3;

    this.transparency = 0;

    //Limits.
    this.x_limit_start = 0;
    this.x_limit_end = 0;

    this.y_limit_start = 0;
    this.y_limit_end = 0;

    //Max height.
    this.min_height = 0;
    this.max_height = 0;

    //Window resizer
    this.window_resizer_start = 0.0;
    this.window_resizer_end = 1.0;
  }

  //Avoid boid going out of screen
  edges() {
    if (this.position.x > this.x_limit_end) {
      this.position.x = this.x_limit_start;
    } else if (this.position.x < this.x_limit_start) {
      this.position.x = this.x_limit_end;
    }

    if (this.position.y > this.y_limit_end) {
      this.position.y = this.y_limit_start;
    } else if (this.position.y < this.y_limit_start) {
      this.position.y = this.y_limit_end;
    }
  }

  align(boids) {
    let perceptionRadius = this.perception_radius;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      //Here we are going to implement the steering formula.
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering; //Always return steering.
  }

  //There is a better way to do this.
  cohesion(boids) {
    let perceptionRadius = this.perception_radius;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      //Here we are going to implement the steering formula.
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering; //Always return steering.
  }

  //There is a better way to do this.
  separation(boids) {
    let perceptionRadius = this.perception_radius;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      //Here we are going to implement the steering formula.
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering; //Always return steering.
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    /* This doesnt work anymore since I disabled the sliders. */

    /*     alignment.mult(alignSlider.value());
    separation.mult(separationSlider.value());
    cohesion.mult(cohesionSlider.value()); */

    this.acceleration.add(separation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);

    //If in part 2, reduce borders constantly to create wave effect with the song.
    if (part == 2) {
      if (round(audio.currentTime(), 1) % 1.5 == 0) {
        this.velocity.mult(0);
        this.maxForce = 0.01;
        this.acceleration.add(random(1, 3), random(-1, 1));
      }
    }

    /*     if (part == 3) {
      if (round(audio.currentTime(), 1) % 1.5 == 0) {
        this.velocity.mult(0);
        this.maxForce = 1;
        this.maxSpeed = 5;
        this.acceleration.add(random(1, 3), random(-1, 1));
      }
    } */

    //If in part 6, reduce the borders constantly
    if (part == 6) {
      this.window_resizer_start += 0.001;
      this.window_resizer_end -= 0.001;

      this.x_limit_start = width * this.window_resizer_start;
      this.x_limit_end = width * this.window_resizer_end;

      this.y_limit_start = height * this.window_resizer_start;
      this.y_limit_end = height * this.window_resizer_end;
    }
  }

  move_to_mouse() {
    let x = map(mouseX, 0, width, -10, 10);
    let y = map(mouseY, 0, height, -10, 10);
    let new_position = createVector(x, y);

    this.acceleration.add(new_position);
  }

  show() {
    let angle = this.velocity.heading();

    push();
    fill(255, 255, 255, this.transparency);
    noStroke();
    translate(this.position.x, this.position.y);
    rotate(angle);

    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);

    pop();
  }

  //Updates values according to part of the song. Basically, controls the boundaries...
  update_values(phase) {
    if (phase == 1) {
      this.x_limit_start = width * 0;
      this.x_limit_end = width * 1;

      this.y_limit_start = height * 0.4;
      this.y_limit_end = height * 0.6;
    } else if (phase == 2) {
      this.x_limit_start = width * 0;
      this.x_limit_end = width * 1;

      this.y_limit_start = height * 0.4;
      this.y_limit_end = height * 0.6;
    } else if (phase == 3) {
      this.x_limit_start = width * 0;
      this.x_limit_end = width * 1;

      this.y_limit_start = height * 0;
      this.y_limit_end = height * 1;
    } else if (phase == 4) {
      this.x_limit_start = width * 0.1;
      this.x_limit_end = width * 0.3;

      this.y_limit_start = height * 0;
      this.y_limit_end = height * 1;
    } else if (phase == 5) {
      this.x_limit_start = width * 0.0;
      this.x_limit_end = width * 1;

      this.y_limit_start = height * 0.7;
      this.y_limit_end = height * 0.8;
    } else if (phase == 6) {
      this.x_limit_start = width * 0.6;
      this.x_limit_end = width * 0.9;

      this.y_limit_start = height * 0;
      this.y_limit_end = height * 1;
    } else if (phase == 7) {
      this.x_limit_start = width * this.window_resizer_start;
      this.x_limit_end = width * this.window_resizer_end;

      this.y_limit_start = height * this.window_resizer_start;
      this.y_limit_end = height * this.window_resizer_end;
    }
  }
}
