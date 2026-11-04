/* Figma: "Featured icon" — ไฟล์ (Component) VMS Plus หน้า Featured icon (node 2861:54686) · สเปก figma-spec/Featured icon.json
   variant: Color = Gray | Info | Success | Warning | Error | Brand | Disabled | Purple · Size = md (48) | sm (36)
   Purple: พื้น purple-50 · ไอคอน md purple-700 · sm ไลบรารีใช้ purple/600 ซึ่งยังไม่มี token → ใช้ purple-700 (COMPOSED.md ข.)
   property: Icon swap (ค่าเริ่ม info-24-300-round) · วงกลม · ไอคอน 24 */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type FeaturedIconColor = "Gray" | "Info" | "Success" | "Warning" | "Error" | "Brand" | "Disabled" | "Purple";

const COLOR: Record<FeaturedIconColor, string> = {
  Brand: "bg-brand-50 text-brand-900",
  Gray: "bg-gray-100 text-gray-500",
  Info: "bg-info-50 text-info-600",
  Success: "bg-success-50 text-success-600",
  Warning: "bg-warning-50 text-warning-600",
  Error: "bg-error-50 text-error-500",
  Disabled: "bg-gray-100 text-gray-400",
  Purple: "bg-purple-50 text-purple-700",
};

export function FeaturedIcon({ Color = "Brand", Size = "md", IconSwap = "info-24-300-round", className }: { Color?: FeaturedIconColor; Size?: "md" | "sm"; IconSwap?: string; className?: string }) {
  return (
    <span className={cx("inline-flex shrink-0 items-center justify-center rounded-pill", Size === "md" ? "size-12" : "size-9", COLOR[Color], className)}>
      <Ms name={IconSwap} size={24} />
    </span>
  );
}
