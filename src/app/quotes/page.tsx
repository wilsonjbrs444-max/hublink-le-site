import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    where: { status: "ouverte" },
    orderBy: { createdAt: "desc" },
    include: { company: true, _count: { select: { responses: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Demandes de devis</h1>
          <p className="mt-1 text-sm text-gray-600">
            Besoins professionnels publiés par des entreprises.
          </p>
        </div>
        <Link
          href="/quotes/create"
          className="rounded-md bg-hublink px-4 py-2 text-sm font-semibold text-white hover:bg-hublink-dark"
        >
          + Demander un devis
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {quotes.map((q: any) => (
          <Link
            key={q.id}
            href={`/quotes/${q.id}`}
            className="block rounded-lg border bg-white p-5 shadow-sm hover:shadow-md"
          >
            <p className="font-semibold text-gray-900">
              {q.title || "Demande de devis"}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {q.description}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {q.company.companyName} · {q._count.responses} réponse(s)
            </p>
          </Link>
        ))}
        {quotes.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucune demande de devis ouverte pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
