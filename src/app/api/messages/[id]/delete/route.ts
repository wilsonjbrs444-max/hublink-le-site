import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { scope } = await req.json();
  if (scope !== "me" && scope !== "everyone") {
    return NextResponse.json({ error: "Paramètre invalide." }, { status: 400 });
  }

  const message = await prisma.message.findUnique({ where: { id: params.id } });
  if (!message) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }

  const isParticipant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: message.conversationId,
        userId: user.id,
      },
    },
  });
  if (!isParticipant) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  if (scope === "everyone") {
    if (message.senderId !== user.id) {
      return NextResponse.json(
        { error: "Tu ne peux supprimer pour tout le monde que tes propres messages." },
        { status: 403 }
      );
    }
    await prisma.message.update({
      where: { id: params.id },
      data: { content: "", imageUrl: null, deletedForEveryone: true },
    });
  } else {
    await prisma.messageDeletion.upsert({
      where: { messageId_userId: { messageId: params.id, userId: user.id } },
      update: {},
      create: { messageId: params.id, userId: user.id },
    });
  }

  return NextResponse.json({ ok: true });
}
