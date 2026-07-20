import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { createNotification } from "@/lib/notify";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Tu dois être connecté pour proposer une offre." },
        { status: 401 }
      );
    }
    if (!user.freelanceProfile) {
      return NextResponse.json(
        {
          error:
            "Seuls les comptes freelance peuvent faire des offres. Active ce rôle depuis ton profil.",
        },
        { status: 403 }
      );
    }

    const { price, message } = await req.json();
    if (!price) {
      return NextResponse.json(
        { error: "Le prix proposé est obligatoire." },
        { status: 400 }
      );
    }

    const offer = await prisma.missionOffer.create({
      data: {
        missionId: params.id,
        freelanceId: user.freelanceProfile.id,
        price: Number(price),
        message,
      },
    });

    const mission = await prisma.mission.findUnique({ where: { id: params.id } });
    if (mission) {
      await createNotification(
        mission.clientId,
        "nouvelle_offre",
        `${user.fullName} a proposé une offre sur "${mission.title}"`,
        `/freelance/${mission.id}`
      );
    }

    return NextResponse.json({ offer });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de l'offre." },
      { status: 500 }
    );
  }
}
