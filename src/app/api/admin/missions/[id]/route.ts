import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
  }

  await prisma.mission.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
