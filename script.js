const board = document.getElementById("board");
const playerIndicator = document.getElementById("player-indicator");
const resetButton = document.getElementById("reset-button");
let currentPlayer = 1;
let gameBoard = Array(6)
  .fill()
  .map(() => Array(7).fill(0));

function createBoard() {
  for (let col = 0; col < 7; col++) {
    const column = document.createElement("div");
    column.classList.add("column");
    column.dataset.col = col;
    column.addEventListener("click", () => dropPiece(col));

    for (let row = 0; row < 6; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      column.appendChild(cell);
    }

    board.appendChild(column);
  }
}

function dropPiece(col) {
  for (let row = 5; row >= 0; row--) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] = currentPlayer;
      updateBoard();
      if (checkWin(row, col)) {
        setTimeout(() => {
          alert(`Player ${currentPlayer} wins!`);
          resetGame();
        }, 100);
      } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerIndicator();
      }
      return; // Exit the function after placing the piece
    }
  }
  // If we get here, the column is full
  alert("This column is full. Try another one!");
}

function updateBoard() {
  for (let col = 0; col < 7; col++) {
    let emptyRow = 5;
    for (let row = 5; row >= 0; row--) {
      const cellElement = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cellElement.className = "cell";
      if (gameBoard[row][col] !== 0) {
        cellElement.classList.add(`player${gameBoard[row][col]}`);
        emptyRow--;
      }
    }
    // Fill empty cells above
    for (let row = emptyRow; row >= 0; row--) {
      const cellElement = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cellElement.className = "cell";
    }
  }
}

function updatePlayerIndicator() {
  playerIndicator.className = `player${currentPlayer}`;
}

function checkWin(row, col) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  return directions.some(([dx, dy]) => {
    return [1, -1].some((direction) => {
      let count = 0;
      let r = row;
      let c = col;

      while (
        r >= 0 &&
        r < 6 &&
        c >= 0 &&
        c < 7 &&
        gameBoard[r][c] === currentPlayer
      ) {
        count++;
        r += dx * direction;
        c += dy * direction;
      }

      return count >= 4;
    });
  });
}

function resetGame() {
  gameBoard = Array(6)
    .fill()
    .map(() => Array(7).fill(0));
  currentPlayer = 1;
  updateBoard();
  updatePlayerIndicator();
}

createBoard();
updatePlayerIndicator();
resetButton.addEventListener("click", resetGame);
