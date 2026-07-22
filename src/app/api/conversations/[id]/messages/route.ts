import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";

async function assertParticipant(userId: string, conversationId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  return !!participant;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  if (!(await assertParticipant(user.id, params.id))) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: params.id },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  await prisma.message.updateMany({
    where: {
      conversationId: params.id,
      senderId: { not: user.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }
    if (!(await assertParticipant(user.id, params.id))) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { content, imageUrl } = await req.json();
if (!content?.trim() && !imageUrl) {
  return NextResponse.json({ error: "Message vide." }, { status: 400 });
}

const message = await prisma.message.create({
  data: { conversationId: params.id, senderId: user.id, content: content || "", imageUrl },
  include: { sender: true },
});

    const others = await prisma.conversationParticipant.findMany({
      where: { conversationId: params.id, userId: { not: user.id } },
    });
    for (const p of others) {
      await createNotification(
        p.userId,
        "nouveau_message",
        `${user.fullName} : ${content.slice(0, 60)}`,
        `/messages/${params.id}`
      );
    }

    return NextResponse.json({ message });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
