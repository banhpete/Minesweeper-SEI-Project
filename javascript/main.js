// Initialize State and Constants
var gameGridDOM = document.getElementById("game-grid");
var gameTimerDOM = document.querySelector("#timer p");
var gameMineDOM = document.querySelector("#num-of-mines");
var gameResetDOM = document.querySelector("#reset");

const gameDiffSet = {
  Easy: {
    gridX: 10,
    gridY: 8,
    numOfMines: 10,
  },
  Normal: {
    gridX: 18,
    gridY: 14,
    numOfMines: 40,
  },
  Hard: {
    gridX: 24,
    gridY: 20,
    numOfMines: 99,
  },
};
var gameDiff = "Normal";
var gridX = gameDiffSet[gameDiff]["gridX"];
var gridY = gameDiffSet[gameDiff]["gridY"];
var numOfMines = gameDiffSet[gameDiff]["numOfMines"];
var remainingSq = null;
var timeElap = null;
var timer;
var gameGridValues = [];
var gameGridReveal = [];
var gameStatus = 0;

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
              }, 200 * Math.random());
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
  remainingSq--;
  console.log(remainingSq);
  square.classList.remove("closed");
  square.classList.add("open");
  square.innerText = gameGridValues[squareY][squareX]
    ? gameGridValues[squareY][squareX]
    : "";
  gameGridReveal[squareY][squareX] = 1;
}

function renderWinLoss() {
  let popup = document.createElement("div");
  popup.setAttribute("id", "popup");
  clearInterval(timer);
  if (remainingSq > 0) {
    let square;
    gameGridValues.forEach(function (row, y) {
      row.forEach(function (square, x) {
        if (square == -1) {
          setTimeout(function () {
            square = document
              .getElementById(`${y},${x}`)
              .classList.add("mineExposed");
          }, 200 + Math.random() * 500);
        }
      });
    });
    setTimeout(function () {
      popup.innerHTML = "<p>YOU LOSE</p>";
      gameGridDOM.appendChild(popup);
    }, 900);
  } else {
    popup.innerHTML = "<p>YOU WIN</p>";
    gameGridDOM.appendChild(popup);
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

//Reset Function
function reset() {
  console.log("hi");
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
  initialize();
}

//Initialize Functions
function initialize() {
  renderGameGrid();
  renderMines();
  calcRemainSq();
  mineNumGen();
  gameGridDOM.onclick = squareClick;
  gameResetDOM.onclick = reset;
  console.log(gameGridValues);
}

initialize();
