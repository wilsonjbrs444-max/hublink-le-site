export type MorpionState = {
  board: (string | null)[]; // 9 cases, "X" | "O" | null
};

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function checkMorpionWinner(board: (string | null)[]): string | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export function isMorpionFull(board: (string | null)[]): boolean {
  return board.every((c) => c !== null);
}

// IA simple : gagne si possible, bloque sinon, sinon centre, sinon coin, sinon random
export function morpionAiMove(board: (string | null)[], aiSymbol: string): number {
  const humanSymbol = aiSymbol === "X" ? "O" : "X";
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);

  for (const i of empty) {
    const copy = [...board];
    copy[i] = aiSymbol;
    if (checkMorpionWinner(copy) === aiSymbol) return i;
  }
  for (const i of empty) {
    const copy = [...board];
    copy[i] = humanSymbol;
    if (checkMorpionWinner(copy) === humanSymbol) return i;
  }
  if (board[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}
