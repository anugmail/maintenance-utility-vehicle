"use client";
/* Figma: "Table" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Table.json
   variant: Alternating fills = False | True · property: Scrollbar (ปิด) · Pagination
   โครง: Content = คอลัมน์ละ Table header cell + Table cell ไลบรารีมี 8 คอลัมน์ × 10 แถว (กติกา TABLE_MAX ของ core.js) · ช่องไฟ Content → Pagination 20 (Alternating fills=True)
   ใช้แบบ tbl() ใน core.js: columns [หัว, กว้าง (0 = ยืด), Style, Sort icon] · ช่อง = ข้อความ | {text, sub} | {pills} | {actions}
   กว้างคอลัมน์ส่งเป็นตัวเลขตอนรัน → style width (ค่าที่คำนวณตอนรัน ตามกติกาข้อ 3) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { TableCell, type CellAction, type TableCellStyle } from "./TableCell";
import { TableHeaderCell } from "./TableHeaderCell";
import type { PillColor } from "./PillOutline";

export interface TableColumn {
  head: string;
  /** กว้าง px · 0/ไม่ใส่ = ยืด */
  width?: number;
  Style?: TableCellStyle;
  SortIcon?: "Down" | "Up" | "Swap";
}

export type TableValue =
  | string | number | null | undefined
  | { text: string; sub?: string }
  | { pills: [string, PillColor][] }
  | { actions: CellAction[]; mobileActions?: CellAction[] };   // mobileActions = ไอคอนดู แก้ไข ลบ ที่กางบนการ์ดมือถือแทนปุ่ม … (เจ้าของงาน 4 พ.ย. 2569)

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
  /** property Pagination — ส่ง Table pagination มาวางใต้ตาราง */
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
