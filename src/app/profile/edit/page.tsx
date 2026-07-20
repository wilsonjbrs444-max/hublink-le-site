import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import EditProfileForm from "@/components/EditProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold">Modifier mon profil</h1>
      <p className="mt-1 text-sm text-gray-600">
        Photo de profil, couverture, bio — personnalise ton profil HUBLINK.
      </p>

      <div className="mt-8">
        <EditProfileForm
          initialData={{
            fullName: user.fullName,
            city: user.city || "",
            bio: user.bio || "",
            avatarUrl: user.avatarUrl || "",
            coverUrl: user.coverUrl || "",
          }}
        />
      </div>
    </div>
  );
}
