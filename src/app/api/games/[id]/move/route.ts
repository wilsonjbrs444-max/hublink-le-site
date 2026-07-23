import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const session = await prisma.gameSession.findUnique({ where: { id: params.id } });
  if (!session) {
    return NextResponse.json({ error: "Partie introuvable." }, { status: 404 });
  }
  if (session.player1Id !== user.id && session.player2Id !== user.id) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  if (session.turnId && session.turnId !== user.id) {
    return NextResponse.json({ error: "Ce n'est pas ton tour." }, { status: 400 });
  }

  const { state, nextTurnId, winnerId, status } = await req.json();

  const updated = await prisma.gameSession.update({
    where: { id: params.id },
    data: {
      state: JSON.stringify(state),
      turnId: nextTurnId ?? null,
      winnerId: winnerId ?? null,
      status: status || session.status,
    },
  });

  // Notifie l'adversaire dont c'est le tour, ou que la partie est finie
  const opponentId = session.player1Id === user.id ? session.player2Id : session.player1Id;
  if (opponentId && status === "finished") {
    await createNotification(
      opponentId,
      "partie_terminee",
      winnerId
        ? winnerId === opponentId
          ? "Tu as gagné la partie ! 🎉"
          : "Partie terminée."
        : "Match nul !",
      `/games/${session.gameType}/${session.id}`
    );
  }

  return NextResponse.json({ session: updated });
}
