import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { applyPawnMove, getValidPawnMoves, LudoState } from "@/lib/games/ludo";
import { createNotification } from "@/lib/notify";
import { sendPushToUser } from "@/lib/push";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { pawnIndex } = await req.json();

  const game = await prisma.ludoGame.findUnique({ where: { id: params.id } });
  if (!game) return NextResponse.json({ error: "Partie introuvable." }, { status: 404 });

  const seats: any[] = JSON.parse(game.seats);
  let state: LudoState = JSON.parse(game.state);
  const currentColor = state.activeColors[state.turnIndex];
  const currentSeat = seats.find((s) => s.color === currentColor);

  if (!currentSeat || currentSeat.userId !== user.id) {
    return NextResponse.json({ error: "Ce n'est pas ton tour." }, { status: 400 });
  }
  if (!state.diceRolled || state.diceValue === null) {
    return NextResponse.json({ error: "Lance d'abord le dé." }, { status: 400 });
  }

  const validMoves = getValidPawnMoves(state.pawns, currentColor, state.diceValue);
  if (!validMoves.includes(pawnIndex)) {
    return NextResponse.json({ error: "Coup invalide." }, { status: 400 });
  }

  const { state: nextState } = applyPawnMove(state, currentColor, pawnIndex, state.diceValue);

  const status = nextState.winner ? "finished" : "active";

  const updated = await prisma.ludoGame.update({
    where: { id: params.id },
    data: { state: JSON.stringify(nextState), status },
  });

  if (nextState.winner) {
    for (const seat of seats) {
      if (seat.type === "human" && seat.userId && seat.userId !== user.id) {
        await createNotification(
          seat.userId,
          "partie_terminee",
          `La partie de Ludo est terminée !`,
          `/games/ludo/${params.id}`
        );
        await sendPushToUser(seat.userId, {
          title: "Ludo terminé 🎲",
          body: "La partie de Ludo vient de se terminer.",
          url: `/games/ludo/${params.id}`,
        });
      }
    }
  }

  return NextResponse.json({
    game: { ...updated, seats, state: JSON.parse(updated.state) },
  });
}
