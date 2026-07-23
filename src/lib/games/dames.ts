// Damier 8x8. On n'utilise que les cases sombres : (row + col) % 2 === 1
// Pièces : "r" / "rd" (rouge, dame) — descend au départ (row croissant)
//          "n" / "nd" (noir, dame) — monte au départ (row décroissant)

export type DamesPiece = "r" | "rd" | "n" | "nd" | null;
export type DamesBoard = DamesPiece[]; // 64 cases (8x8), on ignore les cases claires

export function initialDamesBoard(): DamesBoard {
  const board: DamesBoard = Array(64).fill(null);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row * 8 + col] = "n";
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row * 8 + col] = "r";
    }
  }
  return board;
}

function isRed(p: DamesPiece) {
  return p === "r" || p === "rd";
}
function isBlack(p: DamesPiece) {
  return p === "n" || p === "nd";
}
function isKing(p: DamesPiece) {
  return p === "rd" || p === "nd";
}
function sameTeam(a: DamesPiece, b: DamesPiece) {
  if (!a || !b) return false;
  return (isRed(a) && isRed(b)) || (isBlack(a) && isBlack(b));
}

export type DamesMove = { from: number; to: number; captured?: number };

// Retourne tous les coups valides pour un joueur ("r" ou "n"),
// avec priorité aux prises si au moins une est possible (règle classique).
export function getDamesMoves(board: DamesBoard, team: "r" | "n"): DamesMove[] {
  const moves: DamesMove[] = [];
  const captures: DamesMove[] = [];

  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (!p) continue;
    if (team === "r" && !isRed(p)) continue;
    if (team === "n" && !isBlack(p)) continue;

    const row = Math.floor(i / 8);
    const col = i % 8;
    const king = isKing(p);
    const forwardDirs = team === "r" ? [-1] : [1]; // r monte visuellement vers le haut (row--), n descend
    const dirs = king ? [-1, 1] : forwardDirs;

    for (const dr of dirs) {
      for (const dc of [-1, 1]) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
        const target = nr * 8 + nc;
        if (!board[target]) {
          moves.push({ from: i, to: target });
        } else if (!sameTeam(p, board[target])) {
          const jr = nr + dr;
          const jc = nc + dc;
          if (jr < 0 || jr > 7 || jc < 0 || jc > 7) continue;
          const jumpTarget = jr * 8 + jc;
          if (!board[jumpTarget]) {
            captures.push({ from: i, to: jumpTarget, captured: target });
          }
        }
      }
    }
  }

  return captures.length > 0 ? captures : moves;
}

export function applyDamesMove(board: DamesBoard, move: DamesMove): DamesBoard {
  const next = [...board];
  let piece = next[move.from];
  next[move.from] = null;
  if (move.captured !== undefined) next[move.captured] = null;

  const toRow = Math.floor(move.to / 8);
  if (piece === "r" && toRow === 0) piece = "rd";
  if (piece === "n" && toRow === 7) piece = "nd";
  next[move.to] = piece;
  return next;
}

export function checkDamesWinner(board: DamesBoard): "r" | "n" | null {
  const hasRed = board.some((p) => isRed(p));
  const hasBlack = board.some((p) => isBlack(p));
  if (!hasRed) return "n";
  if (!hasBlack) return "r";
  const redMoves = getDamesMoves(board, "r");
  const blackMoves = getDamesMoves(board, "n");
  if (redMoves.length === 0) return "n";
  if (blackMoves.length === 0) return "r";
  return null;
}

export function damesAiMove(board: DamesBoard, team: "r" | "n"): DamesMove | null {
  const moves = getDamesMoves(board, team);
  if (moves.length === 0) return null;
  const captures = moves.filter((m) => m.captured !== undefined);
  const pool = captures.length > 0 ? captures : moves;
  return pool[Math.floor(Math.random() * pool.length)];
}
