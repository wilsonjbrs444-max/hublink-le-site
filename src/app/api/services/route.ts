import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICES } from "@/lib/seedServices";

export async function GET() {
  let services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });

  if (services.length === 0) {
    try {
      await prisma.service.createMany({ data: DEFAULT_SERVICES });
    } catch (e) {
      // Ignoré : une autre requête a déjà inséré les données (cas du dev/strict mode)
    }
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    });
  }

  return NextResponse.json({ services });
}
