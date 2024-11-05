document.addEventListener("DOMContentLoaded", () => {
  console.clear();
  // DOM Elements Selections.
  const dropDown = document.querySelector("nav .dropDown"); // Dropdown menu.
  const canvas = document.getElementById("canvas"); // Canvas element.
  const restartBtn = document.querySelector(".restart-button"); // Restart button.
  const startBtn = document.querySelector(".start-button"); // Game start button
  let gameOverDisplay = document.querySelector(".game-over"); // Game over display.
  let gameStartDisplay = document.querySelector(".game-start"); // Game start display.
  const oldScore = document.getElementById("old"); // Old Score Display.
  const newScore = document.getElementById("new"); // New Score Display.
  const darkModBtn = document.getElementById("dark"); // Dark mode button.
  const darkModIcon = document.getElementById("dark-mod"); //Dark mode icon.
  const darkModText = document.getElementById("dark-text"); //Dark mode text.
  const gameSoundBtn = document.getElementById("sound"); // Game sound button.
  const soundIcon = document.getElementById("sound-icon"); // Game Sonde button icons.
  const avatarContainer = document.getElementById("birds-container"); // Birds avatar container.
  const avatarSection = document.getElementById("avatar-section"); // Avatars container section.
  const birdsBtn = document.getElementById("birds"); // Birds avatar show button.
  const aboutBtn = document.getElementById("about"); // About Button.
  let aboutDisplay = document.querySelector(".about"); // About content display.
  const date = document.getElementById("date"); // Date.

  let width = canvas.offsetWidth; // Canvas Width.
  let height = canvas.clientHeight; // Canvas Height.

  // Game Start
  let start = false;

  // Scores.
  let score;
  let points = [];
  let oldP = 0; // Old Highest point.
  //On Window Load Old Old Highest Point Equal To Zero. Set Local Stored Point.
  if (oldP == 0) {
    oldP = localStorage.getItem("currentScore"); // Retrieve Old Points.
    oldScore.innerHTML = oldP; // Set Old Score In Game Over Display.
  }

  // Dark Mode.
  let dark = true;
  //  On Window Load Add Current Dark Mode Status.
  let darkModeStatus = localStorage.getItem("dark-mod");
  if (darkModeStatus == "true") {
    document.body.setAttribute("class", "dark");
    darkModText.innerText = "Light";
    darkModIcon.setAttribute("name", "sunny-outline");
  }

  // Game Sound Mute Status.
  let soundMute = true;
  let soundMuteStatus = localStorage.getItem("gameSound");
  if (soundMuteStatus == "true") {
    soundMute = false;
    soundIcon.setAttribute("name", "volume-mute-outline");
  }

  // Game Area
  let gameArea;

  // Flappy Bird
  var flappyBird;
  // Reassign Flappy Bird Image.
  flappyBird = {
    image: new Image(),
  };
  // Set Avatar Image On Window Load.
  let birdAvatarImg = localStorage.getItem("birdAvatarImg");
  flappyBird.image.src = birdAvatarImg;
  // Avatar Status.
  let avatarStatus = true;
  // Bird Y Position.
  var birdCurrentPosY = height / 2;

  // Pipes
  let pipes = [];

  // Background Image.
  let backgroundImg;
  // Sounds
  let hitSound; // bird hit sound.
  let pointSound; // point earn sound.
  let flyingSound; // bird flying sound.
  let dieSound; // bird die Sound.
  // Game Resume , Pause.
  let pauseBtn; // Game pause button.
  let gameResume = true; // Game Pause Status.
  // Button properties
  let buttonX = width - 60;
  let buttonY = canvas.clientHeight - height + 15;
  const buttonWidth = 35;
  const buttonHeight = 35;

  // Drop Down.
  document.onclick = (Event) => {
    // If Click Settings And Dropdown Items.
    if (Event.target.className[0] === "s") {
      dropDown.style.display = "block";
      dropDown.style.opacity = "1";
    } else {
      // Hide Drop Down When Click Outside.
      dropDown.style.display = "none";
      dropDown.style.opacity = "0";
      // About Display.
      if (Event.target.className[0] !== "a") {
        aboutDisplay.style.display = "none";
        aboutStatus = false;
      }
      // Avatar Display.
      avatarSection.style.display = "none";
      avatarStatus = true;
    }
  };

  // Dark And Light Mode Option.
  darkModBtn.addEventListener("click", () => {
    localStorage.setItem("dark-mod", dark); // Store dark mode status locally.
    avatarSection.style.display = "none"; // Hide avatar container
    if (dark) {
      document.body.setAttribute("class", "dark");
      darkModText.innerText = "Light";
      darkModIcon.setAttribute("name", "sunny-outline");
      dark = false;
    } else {
      document.body.removeAttribute("class", "dark");
      darkModText.innerText = "Dark";
      darkModIcon.setAttribute("name", "moon-outline");
      dark = true;
    }
  });

  // Game Sound Mute Button Event.
  gameSoundBtn.addEventListener("click", () => {
    localStorage.setItem("gameSound", soundMute); // Store game sound status locally.
    avatarSection.style.display = "none"; // Hide avatar container
    if (soundMute) {
      soundMute = false;
      soundIcon.setAttribute("name", "volume-mute-outline");
    } else {
      soundMute = true;
      soundIcon.setAttribute("name", "volume-high-outline");
    }
  });

  // Avatar Button.
  birdsBtn.addEventListener("click", () => {
    if (avatarStatus) {
      avatarSection.style.display = "block";
      avatarStatus = false;
    } else {
      avatarSection.style.display = "none";
      // Avatar Status.
      avatarStatus = true;
    }
  });

  // About Button Event.
  let aboutStatus = false;
  aboutBtn.addEventListener("click", () => {
    if (!aboutStatus) {
      aboutDisplay.style.display = "block";
      aboutStatus = true;
    } else {
      aboutDisplay.style.display = "none";
      aboutStatus = false;
    }
  });

  // // Game Pause Button Event.
  canvas.addEventListener("click", (e) => {
    avatarSection.style.display = "none"; // Hide avatar container
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Check if click is inside button boundaries.
    if (
      x > buttonX &&
      x < buttonX + buttonWidth &&
      y > buttonY &&
      y < buttonY + buttonHeight
    ) {
      // Call Game Resume $Fun.
      resumeGame();
    }
  });

  // Game Resume $Fun.
  function resumeGame() {
    if (gameResume) {
      gameArea.stopInterval();
      gameResume = false; // game pause.
      resume = false; // game sound off.
    } else {
      start = true; // game star status.
      gameArea.stopInterval();
      birdCurrentPosY = flappyBird.y; // Set current bird position.
      gameStart();
    }
  }

  // Restart Game $Fun.
  function restartGame() {
    avatarSection.style.display = "none"; // Hide avatar container
    flappyBird.image.src = birdAvatarImg; // Set current bird avatar.
    gameStartDisplay.style.display = "none";
    gameOverDisplay.style.display = "none";
    gameArea.stopInterval();
    gameArea.clearCanvas();
    gameArea = {};
    flappyBird = {};
    pipes = [];
    score = {};
    points = [];
    backgroundImg = {};
    hitSound = {};
    pointSound = {};
    flyingSound = {};
    dieSound = {};
    pauseBtn = {};
    canvas.innerHTML = "";
    gameStart();
  }

  // Game Start $Fun.
  function gameStart() {
    // Avatar Status.
    avatarStatus = true;
    // Game Pause Status.
    gameResume = true;
    //Game Sound.
    resume = true;
    // Create A Game Space.
    gameArea = new gameSpace();
    if (start) {
      // Background Image.
      backgroundImg = new gameComponents(
        width,
        height,
        "./src/images/bg-1.png",
        0,
        0,
        "background"
      );
      // Scores.
      score = new gameComponents("0", "0", "white", 40, 40, "text");
      // Flappy Bird.
      flappyBird = new gameComponents(
        35,
        35,
        birdAvatarImg,
        100,
        birdCurrentPosY,
        "image"
      );
      // Pause Button.
      pauseBtn = new gameComponents(
        buttonWidth,
        buttonWidth,
        "./src/icon/pause-circle-outline.svg",
        buttonX,
        buttonY,
        "image"
      );
    }

    // Pipes
    // pipes = new gameComponents(30, 360, "blue", 250, 300);
    if (gameResume && soundMute && start) {
      // Sounds
      hitSound = new gameSound("./src/sounds/flappy-bird-hit.mp3");
      // point sound.
      pointSound = new gameSound("./src/sounds/point.mp3");
      // Bird Flying Sound.
      flyingSound = new gameSound("./src/sounds/flap.mp3");
      // Bird Dead Sound.
      dieSound = new gameSound("./src/sounds/die.mp3");
    }
    // Start Game Interval $Fun.
    gameArea.startInterval();
  }

  // Create A Game Playing Space Using Object Constructor, $fun.
  function gameSpace() {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[3]);
    //Frames Numbers.
    this.frameNo = 0;
    // Pause Interval.
    this.pause = false;

    this.clearCanvas = function () {
      // Clear The Canvas.
      this.context.clearRect(
        0,
        0,
        this.canvas.offsetWidth,
        this.canvas.clientHeight
      );
    };
    this.startInterval = function () {
      // Call Update Game Space $Fun In Every 20th ms(50 time per seconds).
      this.timeInterval = setInterval(updateGameSpace, 20);
    };

    this.stopInterval = function () {
      // Clear The TimeInterval.
      clearInterval(this.timeInterval);
      this.pause = true;
    };
  }

  // Add Game Components Using Object Constructor, $fun.
  function gameComponents(width, height, color, x, y, type) {
    this.type = type;
    // Check The Types.
    if (type == "image" || type == "background") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    // X,Y Positions.
    this.posX = 0; // X coordinate position.
    this.posY = 0; // y coordinate position.
    // Add Gravity.
    this.currentGravity = 0.2; // Current gravity.
    this.updateGravity = 0; // updated gravity speed.

    // Bird Bounce.
    this.bounce = 0.2;

    // Update Canvas $Fun.
    this.updateCanvas = () => {
      ctx = gameArea.context;
      if (type == "text") {
        ctx.font = "1.5rem Trebuchet MS";
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      }
      if (type == "image" || type == "background") {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (type == "background") {
          // Draw The Loop Background.
          ctx.drawImage(
            this.image,
            this.x - this.width,
            this.y,
            this.width,
            this.height
          );
        }
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };

    // New Flappy Bird And Bg Positions Updates.
    this.newPositions = () => {
      this.updateGravity += this.currentGravity; // increase current gravity.
      this.x += this.posX; // set x coordinates.
      this.y += this.posY + this.updateGravity; // update y coordinates.
      this.bottomFall(); // call stop bottom $fun.
      this.topHit(); // Call bottom hit $fun.
      //
      if (this.type == "background") {
        // If The Components X Position Has Reached The End Of The Image.
        if (this.x == +this.width) {
          // Set XPosition Zero.
          this.x = 0;
        }
      }
    };

    // Stop Bottom Over Fall $Fun.
    let bottomHit = false;
    this.bottomFall = () => {
      let birdBottom = gameArea.canvas.clientHeight - this.height;
      if (this.y > birdBottom) {
        this.y = birdBottom;
        this.updateGravity = -(this.updateGravity * this.bounce);
        // this.updateGravity = 0;
        // bottomHit = true;
      }
    };

    // Stop Top Hit.
    this.topHit = () => {
      if (this.y < 0) {
        this.y = 0;
        // Bird Hit Image Show $fun.
        birdHits();
        this.updateGravity = -(this.updateGravity * this.bounce); // bounce back when hit the bird.
        // Check The Sound Mute Status.
        if (soundMute) {
          hitSound.play(); // play sound when bird hit.
        }
      }
    };

    //  Crash check.
    this.crashCheck = (obj) => {
      let crashStatus = true;
      // Bird.
      let birdLeft = this.x;
      let birdRight = this.x + this.width;
      let birdTop = this.y;
      let birdBottom = this.y + this.height;
      // Pipes.
      let pipeLeft = obj.x;
      let pipeRight = obj.x + obj.width;
      let pipeTop = obj.y;
      let pipeBottom = obj.y + obj.height;

      if (
        birdLeft > pipeRight ||
        birdRight < pipeLeft ||
        birdTop > pipeBottom ||
        birdBottom < pipeTop
      ) {
        crashStatus = false;
      }
      return crashStatus;
    };

    // Score Check.
    // console.log(this.x -100);
    this.addScore = (obj) => {
      let birdPos = this.x;
      let pipePos = obj.x;
      let newP = 0;

      if (birdPos === pipePos) {
        points.push(1);
        // Check The Sound Mute Status.
        if (soundMute) {
          pointSound.play(); // pay point sound.
        }

        // Store Score In Locally
        newP = Number(points.length / 2);

        //  check old points is smaller than nwe points.
        if (oldP < newP) {
          oldP = newP; // Set new point in old point value.
          oldScore.innerHTML = oldP; // Set old score in game over display.
          newScore.innerHTML = newP; // Set new score in game over display.

          if (typeof Storage !== "undefined") {
            localStorage.setItem("currentScore", oldP); // Add Points In Locally.
          } else {
            // Sorry! No Web Storage support..
            console.log("Sorry! No Web Storage support..");
          }
        }
      }
    };
  }

  // Add Game Sounds Using Object Constructor, $fun.
  function gameSound(src) {
    this.sound = document.createElement("audio"); // create audio element.
    this.sound.src = src; // add audio source.
    this.sound.setAttribute("preload", "auto"); // Add audio preload;
    this.sound.setAttribute("controls", "none"); // Remove audio controls.
    this.sound.style.display = "none"; // Remove audio default styles.
    // Add Sound Element In Body.
    document.body.appendChild(this.sound);
    // Add Audio Play Function To Using Play method.
    this.play = async () => {
      try {
        await this.sound.play();
      } catch (error) {
        console.error(error.message);
      }
    };
    // Add Audio Pause Function To Using Pause Method.
    this.pause = async () => {
      try {
        this.sound.pause();
      } catch (error) {
        console.error(error.message);
      }
    };
  }

  // Update Game Space $Fun.
  function updateGameSpace() {
    // Declare All variables,
    var x, h, maxPipeHeight, maxPipeHeight, height, minPipeGap, maxPipeGap;
    // Loop All Pipes And Check Crashes.
    for (let i = 0; i < pipes.length; i++) {
      flappyBird.addScore(pipes[i]); // Score Checks.

      if (flappyBird.crashCheck(pipes[i])) {
        // Check The Sound Mute Status.
        if (soundMute) {
          hitSound.play(); // play sound when bird hit.
        }
        setTimeout(() => {
          // Check The Sound Mute Status.
          if (soundMute) {
            dieSound.play(); //bird dead sound.
          }
        }, 600);
        // Bird Hit Image Show $fun.
        birdHits();
        gameArea.stopInterval();
        gameOverDisplay.style.display = "block";
        gameResume = false; // Stop the game.
        return;
      }
    }
    // If Not Pause The Interval.
    if (gameArea.pause == false && start) {
      gameArea.clearCanvas(); // clear canvas.
      gameArea.frameNo += 1; // increase frame num.

      backgroundImg.posX = +1;
      backgroundImg.newPositions(); // Background Positions.
      backgroundImg.updateCanvas(); // Background Positions updates.

      // Push The Pipes Based On The frames No And Intervals.
      if (gameArea.frameNo == 0 || frameNoCheck(150)) {
        x = gameArea.canvas.width;
        h = gameArea.canvas.clientHeight;
        minPipeHeight = 45;
        maxPipeHeight = 300;
        height = Math.floor(
          Math.random() * (maxPipeHeight - minPipeHeight + 1) + minPipeHeight
        );
        minPipeGap = 50;
        maxPipeGap = 250;
        pipeGap = Math.floor(
          Math.random() * (maxPipeGap - minPipeGap + 1) + minPipeGap
        );
        pipes.push(
          new gameComponents(
            60,
            height,
            "./src/images/pipe-1.png",
            x,
            0,
            "image"
          )
        );
        pipes.push(
          new gameComponents(
            60,
            h - height / 2,
            "./src/images/pipe-2.png",
            x,
            height + pipeGap,
            "image"
          )
        );
      }

      // Show All Pipes In Canvas.
      for (let i = 0; i < pipes.length; i++) {
        pipes[i].x += -1;
        pipes[i].updateCanvas();
      }
      // Add Scores.
      score.text = "SCORE : " + points.length / 2;
      score.updateCanvas();
      // Flappy Bird.
      flappyBird.newPositions();
      flappyBird.updateCanvas();
      // Pause Button.
      pauseBtn.updateCanvas();
    }
  }

  // Frame Numbers Check.
  function frameNoCheck(num) {
    // If it`s returns true if the current frame number corresponds with the given interval.
    if ((gameArea.frameNo / num) % 1 == 0) {
      return true;
    }
    return false;
  }

  // Key On Pressing.
  window.addEventListener("keydown", (ev) => {
    if (ev.code === "Space" || (ev.key === "" && gameResume && start)) {
      ev.preventDefault(); // Prevent the default action to avoid triggering other buttons.
      birdUp(-0.2);
      // Check The Sound Mute Status.
      if (soundMute && gameResume) {
        flyingSound.play(); // bird flaying sound.
      }
    }
  });

  // Key On Releasing.
  window.addEventListener("keyup", (ev) => {
    if (ev.code == "Space" || (ev.key === "" && gameResume && start)) {
      ev.preventDefault(); // Prevent the default action to avoid triggering other buttons.
      birdUp(0.1);
      flappyBird.image.src = birdAvatarImg; // Set current bird avatar.
    }
  });

  // Update Bird Positions On Clicks.
  window.addEventListener("mousedown", (e) => {
    if (e.target.id === "canvas" && gameResume && start) {
      birdUp(-0.2);
      flappyBird.image.src = birdAvatarImg; // Set current bird avatar.
      // Check The Sound Mute Status.
      if (soundMute && start) {
        flyingSound.play(); // bird flaying sound.
      }
    }
  });
  window.addEventListener("mouseup", (e) => {
    if (gameResume && start) {
      birdUp(0.1);
      flappyBird.image.src = birdAvatarImg; // Set current bird avatar.
    }
  });

  // Bird Position Up $Fun.
  function birdUp(up) {
    if (start && gameResume) {
      flappyBird.currentGravity = up;
    }
  }

  // Game Restart $Fun.
  restartBtn.addEventListener("click", () => {
    gameOverDisplay.style.display = "none";
    gameStartDisplay.style.display = "block";
  });

  // On Click Game Start Button.
  startBtn.addEventListener("click", () => {
    start = true; // game start.
    // Start Or Restart The Game.
    restartGame();
  });

  // Add Bird Avatars.
  function birdAvatars() {
    for (let i = 0; i < 9; i++) {
      const avatars = document.createElement("div");
      avatars.innerText = i;
      avatars.setAttribute("class", "birdAvatar");
      avatarContainer.appendChild(avatars);
      // Add Avatars.
      let avatar = document.querySelectorAll(".birdAvatar")[i];
      switch (avatars.innerText) {
        case `${i}`:
          avatars.style.backgroundImage = `url(./src/images/bird-${i}.png)`;
          break;

        default:
          console.log("No Image!");
          break;
      }
      // Reassign Flappy Bird Image.
      flappyBird = {
        image: new Image(),
      };
      // Add Specific Avatars In Games.
      avatar.addEventListener("click", (e) => {
        let avatarNum = e.target.innerText;
        let birdImg =
          (flappyBird.image.src = `./src/images/bird-${avatarNum}.png`);
        localStorage.setItem("birdAvatarImg", birdImg);
        avatarSection.style.display = "none";
        window.location.reload(); // Reload Window.
      });
    }
  }

  // Bird Hit Avatars Set.
  function birdHits() {
    //  Add Image To Birds After Hit.
    for (let i = 0; i < 9; i++) {
      switch (birdAvatarImg) {
        case `./src/images/bird-${i}.png`:
          if (i > 1 && i < 4) {
            flappyBird.image.src = "./src/images/greenHit.png";
          } else if (i > 3 && i < 6) {
            flappyBird.image.src = "./src/images/yellowHit.png";
          } else if (i > 5 && i < 9) {
            flappyBird.image.src = "./src/images/blueHit.png";
          } else if (i < 2) {
            flappyBird.image.src = "./src/images/redHit.png";
          }
          break;

        default:
          break;
      }
    }
  }
  // Add Footer Automatic Dates.
  date.innerText = new Date().getFullYear();

  birdAvatars();
  gameStart();
});
