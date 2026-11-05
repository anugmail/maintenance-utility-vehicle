"use client";
/* Figma: "Page header" — ไฟล์ (Component) VMS Plus หน้า Page headers (node 1983:21158) · สเปก figma-spec/Page header.json
   variant: Breakpoint = Desktop | Mobile
   property: Title · Badge · Supporting text · Back action · Copy action (ปิด) · More actions (ปิด) · Actions · Divider (ปิด R2/R13)
   Desktop: Breadcrumbs → (24) → Content: หัวข้อ 32 SemiBold black + Badge outline ห่าง 12 · Supporting text 16 gray-600 · Actions ขวา ช่องไฟ 12 (ปุ่ม md)
   Mobile: ไม่มี Breadcrumbs · แถว Title = ปุ่มย้อนกลับ (Tertiary button keyboard_arrow_left) + หัวข้อ 20 SemiBold · Actions ใต้หัวข้อ ช่องไฟ 16 (ปุ่ม lg)
   ใช้แบบ pageHead() ใน core.js: crumbs = [ชื่อเมนู, ...ระดับกลาง, หน้าปัจจุบัน] · ปุ่มลบสีแดง/ปุ่มหลายปุ่มวางในกรอบ Actions แยก (ส่ง Actions)
   Desktop ไม่มีปุ่ม Back ใน variant (ย้อนกลับด้วย Breadcrumbs) — ดู COMPOSED.md
   Pill = สลับชั้น Badge outline เป็น Pill outline (headPill() ใน screens.js 5 พ.ย. 2569: สถานะ "อยู่ระหว่างบำรุงรักษา" สี Warning ตรงกับตาราง — Badge outline ไม่มีสี Warning) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { BadgeOutline, type BadgeOutlineColor } from "./BadgeOutline";
import { PillOutline, type PillColor } from "./PillOutline";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { TertiaryButton } from "./TertiaryButton";

export interface PageHeaderProps {
  Breakpoint?: Breakpoint;
  Title: string;
  /** property Badge — [ข้อความ, สี Badge outline] */
  Badge?: [string, BadgeOutlineColor];
  /** ชั้น Badge สลับเป็น Pill outline (แทน Badge) */
  Pill?: [string, PillColor];
  SupportingText?: string;
  /** property Back action (มือถือ) */
  onBack?: () => void;
  crumbs?: Crumb[];
  /** property Actions — ปุ่มขวา (desktop) / ใต้หัวข้อ (mobile) */
  Actions?: ReactNode;
  className?: string;
}

export function PageHeader({ Breakpoint: bp, Title, Badge, Pill, SupportingText, onBack, crumbs, Actions, className }: PageHeaderProps) {
  const b = useBreakpoint(bp);
  if (b === "Mobile") {
    return (
      <div className={cx("flex flex-col gap-4", className)}>
        <div className="flex gap-2">
          {onBack && <TertiaryButton LeadingIconSwap="keyboard_arrow_left-20-400-round" ButtonText={false} aria-label="ย้อนกลับ" onClick={onBack} />}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex min-h-10 flex-wrap items-center gap-3">
              <h1 className="text-lg font-semibold text-black">{Title}</h1>
              {Pill ? <PillOutline Text={Pill[0]} Color={Pill[1]} /> : Badge && <BadgeOutline Text={Badge[0]} Color={Badge[1]} />}
            </div>
            {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
          </div>
        </div>
        {Actions && <div className="flex gap-4 [&>*]:flex-1">{Actions}</div>}
      </div>
    );
  }
  return (
    <div className={cx("flex flex-col gap-6", className)}>
      {crumbs && <Breadcrumbs links={crumbs} />}
      <div className="flex items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-title font-semibold text-black">{Title}</h1>
            {Pill ? <PillOutline Text={Pill[0]} Color={Pill[1]} /> : Badge && <BadgeOutline Text={Badge[0]} Color={Badge[1]} />}
          </div>
          {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
        </div>
        {Actions && <div className="flex shrink-0 gap-3">{Actions}</div>}
      </div>
    </div>
  );
}
