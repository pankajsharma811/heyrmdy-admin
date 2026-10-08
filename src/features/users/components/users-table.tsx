"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { UserListItem } from "../types";

function initials(name: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-[#2F5D56]/10 text-[#2F5D56]"
          : "bg-[#EFEBE2] text-[#7A756A]"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-[#2F5D56]" : "bg-[#B6B1A5]"
        )}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function UsersTable({
  users,
  loading,
}: {
  users: UserListItem[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-px overflow-hidden rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="h-9 w-9 rounded-full bg-[#EFEBE2]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-40 bg-[#EFEBE2]" />
              <Skeleton className="h-3 w-56 bg-[#EFEBE2]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#D8D3C9] bg-[#FBFAF7] px-6 py-14 text-center">
        <p className="text-sm font-medium text-[#1C1E1C]">No users found</p>
        <p className="mt-1 text-sm text-[#9A958A]">
          Try adjusting your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
      <div className="overflow-x-auto">
        <Table className="min-w-[520px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[#9A958A]">
                User
              </TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] md:table-cell">
                Email
              </TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] lg:table-cell">
                Joined
              </TableHead>
              <TableHead className="h-11 text-xs font-medium text-[#9A958A]">
                Status
              </TableHead>
              <TableHead className="h-11 w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="group border-b border-[#EFEBE2] last:border-0 hover:bg-[#F6F3EE]"
              >
                <TableCell className="px-4 py-3">
                  <Link
                    href={`/users/${user.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profileImage ?? undefined} />
                      <AvatarFallback className="bg-[#2F5D56] text-xs font-medium text-[#F6F3EE]">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1C1E1C]">
                        {user.name ?? "Unnamed"}
                      </p>
                      <p className="truncate text-xs text-[#9A958A] md:hidden">
                        {user.email}
                      </p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell className="hidden text-sm text-[#5C5850] md:table-cell">
                  {user.email}
                </TableCell>

                <TableCell className="hidden text-sm text-[#5C5850] lg:table-cell">
                  {new Date(user.joinedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  <StatusPill active={user.status} />
                </TableCell>

                <TableCell className="pr-4">
                  <Link href={`/users/${user.id}`} aria-label="View user">
                    <ChevronRight
                      className="h-4 w-4 text-[#B6B1A5] transition-colors group-hover:text-[#2F5D56]"
                      strokeWidth={1.75}
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}