import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import TapeTaupeDuelClient from "@/components/games/TapeTaupeDuelClient";

export const dynamic = "force-dynamic";

export default async function TapeTaupeDuelPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <TapeTaupeDuelClient sessionId={params.sessionId} currentUserId={user.id} />;
}
