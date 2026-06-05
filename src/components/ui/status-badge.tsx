import { Badge } from "@/components/ui/badge";

const VARIANTS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  OFFLINE: "bg-neutral-100 text-neutral-500 border-neutral-200",
  COMPROMISED: "bg-red-100 text-red-700 border-red-200",
  MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
  registered: "bg-blue-100 text-blue-700 border-blue-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-mono ${VARIANTS[status] || ""}`}
    >
      {status}
    </Badge>
  );
}
