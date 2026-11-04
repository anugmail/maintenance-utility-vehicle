/* Figma: "Pill color" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Pill color.json
   variant: Color = Brand | Gray | Info | Success | Warning | Error | Disabled · property: Text
   ค่า: สูง 24 · ขอบใน 4/8 · รัศมี 9999 · ตัวอักษร 12 SemiBold
        พื้น/ตัวอักษร: Brand brand-900/white · Gray gray-200/gray-600 · Info info-600/white · Success success-600/white · Warning warning-600/white · Error error-500/white · Disabled gray-100/gray-400
   ใช้เป็นป้ายตัวเลขใน Nav item / Nav list item (property Badge) */
import { cx } from "@/lib/cx";
import type { PillColor as PillColorName } from "./PillOutline";

const COLOR: Record<PillColorName, string> = {
  Brand: "bg-brand-900 text-white",
  Gray: "bg-gray-200 text-gray-600",
  Info: "bg-info-600 text-white",
  Success: "bg-success-600 text-white",
  Warning: "bg-warning-600 text-white",
  Error: "bg-error-500 text-white",
  Disabled: "bg-gray-100 text-gray-400",
};

export function PillColor({ Text, Color = "Brand", className }: { Text: string; Color?: PillColorName; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-pill px-2 py-1 text-xs leading-[18px] font-semibold whitespace-nowrap", COLOR[Color], className)}>
      {Text}
    </span>
  );
}
