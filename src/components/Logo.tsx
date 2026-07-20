import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "icon" | "full"; // icon = petit logo pour navbar, full = logo + texte pour hero/footer
  showText?: boolean;
};

export default function Logo({ variant = "icon", showText = true }: Props) {
  if (variant === "full") {
    return (
      <Link href="/" className="inline-block">
        <Image
          src="/brand/hublink-logo-full.png"
          alt="HUBLINK — Le lien de l'innovation"
          width={220}
          height={200}
          priority
          className="h-auto w-40"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/brand/hublink-icon.png"
        alt="HUBLINK"
        width={40}
        height={23}
        priority
        className="h-8 w-auto"
      />
      {showText && (
        <span className="font-heading text-lg font-extrabold tracking-tight text-gray-900">
          HUB<span className="text-green-500">LINK</span>
        </span>
      )}
    </Link>
  );
}
