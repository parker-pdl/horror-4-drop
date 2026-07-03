import { Board, COLS, ROWS, Player, checkWin, dropPiece, getValidColumns, otherPlayer } from './connect-four';

export type Difficulty = 'easy' | 'medium' | 'hard';

const SEARCH_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 7,
};

const EASY_RANDOM_MOVE_CHANCE = 0.4;

const CENTER_ORDER = [3, 2, 4, 1, 5, 0, 6];
const CENTER_COLUMN_BONUS: Record<number, number> = { 3: 3, 2: 2, 4: 2 };

const WIN_SCORE = 1_000_000;

export function getGhostMove(board: Board, difficulty: Difficulty): number {
  const validColumns = getValidColumns(board);
  if (validColumns.length === 0) return -1;

  if (difficulty === 'easy' && Math.random() < EASY_RANDOM_MOVE_CHANCE) {
    return validColumns[Math.floor(Math.random() * validColumns.length)];
  }

  const depth = SEARCH_DEPTH[difficulty];
  const orderedColumns = CENTER_ORDER.filter((col) => validColumns.includes(col));

  let bestColumn = orderedColumns[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const col of orderedColumns) {
    const result = dropPiece(board, col, 'ghost');
    if (!result) continue;

    const score = minimax(result.board, depth - 1, alpha, beta, 'red', {
      row: result.row,
      col,
      player: 'ghost',
    });

    if (score > bestScore) {
      bestScore = score;
      bestColumn = col;
    }
    alpha = Math.max(alpha, bestScore);
  }

  return bestColumn;
}

type LastMove = { row: number; col: number; player: Player };

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  currentPlayer: Player,
  lastMove: LastMove,
): number {
  const winResult = checkWin(board, lastMove.row, lastMove.col);
  if (winResult) {
    return winResult.player === 'ghost' ? WIN_SCORE + depth : -(WIN_SCORE + depth);
  }

  const validColumns = getValidColumns(board);
  if (validColumns.length === 0) return 0; // draw
  if (depth === 0) return scoreBoard(board);

  const orderedColumns = CENTER_ORDER.filter((col) => validColumns.includes(col));
  const maximizing = currentPlayer === 'ghost';
  let value = maximizing ? -Infinity : Infinity;

  for (const col of orderedColumns) {
    const result = dropPiece(board, col, currentPlayer);
    if (!result) continue;

    const childScore = minimax(result.board, depth - 1, alpha, beta, otherPlayer(currentPlayer), {
      row: result.row,
      col,
      player: currentPlayer,
    });

    if (maximizing) {
      value = Math.max(value, childScore);
      alpha = Math.max(alpha, value);
    } else {
      value = Math.min(value, childScore);
      beta = Math.min(beta, value);
    }

    if (alpha >= beta) break;
  }

  return value;
}

function scoreBoard(board: Board): number {
  let score = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = board[row][col];
      if (cell === 'ghost') score += CENTER_COLUMN_BONUS[col] ?? 0;
      if (cell === 'red') score -= CENTER_COLUMN_BONUS[col] ?? 0;
    }
  }

  for (const window of allWindows()) {
    score += scoreWindow(window.map(([row, col]) => board[row][col]));
  }

  return score;
}

function scoreWindow(cells: (Player | null)[]): number {
  const ghostCount = cells.filter((c) => c === 'ghost').length;
  const redCount = cells.filter((c) => c === 'red').length;
  const emptyCount = cells.filter((c) => c === null).length;

  if (ghostCount > 0 && redCount > 0) return 0;

  if (ghostCount === 4) return 100_000;
  if (ghostCount === 3 && emptyCount === 1) return 5;
  if (ghostCount === 2 && emptyCount === 2) return 2;

  if (redCount === 4) return -100_000;
  if (redCount === 3 && emptyCount === 1) return -5;
  if (redCount === 2 && emptyCount === 2) return -2;

  return 0;
}

function allWindows(): [number, number][][] {
  const windows: [number, number][][] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      windows.push([0, 1, 2, 3].map((i) => [row, col + i] as [number, number]));
    }
  }

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - 4; row++) {
      windows.push([0, 1, 2, 3].map((i) => [row + i, col] as [number, number]));
    }
  }

  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      windows.push([0, 1, 2, 3].map((i) => [row + i, col + i] as [number, number]));
    }
  }

  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 3; col < COLS; col++) {
      windows.push([0, 1, 2, 3].map((i) => [row + i, col - i] as [number, number]));
    }
  }

  return windows;
}
