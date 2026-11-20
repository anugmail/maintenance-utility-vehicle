import { cx } from "@/lib/cx";

export function ProgressBar({ Progress, Percentage = true, Color = "Brand", className }: { Progress: number; Percentage?: boolean; Color?: "Brand" | "Success"; className?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(Progress)));
  return (
    <div className={cx("flex items-center gap-2", className)} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-pill bg-gray-300">
        {p > 0 && <div className={cx("absolute inset-y-0 left-0 rounded-pill", Color === "Success" ? "bg-success-500" : "bg-brand-900")} style={{ width: p + "%" }} />}
      </div>
      {Percentage && <span className="w-10 shrink-0 text-right text-sm text-gray-600">{p}%</span>}
    </div>
  );
}
