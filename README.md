# General Assembly - Peter Banh - SEI Project 1

The purpose of this document is to detail the first project of the General Assembly's Software Engineering Immserive Program from student Peter Banh of cohort 32.

To do so, the documment will cover the following:

1. [Introdution](##1.-Introduction)
2. [Project Requirements](##2.-Project-Requirements)
3. [Game Chosen: Minesweeper](##3.-Game-Chosen:-Minesweeper)
4. [Wireframe](##4.-Wireframe)
5. [Psuedocode](##5.-Psuedocode)
6. [Technologies Used](##6.-Technologies-Used)
7. [Project Content](##7.-Project-Content)
8. [Getting Started](##8.-Getting-Started)
9. [Discussion on Development](##9.-Discussion-on-Development)
10. [Next Steps](##10.-Next-Steps)

<a name="intro"></a>
## 1. Introduction

To showcase the Fundamentals of Front-End Development learned in the first few weeks of General Assmebly's Software Engineering Immersive Program, each student is create a browser based game as their first project.

The browser based game will be based on most, if not all, of the following:
- Fundamentals of JavaScript
- Fundamentals of HTML
- Fundamentals of CSS
- DOM Manipulation
- Event Handling
- MVC Model
- CS Flexbox, Grid and Responsive Design
- Callback Functions
- Classes
- jQuery
- 'this' keyword
- Array Iterator Methods

The game shall also meet the technical requirements as specifieid in the [project requirements](https://git.generalassemb.ly/sei-toronto/sei-4/blob/master/projects/project-1/project-1-requirements.md) detailed in section 2 of this document.

## 2. Project Requirements
As per the [projects-1-requirements](https://git.generalassemb.ly/sei-toronto/sei-4/blob/master/projects/project-1/project-1-requirements.md) project 1 shall:
- Render a game in the browser
- Include win/loss logic and render win/loss messages in HTML. Popup alerts using the alert() method are okay during development, but not production.
- Include separate HTML, CSS & JavaScript files.
- Have properly indented HTML, CSS & JavaScript. In addition, vertical whitespace needs to be consistent.
- Have no remaining dead and/or commented out code (code that will never be called).
 - Have functions and variables that are named sensibly. Remember, functions are typically named as verbs and variables (data) named as nouns.
 - Be coded in a consistent manner. For example, choose between your preference for function declarations vs. function expressions.
 - Be deployed online using GitHub Pages so that the rest of the world can play the game!
- Be one of the following games unless specified:
  - Hangman
  - War
  - Blackjack
  - Simon
  - Connect Four
  - Slot Machine
  - Mancala
  - Minesweeper
  - Roulette
  - Video Poker
  - Checkers
  - Solitaire
  - Battleship

## 3. Game Chosen: Minesweeper
The game chosen for the completion of project 1 will be Minesweeper. Minesweeper is a puzzle video game originating in the 1960's where the objectives are the following:
 - A player must uncover all cells of a rectangular grid while using hints provided to avoid mines that are also hidden in the rectangular grid. The hints are provided in the form of a number in a cell dictating how many mines are surrounding that one particular cell (the cells that form a 3x3 square with the particular cell in the middle). 
 - Uncover all the non-mine cells as fast as possible

 The duration of the game and number of mines will be visible to the player.
 
 Depending on the difficulty, the size of the grid and the number of mines will vary. If the player uncovers a mine, they will lose the game and will be forced to reset.

 ![Image of Minesweeper](https://assets.rockpapershotgun.com/images/2018/09/ys28fd6a6tuz.png/RPSS/resize/760x-1/format/jpg/quality/90)

The browser based game will be made as close as possible to the description above, and similiar to what is being depicted above. 

If time is not a constraint, the following features will also be added to the browser based game in the following order:
- Two player mode where the objective is reversed, and the player must find the most mines. The player will take turns uncovering the cells to look for mines. If a mine is found the player will be allowed to continue their turn, if no mine is found the player turn will end and the next player will be allowed to uncover mines.
- Abilities in the two player mode that will allow one player to disrupt the other player's ability to find mines.
- An AI to play against the player

## 4. Wireframe
Mockups for the browser based game for one player and two players are shown below. 

### Player 1
![Web 1920 Player 1 Mockup](Wireframes/Web1920P1.jpg)
![Web 1280 Player 1 Mockup](Wireframes/Web1280P1.jpg)
![Mobile iPhone 11 Player 1 Mockup](Wireframes/iPhoneX-XS-11ProP1.jpg)

### Player 2
![Web 1920 Player 1 Mockup](Wireframes/Web1920P2.jpg)
![Web 1280 Player 1 Mockup](Wireframes/Web1280P2.jpg)
![Mobile iPhone 11 Player 1 Mockup](Wireframes/iPhoneX-XS-11ProP2.jpg)

Players will be interacting mainly with the grid that is centered in the middle of the screen. There will also be a menu for the player to interact with in the top right to change difficulty.

Win/loss messages are not included in this mockup but will appear in the middle of the screen.

Considering the scope of the project, the design of the game will take a computer screen first approach considering the game is intended first.

## 5. Psuedocode

### Initialize State & Class
- Declare Play Class. This will have
  - Flag colour

- Declare GameObj Object. This will have:
  - Game Grid - DOM Node 
  - Timer - DOM Node
  - Game Difficulty Selected - String - Easy, Normal and Hard
  - Game Difficulty Settings - Obj - Grid size and number of mines
  - Grid X Value - Number
  - Grid Y Value - Number
  - Number of Mines - Number
  - Game Grid Values - 2D Array -  State of every cell, whether it's a mine, or empty or a number.
  - Game Grid Reveal Status - 2D Array - Array of 0 or 1 values indicating reveal status
  - Remaining Squares left to unreveal - Number.
  - Time Spent - Number - Starts with 0.
  - Game Status - Number - 0 implies ongoing, 1 implies done

### Update State Functions
- Mine/Number Generator Function - Takes in settings and then randomizes coordinates of mines and inputs it into Game Grid Values.
- Update Reveal Status Function - Takes in coordiantes and updates that coordiante in the Game Grid Reveal Status. Then runs the re-render number square and ubtract one from the remaing squares to reveal state and check if it equal to 0, if it is run the render win/loss function.
- Flood fill Function - Takes in one coordinate of empty cell, checks all neighbouring cells. When it finds a neighbouring cell:
  - If it is a empty cell and not revealed, reveal it, and then send that coordinate to the flood fill function.
  - If it is a empty cell but revealed, leave it.
  - If it is a number cell but not revealed, reveal it.
  - If it is a number cell but reveaeld, leave it.
- Update Time Function - Add 1 second to the current time 
- Reset Function - Delete the current game grid, and add another one, and then re run initialization. For adding the event handlers. Previous event handlers can be added over top the other one with onclick. We only need one function.

### Initialization Function
- Runs the render squares function
- Runs the Mine/Number Generator 
- Runs the render function
- Adds Event Handler to Grid DOM for buttons click.

### Render Functions
- Render squares in the rectangular grid.
  - Use a for loop
  - Each square requires an id with x,y coodinates
  - At the same time creates the two grids for reveal status and grid values
  - Lastly sets the number of squares left to reveal. This should be equal to gridx*gridy - number of mines.

- Re-render square
  - Takes in a number and id, find DOM element with corresponding id, and change class and update text to show the number.

- Render Timer
  - Constantly re-rendered to show time

- Render Mine
  - Render the number of mines

- Render Win/Loss
  - Render window to show Win/Lose
  - Checks the remaining squares to determine if win/loss.
  - Depending on the status, show all mines as red, or show all mines as green.
  - Window will have button to reset

### Event Handler
- Attach event listener to div holding all squares. This will be a delegated event listener. The listener will take the id of the square that was clicked and check if these coordinates are in the Mine and Numbers Location.
  - If time in the gameObj is 0, then start the timer interval.
  - If it is mine run the win/loss function. 
  - If it is number, re-render square. 
  - If it empty run the flood fill to find all neighbouring empty cells. All these functions shall update the reveal grid.
- Attach event listener to a reset button. Render all squares again. and run mine/number generator for a new mine/number layout. Also reset the time.

### Function Interval
- Run Update Time Function every second and then run render timer function.

## 6. Technologies Used
In order to make the browser based game with the following requirements and pseudo code, the following technologies were used:
- HTML
  - User interface
- CSS
  - Style interface
  - Provide responsiveness to screen size with media queries
  - Add animation to the game
- JavaScript
  - Create game state
  - Provide functionality and logic for the game to work
  - Manipulate DOM elements
  - Provide responsiveness to screen size.

## 7. Working Version of Project: Minesweeper - Mario NES Edition
Based on the requirements and details above, a working version of the browser based game was completed and the game was designed to have a Mario NES theme.

Screenshot of the game in progress.
![Image of the Minesweeper Game](README-Images/Screenshot.JPG)

Screenshot of the losing screen

As shown above, the working project deviates from the mockup slightly, having the setting button move to left and a music button to the right.

This project consists of the following:
- index.html - The main page that users will interact with
- style.css - The style for the main page
- main.js - The code for the minesweeper game
- /Sounds - Folder containing the sound effects of the game
- /Images - Folder containing the images used in the game

## 8. Getting Started
To play, access the browser based game here: 

https://banhpete.github.io/SEI-Project-Minesweeper/

No special required to play the game. 

For anyone looking to play the game locally, for the repository and open up the index.html file, no special instructions required.

## 9. Discussion on Development
To be added.
## 10. Next Steps
To be added.