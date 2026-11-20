import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export function MobileProgressSteps({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  const pct = Math.round((current / steps.length) * 100);
  const next = steps[current];
  return (
    <div aria-label="ขั้นตอน" className={cx("flex items-center gap-4 rounded-md border border-gray-300 bg-white p-4", className)}>
      <span className="relative inline-flex size-18 shrink-0 items-center justify-center rounded-pill" style={{ background: `conic-gradient(var(--brand-900) 0 ${pct}%, var(--gray-300) 0)` }}>
        <span className="absolute inset-1.5 rounded-pill bg-white" />
        <span className="relative flex items-center gap-1 text-xs"><b className="font-semibold text-black">{current}</b><span className="text-gray-400">/</span><b className="font-semibold text-black">{steps.length}</b></span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-md font-semibold text-black">{steps[current - 1]}</span>
        {next && <span className="flex items-center gap-1 text-xs text-gray-600"><b className="font-semibold">ถัดไป:</b>{next}</span>}
      </div>
      <Ms name="keyboard_arrow_down-20-400-round" size={20} className="text-gray-600" />
    </div>
  );
}
