"use client";
/* Figma: "Table pagination" — ไฟล์ (Component) VMS Plus หน้า Pagination (node 2:15) · สเปก figma-spec/Table pagination.json
   variant: Breakpoint = Desktop | Mobile
   Desktop: แถวเดียว ชิดซ้าย–ขวา ช่องไฟ 24 · ซ้าย "แสดง a ถึง b จาก n รายการ" 14 black + Items per page dropdown (Input dropdown Selected กว้าง 92) ห่าง 8
            ขวา กลุ่มปุ่ม Button groups pagination item กรอบ 1 gray-300 รัศมี 8
   Mobile: เรียงลง จัดกลาง ช่องไฟ 16 · กลุ่มปุ่มก่อน แล้วข้อความ
   ข้อความตาม fillPagination() ใน core.js */
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";
import { ButtonGroupsPaginationItem } from "./ButtonGroupsPaginationItem";
import { InputDropdown } from "./InputDropdown";

export interface TablePaginationProps {
  Breakpoint?: Breakpoint;
  total: number;
  page?: number;
  perPage?: number;
  onPage?: (p: number) => void;
  className?: string;
}

export function TablePagination({ Breakpoint: bp, total, page = 1, perPage = 10, onPage, className }: TablePaginationProps) {
  const b = useBreakpoint(bp);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total ? (page - 1) * perPage + 1 : 0, to = Math.min(total, page * perPage);
  const info = (
    <div className="flex items-center gap-2">
      <span className="text-sm text-black">{"แสดง " + from + " ถึง " + to + " จาก " + total + " รายการ"}</span>
      <InputDropdown Label={false} Text={String(perPage)} className="w-[92px]" />
    </div>
  );
  const group = (
    <div className="flex overflow-hidden rounded-md border border-gray-300">
      <ButtonGroupsPaginationItem Type="Previous" State={page <= 1 ? "Disabled" : "Default"} onClick={() => onPage?.(page - 1)} />
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <ButtonGroupsPaginationItem key={n} Type="Number" Number={String(n)} State={n === page ? "Hover/Active" : "Default"} onClick={() => onPage?.(n)} />
      ))}
      <ButtonGroupsPaginationItem Type="Next" State={page >= pages ? "Disabled" : "Default"} onClick={() => onPage?.(page + 1)} last />
    </div>
  );
  return b === "Mobile"
    ? <div className={cx("flex flex-col items-center gap-4", className)}>{group}{info}</div>
    : <div className={cx("flex items-center justify-between gap-6", className)}>{info}{group}</div>;
}
