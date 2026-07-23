import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const game = await prisma.ludoGame.findUnique({ where: { id: params.id } });
  if (!game) {
    return NextResponse.json({ error: "Partie introuvable." }, { status: 404 });
  }

  let seats: any[] = JSON.parse(game.seats);
  const alreadyIn = seats.some((s) => s.userId === user.id);

  if (!alreadyIn && game.status === "waiting") {
    const openIndex = seats.findIndex((s) => s.type === "open");
    if (openIndex !== -1) {
      seats[openIndex] = { ...seats[openIndex], type: "human", userId: user.id, name: user.fullName };
      const stillHasOpen = seats.some((s) => s.type === "open");
      const updated = await prisma.ludoGame.update({
        where: { id: params.id },
        data: {
          seats: JSON.stringify(seats),
          status: stillHasOpen ? "waiting" : "active",
        },
      });
      return NextResponse.json({
        game: { ...updated, seats, state: JSON.parse(updated.state) },
      });
    }
  }

  if (!alreadyIn && game.status !== "waiting") {
    return NextResponse.json({ error: "Cette partie est déjà complète." }, { status: 403 });
  }

  return NextResponse.json({
    game: { ...game, seats, state: JSON.parse(game.state) },
  });
}
