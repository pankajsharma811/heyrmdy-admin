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
      className="rounded-md border px-4 py-2"
    >
      Logout
    </button>
  );
}