import { cn } from "@/lib/utils";

export function StatusPill({ active }: { active: boolean }) {
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