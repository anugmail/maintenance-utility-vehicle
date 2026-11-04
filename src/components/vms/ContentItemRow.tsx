"use client";
/* Figma: "Content item row" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Content item row.json
   variant: Column width = Full (ที่ต้นแบบใช้) | 50% first column | 50% last column · property: Item 2 · Item 3 · Item 4 (ช่องที่ 2–4)
   ค่า: แถวเดียว ช่องไฟ 24 · ลูก = _Content item base สูงสุด 4 ช่อง กว้างเท่ากัน (ช่องที่ไม่ใช้เว้นว่างให้คอลัมน์ตรงกันทุกแถว)
   ใช้แบบ kv() ใน core.js: Type="Text with label" ไม่มีไอคอน · desktop แถวละ 4 · มือถือ แถวละ 2 (ส่ง perRow) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ContentItemBase, type ContentItemBaseProps } from "./ContentItemBase";

export type KvPair = [ReactNode, ReactNode];

export function ContentItemRow({ items, perRow = 4, ColumnWidth = "Full", gap = "gap-6", className }: {
  items: (KvPair | ContentItemBaseProps)[]; perRow?: number; ColumnWidth?: "Full" | "50% first column" | "50% last column";
  /** ช่องไฟระหว่างช่อง (ไลบรารี 24 · VehicleAndReporterInfo 16) */ gap?: "gap-6" | "gap-4"; className?: string;
}) {
  const cells = items.map((it, i) => (Array.isArray(it) ? <ContentItemBase key={i} Label={it[0]} Text={it[1]} /> : <ContentItemBase key={i} {...it} />));
  const pad = Array.from({ length: Math.max(0, perRow - cells.length) }, (_, i) => <span key={"pad" + i} aria-hidden="true" />);
  if (ColumnWidth !== "Full" && perRow > 1) {
    const [first, ...rest] = cells;
    const half = <div className={cx("grid min-w-0 flex-1 grid-cols-2", gap)}>{rest}</div>;
    return <div className={cx("flex", gap, className)}>{ColumnWidth === "50% first column" ? <><div className="min-w-0 flex-1">{first}</div>{half}</> : <>{half}<div className="min-w-0 flex-1">{first}</div></>}</div>;
  }
  return <div className={cx("grid", gap, perRow === 1 ? "grid-cols-1" : perRow === 2 ? "grid-cols-2" : perRow === 3 ? "grid-cols-3" : "grid-cols-4", className)}>{cells}{pad}</div>;
}
