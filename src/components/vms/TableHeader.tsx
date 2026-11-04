"use client";
/* Figma: "Table header" — ไฟล์ (Component) VMS Plus หน้า Table headers (node 2096:36080) · สเปก figma-spec/Table header.json
   variant: Breakpoint = Desktop | Mobile
   property: Table title · Badge · Supporting text · Actions · Filters · More actions · Divider (ปิดตามกติกา R2/R13)
   ใช้แบบ tableHeader() ใน core.js: ไม่มีหัวตาราง · ช่องค้นหา (Text input ไม่มีป้าย ไอคอน search) + ปุ่ม "ตัวกรอง" (Secondary button ไอคอน filter_list) · ชิปตัวกรอง Brand
   Desktop: ค้นหากว้าง 320 ซ้าย · ปุ่มขวา ช่องไฟ 12 · แถวชิปห่าง 20 ช่องไฟ 12
   Mobile: เรียงลง ช่องไฟ 16 · ช่องค้นหา Size=lg เต็มแถว · ปุ่ม Size=lg ครึ่งแถว */
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";
import { BadgeOutlineWithRemoveIcon } from "./BadgeOutlineWithRemoveIcon";
import { SecondaryButton } from "./SecondaryButton";
import { TextInput } from "./TextInput";

export interface TableHeaderProps {
  Breakpoint?: Breakpoint;
  /** คำค้น (property Text ของ Text input) */
  query?: string;
  Placeholder?: string;
  onQuery?: (q: string) => void;
  /** ปุ่มตัวกรอง */
  onFilter?: () => void;
  FilterText?: string;
  /** property Filters — ชิปตัวกรองที่ใช้อยู่ */
  Filters?: string[];
  onRemoveFilter?: (f: string) => void;
  className?: string;
}

export function TableHeader({ Breakpoint: bp, query, Placeholder, onQuery, onFilter, FilterText = "ตัวกรอง", Filters, onRemoveFilter, className }: TableHeaderProps) {
  const b = useBreakpoint(bp);
  const mob = b === "Mobile";
  const chips = Filters && Filters.length > 0 && (
    <div className={cx("flex flex-wrap items-center", mob ? "gap-4" : "gap-3")}>
      {Filters.map((f) => <BadgeOutlineWithRemoveIcon key={f} Text={f} Color="Brand" onRemove={onRemoveFilter ? () => onRemoveFilter(f) : undefined} />)}
    </div>
  );
  return (
    <div className={cx("flex flex-col", mob ? "gap-4" : "gap-5", className)}>
      <div className={cx("flex", mob ? "flex-col gap-4" : "items-center justify-between gap-3")}>
        <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={query} Placeholder={Placeholder} onChange={onQuery} aria-label={Placeholder} className={mob ? "w-full" : "w-80"} />
        <div className={cx("flex", mob ? "gap-4" : "gap-3")}>
          <SecondaryButton Text={FilterText} Size={mob ? "lg" : "md"} LeadingIconSwap="filter_list-24-400-round" onClick={onFilter} className={mob ? "flex-1 basis-0" : undefined} />
          {mob && <span className="flex-1 basis-0" />}
        </div>
      </div>
      {chips}
    </div>
  );
}
