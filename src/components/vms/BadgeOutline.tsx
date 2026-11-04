/* Figma: "Badge outline" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline.json
   ใช้ซ้อนใน Page header / Section header (ป้ายจำนวน/สถานะข้างหัวข้อ)
   variant: Color = Brand | Gray | Disabled | Success | Error · property: Text
   ค่า: สูง 24 · ขอบใน 4/8 · รัศมี 4 · ขอบ 1 · ตัวอักษร 12 SemiBold */
import { cx } from "@/lib/cx";

export type BadgeOutlineColor = "Brand" | "Gray" | "Disabled" | "Success" | "Error";

const COLOR: Record<BadgeOutlineColor, string> = {
  Brand: "bg-brand-50 border-brand-200 text-brand-900",
  Gray: "bg-white border-gray-300 text-gray-600",
  Disabled: "bg-gray-100 border-gray-300 text-gray-400",
  Success: "bg-success-50 border-success-200 text-success-700",
  Error: "bg-error-50 border-error-200 text-error-700",
};

export function BadgeOutline({ Text, Color = "Gray", className }: { Text: string; Color?: BadgeOutlineColor; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 shrink-0 items-center gap-1 rounded-xs border px-2 text-xs leading-[18px] font-semibold whitespace-nowrap", COLOR[Color], className)}>
      {Text}
    </span>
  );
}
