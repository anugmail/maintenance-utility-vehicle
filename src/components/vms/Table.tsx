"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { TableCell, type CellAction, type TableCellStyle } from "./TableCell";
import { TableHeaderCell } from "./TableHeaderCell";
import type { PillColor } from "./PillOutline";

export interface TableColumn {
  head: string;
  width?: number;
  Style?: TableCellStyle;
  SortIcon?: "Down" | "Up" | "Swap";
}

export type TableValue =
  | string | number | null | undefined
  | { text: string; sub?: string }
  | { pills: [string, PillColor][] }
  | { actions: CellAction[]; mobileActions?: CellAction[]; mobileButtons?: ReactNode };

export function cellProps(v: TableValue, style?: TableCellStyle) {
  if (v && typeof v === "object" && "pills" in v) return { Style: (v.pills.length > 1 ? "Multiple badges" : "Badge") as TableCellStyle, Pills: v.pills };
  if (v && typeof v === "object" && "actions" in v) return { Style: "Action icons" as TableCellStyle, Actions: v.actions };
  if (v && typeof v === "object" && "text" in v) return { Style: style ?? "Text", Text: v.text, SupportingText: v.sub };
  return { Style: style ?? "Text", Text: v == null ? "" : String(v) };
}

export interface TableProps {
  columns: TableColumn[];
  rows: TableValue[][];
  AlternatingFills?: boolean;
  Pagination?: ReactNode;
  rowKey?: (row: TableValue[], i: number) => string;
  className?: string;
}

export function Table({ columns, rows, AlternatingFills = true, Pagination, rowKey, className }: TableProps) {
  return (
    <div className={cx("flex flex-col", AlternatingFills ? "gap-5" : "gap-2", className)}>
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {columns.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}
          </colgroup>
          <thead>
            <tr>{columns.map((c, i) => <TableHeaderCell key={i} Text={c.head} HeaderText={!!c.head} SortIcon={c.SortIcon} />)}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={rowKey ? rowKey(r, ri) : ri}>
                {columns.map((c, ci) => <TableCell key={ci} AlternatingFills={AlternatingFills && ri % 2 === 1} {...cellProps(r[ci], c.Style)} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Pagination}
    </div>
  );
}
