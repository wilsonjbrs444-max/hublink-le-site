import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { fullName, city, bio, avatarUrl, coverUrl } = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(city !== undefined && { city }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(coverUrl !== undefined && { coverUrl }),
      },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}
