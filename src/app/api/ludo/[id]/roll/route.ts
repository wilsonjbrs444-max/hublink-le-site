import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { rollLudoDice, getValidPawnMoves, passLudoTurn, LudoState } from "@/lib/games/ludo";

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
    return NextResponse.json({ error: "La partie n'est pas active." }, { status: 400 });
  }

  const seats: any[] = JSON.parse(game.seats);
  let state: LudoState = JSON.parse(game.state);
  const currentColor = state.activeColors[state.turnIndex];
  const currentSeat = seats.find((s) => s.color === currentColor);

  if (!currentSeat || currentSeat.userId !== user.id) {
    return NextResponse.json({ error: "Ce n'est pas ton tour." }, { status: 400 });
  }
  if (state.diceRolled) {
    return NextResponse.json({ error: "Choisis d'abord un pion à déplacer." }, { status: 400 });
  }

  const value = rollLudoDice();
  const validMoves = getValidPawnMoves(state.pawns, currentColor, value);

  if (validMoves.length === 0) {
    state = passLudoTurn(state);
  } else {
    state = { ...state, diceValue: value, diceRolled: true };
  }

  const updated = await prisma.ludoGame.update({
    where: { id: params.id },
    data: { state: JSON.stringify(state) },
  });

  return NextResponse.json({
    game: { ...updated, seats, state: JSON.parse(updated.state) },
    diceValue: value,
  });
}
