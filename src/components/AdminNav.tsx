import Link from "next/link";

const tabs = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/missions", label: "Missions" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/verifications", label: "Vérifications" },
  { href: "/admin/support", label: "Support" },
];

export default function AdminNav({ current }: { current: string }) {
  return (
    <div className="mb-8 flex gap-1 overflow-x-auto border-b">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
            current === t.href
              ? "border-hublink text-hublink"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
