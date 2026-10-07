"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  async function handleLogout() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-[#D8D3C9] px-3 py-2 text-[13px] font-medium text-[#5C5850] transition-colors hover:bg-[#EFEBE2] hover:text-[#1C1E1C]"
    >
      Logout
    </button>
  );
}