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
import { fetchUserFlares } from "../../api";
import { usePaginatedTab } from "../../hooks/use-paginated-tab";
import { formatDate, formatEnum, intensityTone } from "../../utils";
import {
  TabEmpty,
  TabError,
  TabLoading,
  TabPagination,
  TabTableShell,
  TagList,
} from "./tab-shared";

export function FlaresTab({ userId }: { userId: string }) {
  const { items, meta, loading, error, setPage, retry } = usePaginatedTab(
    fetchUserFlares,
    userId
  );

  if (loading) return <TabLoading />;
  if (error) return <TabError onRetry={retry} />;
  if (items.length === 0) return <TabEmpty message="No flares logged yet" />;

  const offset = meta ? (meta.page - 1) * meta.limit : 0;

  return (
    <div className="space-y-4">
      <TabTableShell>
        <Table className="min-w-[520px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] hover:bg-transparent">
              <TableHead className="hidden h-11 w-14 px-4 text-xs font-medium text-[#9A958A] sm:table-cell">
                No.
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-medium text-[#9A958A] sm:px-2">
                Date &amp; time
              </TableHead>
              <TableHead className="h-11 text-xs font-medium text-[#9A958A]">
                Intensity
              </TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] md:table-cell">
                Symptoms
              </TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] lg:table-cell">
                Notes
              </TableHead>
              <TableHead className="hidden h-11 pr-4 text-xs font-medium text-[#9A958A] lg:table-cell">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id}
                className="border-b border-[#EFEBE2] align-top last:border-0 hover:bg-[#F6F3EE]"
              >
                <TableCell className="hidden px-4 py-3 text-sm text-[#9A958A] sm:table-cell">
                  {offset + index + 1}
                </TableCell>

                <TableCell className="px-4 py-3 sm:px-2">
                  <p className="whitespace-nowrap text-sm font-medium text-[#1C1E1C]">
                    {formatDate(item.date)}
                  </p>
                  <p className="text-xs text-[#9A958A]">{item.time}</p>
                  <div className="mt-1.5 md:hidden">
                    <TagList tags={item.symptoms} max={2} />
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      intensityTone(item.intensity)
                    )}
                  >
                    {formatEnum(item.intensity)}
                  </span>
                </TableCell>

                <TableCell className="hidden max-w-[260px] py-3 md:table-cell">
                  <TagList tags={item.symptoms} />
                </TableCell>

                <TableCell className="hidden max-w-[240px] py-3 lg:table-cell">
                  <p className="line-clamp-2 text-sm text-[#5C5850]">
                    {item.notes ?? "—"}
                  </p>
                </TableCell>

                <TableCell className="hidden whitespace-nowrap py-3 pr-4 text-sm text-[#5C5850] lg:table-cell">
                  {formatDate(item.createdAt)}
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