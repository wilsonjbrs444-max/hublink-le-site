import { redirect } from "next/navigation";
import {
  Briefcase,
  CheckCircle2,
  MessageCircle,
  UserPlus,
  Bell,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import MarkAllReadButton from "@/components/MarkAllReadButton";
import NotificationItem from "@/components/NotificationItem";

export const dynamic = "force-dynamic";

const typeIcon: Record<string, any> = {
  nouvelle_offre: Briefcase,
  offre_acceptee: CheckCircle2,
  nouveau_message: MessageCircle,
  nouvel_abonne: UserPlus,
};

type Group = {
  ids: string[];
  type: string;
  content: string;
  link: string;
  createdAt: Date;
  isRead: boolean;
  count: number;
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Regroupe les notifications de messages venant de la même conversation
  // (évite d'afficher 5 lignes séparées si quelqu'un envoie 5 messages d'affilée)
  const groups: Group[] = [];
  const seenMessageLinks = new Map<string, Group>();

  for (const n of notifications) {
    if (n.type === "nouveau_message" && n.link) {
      const existing = seenMessageLinks.get(n.link);
      if (existing) {
        existing.ids.push(n.id);
        existing.count += 1;
        existing.isRead = existing.isRead && n.isRead;
        continue;
      }
      const group: Group = {
        ids: [n.id],
        type: n.type,
        content: n.content || "",
        link: n.link,
        createdAt: n.createdAt,
        isRead: n.isRead,
        count: 1,
      };
      seenMessageLinks.set(n.link, group);
      groups.push(group);
    } else {
      groups.push({
        ids: [n.id],
        type: n.type,
        content: n.content || "",
        link: n.link || "/notifications",
        createdAt: n.createdAt,
        isRead: n.isRead,
        count: 1,
      });
    }
  }

  const unreadCount = groups.filter((g) => !g.isRead).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      <div className="mt-8 space-y-2">
        {groups.map((g) => {
          const Icon = typeIcon[g.type] || Bell;
          return (
            <NotificationItem
              key={g.ids[0]}
              ids={g.ids}
              link={g.link}
              isRead={g.isRead}
            >
              <div
                className={`flex items-start gap-3 rounded-lg border p-4 hover:shadow-sm ${
                  g.isRead ? "bg-white" : "bg-hublink-light"
                }`}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-hublink">
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    {g.content}
                    {g.count > 1 && (
                      <span className="ml-1 rounded-full bg-hublink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        +{g.count - 1}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(g.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                {!g.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-hublink" />
                )}
              </div>
            </NotificationItem>
          );
        })}
        {groups.length === 0 && (
          <p className="text-sm text-gray-500">Aucune notification pour le moment.</p>
        )}
      </div>
    </div>
  );
}
