class player {
  constructor() {
    flagcolor = "red";
  }
}

var gameObj = {
  //state
  gameDifficultySettings: {
    Easy: {
      gridx: 10,
      gridy: 8,
      mines: 10,
    },
    Normal: {
      gridx: 18,
      gridy: 14,
      mines: 40,
    },
    Hard: {
      gridx: 24,
      gridy: 20,
      mines: 99,
    },
  },
  gridx: 18,
  gridy: 14,
  mines: 40,
  gameGrid: document.getElementById("game-grid"),
  mineAndNumberLocations: {},

  //Initialize
  initialize: function () {
    this.mineGenerator();
    this.numberGenerator();
    this.RenderGameGrid();
  },

  //Update State Methods
  mineGenerator: function () {
    for (let mine = 0; mine < this.mines; mine++) {
      let coordinates =
        Math.floor(Math.random() * this.gridx) +
        "," +
        Math.floor(Math.random() * this.gridy);
      while (this.mineAndNumberLocations[coordinates]) {
        coordinates =
          Math.floor(Math.random() * this.gridx) +
          "," +
          Math.floor(Math.random() * this.gridy);
      }
      this.mineAndNumberLocations[coordinates] = 0;
    }
  },
  numberGenerator: function () {
    let mineLocations = Object.keys(this.mineAndNumberLocations);
    mineLocations.forEach(function (coordinates) {
      coordinates = coordinates.split(",");
      let x = parseInt(coordinates[0]);
      let y = parseInt(coordinates[1]);
      for (let xin = -1; xin <= 1; xin++) {
        let newx = x - xin;
        if (newx >= 0 && newx < gameObj.gridx) {
          for (yin = -1; yin <= 1; yin++) {
            let newy = y - yin;
            if (newy >= 0 && newy < gameObj.gridy) {
              let newcoordinates = newx + "," + newy;
              if (gameObj.mineAndNumberLocations[newcoordinates] !== 0) {
                if (gameObj.mineAndNumberLocations[newcoordinates]) {
                  gameObj.mineAndNumberLocations[newcoordinates]++;
                } else {
                  gameObj.mineAndNumberLocations[newcoordinates] = 1;
                }
              }
            }
          }
        }
      }
    });
  },
  // Render Methods
  RenderGameGrid: function () {
    for (y = 0; y < this.gridy; y++) {
      for (x = 0; x < this.gridx; x++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.id = y + "," + x;
        if (!isNaN(this.mineAndNumberLocations[x + "," + y])) {
          square.innerText = this.mineAndNumberLocations[x + "," + y];
        }
        this.gameGrid.appendChild(square);
      }
    }
  },
};

gameObj.initialize();
