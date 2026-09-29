"use client";

import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/auth/logout-button";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="text-sm text-muted-foreground">
        {session?.user?.email ? `Signed in as ${session.user.email}` : ""}
      </div>
      <LogoutButton />
    </header>
  );
}