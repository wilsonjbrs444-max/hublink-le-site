import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

const VALID_TYPES = ["product", "mission", "technician"];

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { targetType, targetId } = await req.json();
  if (!VALID_TYPES.includes(targetType) || !targetId) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_targetType_targetId: { userId: user.id, targetType, targetId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: user.id, targetType, targetId },
  });
  return NextResponse.json({ favorited: true });
}
