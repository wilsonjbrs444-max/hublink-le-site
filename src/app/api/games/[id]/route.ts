import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const session = await prisma.gameSession.findUnique({
    where: { id: params.id },
    include: {
      player1: { select: { id: true, fullName: true } },
      player2: { select: { id: true, fullName: true } },
    },
  });
  if (!session) {
    return NextResponse.json({ error: "Partie introuvable." }, { status: 404 });
  }

  // Rejoint automatiquement une partie ouverte (lien partagé sans destinataire précis)
  if (
    session.status === "waiting" &&
    !session.player2Id &&
    session.player1Id !== user.id
  ) {
    const updated = await prisma.gameSession.update({
      where: { id: params.id },
      data: { player2Id: user.id, status: "active" },
      include: {
        player1: { select: { id: true, fullName: true } },
        player2: { select: { id: true, fullName: true } },
      },
    });
    return NextResponse.json({ session: updated });
  }

  if (
    session.player1Id !== user.id &&
    session.player2Id !== user.id
  ) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  return NextResponse.json({ session });
}
