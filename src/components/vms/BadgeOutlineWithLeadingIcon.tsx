/* Figma: "Badge outline with leading icon" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline with leading icon.json
   variant: Color = Brand | Gray | Disabled | Success | Error · property: Text · Leading icon swap
   ค่า: สูง 24 · ขอบใน 4/8/4/6 · ช่องไฟ 4 · รัศมี 4 · ขอบ 1 · ไอคอน 12 (Brand brand-800 · Gray gray-500) · ตัวอักษร 12 SemiBold
   ใช้ใน Spare Part Card Item ("เลือกแล้ว" ไอคอน check) */
import { cx } from "@/lib/cx";
import type { BadgeOutlineColor } from "./BadgeOutline";
import { Ms } from "./Ms";

const COLOR: Record<BadgeOutlineColor, [string, string]> = {
  Brand: ["bg-brand-50 border-brand-200 text-brand-900", "text-brand-800"],
  Gray: ["bg-white border-gray-300 text-gray-600", "text-gray-500"],
  Disabled: ["bg-gray-100 border-gray-300 text-gray-400", "text-gray-400"],
  Success: ["bg-success-50 border-success-200 text-success-700", "text-success-600"],
  Error: ["bg-error-50 border-error-200 text-error-700", "text-error-500"],
};

export function BadgeOutlineWithLeadingIcon({ Text, Color = "Gray", LeadingIconSwap = "check-24-300-round", className }: { Text: string; Color?: BadgeOutlineColor; LeadingIconSwap?: string; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 shrink-0 items-center gap-1 rounded-xs border py-1 pr-2 pl-1.5 text-xs leading-[18px] font-semibold whitespace-nowrap", COLOR[Color][0], className)}>
      <Ms name={LeadingIconSwap} size={12} className={COLOR[Color][1]} />
      {Text}
    </span>
  );
}
