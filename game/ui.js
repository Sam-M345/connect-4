export class UI {
  constructor() {
    this.playerIndicator = document.getElementById("player-indicator");
    this.playerText = document.getElementById("player-text");
    this.winMessage = document.getElementById("win-message");
    this.winnerText = document.getElementById("winner-text");
  }

  updatePlayerIndicator(player) {
    this.playerText.textContent = player === 1 ? "Human 🙂" : "AI 🤖";
    this.playerIndicator.className = player === 1 ? "player1" : "player2";
    this.playerIndicator.style.backgroundColor = `var(--player${player}-color)`;
  }

  showWinMessage(winner) {
    if (winner === "Draw") {
      this.winnerText.textContent = "It's a Draw! 🤝";
      this.winMessage.className = "win-message draw";
    } else {
      this.winnerText.textContent = `${winner} Wins ${
        winner === "Human" ? "🙂" : "🤖"
      }`;
      this.winMessage.className = `win-message ${winner.toLowerCase()}-winner`;
    }
    this.winMessage.classList.remove("hidden");
  }

  hideWinMessage() {
    this.winMessage.classList.add("hidden");
  }
}
