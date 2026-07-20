import Link from "next/link";
import { redirect } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  GraduationCap,
  ClipboardList,
  Newspaper,
} from "lucide-react";
import { getCurrentUser } from "@/lib/currentUser";
import ThemeSettingRow from "@/components/ThemeSettingRow";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <p className="mt-1 text-sm text-gray-600">
        Gère ton compte et tes préférences HUBLINK.
      </p>

      {/* Compte */}
      <section className="mt-8">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Compte
        </h2>
        <div className="divide-y rounded-lg border bg-white">
          <Link
            href={`/profile/${user.id}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link
            href="/profile/edit"
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="text-sm text-gray-700">
              Modifier photo, couverture, bio
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </section>

      {/* Sécurité */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Sécurité
        </h2>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-gray-500" />
            <p className="text-sm text-gray-700">Mot de passe</p>
          </div>
          <div className="mt-2 pl-7">
            <ChangePasswordForm />
          </div>
        </div>
      </section>

      {/* Apparence */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Apparence
        </h2>
        <ThemeSettingRow />
      </section>

      {/* Notifications */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Notifications
        </h2>
        <Link
          href="/notifications"
          className="flex items-center justify-between rounded-lg border bg-white p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-gray-500" />
            <span className="text-sm text-gray-700">Voir mes notifications</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>
      </section>

      {/* Aide */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Aide et légal
        </h2>
        <div className="divide-y rounded-lg border bg-white">
          <Link
            href="/support"
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Centre d'aide</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <div className="flex items-center gap-3 p-4 text-gray-400">
            <FileText size={18} />
            <span className="text-sm">
              Conditions d'utilisation <span className="text-xs">(bientôt)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Explorer */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Explorer
        </h2>
        <div className="divide-y rounded-lg border bg-white">
          <Link
            href="/training"
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Formation</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link
            href="/quotes"
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Demandes de devis Pro</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link
            href="/blog"
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Newspaper size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Blog</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </section>

      {/* Déconnexion */}
      <section className="mt-8">
        <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-3 text-red-700">
            <LogOut size={18} />
            <span className="text-sm font-medium">Se déconnecter</span>
          </div>
          <LogoutButton />
        </div>
      </section>
    </div>
  );
}
