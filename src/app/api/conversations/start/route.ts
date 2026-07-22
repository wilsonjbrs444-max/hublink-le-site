import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";
import { sendPushToUser } from "@/lib/push";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { targetUserId, initialMessage } = await req.json();
    if (!targetUserId || targetUserId === user.id) {
      return NextResponse.json({ error: "Destinataire invalide." }, { status: 400 });
    }
    // Note : on autorise l'envoi de message à n'importe quel utilisateur,
    // pas seulement aux comptes suivis (ex: contacter un vendeur depuis
    // une annonce marketplace, un freelance depuis une mission, etc.)

    // Cherche une conversation 1:1 déjà existante entre les deux
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
    });

    let conversationId = existing?.id;

    if (!conversationId) {
      const created = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: user.id }, { userId: targetUserId }],
          },
        },
      });
      conversationId = created.id;
    }

    if (initialMessage) {
      await prisma.message.create({
        data: {
          conversationId,
          senderId: user.id,
          content: initialMessage,
        },
      });
      await createNotification(
        targetUserId,
        "nouveau_message",
        `${user.fullName} : ${initialMessage.slice(0, 60)}`,
        `/messages/${conversationId}`
      );
      await sendPushToUser(targetUserId, {
        title: user.fullName,
        body: initialMessage.slice(0, 120),
        url: `/messages/${conversationId}`,
      });
    }

    return NextResponse.json({ conversationId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la conversation." },
      { status: 500 }
    );
  }
}
