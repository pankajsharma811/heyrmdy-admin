"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchUserSymptoms } from "../../api";
import { usePaginatedTab } from "../../hooks/use-paginated-tab";
import { formatDate } from "../../utils";
import {
  TabEmpty,
  TabError,
  TabLoading,
  TabPagination,
  TabTableShell,
  TagList,
} from "./tab-shared";

export function SymptomsTab({ userId }: { userId: string }) {
  const { items, meta, loading, error, setPage, retry } = usePaginatedTab(
    fetchUserSymptoms,
    userId
  );

  if (loading) return <TabLoading />;
  if (error) return <TabError onRetry={retry} />;
  if (items.length === 0) return <TabEmpty message="No symptom logs yet" />;

  return (
    <div className="space-y-4">
      <TabTableShell>
        <Table className="min-w-[420px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[#9A958A]">
                Date
              </TableHead>
              <TableHead className="h-11 text-xs font-medium text-[#9A958A]">
                Symptoms
              </TableHead>
              <TableHead className="hidden h-11 pr-4 text-xs font-medium text-[#9A958A] md:table-cell">
                Logged on
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-[#EFEBE2] align-top last:border-0 hover:bg-[#F6F3EE]"
              >
                <TableCell className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[#1C1E1C]">
                  {formatDate(item.logDate)}
                </TableCell>

                <TableCell className="max-w-[360px] py-3">
                  <TagList tags={item.symptoms} max={4} />
                </TableCell>

                <TableCell className="hidden whitespace-nowrap py-3 pr-4 text-sm text-[#5C5850] md:table-cell">
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