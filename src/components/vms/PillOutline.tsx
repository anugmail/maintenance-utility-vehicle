/* Figma: "Pill outline" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Pill outline.json
   variant: Color = Brand | Gray | Info | Success | Warning | Error | Disabled (Purple ไม่มี token — ดู figma-spec/COMPOSED.md)
   property: Text
   ค่า: สูง 24 · ขอบใน 4/8 · รัศมี 9999 · ขอบ 1 · ตัวอักษร 12 SemiBold */
import { cx } from "@/lib/cx";

export type PillColor = "Brand" | "Gray" | "Info" | "Success" | "Warning" | "Error" | "Disabled";

const COLOR: Record<PillColor, string> = {
  Brand: "bg-brand-50 border-brand-200 text-brand-900",
  Gray: "bg-gray-50 border-gray-200 text-gray-700",
  Info: "bg-info-50 border-info-200 text-info-700",
  Success: "bg-success-50 border-success-200 text-success-700",
  Warning: "bg-warning-50 border-warning-200 text-warning-700",
  Error: "bg-error-50 border-error-200 text-error-700",
  Disabled: "bg-gray-100 border-gray-300 text-gray-400",
};

export function PillOutline({ Text, Color = "Brand", className }: { Text: string; Color?: PillColor; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 shrink-0 items-center justify-center rounded-pill border px-2 text-xs leading-[18px] font-semibold whitespace-nowrap", COLOR[Color], className)}>
      {Text}
    </span>
  );
}
