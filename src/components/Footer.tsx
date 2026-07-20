import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-6 text-sm text-gray-500 dark:bg-gray-950">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4">
        <Logo variant="icon" showText={false} />
        <span className="ml-3 text-xs text-gray-400">
          © {new Date().getFullYear()} HUBLINK — Tous droits réservés.
        </span>
      </div>
    </footer>
  );
}
