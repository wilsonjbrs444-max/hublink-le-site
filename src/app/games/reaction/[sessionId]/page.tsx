import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import ReactionDuelClient from "@/components/games/ReactionDuelClient";

export const dynamic = "force-dynamic";

export default async function ReactionDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ReactionDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
