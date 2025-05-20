export class GameLogic {
  constructor(board, ui) {
    this.board = board;
    this.ui = ui;
    this.currentPlayer = 1;
    this.gameActive = true;
  }

  checkWin(row, col) {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal right
      [1, -1], // diagonal left
    ];

    return directions.some(([dx, dy]) => {
      let count = 1;

      // Check both directions
      for (const multiplier of [1, -1]) {
        for (let i = 1; i < 4; i++) {
          const newRow = row + dx * i * multiplier;
          const newCol = col + dy * i * multiplier;

          if (
            this.isValidPosition(newRow, newCol) &&
            this.board.grid[newRow][newCol] === this.currentPlayer
          ) {
            count++;
          } else {
            break;
          }
        }
      }

      return count >= 4;
    });
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 6 && col >= 0 && col < 7;
  }

  async handleMove(col) {
    if (!this.gameActive || !this.board.isValidMove(col)) {
      return false;
    }

    // Hide AI start button after first move
    document.getElementById("ai-start-button").classList.add("hidden");

    const row = this.board.makeMove(col, this.currentPlayer);
    await this.board.updateCell(row, col, this.currentPlayer);

    if (this.checkWin(row, col)) {
      this.gameActive = false;
      this.ui.showWinMessage(this.currentPlayer === 1 ? "Human" : "AI");
      return true;
    }

    if (this.board.isFull()) {
      this.gameActive = false;
      this.ui.showWinMessage("Draw");
      return true;
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.ui.updatePlayerIndicator(this.currentPlayer);
    return true;
  }

  reset() {
    this.board.reset();
    this.currentPlayer = 1;
    this.gameActive = true;
    this.ui.updatePlayerIndicator(this.currentPlayer);
    this.ui.hideWinMessage();

    // Show AI start button when game is reset
    const aiStartButton = document.getElementById("ai-start-button");
    aiStartButton.classList.remove("hidden");
    aiStartButton.disabled = false;
  }
}
