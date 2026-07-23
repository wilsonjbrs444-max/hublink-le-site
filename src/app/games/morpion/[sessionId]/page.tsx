import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import MorpionDuelClient from "@/components/games/MorpionDuelClient";

export const dynamic = "force-dynamic";

export default async function MorpionDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <MorpionDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
