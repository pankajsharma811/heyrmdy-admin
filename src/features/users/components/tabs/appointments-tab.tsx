"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fetchUserAppointments } from "../../api";
import { usePaginatedTab } from "../../hooks/use-paginated-tab";
import { formatDate, formatEnum } from "../../utils";
import type { AppointmentItem } from "../../types";
import {
  TabEmpty,
  TabError,
  TabLoading,
  TabPagination,
  TabTableShell,
} from "./tab-shared";

function AppointmentStatus({ status }: { status: AppointmentItem["status"] }) {
  const upcoming = status === "UPCOMING";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        upcoming ? "bg-[#2F5D56]/10 text-[#2F5D56]" : "bg-[#EFEBE2] text-[#7A756A]"
      )}
    >
      {formatEnum(status)}
    </span>
  );
}

export function AppointmentsTab({ userId }: { userId: string }) {
  const { items, meta, loading, error, setPage, retry } = usePaginatedTab(
    fetchUserAppointments,
    userId
  );

  if (loading) return <TabLoading />;
  if (error) return <TabError onRetry={retry} />;
  if (items.length === 0) return <TabEmpty message="No appointments yet" />;

  return (
    <div className="space-y-4">
      <TabTableShell>
        <Table className="min-w-[520px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[#9A958A]">Provider</TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] md:table-cell">Visit type</TableHead>
              <TableHead className="h-11 text-xs font-medium text-[#9A958A]">Date</TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] lg:table-cell">Location</TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] lg:table-cell">Felt</TableHead>
              <TableHead className="h-11 pr-4 text-xs font-medium text-[#9A958A]">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-[#EFEBE2] last:border-0 hover:bg-[#F6F3EE]"
              >
                <TableCell className="px-4 py-3">
                  <p className="text-sm font-medium text-[#1C1E1C]">{item.providerName}</p>
                  <p className="text-xs text-[#9A958A] md:hidden">{formatEnum(item.visitType)}</p>
                </TableCell>
                <TableCell className="hidden text-sm text-[#5C5850] md:table-cell">
                  {formatEnum(item.visitType)}
                </TableCell>
                <TableCell>
                  <p className="text-sm text-[#1C1E1C]">{formatDate(item.date)}</p>
                  <p className="text-xs text-[#9A958A]">{item.time}</p>
                </TableCell>
                <TableCell className="hidden max-w-[220px] truncate text-sm text-[#5C5850] lg:table-cell">
                  {item.location ?? "—"}
                </TableCell>
                <TableCell className="hidden text-sm text-[#5C5850] lg:table-cell">
                  {item.feel ? formatEnum(item.feel) : "—"}
                </TableCell>
                <TableCell className="pr-4">
                  <AppointmentStatus status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabTableShell>

      {meta && <TabPagination meta={meta} onPageChange={setPage} />}
    </div>
  );
}