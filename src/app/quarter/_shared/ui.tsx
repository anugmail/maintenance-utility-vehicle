"use client";
import { useRouter } from "next/navigation";
import { Children, useState, type ReactNode } from "react";
import type { Crumb } from "@/components/vms/Breadcrumbs";
import { MobileCards } from "@/components/vms/MobileTable";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TablePagination } from "@/components/vms/TablePagination";
import { cx } from "@/lib/cx";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const MENU_HOME = "บำรุงรักษาตามวาระ";
export const planDetailHref = (id: string) => "/detail/?id=" + id;
export const tripsHref = (id: string, q: number) => "/quarter/trips/?id=" + id + "&q=" + q;
export const quarterHref = tripsHref;
export const quarterCrumbs = (id: string, planName: string, q: number, ...more: string[]): Crumb[] => [
  { Text: MENU_HOME, href: "/" }, { Text: planName || "แผน " + id, href: planDetailHref(id) },
  more.length ? { Text: "ไตรมาส " + q, href: tripsHref(id, q) } : { Text: "ไตรมาส " + q }, ...more.map((t) => ({ Text: t })),
];

export function useBack(fallback: string) {
  const router = useRouter();
  return () => (typeof window !== "undefined" && window.history.length > 1 ? router.back() : router.push(fallback));
}

export function BtnRow({ children }: { children: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  const n = Children.toArray(children).filter(Boolean).length;
  return <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : n > 1 ? "justify-between gap-3" : "justify-end")}>{children}</div>;
}

export function Section({ children, gap = 16 }: { children: ReactNode; gap?: 16 | 24 }) {
  return <section className={cx("flex flex-col", gap === 24 ? "gap-6" : "gap-4")}>{children}</section>;
}
export function Content({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-8">{children}</div>;
}

export function DataTable({ columns, rows, pagination, perPage = 10, rowKey }: { columns: TableColumn[]; rows: TableValue[][]; pagination?: number; perPage?: number; rowKey?: (r: TableValue[], i: number) => string }) {
  const mob = useBreakpoint() === "Mobile";
  if (pagination == null) return <PagedTable columns={columns} rows={rows} rowKey={rowKey} />;
  const pg = pagination != null ? <TablePagination total={pagination} perPage={perPage} /> : undefined;
  if (mob) return <div className="flex flex-col gap-5"><MobileCards columns={columns} rows={rows} rowKey={rowKey} />{pg}</div>;
  return <Table columns={columns} rows={rows} rowKey={rowKey} Pagination={pg} />;
}

export function PagedTable({ columns, rows, perPage = 10, rowKey }: { columns: TableColumn[]; rows: TableValue[][]; perPage?: number; rowKey?: (r: TableValue[], i: number) => string }) {
  const mob = useBreakpoint() === "Mobile";
  const [page, setPage] = useState(1);
  const last = Math.max(1, Math.ceil(rows.length / perPage)), p = Math.min(page, last);
  const shown = rows.slice((p - 1) * perPage, p * perPage);
  const pg = rows.length > perPage ? <TablePagination total={rows.length} page={p} perPage={perPage} onPage={setPage} /> : undefined;
  const key = rowKey && ((r: TableValue[], i: number) => rowKey(r, (p - 1) * perPage + i));
  if (mob) return <div className="flex flex-col gap-5"><MobileCards columns={columns} rows={shown} rowKey={key} />{pg}</div>;
  return <Table columns={columns} rows={shown} rowKey={key} Pagination={pg} />;
}

export const go = (label: string, onClick: () => void): TableValue => ({ actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label, onClick }] });
