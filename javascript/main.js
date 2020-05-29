// Initialize State and Constants
var gameGridDOM = document.getElementById("game-grid");
var gameTimerDOM = document.querySelector("#timer p");
var gameMineDOM = document.querySelector("#num-of-mines");
var gameResetDOM = document.querySelector("#reset");
var gameMenuDOM = document.querySelector("#settings ul");
var musicDOM = document.querySelector("#music");
var coinAudio = document.querySelector("#coinAudio");
var themeAudio = document.querySelector("#themeAudio");
var gameOverAudio = document.querySelector("#gameOverAudio");
var bombAudio = document.querySelector("#bombAudio");
var stageClearAudio = document.querySelector("#stageClearAudio");

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

const gameDiffSet = {
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
var gameDiff = "Normal";
var gridX;
var gridY;
var numOfMines;
var remainingSq = null;
var timeElap = null;
var timer;
var gameGridValues = [];
var gameGridReveal = [];
var gameStatus = 0;
var soundSetting = 0;
var explosionSet = 0;

class player {
  constructor() {
    flagcolor = "red";
  }
}

// Update State Function
function floodFill(square, x, y) {
  rerenderSquare(square, x, y);
  for (let dx = -1; dx <= 1; dx++) {
    if (x + dx >= 0 && x + dx < gridX) {
      for (let dy = -1; dy <= 1; dy++) {
        if (y + dy >= 0 && y + dy < gridY) {
          if (gameGridReveal[y + dy][x + dx] == 0) {
            if (gameGridValues[y + dy][x + dx] > 0) {
              let checkedSquare = document.getElementById(
                `${y + dy},${x + dx}`
              );
              rerenderSquare(checkedSquare, x + dx, y + dy);
            } else {
              let checkedSquare = document.getElementById(
                `${y + dy},${x + dx}`
              );
              setTimeout(function () {
                floodFill(checkedSquare, x + dx, y + dy);
              }, 300 * Math.random());
            }
          }
        }
      }
    }
  }
}

function mineNumGen() {
  for (let minesAdded = 0; minesAdded < numOfMines; minesAdded++) {
    randX = Math.floor(Math.random() * gridX);
    randY = Math.floor(Math.random() * gridY);
    while (gameGridValues[randY][randX] == -1) {
      randX = Math.floor(Math.random() * gridX);
      randY = Math.floor(Math.random() * gridY);
    }
    gameGridValues[randY][randX] = -1;
    for (let dx = -1; dx <= 1; dx++) {
      if (randX + dx >= 0 && randX + dx < gridX) {
        for (let dy = -1; dy <= 1; dy++) {
          if (randY + dy >= 0 && randY + dy < gridY) {
            if (gameGridValues[randY + dy][randX + dx] != -1) {
              gameGridValues[randY + dy][randX + dx]++;
            }
          }
        }
      }
    }
    gameGridReveal[randY][randX] = 1;
  }
}

function calcRemainSq() {
  remainingSq = gridX * gridY - numOfMines;
}

// Render Functions
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

function rerenderSquare(square, squareX, squareY) {
  if (square.classList.value.includes("open")) {
    return;
  }
  coinAudio.pause();
  coinAudio.currentTime = 0;
  coinAudio.play();
  remainingSq--;
  square.classList.remove("closed");
  square.classList.add("open");
  if (gameGridValues[squareY][squareX]) {
    square.innerText = gameGridValues[squareY][squareX];
    square.style.color = numColor[gameGridValues[squareY][squareX]];
  }
  gameGridReveal[squareY][squareX] = 1;
}

function renderWinLoss() {
  explosionSet = 1;
  let popup = document.createElement("div");
  popup.setAttribute("id", "popup");
  clearInterval(timer);
  let square;
  let mineCount = 0;
  gameGridValues.forEach(function (row, y) {
    row.forEach(function (square, x) {
      if (square == -1) {
        setTimeout(function () {
          square = document
            .getElementById(`${y},${x}`)
            .classList.add("mineExposed");
          bombAudio.pause();
          bombAudio.currentTime = 0;
          bombAudio.play();
        }, (++mineCount * 1500) / numOfMines);
      }
    });
  });
  let mario = document.createElement("div");
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
        popup.appendChild(resetMsg);
      }, 3000);
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
        popup.appendChild(resetMsg);
      }, 3000);
    }, 2300);
  }
  gameStatus = 1;
}

function renderTimer() {
  gameTimerDOM.innerText = ++timeElap;
}

function renderMines() {
  gameMineDOM.innerText = numOfMines + " Mines";
}

// Event Handler Functions
function squareClick(event) {
  if (timeElap === null) {
    timeElap = 0;
    timer = setInterval(renderTimer, 1000);
  }
  // Checking the event
  let square = event.target;
  if (!square.classList.value.includes("square") || gameStatus) {
    return;
  }
  // Extracting information from event
  let squareX = parseInt(square.id.split(",")[1]);
  let squareY = parseInt(square.id.split(",")[0]);

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

  if (!remainingSq) {
    renderWinLoss();
  }
}

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

function musicToggle() {
  if (themeAudio.paused) {
    themeAudio.play();
    soundSetting = 0;
  } else {
    themeAudio.pause();
    soundSetting = 1;
  }
}

//Initialize Functions
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
  gameGridDOM.onclick = squareClick;
  gameResetDOM.onclick = reset;
  gameMenuDOM.onclick = selectDiff;
  musicDOM.onclick = musicToggle;
}

initialize();
