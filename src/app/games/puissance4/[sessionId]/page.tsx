import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import Puissance4DuelClient from "@/components/games/Puissance4DuelClient";

export const dynamic = "force-dynamic";

export default async function Puissance4DuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <Puissance4DuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
