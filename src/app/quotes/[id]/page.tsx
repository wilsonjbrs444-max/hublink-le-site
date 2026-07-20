import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import QuoteResponseForm from "@/components/QuoteResponseForm";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      responses: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!quote) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.companyProfile?.id === quote.companyId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-bold">
          {quote.title || "Demande de devis"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Publié par {quote.company.companyName}
        </p>
        <p className="mt-4 whitespace-pre-line text-gray-700">
          {quote.description}
        </p>
      </div>

      {!isOwner && (
        <div className="mt-6">
          <QuoteResponseForm quoteId={quote.id} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-semibold text-gray-900">
          Réponses reçues ({quote.responses.length})
        </h2>
        <div className="mt-3 space-y-3">
          {quote.responses.map((r: any) => (
            <div key={r.id} className="rounded-lg border bg-white p-4">
              {r.price && (
                <p className="font-semibold text-hublink">
                  {Number(r.price).toLocaleString("fr-FR")} FCFA
                </p>
              )}
              {r.message && (
                <p className="mt-1 text-sm text-gray-600">{r.message}</p>
              )}
            </div>
          ))}
          {quote.responses.length === 0 && (
            <p className="text-sm text-gray-500">Aucune réponse pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
