import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
  }
  if (admin.id === params.id) {
    return NextResponse.json(
      { error: "Tu ne peux pas modifier ton propre statut admin ici." },
      { status: 400 }
    );
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { isAdmin: !target.isAdmin },
  });

  return NextResponse.json({ isAdmin: updated.isAdmin });
}
