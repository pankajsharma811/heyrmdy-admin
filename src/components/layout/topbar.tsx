"use client";

import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/auth/logout-button";

function initials(name: string | null | undefined, email: string | null | undefined) {
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? "A";
}

export function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E8E4DA] bg-[#FBFAF7] px-6">
      <div />

      {session?.user?.email && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[13px] font-medium text-[#1C1E1C]">
              {session.user.name ?? "Admin"}
            </p>
            <p className="text-xs text-[#9A958A]">{session.user.email}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F5D56] text-xs font-medium text-[#F6F3EE]">
            {initials(session.user.name, session.user.email)}
          </div>

          <LogoutButton />
        </div>
      )}
    </header>
  );
}