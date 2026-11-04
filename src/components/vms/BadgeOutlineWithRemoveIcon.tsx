"use client";
/* Figma: "Badge outline with remove icon" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline with remove icon.json
   ใช้เป็นชิปค่าที่เลือกใน Input dropdown with badges (Color=Gray) และชิปตัวกรองใน Table header (Color=Brand)
   variant: Color = Brand | Gray | Disabled · property: Text
   ค่า: สูง 24 · ขอบใน 4 บน/ล่าง · ซ้าย 8 ขวา 4 · ช่องไฟ 4 · รัศมี 4 · ตัวอักษร 12 SemiBold · ไอคอนลบ _close_small 12 (Brand brand-800 · Gray gray-500) */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type RemoveBadgeColor = "Brand" | "Gray" | "Disabled";

const COLOR: Record<RemoveBadgeColor, [string, string]> = {
  Brand: ["bg-brand-50 border-brand-200 text-brand-900", "text-brand-800"],
  Gray: ["bg-white border-gray-300 text-gray-600", "text-gray-500"],
  Disabled: ["bg-gray-100 border-gray-300 text-gray-400", "text-gray-400"],
};

export function BadgeOutlineWithRemoveIcon({ Text, Color = "Gray", onRemove, className }: { Text: string; Color?: RemoveBadgeColor; onRemove?: () => void; className?: string }) {
  const [box, ic] = COLOR[Color];
  return (
    <span className={cx("inline-flex h-6 shrink-0 items-center gap-1 rounded-xs border pr-1 pl-2 text-xs leading-[18px] font-semibold whitespace-nowrap", box, className)}>
      {Text}
      {onRemove ? (
        <button type="button" aria-label={"เอา " + Text + " ออก"} disabled={Color === "Disabled"} className="inline-flex cursor-pointer items-center" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          <Ms name="close_small-20-400-round" size={12} className={ic} />
        </button>
      ) : (
        <Ms name="close_small-20-400-round" size={12} className={ic} />
      )}
    </span>
  );
}
