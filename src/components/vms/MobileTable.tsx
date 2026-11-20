"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { MobileTableItem } from "./MobileTableItem";
import type { CellAction } from "./TableCell";
import type { TableColumn, TableValue } from "./Table";

export function MobileTable({ AlternatingFills, children, className }: { AlternatingFills?: boolean; children: ReactNode; className?: string }) {
  return <div className={cx("flex flex-col overflow-hidden rounded-md border border-gray-300 pt-1", AlternatingFills ? "bg-gray-50" : "bg-white", className)}>{children}</div>;
}

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
        const a = acts as { actions: CellAction[]; mobileActions?: CellAction[]; mobileButtons?: ReactNode } | null;
        return (
          <MobileTable key={rowKey ? rowKey(r, ri) : ri}>
            {data.map(({ head, v }, i) => {
              const last = i === data.length - 1 && !a;
              if (v && typeof v === "object" && "pills" in v) return <MobileTableItem key={i} Style="Badge" Header={head} Pill={v.pills[0]} last={last} />;
              if (v && typeof v === "object" && "text" in v) return <MobileTableItem key={i} Style={i === 0 ? "Lead text" : "Text"} Header={head} Text={v.text} SupportingText={v.sub || undefined} last={last} />;
              return <MobileTableItem key={i} Style={i === 0 ? "Lead text" : "Text"} Header={head} Text={v == null ? "" : String(v)} last={last} />;
            })}
            {a && (a.mobileButtons ? <MobileTableItem Style="Action buttons" Buttons={a.mobileButtons} /> : <MobileTableItem Style="Action icons" Actions={a.mobileActions ?? a.actions} />)}
          </MobileTable>
        );
      })}
    </div>
  );
}
