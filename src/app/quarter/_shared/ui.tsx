"use client";
/* ตัวช่วยจัดวางของหน้า batch B (S4 S6 S9 S7 S8 S15 S16 S17) — ไม่ใช่ component ใหม่ เป็นการจัดวาง component ไลบรารีตาม core.js
   BtnRow = btnRow() (desktop ปุ่มแรกซ้าย ปุ่มท้ายขวา · ปุ่มเดียวชิดขวา · มือถือเต็มแถวแบ่งเท่ากัน ช่องไฟ 16)
   DataTable = tbl() (desktop Table · มือถือ Mobile table ผ่าน MobileCards) · Section = col('Section', …, 16) */
import { useRouter } from "next/navigation";
import { Children, useState, type ReactNode } from "react";
import type { Crumb } from "@/components/vms/Breadcrumbs";
import { MobileCards } from "@/components/vms/MobileTable";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TablePagination } from "@/components/vms/TablePagination";
import { cx } from "@/lib/cx";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const MENU_HOME = "บำรุงรักษาตามวาระ";
/* หน้ารายละเอียดแผน (batch A) — ทางเข้า S4 และ S15 อยู่ที่หน้านั้น · รากเว็บไม่มี /plans/ (CLAUDE.md ข้อ 10) */
export const planDetailHref = (id: string) => "/detail/?id=" + id;
/* หน้า "ไตรมาส n" = หน้าแผนเดินทางของไตรมาส (/quarter/trips/ · รีวิว 5 พ.ย. 2569 "หน้านี้คือหน้า ไตรมาส 1") · S4 เป็นแดชบอร์ด /parts/ แล้ว (6 พ.ย. 2569) */
export const tripsHref = (id: string, q: number) => "/quarter/trips/?id=" + id + "&q=" + q;
export const quarterHref = tripsHref;
/* Breadcrumbs ใต้หน้าไตรมาส (pageHead ใน core.js · 5 พ.ย. 2569): บำรุงรักษาตามวาระ › <ชื่อแผน> › ไตรมาส n [› ต่อท้าย]
   ชื่อแผน → หน้ารายละเอียดแผน · ไตรมาส n → หน้าไตรมาส (หน้าปัจจุบันไม่มีลิงก์) */
export const quarterCrumbs = (id: string, planName: string, q: number, ...more: string[]): Crumb[] => [
  { Text: MENU_HOME, href: "/" }, { Text: planName || "แผน " + id, href: planDetailHref(id) },
  more.length ? { Text: "ไตรมาส " + q, href: tripsHref(id, q) } : { Text: "ไตรมาส " + q }, ...more.map((t) => ({ Text: t })),
];

/* ย้อนกลับ = หน้าก่อนหน้า (เปิดตรงจากลิงก์ = ไปหน้าที่กำหนด) */
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

/* pagination = จำนวนรายการที่ Table pagination บอก (ไม่ส่ง = ไม่มี) · perPage ตามจอ (ประวัติ 12 รายการหน้าเดียว) */
export function DataTable({ columns, rows, pagination, perPage = 10, rowKey }: { columns: TableColumn[]; rows: TableValue[][]; pagination?: number; perPage?: number; rowKey?: (r: TableValue[], i: number) => string }) {
  const mob = useBreakpoint() === "Mobile";
  const pg = pagination != null ? <TablePagination total={pagination} perPage={perPage} /> : undefined;
  if (mob) return <div className="flex flex-col gap-5"><MobileCards columns={columns} rows={rows} rowKey={rowKey} />{pg}</div>;
  return <Table columns={columns} rows={rows} rowKey={rowKey} Pagination={pg} />;
}

/* ตารางที่แบ่งหน้า (หน้าละ perPage · Table pagination กดเปลี่ยนหน้าได้) — รถในไตรมาสเกิน 10 คัน (E.1 · Table ของไลบรารี 10 แถว R8) */
export function PagedTable({ columns, rows, perPage = 10, rowKey }: { columns: TableColumn[]; rows: TableValue[][]; perPage?: number; rowKey?: (r: TableValue[], i: number) => string }) {
  const mob = useBreakpoint() === "Mobile";
  const [page, setPage] = useState(1);
  const last = Math.max(1, Math.ceil(rows.length / perPage)), p = Math.min(page, last);
  const shown = rows.slice((p - 1) * perPage, p * perPage);
  const pg = rows.length > perPage ? <TablePagination total={rows.length} page={p} perPage={perPage} onPage={setPage} /> : undefined;
  if (mob) return <div className="flex flex-col gap-5"><MobileCards columns={columns} rows={shown} rowKey={rowKey} />{pg}</div>;
  return <Table columns={columns} rows={shown} rowKey={rowKey} Pagination={pg} />;
}

/* TRIP_VIEW_COLS — รถในแผนเดินทาง ดูอย่างเดียว (S7 S8 · สถานที่ + บรรทัดรอง · ไม่มีเบอร์ติดต่อ) */
export const TRIP_VIEW_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 200, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 200 }, { head: "สถานที่บำรุงรักษา", width: 330 },
];

/* ช่อง "›" เปิดรายการ (GO ใน screens.js) */
export const go = (label: string, onClick: () => void): TableValue => ({ actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label, onClick }] });
