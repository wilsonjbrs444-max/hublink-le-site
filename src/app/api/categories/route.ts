import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  "Développement",
  "Cybersécurité",
  "Maintenance PC",
  "Maintenance imprimantes",
  "Installation Windows",
  "Installation Linux",
  "Caméras",
  "Réseaux",
  "Graphisme",
  "Montage vidéo",
  "Marketing",
  "Création de sites",
  "Applications mobiles",
  "Administration systèmes",
  "Cloud",
  "IA",
];

export async function GET() {
  let categories = await prisma.missionCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Première utilisation : on crée les catégories par défaut
  // skipDuplicates évite l'erreur si deux requêtes arrivent en même temps
  if (categories.length === 0) {
    try {
      await prisma.missionCategory.createMany({
        data: DEFAULT_CATEGORIES.map((name) => ({ name })),
      });
    } catch (e) {
      // Ignoré : une autre requête a déjà inséré les données (cas du dev/strict mode)
    }
    categories = await prisma.missionCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  return NextResponse.json({ categories });
}
