import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

async function assertAdmin() {
  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) return null;
  return admin;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
  }

  const { title, icon, description, priceIndicative, isActive } = await req.json();

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(icon !== undefined && { icon }),
      ...(description !== undefined && { description }),
      ...(priceIndicative !== undefined && { priceIndicative }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ service });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
  }

  await prisma.service.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
