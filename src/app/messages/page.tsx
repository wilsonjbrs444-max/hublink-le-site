import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import ConversationSearch from "@/components/ConversationSearch";

export const dynamic = "force-dynamic";

export default async function MessagesInboxPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId: user.id } } },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const sorted = conversations
    .filter((c) => c.messages.length > 0)
    .sort(
      (a, b) =>
        new Date(b.messages[0].createdAt).getTime() -
        new Date(a.messages[0].createdAt).getTime()
    )
    .map((c: any) => {
      const other = c.participants.find((p) => p.userId !== user.id)?.user;
      const lastMessage = c.messages[0];
      return {
        id: c.id,
        otherName: other?.fullName || "Utilisateur",
        otherId: other?.id || "",
        lastMessage: lastMessage.content,
        isMine: lastMessage.senderId === user.id,
        createdAt: lastMessage.createdAt.toISOString(),
      };
    });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-gray-600">
        Toutes tes conversations, peu importe d'où elles ont démarré.
      </p>

      <div className="mt-8">
        <ConversationSearch conversations={sorted} />
      </div>
    </div>
  );
}
