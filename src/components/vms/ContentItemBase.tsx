/* Figma: "_Content item base" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/_Content item base.json
   ช่องข้อมูล 1 ช่องใน Content item row
   variant: Type = Text | Text with label (ที่ต้นแบบใช้ · kv()) | Attachment | Big | Component swap
   property: Leading icon (ปิดตาม kv()) · Label · Text · Supporting · Supporting text · Instance swap (Component swap)
   ค่า: ช่องไฟ 8 · ไอคอนนำ 24 brand-900 · Text with label: Label 16 SemiBold black → Text 16 Regular black ห่าง 4
        Text: Text 16 black + Supporting text 16 gray-600 · Attachment: Text สีลิงก์ info-700 (token ใกล้สุด — COMPOSED.md ข.) · Big: 20/20 */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type ContentItemType = "Text" | "Text with label" | "Attachment" | "Big" | "Component swap";

export interface ContentItemBaseProps {
  Type?: ContentItemType;
  Label?: ReactNode;
  Text?: ReactNode;
  SupportingText?: ReactNode;
  LeadingIconSwap?: string;
  /** Component swap — ชิ้นที่วางแทน Text (เช่น Badge outline / Pill outline) */
  InstanceSwap?: ReactNode;
  className?: string;
}

export function ContentItemBase({ Type = "Text with label", Label, Text, SupportingText, LeadingIconSwap, InstanceSwap, className }: ContentItemBaseProps) {
  const icon = LeadingIconSwap && <Ms name={LeadingIconSwap} size={24} className="text-brand-900" />;
  if (Type === "Text") {
    return (
      <div className={cx("flex min-w-0 items-center gap-2 text-md", className)}>
        {icon}<span className="text-black">{Text}</span>{SupportingText && <span className="text-gray-600">{SupportingText}</span>}
      </div>
    );
  }
  const big = Type === "Big";
  return (
    <div className={cx("flex min-w-0 gap-2", className)}>
      {icon}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className={cx("font-semibold break-words text-black", big ? "text-lg" : "text-md")}>{Label}</span>
        {Type === "Component swap" ? <span className="flex">{InstanceSwap}</span>
          : <span className={cx("break-words", big ? "text-lg" : "text-md", Type === "Attachment" ? "text-info-700 underline-offset-2 hover:underline" : "text-black")}>{Text}</span>}
      </div>
    </div>
  );
}
