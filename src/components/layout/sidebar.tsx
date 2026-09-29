"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users" },
  { label: "Community", href: "/community" },
  { label: "Library", href: "/library" },
  { label: "Categories", href: "/categories" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">heyRMDY Admin</span>
      </div>

      <nav className="space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-black text-white"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}