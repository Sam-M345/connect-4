// Constants and initial setup
const board = document.getElementById("board");
const playerIndicator = document.getElementById("player-indicator");
const resetButton = document.getElementById("reset-button");

let currentPlayer = 1; // 1 for human, 2 for AI
let gameBoard = Array(6)
  .fill()
  .map(() => Array(7).fill(0));
let gameActive = true;

// Winner Message setup
const winnerMessage = document.createElement("div");
winnerMessage.id = "winner-message";
winnerMessage.style.display = "none";
winnerMessage.style.position = "absolute";
winnerMessage.style.top = "0";
winnerMessage.style.left = "50%";
winnerMessage.style.transform = "translateX(-50%)";
winnerMessage.style.zIndex = "1001";
winnerMessage.style.color = "white";
winnerMessage.style.padding = "8px 16px";
winnerMessage.style.borderRadius = "10px";
winnerMessage.style.fontSize = "20px";
winnerMessage.style.textAlign = "center";
winnerMessage.style.whiteSpace = "nowrap";
document.body.insertBefore(winnerMessage, document.body.firstChild);

// AI Configuration
const MAX_DEPTH = 5;
const AI_MOVE_TIME = 1000; // 1.0 second for each AI move
let startTime;

function createBoard() {
  // No need to calculate cellSize here as the CSS handles responsiveness
  for (let col = 0; col < 7; col++) {
    const column = document.createElement("div");
    column.classList.add("column");
    column.dataset.col = col;
    column.addEventListener("click", () => dropPiece(col));
    column.addEventListener("mouseenter", () => showHandIcon(col));
    column.addEventListener("mouseleave", hideHandIcon);

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
  if (!gameActive || currentPlayer !== 1) return; // Only allow human moves when it's their turn

  const row = makeMove(col);
  if (row !== -1) {
    if (!checkWin(row, col)) {
      if (!isBoardFull(gameBoard)) {
        currentPlayer = 2; // Switch to AI player
        updatePlayerIndicator();
        setTimeout(makeAIMove, 500); // Delay AI move for better UX
      } else {
        gameActive = false;
        showDrawMessage();
      }
    }
  }
}

function makeMove(col) {
  for (let row = 5; row >= 0; row--) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] = currentPlayer;
      updateCell(row, col);
      return row; // Return the row where the piece was placed
    }
  }
  return -1; // Column is full
}

function updateCell(row, col) {
  const cellElement = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  cellElement.classList.add(`player${currentPlayer}`);
  const playerColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(`--player${currentPlayer}-color`);
  cellElement.style.backgroundColor = playerColor;
}

function makeAIMove() {
  if (!gameActive) return;

  startTime = Date.now();
  const bestMove = findBestMove(gameBoard);

  if (bestMove !== null) {
    // Ensure AI always takes 1.0 second before making a move
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, AI_MOVE_TIME - elapsedTime);

    setTimeout(() => {
      const row = makeMove(bestMove);
      if (row !== -1) {
        if (!checkWin(row, bestMove)) {
          if (!isBoardFull(gameBoard)) {
            currentPlayer = 1; // Switch back to human player
            updatePlayerIndicator();
          } else {
            gameActive = false;
            showDrawMessage();
          }
        }
      }
    }, remainingTime);
  } else {
    gameActive = false;
    showDrawMessage();
  }
}

function findBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let col = 0; col < 7; col++) {
    if (isValidMove(board, col)) {
      const row = getNextOpenRow(board, col);
      board[row][col] = 2; // AI player
      const score = minimax(board, 0, false, -Infinity, Infinity);
      board[row][col] = 0; // Undo move

      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  if (checkWinForPlayer(board, 2)) return 100 - depth;
  if (checkWinForPlayer(board, 1)) return -100 + depth;
  if (isBoardFull(board)) return 0;
  if (depth >= MAX_DEPTH) return evaluateBoard(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let col = 0; col < 7; col++) {
      if (isValidMove(board, col)) {
        const row = getNextOpenRow(board, col);
        board[row][col] = 2;
        const score = minimax(board, depth + 1, false, alpha, beta);
        board[row][col] = 0;
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let col = 0; col < 7; col++) {
      if (isValidMove(board, col)) {
        const row = getNextOpenRow(board, col);
        board[row][col] = 1;
        const score = minimax(board, depth + 1, true, alpha, beta);
        board[row][col] = 0;
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
    }
    return minScore;
  }
}

function isValidMove(board, col) {
  return board[0][col] === 0;
}

function getNextOpenRow(board, col) {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) return row;
  }
  return -1;
}

function isBoardFull(board) {
  return board[0].every((cell) => cell !== 0);
}

function checkWinForPlayer(board, player) {
  // Check horizontal locations
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] === player &&
        board[row][col + 1] === player &&
        board[row][col + 2] === player &&
        board[row][col + 3] === player
      ) {
        return true;
      }
    }
  }
  // Check vertical locations
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        board[row][col] === player &&
        board[row + 1][col] === player &&
        board[row + 2][col] === player &&
        board[row + 3][col] === player
      ) {
        return true;
      }
    }
  }
  // Check positively sloped diagonals
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] === player &&
        board[row + 1][col + 1] === player &&
        board[row + 2][col + 2] === player &&
        board[row + 3][col + 3] === player
      ) {
        return true;
      }
    }
  }
  // Check negatively sloped diagonals
  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] === player &&
        board[row - 1][col + 1] === player &&
        board[row - 2][col + 2] === player &&
        board[row - 3][col + 3] === player
      ) {
        return true;
      }
    }
  }
  return false;
}

