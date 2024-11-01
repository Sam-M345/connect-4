import * as Board from "./game/board.js";
import { makeAIMove } from "./game/ai.js";
import * as GameLogic from "./game/gameLogic.js";
import * as UI from "./game/ui.js";

// Constants and initial setup
const board = document.getElementById("board");
const playerIndicator = document.getElementById("player-indicator");
const resetButton = document.getElementById("reset-button");

let currentPlayer = 1;
let gameBoard = Array(6)
  .fill()
  .map(() => Array(7).fill(0));
let gameActive = true;

// Initialize game
Board.createBoard();
UI.updatePlayerIndicator();
resetButton.addEventListener("click", GameLogic.resetGame);

// Handle window resize
window.addEventListener("resize", () => {
  board.innerHTML = "";
  Board.createBoard();
  Board.updateBoard();
});

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = ""; // Clear existing content

  // Create 7 columns
  for (let col = 0; col < 7; col++) {
    const column = document.createElement("div");
    column.className = "column";
    column.setAttribute("data-col", col);

    // Add click event listener to the column
    column.addEventListener("click", () => {
      console.log("Column clicked:", col); // Debug log
      dropPiece(col);
    });

    // Create 6 cells for each column
    for (let row = 0; row < 6; row++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-row", row);
      cell.setAttribute("data-col", col);
      column.appendChild(cell);
    }

    board.appendChild(column);
  }
}

// Call createBoard when the page loads
window.addEventListener("load", createBoard);

function dropPiece(col) {
  if (!gameActive || currentPlayer !== 1) {
    console.log("Game not active or not human turn");
    return;
  }

  const row = makeMove(col);
  if (row !== -1) {
    if (checkWin(row, col)) {
      gameActive = false;
      showWinMessage("Human");
      return;
    }

    if (!isBoardFull(gameBoard)) {
      currentPlayer = 2; // Switch to AI player
      updatePlayerIndicator();

      setTimeout(() => {
        const aiCol = makeAIMove(gameBoard);
        const aiRow = makeMove(aiCol);
        if (aiRow !== -1) {
          if (checkWin(aiRow, aiCol)) {
            gameActive = false;
            showWinMessage("AI");
          } else {
            currentPlayer = 1; // Switch back to human
            updatePlayerIndicator();
          }
        }
      }, 500);
    } else {
      gameActive = false;
      showWinMessage("Draw");
    }
  }
}

function isBoardFull(board) {
  return board[0].every((cell) => cell !== 0);
}

function updatePlayerIndicator() {
  const playerText = document.getElementById("player-text");
  const playerIndicator = document.getElementById("player-indicator");

  if (currentPlayer === 1) {
    playerText.textContent = "Human 🙂";
    playerIndicator.className = "player1";
    playerIndicator.style.backgroundColor = "var(--player1-color)";
  } else {
    playerText.textContent = "AI 🤖";
    playerIndicator.className = "player2";
    playerIndicator.style.backgroundColor = "var(--player2-color)";
  }
}

function checkWin(row, col) {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal right
    [1, -1], // diagonal left
  ];

  for (const [dx, dy] of directions) {
    let count = 1;

    // Check in positive direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (
        newRow < 0 ||
        newRow >= 6 ||
        newCol < 0 ||
        newCol >= 7 ||
        gameBoard[newRow][newCol] !== currentPlayer
      ) {
        break;
      }
      count++;
    }

    // Check in negative direction
    for (let i = 1; i < 4; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (
        newRow < 0 ||
        newRow >= 6 ||
        newCol < 0 ||
        newCol >= 7 ||
        gameBoard[newRow][newCol] !== currentPlayer
      ) {
        break;
      }
      count++;
    }

    if (count >= 4) return true;
  }

  return false;
}

document.getElementById("reset-button").addEventListener("click", () => {
  gameBoard = Array(6)
    .fill()
    .map(() => Array(7).fill(0));
  currentPlayer = 1;
  gameActive = true;
  updatePlayerIndicator();

  // Clear all cells
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.className = "cell";
    cell.style.backgroundColor = "";
  });
});

window.addEventListener("load", () => {
  createBoard();
  currentPlayer = 1;
  updatePlayerIndicator();
});

function makeMove(col) {
  for (let row = 5; row >= 0; row--) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] = currentPlayer; // Use current player's number (1 or 2)
      updateCell(row, col);
      return row;
    }
  }
  return -1;
}

function updateCell(row, col) {
  const cellElement = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );

  // Capture the player color at the start of the move
  const isHumanPlayer = currentPlayer === 1;
  const playerColor = isHumanPlayer
    ? "var(--player1-color)"
    : "var(--player2-color)";
  const playerClass = isHumanPlayer ? "player1" : "player2";

  // Create falling disk with the captured color
  const fallingDisk = document.createElement("div");
  fallingDisk.className = "falling-disk";
  fallingDisk.style.backgroundColor = playerColor;

  // Remove any existing falling disks
  cellElement
    .querySelectorAll(".falling-disk")
    .forEach((disk) => disk.remove());

  // Add the disk to the cell
  cellElement.appendChild(fallingDisk);

  // Force a reflow before adding the falling class
  void fallingDisk.offsetWidth;

  // Add falling class to trigger animation
  requestAnimationFrame(() => {
    fallingDisk.classList.add("falling");
  });

  fallingDisk.addEventListener(
    "animationend",
    () => {
      fallingDisk.remove();
      cellElement.className = `cell ${playerClass}`;
      cellElement.style.backgroundColor = playerColor;
    },
    { once: true }
  );
}

// Add these functions to handle the win message
function showWinMessage(winner) {
  const winMessage = document.getElementById("win-message");
  const winnerText = document.getElementById("winner-text");

  // Set message text and class based on winner
  if (winner === "AI") {
    winnerText.textContent = "AI Wins 🤖";
    winMessage.className = "win-message ai-winner";
  } else {
    winnerText.textContent = "Human Wins 🙂";
    winMessage.className = "win-message human-winner";
  }

  winMessage.classList.remove("hidden");
}

function hideWinMessage() {
  const winMessage = document.getElementById("win-message");
  winMessage.classList.add("hidden");
}

// Update the reset functionality
document.getElementById("play-again").addEventListener("click", () => {
  hideWinMessage();
  resetGame();
});

function resetGame() {
  gameBoard = Array(6)
    .fill()
    .map(() => Array(7).fill(0));
  currentPlayer = 1;
  gameActive = true;
  updatePlayerIndicator();

  // Clear all cells
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.className = "cell";
    cell.style.backgroundColor = "white"; // Explicitly set to white
  });
}
