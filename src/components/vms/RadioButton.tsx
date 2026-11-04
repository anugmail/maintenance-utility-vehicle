"use client";
/* Figma: "Radio button" — ไฟล์ (Component) VMS Plus หน้า Radio button (node 2:17) · สเปก figma-spec/Radio button.json
   variant: State = Default | Hover | Focused | Disabled · Selected = True | False
   ค่า: วงกลม 20 · ไม่เลือก ขอบ 2 gray-300 · เลือก พื้น brand-900 จุดกลาง 8 white · Disabled พื้น gray-200 ขอบ 2 gray-300 (จุด gray-300)
        Hover/Focused วงโฟกัส 4 ทึบ 12% (effect ของ Surface): ไม่เลือก gray-500 · เลือก brand-900 */
import { cx } from "@/lib/cx";

export interface RadioButtonProps {
  Selected?: boolean;
  State?: "Default" | "Hover" | "Focused" | "Disabled";
  onChange?: () => void;
  /** ป้ายสำหรับโปรแกรมอ่านจอ (เมื่อไม่มีข้อความข้างๆ) */
  label?: string;
  /** true = แสดงเฉยๆ (อยู่ในการ์ด/แถวที่กดได้ทั้งแถว) */
  bare?: boolean;
  className?: string;
}

export function radioLook(Selected: boolean, State: RadioButtonProps["State"] = "Default", interactive = true) {
  const off = State === "Disabled";
  const ring = off ? "" : State === "Hover" || State === "Focused" ? (Selected ? "shadow-ring" : "shadow-ring-gray")
    : !interactive ? "" : Selected ? "group-hover:shadow-ring" : "group-hover:shadow-ring-gray";
  return cx("relative inline-flex size-5 shrink-0 items-center justify-center rounded-pill",
    off ? "border-2 border-gray-300 bg-gray-200" : Selected ? "bg-brand-900" : "border-2 border-gray-300 bg-white", ring);
}

export function RadioDot({ Selected = false, State = "Default", interactive = true }: { Selected?: boolean; State?: RadioButtonProps["State"]; interactive?: boolean }) {
  return (
    <span aria-hidden="true" className={radioLook(Selected, State, interactive)}>
      {Selected && <span className={cx("size-2 rounded-pill", State === "Disabled" ? "bg-gray-300" : "bg-white")} />}
    </span>
  );
}

export function RadioButton({ Selected = false, State = "Default", onChange, label, bare, className }: RadioButtonProps) {
  if (bare) return <span className={className}><RadioDot Selected={Selected} State={State} interactive={false} /></span>;
  const off = State === "Disabled";
  return (
    <button type="button" role="radio" aria-checked={Selected} aria-label={label} disabled={off} onClick={onChange}
      className={cx("group inline-flex rounded-pill focus-visible:outline-none", off ? "cursor-not-allowed" : "cursor-pointer", className)}>
      <RadioDot Selected={Selected} State={State} />
    </button>
  );
}
