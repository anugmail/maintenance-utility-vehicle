import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type StepStatus = "Incomplete" | "Current" | "Completed";

export function HorizontalStepItem({ Status = "Incomplete", Text, Number, Connector = true }: { Status?: StepStatus; Text: string; Number: string; Connector?: boolean }) {
  return (
    <li aria-current={Status === "Current" ? "step" : undefined} className="flex h-18 min-w-0 flex-1 items-center gap-2 bg-white py-4 pl-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className={cx("inline-flex size-10 shrink-0 items-center justify-center rounded-pill border p-2 text-md font-semibold",
          Status === "Completed" ? "border-brand-900 bg-brand-900 text-white" : Status === "Current" ? "border-brand-900 bg-white text-brand-900" : "border-gray-300 bg-white text-gray-400")}>
          {Status === "Completed" ? <Ms name="check-24-300-round" size={24} /> : Number}
        </span>
        <span className={cx("min-w-0 truncate py-1 text-md font-semibold", Status === "Completed" ? "text-black" : Status === "Current" ? "text-brand-900" : "text-gray-600")}>{Text}</span>
      </div>
      {Connector && (
        <span aria-hidden="true" className="relative h-18 w-5 shrink-0">
          <span className="absolute top-0 left-0 h-[41px] w-px origin-top -rotate-[29deg] bg-gray-300" />
          <span className="absolute bottom-0 left-0 h-[41px] w-px origin-bottom rotate-[29deg] bg-gray-300" />
        </span>
      )}
    </li>
  );
}

export function ProgressSteps({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  return (
    <ol aria-label="ขั้นตอน" className={cx("flex overflow-hidden rounded-md border border-gray-300 bg-white", className)}>
      {steps.map((t, i) => (
        <HorizontalStepItem key={t} Text={t} Number={String(i + 1).padStart(2, "0")} Connector={i < steps.length - 1}
          Status={i + 1 < current ? "Completed" : i + 1 === current ? "Current" : "Incomplete"} />
      ))}
    </ol>
  );
}
