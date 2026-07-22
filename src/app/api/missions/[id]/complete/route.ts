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

  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: { offers: { where: { status: "acceptee" }, include: { freelance: true } } },
  });
  if (!mission) {
    return NextResponse.json({ error: "Mission introuvable." }, { status: 404 });
  }
  if (mission.clientId !== user.id) {
    return NextResponse.json(
      { error: "Seul le client qui a publié la mission peut la marquer terminée." },
      { status: 403 }
    );
  }
  if (mission.status !== "attribuee") {
    return NextResponse.json(
      { error: "Cette mission doit d'abord être attribuée à un technicien." },
      { status: 400 }
    );
  }

  await prisma.mission.update({
    where: { id: params.id },
    data: { status: "terminee" },
  });

  const acceptedOffer = mission.offers[0];
  if (acceptedOffer) {
    await createNotification(
      acceptedOffer.freelance.userId,
      "mission_terminee",
      `"${mission.title}" a été marquée comme terminée. N'oublie pas de laisser un avis !`,
      `/freelance/${mission.id}`
    );
  }

  return NextResponse.json({ success: true });
}
