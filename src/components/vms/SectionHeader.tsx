"use client";
/* Figma: "Section header" — ไฟล์ (Component) VMS Plus หน้า Section headers (node 2011:6955) · สเปก figma-spec/Section header.json
   หัวข้อของหน้า Create/Edit (กติกา R3)
   variant: Breakpoint = Desktop | Mobile · property: Title · Badge · Supporting text · Actions · More actions (ปิด) · Divider (ปิด R2/R13)
   ค่า: แถบ Line 4×24 รัศมี 9999 brand-900 · หัวข้อ 20 SemiBold black ห่าง 12 · Badge outline Gray · Supporting text 14 gray-600 ห่าง 8
        Desktop: Actions ขวา ช่องไฟ 12 · Mobile: Actions ใต้หัวข้อ ห่าง 20 ช่องไฟ 16 */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { BadgeOutline } from "./BadgeOutline";

export interface SectionHeaderProps {
  Breakpoint?: Breakpoint;
  Title: string;
  /** property Badge — ข้อความในป้าย (เช่น "ในแผน 3 คัน") */
  Badge?: string | number | null;
  SupportingText?: string;
  Actions?: ReactNode;
  className?: string;
}

export function SectionHeader({ Breakpoint: bp, Title, Badge, SupportingText, Actions, className }: SectionHeaderProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <div className={cx("flex", mob ? "flex-col gap-5" : "items-start gap-3", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 shrink-0 rounded-pill bg-brand-900" />
          <h2 className="text-lg font-semibold text-black">{Title}</h2>
          {Badge != null && Badge !== "" && <BadgeOutline Text={String(Badge)} Color="Gray" />}
        </div>
        {SupportingText && <p className="text-sm text-gray-600">{SupportingText}</p>}
      </div>
      {Actions && <div className={cx("flex shrink-0", mob ? "gap-4" : "gap-3")}>{Actions}</div>}
    </div>
  );
}
