import { Board } from "./game/board.js";
import { GameLogic } from "./game/gameLogic.js";
import { UI } from "./game/ui.js";
import { makeAIMove } from "./game/ai.js";

let lastClickTime = 0;
const CLICK_DELAY = 2000; // 2 seconds in milliseconds

class Game {
  constructor() {
    this.board = new Board();
    this.ui = new UI();
    this.gameLogic = new GameLogic(this.board, this.ui);
    this.aiStartButton = document.getElementById("ai-start-button");

    this.initializeGame();
  }

  initializeGame() {
    this.board.createBoard();
    this.ui.updatePlayerIndicator(1);

    // Event Listeners
    this.board.element.addEventListener("click", async (e) => {
      const now = Date.now();
      if (now - lastClickTime < CLICK_DELAY) {
        // Ignore the click if it's within the delay period
        return;
      }
      lastClickTime = now; // Update the last click time

      const column = e.target.closest(".column");
      if (!column) return;

      const col = parseInt(column.getAttribute("data-col"));
      await this.handlePlayerMove(col);
    });

    document
      .getElementById("reset-button")
      .addEventListener("click", () => this.gameLogic.reset());

    document
      .getElementById("play-again")
      .addEventListener("click", () => this.gameLogic.reset());

    // Add AI Start button listener
    this.aiStartButton.addEventListener("click", async () => {
      this.gameLogic.reset();
      this.aiStartButton.disabled = true;

      // Make AI play first
      this.gameLogic.currentPlayer = 2;
      this.ui.updatePlayerIndicator(2);

      setTimeout(async () => {
        const aiCol = makeAIMove(this.board.grid);
        await this.gameLogic.handleMove(aiCol);
        this.aiStartButton.disabled = false;
      }, 500);
    });

    window.addEventListener("resize", () => {
      this.board.createBoard();
      // Redraw current game state
      this.board.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== 0) {
            this.board.updateCell(rowIndex, colIndex, cell);
          }
        });
      });
    });
  }

  async handlePlayerMove(col) {
    if (await this.gameLogic.handleMove(col)) {
      if (this.gameLogic.gameActive && this.gameLogic.currentPlayer === 2) {
        this.aiStartButton.disabled = true;
        // AI's turn
        setTimeout(async () => {
          const aiCol = makeAIMove(this.board.grid);
          await this.gameLogic.handleMove(aiCol);
          this.aiStartButton.disabled = false;
        }, 500);
      }
    }
  }
}

// Start the game when the page loads
window.addEventListener("load", () => {
  new Game();

  // If ocean theme is active, set root variables for JS compatibility
  if (document.body.classList.contains("ocean-theme")) {
    document.documentElement.style.setProperty("--player1-color", "#00008b"); // Ocean P1
    document.documentElement.style.setProperty("--player2-color", "#FF0000"); // Solid Red
  }
});
