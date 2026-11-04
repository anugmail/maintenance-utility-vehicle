"use client";
/* Figma: "Table header cell" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Table header cell.json
   variant: Checkbox = False | True · property: Header text · Text · Sort icon
   ค่า: สูง 44 · ขอบใน 12/16 · ช่องไฟ 8 · พื้น gray-100 · ข้อความ 14 SemiBold black · Sort icon 20 */
import { cx } from "@/lib/cx";
import { Checkbox, type CheckboxType } from "./Checkbox";
import { SortIcon } from "./SortIcon";

export interface TableHeaderCellProps {
  Text?: string;
  HeaderText?: boolean;
  /** property Sort icon — ใส่ทิศ = แสดง */
  SortIcon?: "Down" | "Up" | "Swap";
  Checkbox?: boolean;
  checkType?: CheckboxType;
  onCheck?: (next: boolean) => void;
  onSort?: () => void;
  className?: string;
}

export function TableHeaderCell({ Text, HeaderText = true, SortIcon: sort, Checkbox: cb, checkType, onCheck, onSort, className }: TableHeaderCellProps) {
  return (
    <th scope="col" className={cx("h-11 bg-gray-100 px-4 py-3 text-left align-middle text-sm font-semibold text-black", className)}>
      <span className="flex items-center gap-2">
        {cb && <Checkbox Type={checkType} onChange={onCheck} label="เลือกทั้งหมด" />}
        {HeaderText && Text && <span className="truncate">{Text}</span>}
        {sort && (onSort ? <button type="button" aria-label={"เรียง " + (Text ?? "")} onClick={onSort} className="inline-flex cursor-pointer"><SortIcon Icon={sort} /></button> : <SortIcon Icon={sort} />)}
      </span>
    </th>
  );
}
