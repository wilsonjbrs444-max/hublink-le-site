import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import LudoGameClient from "@/components/games/LudoGameClient";

export const dynamic = "force-dynamic";

export default async function LudoGamePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <LudoGameClient gameId={params.id} currentUserId={user.id} />;
}
