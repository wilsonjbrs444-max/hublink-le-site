import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
  }

  const { status } = await req.json();
  const valid = ["ouvert", "en_cours", "resolu", "ferme"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ ticket });
}
