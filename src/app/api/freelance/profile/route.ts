import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { geocodeCity } from "@/lib/geocode";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { bio, specialty, skills, yearsExperience, hourlyRate, city } = await req.json();

    // Géocode la ville en coordonnées pour la carte (silencieux si ça échoue)
    let coords: { latitude: number; longitude: number } | null = null;
    if (city) {
      coords = await geocodeCity(city);
    }

    const profile = await prisma.freelanceProfile.update({
      where: { userId: user.id },
      data: {
        bio,
        specialty,
        skills: JSON.stringify(skills || []),
        yearsExperience: yearsExperience ? Number(yearsExperience) : null,
        hourlyRate: hourlyRate ? Number(hourlyRate) : null,
        city,
        ...(coords && { latitude: coords.latitude, longitude: coords.longitude }),
      },
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.freelanceProfile) {
      return NextResponse.json(
        { error: "Aucun profil freelance actif." },
        { status: 404 }
      );
    }

    try {
      await prisma.freelanceProfile.delete({
        where: { userId: user.id },
      });
    } catch {
      return NextResponse.json(
        {
          error:
            "Impossible de quitter le mode technicien : tu as des offres liées à des missions. Contacte le support pour les annuler d'abord.",
        },
        { status: 409 }
      );
    }

    await prisma.userRole.deleteMany({
      where: { userId: user.id, role: "freelance" },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
