import { STATUS_LABEL } from "@/lib/school/rules";
import type { GateStatus } from "@/lib/school/types";
import { cn } from "@/lib/utils";

const tone: Record<GateStatus, string> = {
  on_time: "bg-ok-soft text-ok",
  late: "bg-gold-soft text-gold-dark",
  early_exit: "bg-rose-soft text-rose",
  dismissed: "bg-leaf text-primary-dark",
  absent: "bg-rose-soft text-rose",
};

export function StatusBadge({ status }: { status: GateStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        tone[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
