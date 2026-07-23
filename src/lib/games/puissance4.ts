export const P4_ROWS = 6;
export const P4_COLS = 7;

export type Puissance4State = {
  board: (string | null)[]; // 42 cases, index = row * 7 + col
};

export function emptyP4Board(): (string | null)[] {
  return Array(P4_ROWS * P4_COLS).fill(null);
}

// Retourne le nouveau plateau après avoir laissé tomber un jeton dans une colonne,
// ou null si la colonne est pleine.
export function dropP4Piece(
  board: (string | null)[],
  col: number,
  symbol: string
): (string | null)[] | null {
  for (let row = P4_ROWS - 1; row >= 0; row--) {
    const idx = row * P4_COLS + col;
    if (!board[idx]) {
      const next = [...board];
      next[idx] = symbol;
      return next;
    }
  }
  return null;
}

export function checkP4Winner(board: (string | null)[]): string | null {
  const get = (r: number, c: number) =>
    r < 0 || r >= P4_ROWS || c < 0 || c >= P4_COLS ? null : board[r * P4_COLS + c];

  for (let r = 0; r < P4_ROWS; r++) {
    for (let c = 0; c < P4_COLS; c++) {
      const s = get(r, c);
      if (!s) continue;
      const dirs = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];
      for (const [dr, dc] of dirs) {
        if (
          s === get(r + dr, c + dc) &&
          s === get(r + dr * 2, c + dc * 2) &&
          s === get(r + dr * 3, c + dc * 3)
        ) {
          return s;
        }
      }
    }
  }
  return null;
}

export function isP4Full(board: (string | null)[]): boolean {
  return board.every((c) => c !== null);
}

export function p4AiMove(board: (string | null)[], aiSymbol: string): number {
  const humanSymbol = aiSymbol === "R" ? "J" : "R";
  const validCols = Array.from({ length: P4_COLS }, (_, c) => c).filter(
    (c) => board[c] === null // case du haut libre => colonne jouable
  );

  for (const c of validCols) {
    const next = dropP4Piece(board, c, aiSymbol);
    if (next && checkP4Winner(next) === aiSymbol) return c;
  }
  for (const c of validCols) {
    const next = dropP4Piece(board, c, humanSymbol);
    if (next && checkP4Winner(next) === humanSymbol) return c;
  }
  const center = 3;
  if (validCols.includes(center)) return center;
  return validCols[Math.floor(Math.random() * validCols.length)];
}
