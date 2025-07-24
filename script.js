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

    // Add event listener for the new close button on the win message
    const closeWinMessageButton = document.getElementById("close-win-message");
    if (closeWinMessageButton) {
      console.log("DEBUG: Close button found, attaching listener."); // DEBUG
      closeWinMessageButton.addEventListener("click", () => {
        console.log("DEBUG: Close button clicked!"); // DEBUG
        this.ui.hideWinMessage();
      });
    } else {
      console.error("DEBUG: Close button NOT found!"); // DEBUG
    }

    // Make win message draggable
    const winMessageElement = document.getElementById("win-message");
    let isDragging = false;
    let offsetX, offsetY;

    if (winMessageElement) {
      console.log("DEBUG: Win message element found for dragging."); // DEBUG
      // Mouse events
      winMessageElement.addEventListener("mousedown", (e) => {
        console.log("DEBUG: winMessage mousedown event"); // DEBUG
        if (
          e.target.id === "play-again" ||
          e.target.id === "close-win-message" ||
          e.target.closest(".message-content")
        ) {
          console.log("DEBUG: Drag prevented on button/content."); // DEBUG
          return;
        }
        isDragging = true;
        offsetX = e.clientX - winMessageElement.getBoundingClientRect().left;
        offsetY = e.clientY - winMessageElement.getBoundingClientRect().top;
        winMessageElement.style.cursor = "grabbing";
        console.log("DEBUG: Dragging started."); // DEBUG
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        winMessageElement.style.left = `${e.clientX - offsetX}px`;
        winMessageElement.style.top = `${e.clientY - offsetY}px`;
        winMessageElement.style.transform = "none";
      });

      document.addEventListener("mouseup", () => {
        if (isDragging) {
          console.log("DEBUG: Dragging ended."); // DEBUG
          isDragging = false;
          winMessageElement.style.cursor = "grab";
        }
      });

      // Touch events
      winMessageElement.addEventListener(
        "touchstart",
        (e) => {
          console.log("DEBUG: winMessage touchstart event"); // DEBUG
          if (
            e.target.id === "play-again" ||
            e.target.id === "close-win-message" ||
            e.target.closest(".message-content")
          ) {
            console.log("DEBUG: Drag prevented on button/content (touch)."); // DEBUG
            return;
          }
          isDragging = true;
          const touch = e.touches[0];
          offsetX =
            touch.clientX - winMessageElement.getBoundingClientRect().left;
          offsetY =
            touch.clientY - winMessageElement.getBoundingClientRect().top;
          console.log("DEBUG: Dragging started (touch)."); // DEBUG
        },
        { passive: false }
      );

      document.addEventListener(
        "touchmove",
        (e) => {
          if (!isDragging) return;
          e.preventDefault();
          const touch = e.touches[0];
          winMessageElement.style.left = `${touch.clientX - offsetX}px`;
          winMessageElement.style.top = `${touch.clientY - offsetY}px`;
          winMessageElement.style.transform = "none";
        },
        { passive: false }
      );

      document.addEventListener("touchend", () => {
        if (isDragging) {
          console.log("DEBUG: Dragging ended (touch)."); // DEBUG
          isDragging = false;
        }
      });
    } else {
      console.error("DEBUG: Win message element NOT found for dragging!"); // DEBUG
    }

    window.addEventListener("resize", () => {
      this.board.createBoard();
      // Redraw current game state
      this.board.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== 0) {
            this.board.updateCell(rowIndex, colIndex, cell);
          }  // test comment added to line 170
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
