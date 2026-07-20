import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import ServiceForm from "@/components/ServiceForm";

export const dynamic = "force-dynamic";

export default async function CreateServicePage() {
  const admin = await getCurrentUser();
  if (!admin) redirect("/login");
  if (!admin.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500">
        Accès réservé aux administrateurs.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Ajouter un service</h1>
      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  );
}
