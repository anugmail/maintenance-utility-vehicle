"use client";
/* Figma: "Mobile table" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Mobile table.json
   variant: Alternating fills = False | True
   ค่า: รัศมี 8 · ขอบ 1 gray-300 · พื้น white (True = gray-50) · ขอบในบน 4 · ลูก = Mobile table item (แถวท้ายเป็น Action icons)
   ใช้แบบ mobileCards() ใน core.js: 1 แถวตาราง = 1 การ์ด · การ์ดห่างกัน 12 · แถวแรกเป็น Lead text · ช่อง {pills} = แถว Badge · ปุ่ม = แถวท้าย Action icons
   ช่อง {text, sub} (บรรทัดรองของตาราง เช่น ชื่อแผน + ปีงบประมาณ) → Text + Supporting text ของ Mobile table item (12 gray-600) ไม่ต่อท้าย Text (เจ้าของงาน 4 พ.ย. 2569) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { MobileTableItem } from "./MobileTableItem";
import type { CellAction } from "./TableCell";
import type { TableColumn, TableValue } from "./Table";

export function MobileTable({ AlternatingFills, children, className }: { AlternatingFills?: boolean; children: ReactNode; className?: string }) {
  return <div className={cx("flex flex-col overflow-hidden rounded-md border border-gray-300 pt-1", AlternatingFills ? "bg-gray-50" : "bg-white", className)}>{children}</div>;
}

/* ตารางเดียวกับ Table แต่แสดงเป็นการ์ด (มือถือ) */
export function MobileCards({ columns, rows, rowKey }: { columns: TableColumn[]; rows: TableValue[][]; rowKey?: (row: TableValue[], i: number) => string }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, ri) => {
        const data: { head: string; v: TableValue }[] = [];
        let acts: TableValue = null;
        columns.forEach((c, ci) => {
          const v = r[ci];
          if (v && typeof v === "object" && "actions" in v) acts = v;
          else if (c.head && v && typeof v === "object" && "pills" in v) v.pills.forEach((p) => data.push({ head: c.head, v: { pills: [p] } }));
          else if (c.head) data.push({ head: c.head, v });
        });
        const a = acts as { actions: CellAction[] } | null;
        return (
          <MobileTable key={rowKey ? rowKey(r, ri) : ri}>
            {data.map(({ head, v }, i) => {
              const last = i === data.length - 1 && !a;
              if (v && typeof v === "object" && "pills" in v) return <MobileTableItem key={i} Style="Badge" Header={head} Pill={v.pills[0]} last={last} />;
              if (v && typeof v === "object" && "text" in v) return <MobileTableItem key={i} Style={i === 0 ? "Lead text" : "Text"} Header={head} Text={v.text} SupportingText={v.sub || undefined} last={last} />;
              return <MobileTableItem key={i} Style={i === 0 ? "Lead text" : "Text"} Header={head} Text={v == null ? "" : String(v)} last={last} />;
            })}
            {a && <MobileTableItem Style="Action icons" Actions={a.actions} />}
          </MobileTable>
        );
      })}
    </div>
  );
}
