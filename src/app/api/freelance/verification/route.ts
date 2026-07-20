import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.freelanceProfile) {
      return NextResponse.json(
        { error: "Tu dois avoir un profil freelance actif." },
        { status: 403 }
      );
    }

    const { cniDocumentUrl, diplomaDocumentUrl, certificateDocumentUrl } =
      await req.json();

    const profile = await prisma.freelanceProfile.update({
      where: { userId: user.id },
      data: {
        cniDocumentUrl,
        diplomaDocumentUrl,
        certificateDocumentUrl,
        certificationStatus: "en_attente",
      },
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi." },
      { status: 500 }
    );
  }
}
