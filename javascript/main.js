/* -------- Initialize State and Constants -------- */
// DOM Nodes
var gameGridDOM = document.getElementById("game-grid");
var gameTimerDOM = document.querySelector("#timer p");
var gameMineDOM = document.querySelector("#num-of-mines");
var gameResetDOM = document.querySelector(".reset");
var gameMenuDOM = document.querySelector("#settings ul");
var musicDOM = document.querySelector("#music");

// DOM Audio Nodes
var coinAudio = document.querySelector("#coinAudio");
var themeAudio = document.querySelector("#themeAudio");
var gameOverAudio = document.querySelector("#gameOverAudio");
var bombAudio = document.querySelector("#bombAudio");
var stageClearAudio = document.querySelector("#stageClearAudio");

// Obj for Font Colour in Grid
const numColor = {
  1: "#0000ff",
  2: "#008000",
  3: "#e80000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000000",
  8: "#808080",
};

// Obj for Game Setting
var gameDiffSet = {
  Easy: {
    squareSize: 70,
    gridX: 10,
    gridY: 8,
    numOfMines: 10,
  },
  Normal: {
    squareSize: 40,
    gridX: 18,
    gridY: 14,
    numOfMines: 40,
  },
  Hard: {
    squareSize: 30,
    gridX: 24,
    gridY: 20,
    numOfMines: 99,
  },
};

// Game State Variables
var gameDiff = "Normal";
var gridX; // Width of Grid in Squares
var gridY; // Height of Grid in Squares
var numOfMines;
var remainingSq = null; // Remaining Squares a player has to uncover before they win
var timeElap = null; // Time elapsed
var timer; // Variable used to hold the setInterval function so that we can stop it
var gameGridValues = []; // State of the grid telling us where mines are and numbers surrounding it
var gameGridReveal = []; // Grid used to keep track of what cells have been revealed already
var gameStatus = 0; // Keeps track on whether the game shall continue or not
var soundSetting = 0; // Used to keep track if the sounds are playing or not.
var explosionSet = 0; // Used to keep of the explosion sequence and to prevent players from skipping it. This is so they can witness the magnificient explosions.
// But also so that they do not reset the game too early, which could affect the state of the grid since we have have a bunch of setTimeOut() functions

/* -------- Utility Functions -------- */
// This function is used throughout the code to check the surrounding
// cells of a particular cell with coordinates y,x.
function checkSurroundings(y, x, fn) {
  for (let dx = -1; dx <= 1; dx++) {
    if (x + dx >= 0 && x + dx < gridX) {
      for (let dy = -1; dy <= 1; dy++) {
        if (y + dy >= 0 && y + dy < gridY) {
          fn(y + dy, x + dx);
        }
      }
    }
  }
}

/* -------- Update State Functions -------- */
// Flood Fill Function that allows for the reveal propagation through the grid.
function floodFill(square, x, y) {
  rerenderSquare(square, x, y);

  checkSurroundings(y, x, function (y2, x2) {
    if (gameGridReveal[y2][x2] == 0) {
      if (gameGridValues[y2][x2] > 0) {
        let checkedSquare = document.getElementById(`${y2},${x2}`);
        rerenderSquare(checkedSquare, x2, y2);
      } else {
        let checkedSquare = document.getElementById(`${y2},${x2}`);
        setTimeout(function () {
          floodFill(checkedSquare, x2, y2);
        }, 300 * Math.random());
      }
    }
  });
}

