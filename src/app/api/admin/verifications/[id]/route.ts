import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Réservé aux administrateurs." },
        { status: 403 }
      );
    }

    const { decision } = await req.json(); // "certifie" ou "rejete"
    if (!["certifie", "rejete"].includes(decision)) {
      return NextResponse.json({ error: "Décision invalide." }, { status: 400 });
    }

    await prisma.freelanceProfile.update({
      where: { id: params.id },
      data: { certificationStatus: decision },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
