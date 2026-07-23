export const CANDY_SIZE = 8;
export const CANDY_TYPES = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁"];

export type CandyGrid = number[]; // index = row*8+col, valeur = index dans CANDY_TYPES

function randomCandy() {
  return Math.floor(Math.random() * CANDY_TYPES.length);
}

export function generateCandyGrid(): CandyGrid {
  let grid: CandyGrid;
  do {
    grid = Array.from({ length: CANDY_SIZE * CANDY_SIZE }, randomCandy);
  } while (findCandyMatches(grid).size > 0);
  return grid;
}

// Retourne l'ensemble des indices faisant partie d'un alignement de 3+ (ligne ou colonne)
export function findCandyMatches(grid: CandyGrid): Set<number> {
  const matched = new Set<number>();

  for (let row = 0; row < CANDY_SIZE; row++) {
    let run = 1;
    for (let col = 1; col <= CANDY_SIZE; col++) {
      const cur = col < CANDY_SIZE ? grid[row * CANDY_SIZE + col] : -1;
      const prev = grid[row * CANDY_SIZE + col - 1];
      if (col < CANDY_SIZE && cur === prev) {
        run++;
      } else {
        if (run >= 3) {
          for (let k = col - run; k < col; k++) matched.add(row * CANDY_SIZE + k);
        }
        run = 1;
      }
    }
  }

  for (let col = 0; col < CANDY_SIZE; col++) {
    let run = 1;
    for (let row = 1; row <= CANDY_SIZE; row++) {
      const cur = row < CANDY_SIZE ? grid[row * CANDY_SIZE + col] : -1;
      const prev = grid[(row - 1) * CANDY_SIZE + col];
      if (row < CANDY_SIZE && cur === prev) {
        run++;
      } else {
        if (run >= 3) {
          for (let k = row - run; k < row; k++) matched.add(k * CANDY_SIZE + col);
        }
        run = 1;
      }
    }
  }

  return matched;
}

// Fait tomber les bonbons restants et remplit le haut avec de nouveaux bonbons aléatoires
export function collapseCandyGrid(grid: CandyGrid, matched: Set<number>): CandyGrid {
  const next = [...grid];
  for (const i of matched) next[i] = -1;

  for (let col = 0; col < CANDY_SIZE; col++) {
    const colValues: number[] = [];
    for (let row = CANDY_SIZE - 1; row >= 0; row--) {
      const v = next[row * CANDY_SIZE + col];
      if (v !== -1) colValues.push(v);
    }
    while (colValues.length < CANDY_SIZE) colValues.push(randomCandy());
    for (let row = CANDY_SIZE - 1; row >= 0; row--) {
      next[row * CANDY_SIZE + col] = colValues[CANDY_SIZE - 1 - row];
    }
  }
  return next;
}

export function areAdjacent(a: number, b: number): boolean {
  const ra = Math.floor(a / CANDY_SIZE);
  const ca = a % CANDY_SIZE;
  const rb = Math.floor(b / CANDY_SIZE);
  const cb = b % CANDY_SIZE;
  return (ra === rb && Math.abs(ca - cb) === 1) || (ca === cb && Math.abs(ra - rb) === 1);
}
