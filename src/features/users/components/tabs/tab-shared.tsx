"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginationMeta } from "../../types";

export function TabLoading() {
  return (
    <div className="space-y-px overflow-hidden rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="h-3.5 w-40 bg-[#EFEBE2]" />
          <Skeleton className="ml-auto h-3.5 w-24 bg-[#EFEBE2]" />
        </div>
      ))}
    </div>
  );
}

export function TabEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#D8D3C9] bg-[#FBFAF7] px-6 py-14 text-center">
      <p className="text-sm font-medium text-[#1C1E1C]">{message}</p>
      <p className="mt-1 text-sm text-[#9A958A]">
        Records will appear here once the user adds them.
      </p>
    </div>
  );
}

export function TabError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-[#E3C7C0] bg-[#FBEAE6] px-6 py-10 text-center">
      <p className="text-sm font-medium text-[#A23B2A]">Could not load this tab</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 h-9 rounded-md border border-[#E3C7C0] bg-[#FBFAF7] px-4 text-xs font-medium text-[#A23B2A] transition-colors hover:bg-white"
      >
        Try again
      </button>
    </div>
  );
}

export function TabTableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8E4DA] bg-[#FBFAF7]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function TabPagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-[#9A958A]">
        Page <span className="font-medium text-[#5C5850]">{meta.page}</span> of{" "}
        <span className="font-medium text-[#5C5850]">{meta.totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="flex h-9 items-center gap-1 rounded-md border border-[#D8D3C9] bg-[#FBFAF7] px-3 text-xs font-medium text-[#5C5850] transition-colors hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <button
          type="button"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="flex h-9 items-center gap-1 rounded-md border border-[#D8D3C9] bg-[#FBFAF7] px-3 text-xs font-medium text-[#5C5850] transition-colors hover:bg-[#EFEBE2] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function TagList({
  tags,
  max = 3,
}: {
  tags: string[];
  max?: number;
}) {
  if (tags.length === 0) {
    return <span className="text-sm text-[#B6B1A5]">—</span>;
  }

  const visible = tags.slice(0, max);
  const hidden = tags.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="rounded-full bg-[#EFEBE2] px-2 py-0.5 text-xs text-[#5C5850]"
        >
          {tag}
        </span>
      ))}
      {hidden > 0 && (
        <span className="rounded-full px-1.5 py-0.5 text-xs text-[#9A958A]">
          +{hidden}
        </span>
      )}
    </div>
  );
}