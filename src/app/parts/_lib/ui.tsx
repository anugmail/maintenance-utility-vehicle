"use client";
import type { FeaturedIconColor } from "@/components/vms/FeaturedIcon";
import { MetricItem } from "@/components/vms/MetricItem";
import { MobileCards } from "@/components/vms/MobileTable";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { cellProps, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableCell } from "@/components/vms/TableCell";
import { TableHeaderCell } from "@/components/vms/TableHeaderCell";
import { TablePagination } from "@/components/vms/TablePagination";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const PER = 10;

export function Metrics({ items }: { items: [string, string, FeaturedIconColor][] }) {
  const mob = useBreakpoint() === "Mobile";
  return (
    <div className={mob ? "grid grid-cols-2 gap-3" : "flex gap-6 [&>*]:flex-1 [&>*]:basis-0"}>
      {items.map(([t, n, c]) => <MetricItem key={t} Text={t} Number={n} FeaturedIconColor={c} />)}
    </div>
  );
}

export interface Sort { col: number; dir: "Down" | "Up"; touched: boolean }
export const SORT0: Sort = { col: 0, dir: "Down", touched: false };
const key = (v: TableValue): string => (v == null ? "" : typeof v !== "object" ? String(v) : "text" in v ? v.text : "pills" in v ? v.pills[0]?.[0] ?? "" : "");
function cmp(a: TableValue, b: TableValue) {
  const x = key(a), y = key(b), nx = parseFloat(x.replace(/^[^\d-]*/, "")), ny = parseFloat(y.replace(/^[^\d-]*/, ""));
  return /^\d/.test(x) && /^\d/.test(y) && !Number.isNaN(nx) && !Number.isNaN(ny) ? nx - ny : x.localeCompare(y, "th");
}
export const sortRows = (rows: TableValue[][], s: Sort) =>
  s.touched ? [...rows].sort((a, b) => (s.dir === "Down" ? 1 : -1) * cmp(a[s.col], b[s.col])) : rows;
export const nextSort = (s: Sort, col: number): Sort => (s.col === col ? { col, dir: s.dir === "Down" ? "Up" : "Down", touched: true } : { col, dir: "Down", touched: true });

export function SortTable({ cols, rows, sort, onSort, page, onPage }: { cols: TableColumn[]; rows: TableValue[][]; sort: Sort; onSort: (col: number) => void; page: number; onPage: (p: number) => void }) {
  const mob = useBreakpoint() === "Mobile";
  const shown = rows.slice((page - 1) * PER, page * PER);
  const pg = <TablePagination total={rows.length} page={page} perPage={PER} onPage={onPage} />;
  if (mob) return <div className="flex flex-col gap-5"><MobileCards columns={cols} rows={shown} />{pg}</div>;
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>{cols.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
          <thead>
            <tr>{cols.map((c, i) => <TableHeaderCell key={i} Text={c.head} HeaderText={!!c.head} SortIcon={c.SortIcon ? (sort.col === i ? sort.dir : "Swap") : undefined} onSort={c.SortIcon ? () => onSort(i) : undefined} />)}</tr>
          </thead>
          <tbody>
            {shown.map((r, ri) => <tr key={ri}>{cols.map((c, ci) => <TableCell key={ci} AlternatingFills={ri % 2 === 1} {...cellProps(r[ci], c.Style)} />)}</tr>)}
          </tbody>
        </table>
      </div>
      {pg}
    </div>
  );
}

export function RadioPick({ title, options, value, onChange }: { title: string; options: { Text: string; SupportingText?: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title={title} />
      <RadioTextCards options={options} value={value} onChange={onChange} />
    </section>
  );
}
