"use client";
/* Figma: "Table header" — ไฟล์ (Component) VMS Plus หน้า Table headers (node 2096:36080) · สเปก figma-spec/Table header.json
   variant: Breakpoint = Desktop | Mobile
   property: Table title · Badge · Supporting text · Actions · Filters · More actions · Divider (ปิดตามกติกา R2/R13)
   ใช้แบบ tableHeader() ใน core.js: ช่องค้นหา (Text input ไม่มีป้าย ไอคอน search) + ปุ่ม "ตัวกรอง" (Secondary button ไอคอน filter_list + Pill outline Brand = จำนวนตัวกรอง) · ชิปตัวกรอง Brand
   Table title (5 พ.ย. 2569 ฟอร์มสร้างแผนแบบ A): Front Section = Line 4×24 brand-900 + Text 20 SemiBold black + Badge outline Gray ช่องไฟ 12 · ห่างแถวค้นหา 20
   Actions: ปุ่มต่อจาก "ตัวกรอง" (Secondary button ช่องที่ 2–4 · Primary button ท้ายสุด ตามดัมป์) — Actions = ปุ่มที่ส่งมา
   Desktop: ค้นหากว้าง 320 ซ้าย · ปุ่มขวา ช่องไฟ 12 · แถวชิปห่าง 20 ช่องไฟ 12
   Mobile: เรียงลง ช่องไฟ 16 · ช่องค้นหา Size=lg เต็มแถว · ปุ่ม Size=lg ครึ่งแถว (ช่องที่ 2 = ปุ่มแรกของ Actions แบบ Request list ของ 5.10 Vehicle In Use (EV) · tableHeader() o.primary) */
import { Children, type ReactNode } from "react";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";
import { BadgeOutline } from "./BadgeOutline";
import { BadgeOutlineWithRemoveIcon } from "./BadgeOutlineWithRemoveIcon";
import { SecondaryButton } from "./SecondaryButton";
import { TextInput } from "./TextInput";

export interface TableHeaderProps {
  Breakpoint?: Breakpoint;
  /** property Table title + Title (ไม่ใส่ = ปิด) */
  Title?: string;
  /** property Badge — ข้อความใน Badge outline Gray ข้างหัวตาราง */
  Badge?: string | number | null;
  /** คำค้น (property Text ของ Text input) */
  query?: string;
  Placeholder?: string;
  onQuery?: (q: string) => void;
  /** ปุ่มตัวกรอง */
  onFilter?: () => void;
  FilterText?: string;
  /** Pill outline ในปุ่มตัวกรอง = จำนวนตัวกรองที่ใช้อยู่ (ไม่ใส่ / 0 = ซ่อน) */
  FilterCount?: number | null;
  /** property Filters — ชิปตัวกรองที่ใช้อยู่ */
  Filters?: string[];
  onRemoveFilter?: (f: string) => void;
  /** ปุ่มต่อจาก "ตัวกรอง" (Secondary / Primary button ของไลบรารี) — ส่งขนาดตาม Breakpoint เอง (Mobile lg) */
  Actions?: ReactNode;
  className?: string;
}

export function TableHeader({ Breakpoint: bp, Title, Badge, query, Placeholder, onQuery, onFilter, FilterText = "ตัวกรอง", FilterCount, Filters, onRemoveFilter, Actions, className }: TableHeaderProps) {
  const b = useBreakpoint(bp);
  const mob = b === "Mobile";
  const acts = Children.toArray(Actions).filter(Boolean);
  const chips = Filters && Filters.length > 0 && (
    <div className={cx("flex flex-wrap items-center", mob ? "gap-4" : "gap-3")}>
      {Filters.map((f) => <BadgeOutlineWithRemoveIcon key={f} Text={f} Color="Brand" onRemove={onRemoveFilter ? () => onRemoveFilter(f) : undefined} />)}
    </div>
  );
  return (
    <div className={cx("flex flex-col", mob ? "gap-4" : "gap-5", className)}>
      {Title && (
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 shrink-0 rounded-pill bg-brand-900" />
          <h3 className="text-lg font-semibold text-black">{Title}</h3>
          {Badge != null && Badge !== "" && <BadgeOutline Text={String(Badge)} Color="Gray" />}
        </div>
      )}
      <div className={cx("flex", mob ? "flex-col gap-4" : "items-center justify-between gap-3")}>
        <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={query} Placeholder={Placeholder} onChange={onQuery} aria-label={Placeholder} className={mob ? "w-full" : "w-80"} />
        <div className={cx("flex", mob ? "flex-wrap gap-4 [&>*]:flex-1 [&>*]:basis-[calc(50%-8px)]" : "gap-3")}>
          <SecondaryButton Text={FilterText} Size={mob ? "lg" : "md"} LeadingIconSwap="filter_list-24-400-round" Pill={FilterCount || null} onClick={onFilter} />
          {acts}
          {mob && !acts.length && <span />}
        </div>
      </div>
      {chips}
    </div>
  );
}
