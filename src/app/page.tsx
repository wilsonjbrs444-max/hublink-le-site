import Link from "next/link";
import RotatingTagline from "@/components/RotatingTagline";

const highlights = [
  {
    title: "Services HUBLINK",
    desc: "Développement, cybersécurité, réseaux, installation, cloud...",
    href: "/services",
  },
  {
    title: "HUBLINK Freelance",
    desc: "Publiez une mission, recevez des offres de techniciens vérifiés.",
    href: "/freelance",
  },
  {
    title: "Marketplace",
    desc: "Achetez du matériel informatique auprès de vendeurs vérifiés.",
    href: "/marketplace",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-hublink-light py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            La plateforme tech tout-en-un
          </h1>
          <RotatingTagline />
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/freelance/create"
              className="rounded-md bg-hublink px-6 py-3 font-semibold text-white hover:bg-hublink-dark"
            >
              Publier une mission
            </Link>
            <Link
              href="/freelance/become"
              className="rounded-md border border-hublink px-6 py-3 font-semibold text-hublink hover:bg-white"
            >
              Devenir freelance
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((h: any) => (
            <Link
              key={h.href}
              href={h.href}
              className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {h.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{h.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
