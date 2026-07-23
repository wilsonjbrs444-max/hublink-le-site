import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";
import { sendPushToUser } from "@/lib/push";

const GAME_LABELS: Record<string, string> = {
  morpion: "Morpion",
  puissance4: "Puissance 4",
  rps: "Pierre-Papier-Ciseaux",
  quiz: "Quiz",
  memory: "Memory",
  pendu: "Pendu",
  dames: "Dames",
  "tape-taupe": "Tape-la-taupe",
  reaction: "Réaction rapide",
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { gameType, opponentUserId, initialState } = await req.json();
  if (!GAME_LABELS[gameType]) {
    return NextResponse.json({ error: "Jeu invalide." }, { status: 400 });
  }

  const session = await prisma.gameSession.create({
    data: {
      gameType,
      player1Id: user.id,
      player2Id: opponentUserId || null,
      state: JSON.stringify(initialState || {}),
      status: opponentUserId ? "active" : "waiting",
      turnId: user.id,
    },
  });

  // Si un ami est choisi, on lui envoie le lien de la partie par message
  if (opponentUserId) {
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: opponentUserId } } },
        ],
      },
    });

    let conversationId = existing?.id;
    if (!conversationId) {
      const created = await prisma.conversation.create({
        data: { participants: { create: [{ userId: user.id }, { userId: opponentUserId }] } },
      });
      conversationId = created.id;
    }

    const link = `/games/${gameType}/${session.id}`;
    await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: `🎮 ${user.fullName} te défie à ${GAME_LABELS[gameType]} ! Rejoins la partie : ${link}`,
      },
    });

    await createNotification(
      opponentUserId,
      "defi_jeu",
      `${user.fullName} te défie à ${GAME_LABELS[gameType]} !`,
      link
    );
    await sendPushToUser(opponentUserId, {
      title: "Nouveau défi 🎮",
      body: `${user.fullName} te défie à ${GAME_LABELS[gameType]} !`,
      url: link,
    });
  }

  return NextResponse.json({ sessionId: session.id });
}
