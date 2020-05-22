class player {
  constructor() {
    flagcolor = "red";
  }
}

var gameObj = {
  //state
  gameGridDOM: document.getElementById("game-grid"),
  gameTimerDOM: document.getElementById("timer"),
  gameDifficultySettings: {
    Easy: {
      gridX: 10,
      gridY: 8,
      mines: 10,
    },
    Normal: {
      gridX: 18,
      gridY: 14,
      mines: 40,
    },
    Hard: {
      gridX: 24,
      gridY: 20,
      mines: 99,
    },
  },
  gameDifficultySettings: "Normal",
  gridX: 18,
  gridY: 14,
  numOfMines: 40,
  remainingSquares: null,
  timeElapsed: 0,
  gameGridValues: [],
  gameGridReveal: [],

  //Initialize
  initialize: function () {
    this.renderGameGrid();
    this.calculateRemainingSquares();
    this.mineNumberGenerator();
  },

  //Update State Methods
  mineNumberGenerator: function () {
    for (let minesAdded = 0; minesAdded <= this.numOfMines; minesAdded++) {
      randX = Math.floor(Math.random() * this.gridX);
      randY = Math.floor(Math.random() * this.gridY);
      while (this.gameGridValues[randY][randX] == -1) {
        randX = Math.floor(Math.random() * this.gridX);
        randY = Math.floor(Math.random() * this.gridY);
      }
      gameObj.gameGridValues[randY][randX] = -1;
      for (let dx = -1; dx <= 1; dx++) {
        if (randX + dx >= 0 && randX + dx < this.gridX) {
          for (let dy = -1; dy <= 1; dy++) {
            if (randY + dy >= 0 && randY + dy < this.gridY) {
              if (this.gameGridValues[randY + dy][randX + dx] != -1) {
                this.gameGridValues[randY + dy][randX + dx]++;
              }
            }
          }
        }
      }
      gameObj.gameGridReveal[randY][randX] = 1;
    }
  },

  calculateRemainingSquares: function () {
    this.remainingSquares = this.gridX * this.gridY - this.numOfMines;
  },

  // Render Methods
  renderGameGrid: function () {
    for (y = 0; y < this.gridY; y++) {
      let valueRow = [];
      let revealRow = [];
      for (x = 0; x < this.gridX; x++) {
        valueRow.push(0);
        revealRow.push(0);
        let square = document.createElement("div");
        square.classList.add("square");
        square.id = y + "," + x;
        this.gameGridDOM.appendChild(square);
      }
      this.gameGridValues.push(valueRow);
      this.gameGridReveal.push(revealRow);
    }
  },

  // Event Handlers
};

gameObj.initialize();
