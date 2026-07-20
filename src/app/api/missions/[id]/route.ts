import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const mission = await prisma.mission.findUnique({ where: { id: params.id } });
    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable." }, { status: 404 });
    }
    if (mission.clientId !== user.id) {
      return NextResponse.json(
        { error: "Tu ne peux supprimer que tes propres missions." },
        { status: 403 }
      );
    }

    await prisma.mission.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}
