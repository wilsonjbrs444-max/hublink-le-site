import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId || targetUserId === user.id) {
      return NextResponse.json({ error: "Cible invalide." }, { status: 400 });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ following: false });
    } else {
      await prisma.follow.create({
        data: { followerId: user.id, followingId: targetUserId },
      });
      await createNotification(
        targetUserId,
        "nouvel_abonne",
        `${user.fullName} s'est abonné à ton profil`,
        `/profile/${user.id}`
      );
      return NextResponse.json({ following: true });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'abonnement." },
      { status: 500 }
    );
  }
}
