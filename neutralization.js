// Function to load the neutralization screen
function loadScreen2() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
      <h1>Welcome to Neutralization Simulation</h1>
      <p>This is the content for Screen 2.</p>
      <canvas id="neutralization-canvas"></canvas>
      <button id="backButton">Back</button>
    `;
  
    // Initialize the p5.js sketch
    new p5(neutralizationSketch, 'neutralization-canvas');
  }
  
  // p5.js sketch for the neutralization simulation
  const neutralizationSketch = (p) => {
    let yscale = 0.0;
    let buttons = {}; // Stores the buttons
    let mixture = {   // Stores the instance of spheres based on the type of molecule
      acids: [],
      bases: [],
      water: [],
    };
  
    p.setup = () => {
      p.createCanvas(800, 500);
  
      // Initialize buttons
      buttons.HCl = new Buttons(515, 80, 47, 144, 218, "HCl");
      buttons.HNO3 = new Buttons(620, 80, 47, 144, 218, "HNO₃");
      buttons.H2CO3 = new Buttons(515, 140, 47, 144, 218, "H₂CO₃");
      buttons.H2SO4 = new Buttons(620, 140, 47, 144, 218, "H₂SO₄");
      buttons.NaOH = new Buttons(515, 250, 37, 196, 245, "NaOH");
      buttons.KOH = new Buttons(620, 250, 37, 196, 245, "KOH");
      buttons.NH4 = new Buttons(515, 310, 37, 196, 245, "NH₄OH");
      buttons.BaOH2 = new Buttons(620, 310, 37, 196, 245, "Ba(OH)₂");
    };
  
    p.draw = () => {
      p.background(255);
      grid();
      drawWater();
      beaker();
      drawButtons();
      handleButtons();
      updateAcids();
      updateBases();
      updateWater();
      p.noStroke();
      p.fill(0);
      p.textSize(20);
      p.text('Acids', 530, 70);
      p.text('Bases', 530, 240);
    };
  
    p.mouseReleased = () => {
      // Reset the pressed status when the mouse is released
      for (let key in buttons) {
        buttons[key].pressed = false;
      }
    };
  
    // Helper functions
    function grid() {
      p.stroke(190);
      p.strokeWeight(0.5);
      for (let i = -10; i < p.width; i += 20) {
        p.line(i, 0, i, p.width);
      }
      for (let i = -10; i < p.height; i += 20) {
        p.line(0, i, 800, i);
      }
    }
  
    function drawWater() {
      p.fill(0, 119, 190);
      p.beginShape();
      let xscale = 0;
      for (let x = 50; x <= 455; x += 15) {
        let y = p.map(p.noise(xscale, yscale), 0, 1, 200, 100);
        p.vertex(x, y);
        xscale += 0.05;
      }
      yscale += 0.01;
      p.vertex(450, 370);
      p.vertex(54, 370);
      p.endShape(p.CLOSE);
    }
  
    function beaker() {
      p.strokeWeight(9);
      p.stroke(0);
      p.fill(250, 45);
      p.rect(50, 70, 400, 300, 20);
      p.strokeWeight(12);
      p.stroke(255);
      p.line(40, 70, 450, 70);
    }
  
    function drawButtons() {
      for (let key in buttons) {
        buttons[key].show();
      }
    }
  
    function handleButtons() {
      let H = [213, 62, 79];
      let OH = [125, 108, 203];
  
      // Handle button presses and create spheres
      if (buttons.HCl.isPressed() && !buttons.HCl.pressed && mixture.acids.length < 10) {
        let x = p.random(70, 430);
        let y = p.random(200, 350);
        mixture.acids.push(new Spheres(x, y, H[0], H[1], H[2], "H⁺"));
        mixture.acids.push(new Spheres(x + 15, y, 0, 255, 0, "Cl⁻"));
        buttons.HCl.pressed = true;
      }
      // Add other button handlers similarly...
    }
  
    function updateAcids() {
      for (let i = 0; i < mixture.acids.length; i++) {
        mixture.acids[i].show();
        mixture.acids[i].move();
        mixture.acids[i].bounce();
        mixture.acids[i].collide(mixture.acids);
        mixture.acids[i].fade();
        if (mixture.acids[i].transparency <= 0) {
          mixture.acids.splice(i, 1);
          i--;
        }
      }
    }
  
    function updateBases() {
      for (let i = mixture.bases.length - 1; i >= 0; i--) {
        mixture.bases[i].show();
        mixture.bases[i].move();
        mixture.bases[i].bounce();
        mixture.bases[i].collide(mixture.bases);
        if (mixture.bases[i].neutralization(mixture.acids)) {
          mixture.bases.splice(i, 1);
          continue;
        }
        mixture.bases[i].fade();
        if (mixture.bases[i].transparency <= 0) {
          mixture.bases.splice(i, 1);
        }
      }
    }
  
    function updateWater() {
      for (let i = 0; i < mixture.water.length; i++) {
        mixture.water[i].show();
        mixture.water[i].move();
        mixture.water[i].bounce();
        mixture.water[i].fade();
        if (mixture.water[i].transparency <= 0) {
          mixture.water.splice(i, 1);
        }
      }
    }
  
    // Button class
    class Buttons {
      constructor(x, y, r, g, b, label) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.label = label;
        this.pressed = false;
      }
  
      show() {
        p.strokeWeight(1);
        p.fill(this.r, this.g, this.b);
        p.rect(this.x, this.y, 100, 40, 10);
        p.fill(255);
        p.noStroke();
        p.textSize(25);
        p.text(this.label, this.x + 10, this.y + 29);
      }
  
      isPressed() {
        return (
          p.mouseIsPressed &&
          p.mouseX > this.x &&
          p.mouseX < this.x + 100 &&
          p.mouseY > this.y &&
          p.mouseY < this.y + 40
        );
      }
    }
  
    // Sphere class
    class Spheres {
      constructor(x, y, r, g, b, label) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.label = label;
        this.xvel = p.random(-0.5, 0.5);
        this.yvel = p.random(-0.5, 0.5);
        this.transparency = 255;
      }
  
      show() {
        if (
          this.label === "Na⁺" ||
          this.label === "K⁺" ||
          this.label === "Ba⁺" ||
          this.label === "NH₄⁺" ||
          this.label === "HCO₃⁻" ||
          this.label === "HSO₄⁻" ||
          this.label === "Cl⁻" ||
          this.label === "NO₃⁻" ||
          this.label === "H₂O"
        ) {
          p.fill(this.r, this.g, this.b, this.transparency);
        } else {
          p.fill(this.r, this.g, this.b);
        }
        p.circle(this.x, this.y, 35);
        p.textSize(10);
        p.fill(0, this.transparency);
        p.text(this.label, this.x - 12, this.y + 4);
      }
  
      move() {
        this.x += this.xvel;
        this.y += this.yvel;
      }
  
      bounce() {
        if (this.x >= 440 || this.x <= 60) {
          this.xvel *= -1;
        }
        if (this.y >= 350 || this.y <= 200) {
          this.yvel *= -1;
        }
      }
  
      collide(solution) {
        for (let i = 0; i < solution.length; i++) {
          let d = p.dist(this.x, this.y, solution[i].x, solution[i].y);
          if (d < 35) {
            let angle = p.atan2(solution[i].y - this.y, solution[i].x - this.x);
            let targetX = this.x + p.cos(angle) * 35;
            let targetY = this.y + p.sin(angle) * 35;
            let ax = (targetX - solution[i].x) * 0.05;
            let ay = (targetY - solution[i].y) * 0.05;
  
            this.xvel -= ax;
            this.yvel -= ay;
            solution[i].xvel += ax;
            solution[i].yvel += ay;
          }
        }
      }
  
      neutralization() {
        for (let i = mixture.acids.length - 1; i >= 0; i--) {
          let d = p.dist(this.x, this.y, mixture.acids[i].x, mixture.acids[i].y);
          if (d < 35 && this.label === "OH⁻" && mixture.acids[i].label === "H⁺") {
            mixture.water.push(new Spheres(mixture.acids[i].x, mixture.acids[i].y, 128, 128, 128, "H₂O"));
            mixture.acids.splice(i, 1);
            mixture.bases.splice(i, 1);
            return true;
          }
        }
        return false;
      }
  
      fade() {
        if (
          this.label === "Na⁺" ||
          this.label === "K⁺" ||
          this.label === "Ba⁺" ||
          this.label === "NH₄⁺" ||
          this.label === "HCO₃⁻" ||
          this.label === "HSO₄⁻" ||
          this.label === "Cl⁻" ||
          this.label === "NO₃⁻" ||
          this.label === "H₂O"
        ) {
          this.transparency -= 2;
        }
      }
    }
  };
  
  // Back button functionality
  document.addEventListener('click', (event) => {
    if (event.target.id === 'backButton') {
      window.location.href = "index.html";
    }
  });
