import { prisma } from "./prisma";

export async function createNotification(
  userId: string,
  type: string,
  content: string,
  link?: string
) {
  try {
    await prisma.notification.create({
      data: { userId, type, content, link },
    });
  } catch (err) {
    // On ne bloque jamais une action principale si la notification échoue
    console.error("Erreur création notification:", err);
  }
}
