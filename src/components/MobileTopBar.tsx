import Link from "next/link";
import Logo from "./Logo";
import { getCurrentUser } from "@/lib/currentUser";

export default async function MobileTopBar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
      <Logo variant="dark" size="sm" showTagline={false} />
      <div className="flex items-center gap-3">
        <Link href="/support" className="text-lg" aria-label="Notifications">
          🔔
        </Link>
        <Link
          href={user ? "/dashboard" : "/login"}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-hublink-light text-sm font-semibold text-hublink"
        >
          {user ? user.fullName.charAt(0).toUpperCase() : "👤"}
        </Link>
      </div>
    </header>
  );
}
