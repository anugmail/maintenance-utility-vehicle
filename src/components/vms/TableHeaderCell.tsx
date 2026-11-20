"use client";
import { cx } from "@/lib/cx";
import { Checkbox, type CheckboxType } from "./Checkbox";
import { SortIcon } from "./SortIcon";

export interface TableHeaderCellProps {
  Text?: string;
  HeaderText?: boolean;
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
