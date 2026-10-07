"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UsersTable } from "@/features/users/components/users-table";
import { fetchUsers } from "@/features/users/api";
import type {
  UserListItem,
  PaginationMeta,
} from "@/features/users/types";

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetchUsers({
        page,
        limit: 10,
        search,
        status,
      });

      setUsers(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeout = setTimeout(load, 300);

    return () => clearTimeout(timeout);
  }, [load]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(
    value: "all" | "active" | "inactive" | null,
  ) {
    if (value === null) return;

    setStatus(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#1C1E1C]">
          Users
        </h1>

        <p className="mt-1 text-sm text-[#6B6760]">
          {meta
            ? `${meta.total.toLocaleString()} total users`
            : "Manage and monitor platform users."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A958A]" />

            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 border-[#D8D3C9] bg-[#FBFAF7] pl-9 text-sm text-[#1C1E1C] placeholder:text-[#9A958A] focus-visible:border-[#2F5D56] focus-visible:ring-[#2F5D56]/20"
            />
          </div>

          <Select
            value={status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="h-10 border-[#D8D3C9] bg-[#FBFAF7] text-sm text-[#5C5850] sm:w-36">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <UsersTable users={users} loading={loading} />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E8E4DA] pt-4">
          <p className="text-xs text-[#9A958A]">
            Page{" "}
            <span className="font-medium text-[#5C5850]">
              {meta.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#5C5850]">
              {meta.totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-9 items-center gap-1 rounded-md border border-[#D8D3C9] bg-[#FBFAF7] px-3 text-xs font-medium text-[#5C5850] transition-colors hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-9 items-center gap-1 rounded-md border border-[#D8D3C9] bg-[#FBFAF7] px-3 text-xs font-medium text-[#5C5850] transition-colors hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}