// Generation of the 2D array that defines mine locations and numbers
function mineNumGen(totalMines = numOfMines, y = 99, x = 99) {
  for (let minesAdded = 0; minesAdded < totalMines; minesAdded++) {
    randX = Math.floor(Math.random() * gridX);
    randY = Math.floor(Math.random() * gridY);

    // This while loop is to ensure mines are not placed in the same place of another mine
    // And to ensure a mine is not relocated near the area where the player first clicks.
    // The conditions containing absolutes are only important for the relocation of mines, not the
    // initial generation of the mines.
    while (
      gameGridValues[randY][randX] == -1 ||
      Math.abs(randY - y) <= 1 ||
      Math.abs(randX - x) <= 1
    ) {
      randX = Math.floor(Math.random() * gridX);
      randY = Math.floor(Math.random() * gridY);
    }

    // Add the value 1 to the surrounding area of the mine
    gameGridValues[randY][randX] = -1;
    checkSurroundings(randY, randX, function (y, x) {
      if (gameGridValues[y][x] != -1) {
        gameGridValues[y][x]++;
      }
    });

    // Update game gameGridReveal
    gameGridReveal[randY][randX] = 1;
  }
}

// This function is a simple function to calculate the remaining squares a user has left to uncover.
// Helps determine if a user has won or not.
function calcRemainSq() {
  remainingSq = gridX * gridY - numOfMines;
}

/* -------- Render Functions -------- */
// Function to dynamically create the squares and add them to DOM. It also serves to create the 2D array.
// While the render function and state defining functions should be separated, it was benefacial to combine these two
// since it was looping through the same thing.
function renderGameGrid() {
  for (y = 0; y < gridY; y++) {
    let valueRow = [];
    let revealRow = [];
    for (x = 0; x < gridX; x++) {
      valueRow.push(0);
      revealRow.push(0);
      let square = document.createElement("div");
      square.style.height = gameDiffSet[gameDiff]["squareSize"] + "px";
      square.style.width = gameDiffSet[gameDiff]["squareSize"] + "px";
      square.classList.add("square");
      square.classList.add("closed");
      square.id = y + "," + x;
      gameGridDOM.appendChild(square);
    }
    gameGridValues.push(valueRow);
    gameGridReveal.push(revealRow);
  }
}

// Re-render a square after it is clicked
function rerenderSquare(square, squareX, squareY) {
  if (square.classList.value.includes("open")) {
    return;
  }

  // Because we can have multiple squares rerendering, it's important to have the pause and reset time to 0
  // Otherwise, the sound effect would be very lame for multiple squares.
  coinAudio.pause();
  coinAudio.currentTime = 0;
  coinAudio.play();

  remainingSq--;

  // Add style to font and the square
  square.classList.remove("closed");
  square.classList.add("open");
  if (gameGridValues[squareY][squareX]) {
    square.innerText = gameGridValues[squareY][squareX];
    square.style.color = numColor[gameGridValues[squareY][squareX]];
  }
  gameGridReveal[squareY][squareX] = 1;
}

function renderWinLoss() {
  // Stop the setInterval
  clearInterval(timer);

  // Stop the user from interacting with the grid and the reset button temporarily
  explosionSet = 1;
  gameStatus = 1;
  let mineCount = 0;

  // Creates new DOM nodes
  let mario = document.createElement("div");
  let popup = document.createElement("div");
  popup.setAttribute("id", "popup");

  // Sets off the explosions throughout the grid. The setTimeout here gives the explosion the wavy effect.
  gameGridValues.forEach(function (row, y) {
    row.forEach(function (squareValue, x) {
      if (squareValue == -1) {
        setTimeout(function () {
          mine = document.getElementById(`${y},${x}`);
          mine.classList.add("mineExposed");
          mine.classList.remove("closed");
          bombAudio.pause();
          bombAudio.currentTime = 0;
          bombAudio.play();
        }, (++mineCount * 1500) / numOfMines);
      }
    });
  });

  // Show the win/loss message. The setTimeout here allows the message to appear shortly after the explosions
  if (remainingSq > 0) {
    setTimeout(function () {
      themeAudio.pause();
      gameOverAudio.play();
      mario.setAttribute("id", "mario-falling");
      popup.innerHTML = "<p>YOU LOSE</p>";
      popup.appendChild(mario);
      gameGridDOM.appendChild(popup);
      explosionSet = 0;
      setTimeout(function () {
        let resetMsg = document.createElement("p");
        resetMsg.innerHTML = "Press Reset";
        resetMsg.onclick = reset;
        resetMsg.classList.add("reset");
        popup.appendChild(resetMsg);
      }, 35000);
    }, 2300);
  } else {
    setTimeout(function () {
      themeAudio.pause();
      stageClearAudio.play();
      mario.setAttribute("id", "mario");
      popup.innerHTML = "<p>YOU WIN</p>";
      popup.appendChild(mario);
      gameGridDOM.appendChild(popup);
      explosionSet = 0;
      setTimeout(function () {
        let resetMsg = document.createElement("p");
        resetMsg.innerHTML = "Press Reset";
        resetMsg.onclick = reset;
        resetMsg.classList.add("reset");
        popup.appendChild(resetMsg);
      }, 3000);
    }, 2300);
  }
}

