"use client";
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

export function pageNumbers(page: number, pages: number): (number | "...")[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  let start = Math.max(2, page - 1), end = Math.min(pages - 1, page + 1);
  if (page <= 3) end = 3;
  else if (page >= pages - 2) start = pages - 2;
  const out: (number | "...")[] = [1];
  if (start > 2) out.push("...");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < pages - 1) out.push("...");
  out.push(pages);
  return out;
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
      {pageNumbers(page, pages).map((n, i) => n === "..."
        ? <ButtonGroupsPaginationItem key={"gap" + i} Type="Number" Number="..." />
        : <ButtonGroupsPaginationItem key={n} Type="Number" Number={String(n)} State={n === page ? "Hover/Active" : "Default"} onClick={() => onPage?.(n)} />
      )}
      <ButtonGroupsPaginationItem Type="Next" State={page >= pages ? "Disabled" : "Default"} onClick={() => onPage?.(page + 1)} last />
    </div>
  );
  return b === "Mobile"
    ? <div className={cx("flex flex-col items-center gap-4", className)}>{group}{info}</div>
    : <div className={cx("flex items-center justify-between gap-6", className)}>{info}{group}</div>;
}
