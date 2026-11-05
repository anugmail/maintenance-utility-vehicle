/* Figma: "Progress steps" + "Horizontal step item" — ไฟล์ (Component) VMS Plus หน้า Progress steps · สเปก figma-spec/Progress steps.json · figma-spec/Horizontal step item.json
   variant (Progress steps): Type = Horizontal (ใช้) | Vertical · property: Step 2 · Step 3 · Step 4 (ซ่อนช่องเกินตาม mtStepper() ใน screens.js)
   Horizontal: กรอบ ขอบ 1 gray-300 (Color/border/primary) รัศมี 8 · ช่องเรียงแนวนอน ยืดเท่ากัน
   Horizontal step item: variant Status = Incomplete | Current | Completed · property: Text · Number · Supporting (ปิด) · Connector
     สูง 72 · ขอบในซ้าย 24 บน/ล่าง 16 · ช่องไฟ 8 · Content ช่องไฟ 16 · วงกลม 40 รัศมี 9999 ขอบ 1
     Incomplete: วง white ขอบ gray-300 ตัวเลข gray-400 (Color/text/disabled) · ข้อความ gray-600 (Color/text/secondary)
     Current: วง white ขอบ brand-900 ตัวเลข brand-900 (Color/text/brand) · ข้อความ brand-900
     Completed: วง brand-900 ไอคอน check 24 white · ข้อความ black (Color/text/primary) · ตัวอักษร 16 SemiBold
     Connector: เส้นหักมุม (>) 20×72 สี gray-300 ชิดขวาของช่อง (ประกอบด้วยเส้น 2 เส้นแทน vector ของไลบรารี — COMPOSED.md) */
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

/** steps = ชื่อขั้น · current = ขั้นปัจจุบัน (1 ขึ้นไป) — ก่อนหน้า Completed · ปัจจุบัน Current · ถัดไป Incomplete · ตัวเลข "01" "02" */
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
