"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusPill } from "./status-pill";
import { updateUserStatus } from "../api";
import { cn } from "@/lib/utils";
import type { UserDetail } from "../types";

function initials(name: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserProfileCard({
  user,
  onStatusChange,
}: {
  user: UserDetail;
  onStatusChange: (status: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    const next = !user.status;

    if (!next && !window.confirm("Deactivate this user?")) return;

    setBusy(true);
    setError("");
    try {
      const result = await updateUserStatus(user.id, next);
      onStatusChange(result.status);
    } catch {
      setError("Could not update status. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#E8E4DA] bg-[#FBFAF7] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profileImage ?? undefined} />
            <AvatarFallback className="bg-[#2F5D56] text-lg font-medium text-[#F6F3EE]">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl leading-tight text-[#1C1E1C]">
              {user.name ?? "Unnamed user"}
            </h1>
            <p className="mt-0.5 truncate text-sm text-[#6B6760]">
              {user.email}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <StatusPill active={user.status} />
              <span className="text-xs text-[#9A958A]">
                Joined{" "}
                {new Date(user.joinedAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className={cn(
              "h-10 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
              user.status
                ? "border border-[#E3C7C0] bg-transparent text-[#A23B2A] hover:bg-[#FBEAE6]"
                : "bg-[#2F5D56] text-[#F6F3EE] hover:opacity-90"
            )}
          >
            {busy ? "Updating" : user.status ? "Deactivate user" : "Activate user"}
          </button>
          {error && <p className="text-xs text-[#A23B2A]">{error}</p>}
        </div>
      </div>
    </div>
  );
}