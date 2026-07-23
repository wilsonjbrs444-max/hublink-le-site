import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import QuizDuelClient from "@/components/games/QuizDuelClient";

export const dynamic = "force-dynamic";

export default async function QuizDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <QuizDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
