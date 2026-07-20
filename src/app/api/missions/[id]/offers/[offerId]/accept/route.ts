import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; offerId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
    });
    if (!mission) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }
    if (mission.clientId !== user.id) {
      return NextResponse.json(
        { error: "Seul le client qui a publié la mission peut accepter une offre." },
        { status: 403 }
      );
    }
    if (mission.status !== "ouverte") {
      return NextResponse.json(
        { error: "Cette mission n'est plus ouverte." },
        { status: 400 }
      );
    }

    // Transaction : on accepte l'offre choisie, on refuse les autres,
    // et on marque la mission comme attribuée.
    await prisma.$transaction([
      prisma.missionOffer.update({
        where: { id: params.offerId },
        data: { status: "acceptee" },
      }),
      prisma.missionOffer.updateMany({
        where: { missionId: params.id, id: { not: params.offerId } },
        data: { status: "refusee" },
      }),
      prisma.mission.update({
        where: { id: params.id },
        data: { status: "attribuee" },
      }),
    ]);

    const acceptedOffer = await prisma.missionOffer.findUnique({
      where: { id: params.offerId },
      include: { freelance: true },
    });
    if (acceptedOffer) {
      await createNotification(
        acceptedOffer.freelance.userId,
        "offre_acceptee",
        `Ton offre sur "${mission.title}" a été acceptée !`,
        `/freelance/${mission.id}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'acceptation." },
      { status: 500 }
    );
  }
}
