"use client";

import {
  LUDO_COLORS,
  LudoColor,
  LUDO_COLOR_HEX,
  RING_PATH,
  HOME_STRETCH,
  BASE_SLOTS,
  BASE_CORNER,
  SAFE_RING_INDICES,
  START_INDEX,
  cellForStep,
  LudoState,
} from "@/lib/games/ludo";

const CELL = 20; // px

function styleFor(row: number, col: number, spanR = 1, spanC = 1) {
  return {
    gridRow: `${row + 1} / span ${spanR}`,
    gridColumn: `${col + 1} / span ${spanC}`,
  } as const;
}

export default function LudoBoard({
  state,
  activeColors,
  myColor,
  validPawnIndices,
  onPawnClick,
}: {
  state: LudoState;
  activeColors: LudoColor[];
  myColor: LudoColor | null;
  validPawnIndices: number[];
  onPawnClick: (pawnIndex: number) => void;
}) {
  return (
    <div
      className="relative mx-auto grid border-2 border-gray-800 bg-white"
      style={{
        width: CELL * 15,
        height: CELL * 15,
        gridTemplateColumns: `repeat(15, ${CELL}px)`,
        gridTemplateRows: `repeat(15, ${CELL}px)`,
      }}
    >
      {/* Maisons (bases) */}
      {LUDO_COLORS.map((color) => {
        const [r, c] = BASE_CORNER[color];
        const active = activeColors.includes(color);
        return (
          <div
            key={color}
            style={{
              ...styleFor(r, c, 6, 6),
              backgroundColor: active ? LUDO_COLOR_HEX[color] : "#e5e7eb",
              opacity: active ? 1 : 0.4,
            }}
            className="relative rounded-md m-0.5"
          >
            <div className="absolute inset-2 rounded bg-white/90" />
          </div>
        );
      })}

      {/* Centre */}
      <div
        style={styleFor(6, 6, 3, 3)}
        className="flex items-center justify-center bg-gray-200 text-sm"
      >
        🏠
      </div>

      {/* Cases du tracé partagé */}
      {RING_PATH.map(([r, c], i) => {
        const isSafe = SAFE_RING_INDICES.has(i);
        const safeColor = LUDO_COLORS.find((col) => START_INDEX[col] === i);
        return (
          <div
            key={`ring-${i}`}
            style={{
              ...styleFor(r, c),
              backgroundColor: safeColor ? LUDO_COLOR_HEX[safeColor] : isSafe ? "#f3f4f6" : "#fff",
            }}
            className="border border-gray-200"
          />
        );
      })}

      {/* Couloirs d'arrivée */}
      {LUDO_COLORS.map((color) =>
        HOME_STRETCH[color].map(([r, c], i) => (
          <div
            key={`${color}-home-${i}`}
            style={{ ...styleFor(r, c), backgroundColor: LUDO_COLOR_HEX[color], opacity: 0.55 }}
            className="border border-white"
          />
        ))
      )}

      {/* Pions */}
      {LUDO_COLORS.filter((c) => activeColors.includes(c)).map((color) =>
        state.pawns[color]?.map((step, idx) => {
          const pos =
            step === -1 ? BASE_SLOTS[color][idx] : cellForStep(color, step);
          if (!pos) return null;
          const clickable = color === myColor && validPawnIndices.includes(idx);
          return (
            <button
              key={`${color}-pawn-${idx}`}
              onClick={() => clickable && onPawnClick(idx)}
              style={{
                ...styleFor(pos[0], pos[1]),
                backgroundColor: LUDO_COLOR_HEX[color],
              }}
              className={`z-10 m-0.5 rounded-full border-2 ${
                clickable
                  ? "border-white ring-2 ring-hublink animate-pulse"
                  : "border-white"
              }`}
              disabled={!clickable}
            />
          );
        })
      )}
    </div>
  );
}
