export type LudoColor = "red" | "green" | "yellow" | "blue";
export const LUDO_COLORS: LudoColor[] = ["red", "green", "yellow", "blue"];

export const LUDO_COLOR_HEX: Record<LudoColor, string> = {
  red: "#dc2626",
  green: "#16a34a",
  yellow: "#eab308",
  blue: "#2563eb",
};

// Le tracé partagé de 52 cases (voir vérification géométrique).
export const RING_PATH: [number, number][] = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0],
  [6, 0],
];

export const START_INDEX: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Cases "sûres" (départ + étoiles classiques) : aucune capture possible dessus.
export const SAFE_RING_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export const HOME_STRETCH: Record<LudoColor, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
};

export const BASE_SLOTS: Record<LudoColor, [number, number][]> = {
  red: [[1, 1], [1, 3], [3, 1], [3, 3]],
  green: [[1, 10], [1, 13], [3, 10], [3, 13]],
  yellow: [[10, 10], [10, 13], [13, 10], [13, 13]],
  blue: [[10, 1], [10, 4], [13, 1], [13, 4]],
};

export const BASE_CORNER: Record<LudoColor, [number, number]> = {
  red: [0, 0],
  green: [0, 9],
  yellow: [9, 9],
  blue: [9, 0],
};

// step : -1 = à la maison (pas encore sorti), 0-50 = case du tracé partagé,
// 51-56 = couloir d'arrivée personnel (56 = arrivé).
export type LudoPawns = Record<LudoColor, number[]>; // 4 valeurs par couleur

export type LudoState = {
  activeColors: LudoColor[];
  pawns: LudoPawns;
  turnIndex: number;
  diceValue: number | null;
  diceRolled: boolean;
  winner: LudoColor | null;
};

export function createInitialLudoState(activeColors: LudoColor[]): LudoState {
  const pawns = {} as LudoPawns;
  for (const c of LUDO_COLORS) pawns[c] = activeColors.includes(c) ? [-1, -1, -1, -1] : [];
  return {
    activeColors,
    pawns,
    turnIndex: 0,
    diceValue: null,
    diceRolled: false,
    winner: null,
  };
}

export function cellForStep(color: LudoColor, step: number): [number, number] | null {
  if (step < 0) return null;
  if (step <= 50) return RING_PATH[(START_INDEX[color] + step) % 52];
  if (step <= 56) return HOME_STRETCH[color][step - 51];
  return null;
}

export function ringIndexForStep(color: LudoColor, step: number): number | null {
  if (step < 0 || step > 50) return null;
  return (START_INDEX[color] + step) % 52;
}

export function rollLudoDice(): number {
  return 1 + Math.floor(Math.random() * 6);
}

export function getValidPawnMoves(pawns: LudoPawns, color: LudoColor, dice: number): number[] {
  const valid: number[] = [];
  pawns[color].forEach((step, i) => {
    if (step === 56) return; // déjà arrivé
    if (step === -1) {
      if (dice === 6) valid.push(i);
      return;
    }
    if (step + dice <= 56) valid.push(i);
  });
  return valid;
}

export function applyPawnMove(
  state: LudoState,
  color: LudoColor,
  pawnIndex: number,
  dice: number
): { state: LudoState; captured: boolean; finished: boolean } {
  const pawns: LudoPawns = JSON.parse(JSON.stringify(state.pawns));
  const current = pawns[color][pawnIndex];
  const newStep = current === -1 ? 0 : current + dice;
  pawns[color][pawnIndex] = newStep;

  let captured = false;
  const ringIdx = ringIndexForStep(color, newStep);
  if (ringIdx !== null && !SAFE_RING_INDICES.has(ringIdx)) {
    for (const other of state.activeColors) {
      if (other === color) continue;
      pawns[other] = pawns[other].map((s) => {
        if (s >= 0 && s <= 50 && ringIndexForStep(other, s) === ringIdx) {
          captured = true;
          return -1;
        }
        return s;
      });
    }
  }

  const finished = newStep === 56;
  const won = pawns[color].every((s) => s === 56);
  const extraTurn = dice === 6 || captured || finished;

  const nextIndex = extraTurn
    ? state.turnIndex
    : (state.turnIndex + 1) % state.activeColors.length;

  return {
    state: {
      ...state,
      pawns,
      diceValue: null,
      diceRolled: false,
      turnIndex: nextIndex,
      winner: won ? color : null,
    },
    captured,
    finished,
  };
}

export function passLudoTurn(state: LudoState): LudoState {
  return {
    ...state,
    diceValue: null,
    diceRolled: false,
    turnIndex: (state.turnIndex + 1) % state.activeColors.length,
  };
}

// IA simple : capture > termine un pion > sort de la maison > avance le pion le plus engagé
export function ludoAiChooseMove(
  pawns: LudoPawns,
  color: LudoColor,
  dice: number,
  activeColors: LudoColor[]
): number {
  const valid = getValidPawnMoves(pawns, color, dice);
  if (valid.length === 0) return -1;

  function wouldCapture(step: number) {
    const newStep = step === -1 ? 0 : step + dice;
    const ringIdx = ringIndexForStep(color, newStep);
    if (ringIdx === null || SAFE_RING_INDICES.has(ringIdx)) return false;
    return activeColors.some(
      (other) =>
        other !== color &&
        pawns[other].some((s) => s >= 0 && s <= 50 && ringIndexForStep(other, s) === ringIdx)
    );
  }

  const capturing = valid.find((i) => wouldCapture(pawns[color][i]));
  if (capturing !== undefined) return capturing;

  const finishing = valid.find((i) => pawns[color][i] + dice === 56);
  if (finishing !== undefined) return finishing;

  if (dice === 6) {
    const leaving = valid.find((i) => pawns[color][i] === -1);
    if (leaving !== undefined) return leaving;
  }

  // Sinon, avance le pion le plus avancé (le plus proche de la maison)
  return valid.reduce((best, i) =>
    pawns[color][i] > pawns[color][best] ? i : best
  , valid[0]);
}