// For rendering the timer
function renderTimer() {
  gameTimerDOM.innerText = ++timeElap;
}

// For rendering the DOM indicating number of mines
function renderMines() {
  gameMineDOM.innerText = numOfMines + " Mines";
}

/* -------- Event Handler Functions -------- */
// For clicking a square
function squareClick(event) {
  // Set event target as square
  let square = event.target;
  // Return if it is not a valid square
  if (!square.classList.value.includes("square") || gameStatus) {
    return;
  }

  // Find coordinates of clicked square
  let squareX = parseInt(square.id.split(",")[1]);
  let squareY = parseInt(square.id.split(",")[0]);

  // Start timer if not yet started and then reorganize grid. This is to
  // ensure the player doesn't lose right away.
  if (timeElap === null) {
    timeElap = 0;
    timer = setInterval(renderTimer, 1000);
    checkSurroundings(squareY, squareX, function (y, x) {
      if (gameGridValues[y][x] == -1) {
        mineNumGen(1, y, x);
        gameGridValues[y][x] = 0;
        gameGridReveal[y][x] = 0;
        checkSurroundings(y, x, function (y2, x2) {
          if (gameGridValues[y2][x2] > 0) {
            if (!(y2 == y && x2 == x)) {
              gameGridValues[y2][x2]--;
            }
          }
          if (gameGridValues[y2][x2] == -1) {
            gameGridValues[y][x]++;
          }
        });
      }
    });
  }

  // Check what was clicked and action depending on the value
  if (gameGridValues[squareY][squareX] == -1) {
    gameStatus = 1;
    renderWinLoss();
  } else if (!gameGridReveal[squareY][squareX]) {
    if (gameGridValues[squareY][squareX] > 0) {
      rerenderSquare(square, squareX, squareY);
    } else {
      floodFill(square, squareX, squareY);
    }
  }

  // After checking the value, check if there are any remaining squares left to uncover
  if (!remainingSq) {
    renderWinLoss();
  }
}

// Reset the game by reseting the States, and deleting the DOM Node holding the squares
// After run initalization again
function reset() {
  if (!explosionSet) {
    gameGridValues = [];
    gameGridReveal = [];
    timeElap = null;
    gameTimerDOM.innerText = 0;
    gameGridDOM.remove();
    gameGridDOM = document.createElement("div");
    gameGridDOM.setAttribute("id", "game-grid");
    document.querySelector("body").appendChild(gameGridDOM);
    gameGridDOM = document.getElementById("game-grid");
    gameStatus = 0;
    clearInterval(timer);
    gameOverAudio.pause();
    gameOverAudio.currentTime = 0;
    stageClearAudio.pause();
    stageClearAudio.currentTime = 0;
    if (!soundSetting) {
      themeAudio.play();
    }
    initialize();
  }
}

// For selecting difficulties
function selectDiff(event) {
  if (event.target.innerText == gameDiff) {
    return;
  } else {
    gameDiff = event.target.innerText;
    let ul = document.querySelectorAll("li");
    ul.forEach(function (ele) {
      ele.classList.remove("selected");
    });
    event.target.classList.add("selected");
  }
  reset();
}

