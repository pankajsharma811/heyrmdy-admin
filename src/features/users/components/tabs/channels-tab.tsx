"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fetchUserChannels } from "../../api";
import { usePaginatedTab } from "../../hooks/use-paginated-tab";
import { channelTypeTone, formatDate, formatEnum } from "../../utils";
import {
  TabEmpty,
  TabError,
  TabLoading,
  TabPagination,
  TabTableShell,
} from "./tab-shared";

export function ChannelsTab({ userId }: { userId: string }) {
  const { items, meta, loading, error, setPage, retry } = usePaginatedTab(
    fetchUserChannels,
    userId
  );

  if (loading) return <TabLoading />;
  if (error) return <TabError onRetry={retry} />;
  if (items.length === 0) return <TabEmpty message="Not a member of any channel" />;

  return (
    <div className="space-y-4">
      <TabTableShell>
        <Table className="min-w-[440px]">
          <TableHeader>
            <TableRow className="border-b border-[#E8E4DA] hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[#9A958A]">
                Channel
              </TableHead>
              <TableHead className="h-11 text-xs font-medium text-[#9A958A]">
                Type
              </TableHead>
              <TableHead className="hidden h-11 text-xs font-medium text-[#9A958A] sm:table-cell">
                Members
              </TableHead>
              <TableHead className="hidden h-11 pr-4 text-xs font-medium text-[#9A958A] md:table-cell">
                Joined
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-[#EFEBE2] last:border-0 hover:bg-[#F6F3EE]"
              >
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-md">
                      <AvatarImage
                        src={item.image ?? undefined}
                        className="rounded-md"
                      />
                      <AvatarFallback className="rounded-md bg-[#2F5D56]/10 text-xs font-medium text-[#2F5D56]">
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1C1E1C]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#9A958A] sm:hidden">
                        {item.totalMembers.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      channelTypeTone(item.channelType)
                    )}
                  >
                    {formatEnum(item.channelType)}
                  </span>
                </TableCell>

                <TableCell className="hidden text-sm text-[#5C5850] sm:table-cell">
                  {item.totalMembers.toLocaleString()}
                </TableCell>

                <TableCell className="hidden whitespace-nowrap pr-4 text-sm text-[#5C5850] md:table-cell">
                  {formatDate(item.joinedAt)}
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