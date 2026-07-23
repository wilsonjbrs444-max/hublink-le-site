import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import {
  rollLudoDice,
  getValidPawnMoves,
  applyPawnMove,
  passLudoTurn,
  ludoAiChooseMove,
  LudoState,
} from "@/lib/games/ludo";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const game = await prisma.ludoGame.findUnique({ where: { id: params.id } });
  if (!game) return NextResponse.json({ error: "Partie introuvable." }, { status: 404 });
  if (game.status !== "active") {
    return NextResponse.json({ game: { ...game, seats: JSON.parse(game.seats), state: JSON.parse(game.state) } });
  }

  const seats: any[] = JSON.parse(game.seats);
  let state: LudoState = JSON.parse(game.state);
  const currentColor = state.activeColors[state.turnIndex];
  const currentSeat = seats.find((s) => s.color === currentColor);

  // Rien à faire si ce n'est pas le tour d'une IA (évite les doubles appels)
  if (!currentSeat || currentSeat.type !== "ai") {
    return NextResponse.json({
      game: { ...game, seats, state },
    });
  }

  const value = rollLudoDice();
  const validMoves = getValidPawnMoves(state.pawns, currentColor, value);

  let nextState: LudoState;
  if (validMoves.length === 0) {
    nextState = passLudoTurn({ ...state, diceValue: value, diceRolled: true });
  } else {
    const choice = ludoAiChooseMove(state.pawns, currentColor, value, state.activeColors);
    const result = applyPawnMove(
      { ...state, diceValue: value, diceRolled: true },
      currentColor,
      choice,
      value
    );
    nextState = result.state;
  }

  const status = nextState.winner ? "finished" : "active";

  const updated = await prisma.ludoGame.update({
    where: { id: params.id },
    data: { state: JSON.stringify(nextState), status },
  });

  return NextResponse.json({
    game: { ...updated, seats, state: JSON.parse(updated.state) },
  });
}
