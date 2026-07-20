import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentUser();
    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Réservé aux administrateurs." },
        { status: 403 }
      );
    }
    if (admin.id === params.id) {
      return NextResponse.json(
        { error: "Tu ne peux pas supprimer ton propre compte admin ici." },
        { status: 400 }
      );
    }

    try {
      await prisma.user.delete({ where: { id: params.id } });
    } catch (deleteErr: any) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer ce compte : il a des missions, avis ou tickets liés. Supprime-les d'abord ou contacte le support technique.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}
