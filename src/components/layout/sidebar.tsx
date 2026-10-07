"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  BookOpen,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Community", href: "/community", icon: MessagesSquare },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Categories", href: "/categories", icon: Tags },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-[#E8E4DA] bg-[#FBFAF7] md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-[#E8E4DA] px-6">
        <span className="font-serif text-lg tracking-tight text-[#2F5D56]">
          heyRMDY
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                active
                  ? "bg-[#2F5D56] text-[#F6F3EE]"
                  : "text-[#5C5850] hover:bg-[#EFEBE2] hover:text-[#1C1E1C]"
              )}
            >
              <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E8E4DA] px-6 py-4">
        <p className="text-xs text-[#9A958A]">Admin Console</p>
      </div>
    </aside>
  );
}