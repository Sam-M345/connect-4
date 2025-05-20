const WINNING_SCORE = 100000;
const MAX_DEPTH = 4;

export const makeAIMove = (gameBoard) => {
  const col = findBestMove(gameBoard);
  return col;
};

export const findBestMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = 3; // Default to middle column
  const alpha = -Infinity;
  const beta = Infinity;

  // Try each column
  for (let col = 0; col < 7; col++) {
    // Skip if column is full
    if (board[0][col] !== 0) continue;

    // Find lowest empty row in this column
    const row = getLowestEmptyRow(board, col);
    if (row === -1) continue;

    // Try this move
    board[row][col] = 2; // AI player
    const score = minimax(board, MAX_DEPTH, false, alpha, beta);
    board[row][col] = 0; // Undo move

    if (score > bestScore) {
      bestScore = score;
      bestMove = col;
    }
  }

  return bestMove;
};

export const minimax = (board, depth, isMaximizing, alpha, beta) => {
  // Base cases
  const score = evaluateBoard(board);
  if (Math.abs(score) === WINNING_SCORE) return score;
  if (depth === 0) return score;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let col = 0; col < 7; col++) {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) continue;

      board[row][col] = 2; // AI player
      const score = minimax(board, depth - 1, false, alpha, beta);
      board[row][col] = 0;

      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let col = 0; col < 7; col++) {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) continue;

      board[row][col] = 1; // Human player
      const score = minimax(board, depth - 1, true, alpha, beta);
      board[row][col] = 0;

      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
};

// Helper functions
const getLowestEmptyRow = (board, col) => {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) return row;
  }
  return -1;
};

const isBoardFull = (board) => {
  return board[0].every((cell) => cell !== 0);
};

const evaluateBoard = (board) => {
  // Check horizontal, vertical, and diagonal lines
  let score = 0;

  // Horizontal check
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateLine(
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3]
      );
    }
  }

  // Vertical check
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      score += evaluateLine(
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col]
      );
    }
  }

  // Diagonal check (positive slope)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateLine(
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3]
      );
    }
  }

  // Diagonal check (negative slope)
  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateLine(
        board[row][col],
        board[row - 1][col + 1],
        board[row - 2][col + 2],
        board[row - 3][col + 3]
      );
    }
  }

  return score;
};

const evaluateLine = (a, b, c, d) => {
  let aiCount = 0;
  let humanCount = 0;

  // Count pieces
  [a, b, c, d].forEach((cell) => {
    if (cell === 2) aiCount++;
    else if (cell === 1) humanCount++;
  });

  // Return score based on piece configuration. ok
  if (aiCount === 4) return WINNING_SCORE;
  if (humanCount === 4) return -WINNING_SCORE;
  if (aiCount > 0 && humanCount > 0) return 0;
  if (aiCount === 3) return 100;
  if (aiCount === 2) return 10;
  if (aiCount === 1) return 1;
  if (humanCount === 3) return -100;
  if (humanCount === 2) return -10;
  if (humanCount === 1) return -1;
  return 0;
};
