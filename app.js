// Global variable
// @ts-check

function Player(name, mark, lastMove) {
  let score = 0;
  const getScore = () => score;
  const addWin = () => { score++; };
  const resetScore = () => { score = 0; };
  return {
    name, mark, lastMove, addWin, getScore, resetScore,
  };
}

const playerOne = Player('🧑', '✔️');
const playerTwo = Player('👲', '❌');

const gameStatus = (() => {
  // ModeAI = true -> PlayerOne vs AI
  // ModeAI = false -> PlayerOne vs PlayerTwo
  let modeAI = false;
  const getModeAI = () => modeAI;
  const setModeAI = () => { modeAI = true; };
  const resetModeAI = () => { modeAI = false; };

  let playerOneTurn = true;
  const getPlayerOneTurn = () => playerOneTurn;
  const togglePlayerOneTurn = () => { playerOneTurn = !playerOneTurn; };

  let gameOver = false;
  const setGameOver = () => { gameOver = true; };
  const getGameOver = () => gameOver;

  const resetStatus = () => {
    gameOver = false;
    playerOneTurn = true;
  };
  return {
    resetStatus,
    getGameOver,
    setGameOver,
    getPlayerOneTurn,
    togglePlayerOneTurn,
    getModeAI,
    setModeAI,
    resetModeAI,
  };
})();

const gameBoard = (() => {
  let gameArray = [];
  const getArray = () => gameArray;
  const resetBoard = () => { gameArray = []; };

  const winner = () => {
    // If there is a winner, return winner Player, else return false
    if (gameArray[0] && gameArray[0] === gameArray[1] && gameArray[1] === gameArray[2]) {
      return gameArray[0];
    }
    if (gameArray[3] && gameArray[3] === gameArray[4] && gameArray[4] === gameArray[5]) {
      return gameArray[3];
    }
    if (gameArray[6] && gameArray[6] === gameArray[7] && gameArray[7] === gameArray[8]) {
      return gameArray[6];
    }
    if (gameArray[0] && gameArray[0] === gameArray[3] && gameArray[3] === gameArray[6]) {
      return gameArray[0];
    }
    if (gameArray[1] && gameArray[1] === gameArray[4] && gameArray[4] === gameArray[7]) {
      return gameArray[1];
    }
    if (gameArray[2] && gameArray[2] === gameArray[5] && gameArray[5] === gameArray[8]) {
      return gameArray[2];
    }
    if (gameArray[0] && gameArray[0] === gameArray[4] && gameArray[4] === gameArray[8]) {
      return gameArray[0];
    }
    if (gameArray[2] && gameArray[2] === gameArray[4] && gameArray[4] === gameArray[6]) {
      return gameArray[2];
    }
    return false;
  };

  const tie = () => {
    // If tie, return true. If not, return false
    if (!winner() && gameArray.length === 9 && !gameArray.includes(undefined)) {
      return true;
    }
    return false;
  };

  const makeMove = (player) => {
    // If move is invalid (square is already taken or lastMove is invalid), return false
    // If move is valid, save the move and return true
    if (gameArray[player.lastMove] || player.lastMove > 8 || player.lastMove < 0 || winner() || tie()) {
      return false;
    }
    gameArray[player.lastMove] = player;
    return true;
  };

  return {
    makeMove, getArray, resetBoard, winner, tie,
  };
})();

const displayController = (() => {
  function updateBoard(array) {
    const board = document.querySelector('#board');
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.dataset.id = i.toString();
      square.textContent = array[i] ? array[i].mark : '';
      square.onclick = () => gameFlow(square.dataset.id, playerOne, playerTwo);
      board.append(square);
    }
  }

  function updateScore(playerA, playerB) {
    const scoreOne = document.querySelector('#score-player-one');
    const scoreTwo = document.querySelector('#score-player-two');
    scoreOne.textContent = playerA.getScore().toString();
    scoreTwo.textContent = playerB.getScore().toString();
  }

  function updatePlayerEmoji(playerA, playerB) {
    playerB.name = gameStatus.getModeAI() ? '🤖' : '👲';
    document.querySelector('#name-player-one').textContent = playerA.name;
    document.querySelector('#name-player-two').textContent = playerB.name;
  }

  function showPopup(popupElement) {
    setTimeout(() => {
      popupElement.style.display = 'flex';
    }, 300);
    setTimeout(() => {
      popupElement.style.display = 'none';
    }, 3000);
  }

  function showWinner(player) {
    const popupElement = document.querySelector('.popup');
    popupElement.textContent = `The winner is ${player.name}`;
    showPopup(popupElement);
  }

  function showTie() {
    const popupElement = document.querySelector('.popup');
    popupElement.textContent = "It's a tie";
    showPopup(popupElement);
  }

  function hideResult() {
    const result = document.querySelector('#result');
    result.textContent = '';
  }

  return {
    updateBoard, showWinner, showTie, hideResult, updateScore, updatePlayerEmoji,
  };
})();

function gameFlow(move, playerA, playerB) {
  let player;

  // Check if game is already finished
  if (gameStatus.getGameOver()) {
    return;
  }

  // Select current player
  if (gameStatus.getPlayerOneTurn() === true) {
    player = playerA;
  } else {
    player = playerB;
  }

  // Save current player move
  player.lastMove = parseInt(move, 10);

  // Check if current player made a valid move
  const playIsValid = gameBoard.makeMove(player);
  if (playIsValid) {
    if (!gameStatus.getPlayerOneTurn() && gameStatus.getModeAI()) {
      // Delay when playing against AI
      setTimeout(() => displayController.updateBoard(gameBoard.getArray()), 400);
    } else {
      displayController.updateBoard(gameBoard.getArray());
    }
    gameStatus.togglePlayerOneTurn();
  }

  // Check if there is a winner
  const winner = gameBoard.winner();
  if (winner) {
    winner.addWin();
    displayController.showWinner(winner);
    displayController.updateScore(playerA, playerB);
    gameStatus.setGameOver();
    return;
  }

  // Check if there it's a tie
  const tie = gameBoard.tie();
  if (tie) {
    displayController.showTie();
    gameStatus.setGameOver();
    return;
  }

  // AI play: recursion until some random move is valid
  // AI always plays on PlayerTwo
  if (gameStatus.getModeAI() && !gameStatus.getPlayerOneTurn()) {
    const randomMove = Math.floor(Math.random() * 8);
    gameFlow(randomMove, playerA, playerB);
  }
}

function initiateGame() {
  gameBoard.resetBoard();
  gameStatus.resetStatus();
  displayController.updateBoard(gameBoard.getArray());
  displayController.updateScore(playerOne, playerTwo);
  displayController.hideResult();
  displayController.updatePlayerEmoji(playerOne, playerTwo);
}

function changePlayer(checkbox) {
  const setMode = checkbox.checked ? gameStatus.setModeAI : gameStatus.resetModeAI;
  setMode();
  playerOne.resetScore();
  playerTwo.resetScore();
}

document.querySelector('#new-button').addEventListener('click', () => {
  initiateGame();
});

const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('click', () => {
  changePlayer(checkbox);
  initiateGame();
});

initiateGame();
