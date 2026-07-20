import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceRequestForm from "@/components/ServiceRequestForm";

export const dynamic = "force-dynamic";

const WHATSAPP_NUMBER = "237695124132";

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    include: { gallery: true },
  });

  if (!service) notFound();

  const whatsappMessage = encodeURIComponent(
    `Bonjour HUBLINK, je suis intéressé(e) par le service "${service.title}".`
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{service.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{service.title}</h1>
          {service.priceIndicative && (
            <p className="text-sm font-medium text-hublink">
              {service.priceIndicative}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-gray-700">{service.description}</p>

      {service.gallery.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {service.gallery.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={img.caption || service.title}
              className="aspect-square rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Demande de devis gratuit</h2>
          <p className="mt-1 text-sm text-gray-600">
            Décris ton besoin, on te recontacte rapidement.
          </p>
          <div className="mt-4">
            <ServiceRequestForm slug={service.slug} />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-lg border bg-green-50 p-5">
          <h2 className="font-semibold text-green-800">
            Besoin d'une réponse rapide ?
          </h2>
          <p className="mt-1 text-sm text-green-700">
            Contacte-nous directement sur WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-md bg-green-600 px-4 py-2 text-center font-semibold text-white hover:bg-green-700"
          >
            💬 Discuter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
