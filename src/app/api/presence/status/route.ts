import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { isEffectivelyOnline } from "@/lib/presence";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ statuses: {} });
  }

  const idsParam = req.nextUrl.searchParams.get("ids") || "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100); // on limite pour éviter les abus

  if (ids.length === 0) {
    return NextResponse.json({ statuses: {} });
  }

  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, isOnline: true, lastActiveAt: true },
  });

  const statuses: Record<string, boolean> = {};
  for (const u of users) {
    statuses[u.id] = isEffectivelyOnline(u.isOnline, u.lastActiveAt);
  }

  return NextResponse.json({ statuses });
}