function evaluateBoard(board) {
  let score = 0;
  const AI_PLAYER = 2;
  const HUMAN_PLAYER = 1;

  // Evaluate center column
  const centerArray = board.map((row) => row[3]);
  const centerCount = centerArray.filter((cell) => cell === AI_PLAYER).length;
  score += centerCount * 3;

  // Evaluate horizontal, vertical, and diagonal lines
  for (let row = 0; row < 6; row++) {
    const rowArray = board[row];
    for (let col = 0; col < 7; col++) {
      if (col <= 3) {
        // Horizontal
        const window = rowArray.slice(col, col + 4);
        score += evaluateWindow(window, AI_PLAYER);
      }
      if (row <= 2) {
        // Vertical
        const window = [
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col],
        ];
        score += evaluateWindow(window, AI_PLAYER);
      }
      if (row <= 2 && col <= 3) {
        // Diagonal down-right
        const window = [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3],
        ];
        score += evaluateWindow(window, AI_PLAYER);
      }
      if (row >= 3 && col <= 3) {
        // Diagonal up-right
        const window = [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3],
        ];
        score += evaluateWindow(window, AI_PLAYER);
      }
    }
  }
  return score;
}

function evaluateWindow(window, player) {
  let score = 0;
  const opponent = player === 1 ? 2 : 1;
  const playerCount = window.filter((cell) => cell === player).length;
  const emptyCount = window.filter((cell) => cell === 0).length;
  const opponentCount = window.filter((cell) => cell === opponent).length;

  if (playerCount === 4) {
    score += 100;
  } else if (playerCount === 3 && emptyCount === 1) {
    score += 5;
  } else if (playerCount === 2 && emptyCount === 2) {
    score += 2;
  }

  if (opponentCount === 3 && emptyCount === 1) {
    score -= 4;
  }

  return score;
}

function checkWin(row, col) {
  const directions = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonal down-right
    [1, -1], // Diagonal down-left
  ];

  const player = gameBoard[row][col];

  for (let [dx, dy] of directions) {
    let count = 1; // Start with 1 (the current piece)

    // Check in the positive direction
    let r = row + dx;
    let c = col + dy;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === player) {
      count++;
      r += dx;
      c += dy;
    }

    // Check in the negative direction
    r = row - dx;
    c = col - dy;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === player) {
      count++;
      r -= dx;
      c -= dy;
    }

    // Check if we have 4 or more in a row
    if (count >= 4) {
      gameActive = false;
      showWinnerMessage(player); // Pass the player number (1 for human, 2 for AI)
      return true;
    }
  }

  return false;
}

function resetGame() {
  // Reset the game state
  gameBoard = Array(6)
    .fill()
    .map(() => Array(7).fill(0));
  currentPlayer = 1; // Always start with the human player
  gameActive = true;

  // Clear all discs from the board
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.style.backgroundColor = ""; // Remove any inline background color
  });

  // Update the player indicator
  updatePlayerIndicator();

  // Hide winner message
  hideWinnerMessage();
}

function showHandIcon(col) {
  const columnElement = document.querySelector(`.column[data-col="${col}"]`);
  const rect = columnElement.getBoundingClientRect();
  handIcon.style.left = `${rect.left + rect.width / 2 - 12}px`; // Center the 24px wide icon
  handIcon.style.top = `${rect.top - 30}px`; // Position it slightly higher to accommodate larger size
  handIcon.style.display = "block";
}

function hideHandIcon() {
  handIcon.style.display = "none";
}

function showWinnerMessage(winningPlayer) {
  const isHuman = winningPlayer === 1;
  const backgroundColor = isHuman ? "#0000FF" : "#FF0000"; // Blue or Red

  winnerMessage.textContent = isHuman ? "👨🏻 Human wins!" : "🤖 AI Wins!";
  winnerMessage.style.backgroundColor = backgroundColor;
  winnerMessage.style.color = "white"; // Ensure text is always visible
  winnerMessage.style.display = "block";
  winnerMessage.style.fontSize = "40px"; // Make the font size twice as big
  winnerMessage.style.padding = "16px 32px"; // Increase padding to accommodate larger text

  console.log("Winner message shown:", winnerMessage.textContent);
}

function hideWinnerMessage() {
  winnerMessage.style.display = "none";
  winnerMessage.style.fontSize = "20px"; // Reset to original size
  winnerMessage.style.padding = "8px 16px"; // Reset to original padding
}

function updatePlayerIndicator() {
  const playerText = document.getElementById("player-text");
  playerIndicator.className = `player${currentPlayer}`;
  playerText.textContent = currentPlayer === 1 ? "Human" : "AI";
}

// Call this function on window resize
window.addEventListener("resize", () => {
  board.innerHTML = ""; // Clear the board
  createBoard(); // Recreate the board
  updateBoard(); // Update the board state
});

function updateBoard() {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cellElement = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      const cellValue = gameBoard[row][col];
      cellElement.className = "cell"; // Reset class
      if (cellValue !== 0) {
        cellElement.classList.add(`player${cellValue}`);
        const playerColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue(`--player${cellValue}-color`);
        cellElement.style.backgroundColor = playerColor;
      } else {
        cellElement.style.backgroundColor = ""; // Clear color
      }
    }
  }
}

createBoard();
updatePlayerIndicator();
resetButton.addEventListener("click", resetGame);

// Function to handle draw scenarios
function showDrawMessage() {
  gameActive = false;
  winnerMessage.textContent = "It's a draw!";
  winnerMessage.style.backgroundColor = "#888"; // Grey color for draw
  winnerMessage.style.color = "white";
  winnerMessage.style.display = "block";
  console.log("The game is a draw!");
}
