export type Player = 'red' | 'ghost';
export type Cell = Player | null;
export type Board = Cell[][];

export const ROWS = 6;
export const COLS = 7;

export type WinResult = {
  player: Player;
  cells: [number, number][];
};

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
}

export function getValidColumns(board: Board): number[] {
  const columns: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === null) columns.push(col);
  }
  return columns;
}

export function dropPiece(
  board: Board,
  col: number,
  player: Player,
): { board: Board; row: number } | null {
  let targetRow = -1;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      targetRow = row;
      break;
    }
  }
  if (targetRow === -1) return null;

  const nextBoard = board.map((r) => r.slice());
  nextBoard[targetRow][col] = player;
  return { board: nextBoard, row: targetRow };
}

const DIRECTIONS: [number, number][] = [
  [0, 1], // horizontal
  [1, 0], // vertical
  [1, 1], // diagonal down-right
  [1, -1], // diagonal down-left
];

export function checkWin(board: Board, row: number, col: number): WinResult | null {
  const player = board[row][col];
  if (!player) return null;

  for (const [dRow, dCol] of DIRECTIONS) {
    const cells: [number, number][] = [[row, col]];

    for (const sign of [1, -1] as const) {
      let r = row + dRow * sign;
      let c = col + dCol * sign;
      while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === player &&
        cells.length < 4
      ) {
        cells.push([r, c]);
        r += dRow * sign;
        c += dCol * sign;
      }
    }

    if (cells.length >= 4) {
      return { player, cells: cells.slice(0, 4) };
    }
  }

  return null;
}

export function checkDraw(board: Board): boolean {
  return getValidColumns(board).length === 0;
}

export function otherPlayer(player: Player): Player {
  return player === 'red' ? 'ghost' : 'red';
}
