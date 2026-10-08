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
import { fetchUserCheckins } from "../../api";
import { usePaginatedTab } from "../../hooks/use-paginated-tab";
import { formatDateRange, formatEnum, moodTone } from "../../utils";
import {
  TabEmpty,
  TabError,
  TabLoading,
  TabPagination,
  TabTableShell,
  TagList,
} from "./tab-shared";

export function CheckinsTab({ userId }: { userId: string }) {
  const { items, meta, loading, error, setPage, retry } = usePaginatedTab(
    fetchUserCheckins,
    userId
  );

  if (loading) return <TabLoading />;
  if (error) return <TabError onRetry={retry} />;
  if (items.length === 0) return <TabEmpty message="No check-ins yet" />;

  return (
    <div className="space-y-4">
      <TabTableShell>
        <Table className="min-w-[520px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[#9A958A]">Week</TableHead>
              <TableHead className="h-11 text-xs font-medium text-[#9A958A]">Mood</TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] md:table-cell">Symptoms</TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] lg:table-cell">Remedies</TableHead>
              <TableHead className="hidden h-11 pr-4 text-xs font-medium text-[#9A958A] lg:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-[#EFEBE2] align-top last:border-0 hover:bg-[#F6F3EE]"
              >
                <TableCell className="px-4 py-3">
                  <p className="whitespace-nowrap text-sm font-medium text-[#1C1E1C]">
                    {formatDateRange(item.weekStart, item.weekEnd)}
                  </p>
                  <div className="mt-1.5 md:hidden">
                    <TagList tags={item.symptoms} max={2} />
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      moodTone(item.overallMood)
                    )}
                  >
                    {formatEnum(item.overallMood)}
                  </span>
                </TableCell>

                <TableCell className="hidden py-3 md:table-cell">
                  <TagList tags={item.symptoms} />
                </TableCell>

                <TableCell className="hidden py-3 lg:table-cell">
                  <TagList tags={item.remedy} />
                </TableCell>

                <TableCell className="hidden max-w-[240px] py-3 pr-4 lg:table-cell">
                  <p className="line-clamp-2 text-sm text-[#5C5850]">
                    {item.notes ?? "—"}
                  </p>
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