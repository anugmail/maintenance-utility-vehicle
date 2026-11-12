/* Figma: "Badge outline with indicator" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline with indicator.json
   ป้ายสถานะแบบมีจุดนำ (Fleet card ของหน้า 5.2 Vehicle Management · UI Release#2 ใช้ Color=Success "ปกติ" / Color=Error "หมดอายุ")
   variant: Color = Gray | Brand | Info | Success | Warning | Error · property: Text
   ค่า: สูง 24 · ขอบใน 4/8 · ช่องไฟ 4 · รัศมี 4 · พื้น white ขอบ 1 gray-300 ทุกสี · ตัวอักษร 12 SemiBold gray-600 (Color/text/secondary)
        Indicator Size=sm สีจุด Color/component/utility/<สี>/500: gray-500 · brand-500 · info-600 · success-600 · warning-600 · error-500 (token ที่ค่าตรงกับ utility 500 ของไลบรารี) */
import { cx } from "@/lib/cx";
import { Indicator } from "./Indicator";

export type BadgeIndicatorColor = "Gray" | "Brand" | "Info" | "Success" | "Warning" | "Error";
const DOT: Record<BadgeIndicatorColor, string> = {
  Gray: "bg-gray-500", Brand: "bg-brand-500", Info: "bg-info-600", Success: "bg-success-600", Warning: "bg-warning-600", Error: "bg-error-500",
};

export function BadgeOutlineWithIndicator({ Text, Color = "Gray", className }: { Text: string; Color?: BadgeIndicatorColor; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-xs border border-gray-300 bg-white px-2 text-xs leading-[18px] font-semibold whitespace-nowrap text-gray-600", className)}>
      <Indicator Size="sm" dot={DOT[Color]} />{Text}
    </span>
  );
}
