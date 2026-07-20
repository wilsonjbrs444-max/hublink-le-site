import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import ServiceForm from "@/components/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Modifier le service</h1>
      <div className="mt-8">
        <ServiceForm
          serviceId={service.id}
          initialData={{
            title: service.title,
            icon: service.icon || "",
            description: service.description || "",
            priceIndicative: service.priceIndicative || "",
          }}
        />
      </div>
    </div>
  );
}
