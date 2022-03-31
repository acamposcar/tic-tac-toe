// Global variable
// @ts-check
let playerTurn = true;

function Player(name, mark, lastSelection) {
  let score = 0;
  const getScore = () => score;
  const addWin = () => { score++; };
  const resetScore = () => { score = 0; };
  return {
    name, mark, lastSelection, addWin, getScore, resetScore,
  };
}

const playerOne = Player('Player 1', '✔️');
const playerTwo = Player('Player 2', '❌');

const gameBoard = (() => {
  let gameArray = [];
  let gameFinished = false;
  const getArray = () => gameArray;
  const getGameOver = () => gameFinished;
  const setGameOver = () => { gameFinished = true; };
  const resetBoard = () => {
    gameArray = [];
    gameFinished = false;
  };

  const winner = () => {
    // If winner, return Player, else return false
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

  const play = (player) => {
    // If play is invalid (square is already taken or lastSelection is invalid), return false
    // If play is valid, return true
    if (gameArray[player.lastSelection] || player.lastSelection > 8 || player.lastSelection < 0 || winner() || tie()) {
      return false;
    }
    gameArray[player.lastSelection] = player;
    return true;
  };

  return {
    play, getArray, resetBoard, winner, tie, getGameOver, setGameOver,
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
      square.onclick = () => gameFlow(square.dataset.id);
      board.append(square);
    }
  }

  function updateScore() {
    const scoreOne = document.querySelector('#score-player-one');
    const scoreTwo = document.querySelector('#score-player-two');
    scoreOne.textContent = playerOne.getScore().toString();
    scoreTwo.textContent = playerTwo.getScore().toString();
  }

  function showWinner(player) {
    const result = document.querySelector('#result');
    result.textContent = `The winner is ${player.name}`;
  }

  function showTie() {
    const result = document.querySelector('#result');
    result.textContent = "It's a tie";
  }

  function hideResult() {
    const result = document.querySelector('#result');
    result.textContent = '';
  }

  return {
    updateBoard, showWinner, showTie, hideResult, updateScore,
  };
})();

function gameFlow(square) {
  let player;
  if (playerTurn === true) {
    player = playerOne;
  } else {
    player = playerTwo;
  }

  player.lastSelection = parseInt(square, 10);
  const playIsValid = gameBoard.play(player);

  if (playIsValid) {
    playerTurn = !playerTurn;
    displayController.updateBoard(gameBoard.getArray());
  }

  const winner = gameBoard.winner();
  if (winner && !gameBoard.getGameOver()) {
    winner.addWin();
    displayController.showWinner(winner);
    displayController.updateScore();
    gameBoard.setGameOver();
    return;
  }

  const tie = gameBoard.tie();
  if (tie) {
    displayController.showTie();
  }
}
displayController.updateBoard(gameBoard.getArray());
displayController.updateScore();

document.querySelector('#new-button').addEventListener('click', () => {
  gameBoard.resetBoard();
  displayController.updateBoard(gameBoard.getArray());
  displayController.updateScore();
  displayController.hideResult();
});
