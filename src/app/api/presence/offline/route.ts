import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isOnline: false, lastActiveAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
