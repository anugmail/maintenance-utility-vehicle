"use client";
/* Figma: "Section label" — ไฟล์ (Component) VMS Plus หน้า Section headers (node 2011:6955) · สเปก figma-spec/Section label.json
   หัวข้อของหน้า Detail (กติกา R5/R11) · ไม่มี Badge → จำนวนต่อท้ายชื่อ "(n)" ตาม sectionLabel() ใน core.js
   variant: Breakpoint = Desktop | Mobile
   property: Title · Supporting · Supporting text · Info icon (ปิด) · Actions · Primary action (Tertiary brand button) · Secondary action (Tertiary button) · More actions (ปิด)
   ค่า: หัวข้อ 16 SemiBold black · Supporting text 12 gray-600 ห่าง 4 · Actions ขวา ช่องไฟ 12 */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface SectionLabelProps {
  Title: string;
  SupportingText?: string;
  /** ปุ่ม Primary action / Secondary action (TertiaryBrandButton · TertiaryButton) */
  Actions?: ReactNode;
  className?: string;
}

export function SectionLabel({ Title, SupportingText, Actions, className }: SectionLabelProps) {
  return (
    <div className={cx("flex items-center gap-3", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-md font-semibold text-black">{Title}</h3>
        {SupportingText && <p className="text-xs text-gray-600">{SupportingText}</p>}
      </div>
      {Actions && <div className="flex shrink-0 items-center">{Actions}</div>}
    </div>
  );
}
