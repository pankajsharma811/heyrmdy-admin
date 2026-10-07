"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import type { UserListItem } from "../types";

function initials(name: string | null) {
  if (!name?.trim()) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
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
      <div className="overflow-hidden rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
        <div className="space-y-px">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-[68px] items-center gap-4 border-b border-[#EEEAE2] px-5 last:border-b-0"
            >
              <Skeleton className="h-9 w-9 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>

              <Skeleton className="hidden h-3 w-32 sm:block" />
              <Skeleton className="hidden h-3 w-24 md:block" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EFEBE2] text-sm font-medium text-[#6B6760]">
            U
          </div>

          <h3 className="mt-3 text-sm font-medium text-[#1C1E1C]">
            No users found
          </h3>

          <p className="mt-1 text-xs text-[#9A958A]">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
      <div className="overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] bg-[#F7F5F0] hover:bg-[#F7F5F0]">
              <TableHead className="h-11 px-5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A857B]">
                User
              </TableHead>

              <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A857B]">
                Email
              </TableHead>

              <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A857B]">
                Joined
              </TableHead>

              <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A857B]">
                Status
              </TableHead>

              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="group border-b border-[#EEEAE2] transition-colors hover:bg-[#F7F5F0] last:border-b-0"
              >
                <TableCell className="px-5 py-3.5">
                  <Link
                    href={`/users/${user.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-9 w-9 border border-[#E8E4DA]">
                      <AvatarImage
                        src={user.profileImage ?? undefined}
                        alt={user.name ?? "User"}
                      />

                      <AvatarFallback className="bg-[#E8EFEC] text-[11px] font-medium text-[#2F5D56]">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-[#1C1E1C]">
                        {user.name ?? "Unnamed"}
                      </p>

                      <p className="truncate text-xs text-[#9A958A] sm:hidden">
                        {user.email}
                      </p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell className="text-[13px] text-[#6B6760]">
                  {user.email}
                </TableCell>

                <TableCell className="whitespace-nowrap text-[13px] text-[#6B6760]">
                  {formatDate(user.joinedAt)}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status
                        ? "border-[#BFD8D1] bg-[#EDF5F2] text-[#2F5D56] hover:bg-[#EDF5F2]"
                        : "border-[#DDD8CE] bg-[#F3F1EC] text-[#7A756C] hover:bg-[#F3F1EC]"
                    }
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        user.status ? "bg-[#4F8A7E]" : "bg-[#9A958A]"
                      }`}
                    />

                    {user.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="pr-4">
                  <Link
                    href={`/users/${user.id}`}
                    aria-label={`View ${user.name ?? "user"}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#B0ABA1] opacity-0 transition-all group-hover:bg-[#EFEBE2] group-hover:text-[#5C5850] group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
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