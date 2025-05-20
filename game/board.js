export class Board {
  constructor() {
    this.grid = Array(6)
      .fill()
      .map(() => Array(7).fill(0));
    this.element = document.getElementById("board");
  }

  createBoard() {
    this.element.innerHTML = "";

    for (let col = 0; col < 7; col++) {
      const column = document.createElement("div");
      column.className = "column";
      column.setAttribute("data-col", col);

      for (let row = 0; row < 6; row++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        column.appendChild(cell);
      }

      this.element.appendChild(column);
    }
  }

  updateCell(row, col, player) {
    const cellElement = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );

    const playerColor =
      player === 1 ? "var(--player1-color)" : "var(--player2-color)";
    const playerClass = player === 1 ? "player1" : "player2";

    const fallingDisk = document.createElement("div");
    fallingDisk.className = "falling-disk";
    fallingDisk.style.backgroundColor = playerColor;

    cellElement
      .querySelectorAll(".falling-disk")
      .forEach((disk) => disk.remove());
    cellElement.appendChild(fallingDisk);

    requestAnimationFrame(() => {
      fallingDisk.classList.add("falling");
    });

    return new Promise((resolve) => {
      fallingDisk.addEventListener(
        "animationend",
        () => {
          fallingDisk.remove();
          cellElement.className = `cell ${playerClass}`;
          cellElement.style.backgroundColor = playerColor;
          resolve();
        },
        { once: true }
      );
    });
  }

  reset() {
    this.grid = Array(6)
      .fill()
      .map(() => Array(7).fill(0));
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.className = "cell";
      cell.style.backgroundColor = "";
    });
  }

  isFull() {
    return this.grid[0].every((cell) => cell !== 0);
  }

  isValidMove(col) {
    return this.grid[0][col] === 0;
  }

  makeMove(col, player) {
    for (let row = 5; row >= 0; row--) {
      if (this.grid[row][col] === 0) {
        this.grid[row][col] = player;
        return row;
      }
    }
    return -1;
  }
}
