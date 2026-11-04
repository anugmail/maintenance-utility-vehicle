"use client";
/* Figma: "Checkbox" — ไฟล์ (Component) VMS Plus หน้า Checkbox (node 2:18) · สเปก figma-spec/Checkbox.json
   variant: State = Default | Hover | Focused | Disabled · Type = Unselected | Selected | Indeterminate
   ค่า: 20×20 รัศมี 4 · Unselected ขอบ 2 gray-300 · Selected/Indeterminate พื้น brand-900 ไอคอน check / check_indeterminate_small 20 white
        Disabled พื้น gray-200 ขอบ 2 gray-300 ไอคอน gray-300
        Hover/Focused วงโฟกัส 4 ทึบ 12% (effect ของ Surface): Unselected gray-500 · Selected/Indeterminate brand-900 */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type CheckboxType = "Unselected" | "Selected" | "Indeterminate";

export function Checkbox({ Type = "Unselected", State = "Default", onChange, label, className }: { Type?: CheckboxType; State?: "Default" | "Hover" | "Focused" | "Disabled"; onChange?: (next: boolean) => void; label?: string; className?: string }) {
  const off = State === "Disabled";
  const on = Type !== "Unselected";
  const ring = off ? "" : State === "Hover" || State === "Focused" ? (on ? "shadow-ring" : "shadow-ring-gray")
    : on ? "hover:shadow-ring focus-visible:shadow-ring focus-visible:outline-none" : "hover:shadow-ring-gray focus-visible:shadow-ring-gray focus-visible:outline-none";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={Type === "Indeterminate" ? "mixed" : on}
      aria-label={label}
      disabled={off}
      onClick={() => onChange?.(!on)}
      className={cx("inline-flex size-5 shrink-0 items-center justify-center rounded-xs", off ? "cursor-not-allowed border-2 border-gray-300 bg-gray-200 text-gray-300" : on ? "cursor-pointer bg-brand-900 text-white" : "cursor-pointer border-2 border-gray-300 bg-white", ring, className)}
    >
      {on && <Ms name={Type === "Indeterminate" ? "check_indeterminate_small-20-400-round" : "check-20-400-round"} size={20} />}
    </button>
  );
}