// For toggle music on and off. Also keeps track if the music is playing or not.
function musicToggle(event) {
  if (themeAudio.paused) {
    event.target.innerHTML = "Music: ON&nbsp";
    themeAudio.play();
    soundSetting = 0;
  } else {
    event.target.innerHTML = "Music: OFF";
    themeAudio.pause();
    soundSetting = 1;
  }
}

// For mobile responsivness. Change the squareSize in the gameDiffSetting depending on screen width.
function respond() {
  if (window.innerWidth < 780) {
    if (gameDiffSet["Easy"]["squareSize"] > 50) {
      gameDiffSet = {
        Easy: {
          squareSize: 35,
          gridX: 10,
          gridY: 8,
          numOfMines: 10,
        },
        Normal: {
          squareSize: 20,
          gridX: 18,
          gridY: 14,
          numOfMines: 40,
        },
        Hard: {
          squareSize: 15,
          gridX: 24,
          gridY: 20,
          numOfMines: 99,
        },
      };
      gameGridDOM.style.width =
        gridX * gameDiffSet[gameDiff]["squareSize"] + 4 + "px";
      let squares = document.querySelectorAll(".square");
      squares.forEach(function (ele) {
        ele.style.height = gameDiffSet[gameDiff]["squareSize"] + "px";
        ele.style.width = gameDiffSet[gameDiff]["squareSize"] + "px";
      });
    } else {
      return;
    }
  } else {
    if (gameDiffSet["Easy"]["squareSize"] < 50) {
      gameDiffSet = {
        Easy: {
          squareSize: 70,
          gridX: 10,
          gridY: 8,
          numOfMines: 10,
        },
        Normal: {
          squareSize: 40,
          gridX: 18,
          gridY: 14,
          numOfMines: 40,
        },
        Hard: {
          squareSize: 30,
          gridX: 24,
          gridY: 20,
          numOfMines: 99,
        },
      };
      gameGridDOM.style.width =
        gridX * gameDiffSet[gameDiff]["squareSize"] + 4 + "px";
      let squares = document.querySelectorAll(".square");
      squares.forEach(function (ele) {
        ele.style.height = gameDiffSet[gameDiff]["squareSize"] + "px";
        ele.style.width = gameDiffSet[gameDiff]["squareSize"] + "px";
      });
    } else {
      return;
    }
  }
}

/* -------- Initialization Functions -------- */
function initialize() {
  gridX = gameDiffSet[gameDiff]["gridX"];
  gridY = gameDiffSet[gameDiff]["gridY"];
  numOfMines = gameDiffSet[gameDiff]["numOfMines"];
  gameGridDOM.style.width =
    gridX * gameDiffSet[gameDiff]["squareSize"] + 4 + "px";

  renderGameGrid();
  renderMines();
  calcRemainSq();
  mineNumGen();
  respond();

  gameGridDOM.onclick = squareClick;
  gameResetDOM.onclick = reset;
  gameMenuDOM.onclick = selectDiff;
  musicDOM.onclick = musicToggle;
  window.addEventListener("resize", respond);
}

initialize();

/* -------- Testing Function for Development -------- */
function testValues(arr) {
  for (let i = 0; i < arr.length; i++) {
    let count;
    for (let j = 0; j < arr[0].length; j++) {
      if (arr[i][j] > 0) {
        count = 0;
        for (let di = -1; di <= 1; di++) {
          if (i + di >= 0 && i + di < arr.length) {
            for (let dj = -1; dj <= 1; dj++) {
              if (j + dj >= 0 && j + dj < arr[0].length) {
                if (arr[i + di][j + dj] == -1) {
                  count++;
                }
              }
            }
          }
        }
        if (count != arr[i][j]) return false;
      } else if (arr[i][j] == -1) {
        for (let di = -1; di <= 1; di++) {
          if (i + di >= 0 && i + di < arr.length) {
            for (let dj = -1; dj <= 1; dj++) {
              if (j + dj >= 0 && j + dj < arr[0].length) {
                if (arr[i + di][j + dj] == 0) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
  }
  return true;
}
