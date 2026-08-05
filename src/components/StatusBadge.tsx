import { ProjectStatus } from "../../Projects/Project";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectStatus, string> = {
  Ongoing: "bg-red-600 text-white",
  Completed: "bg-emerald-700 text-white",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium shadow-sm",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}