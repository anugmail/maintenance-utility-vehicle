"use client";
import type { ReactNode } from "react";
import { ListHeaderItem } from "@/components/vms/ListHeaderItem";
import { ListWithCheckbox } from "@/components/vms/ListWithCheckbox";
import { ListWithCheckboxItem } from "@/components/vms/ListWithCheckboxItem";
import { MobileTableItem } from "@/components/vms/MobileTableItem";
import type { CellAction } from "@/components/vms/TableCell";
import { TableCell } from "@/components/vms/TableCell";
import { TableHeaderCell } from "@/components/vms/TableHeaderCell";
import { cellProps, type TableColumn, type TableValue } from "@/components/vms/Table";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface CheckRow {
  key: string;
  text: string; sub?: string;
  mobileSub?: string;
  cells: TableValue[];
  disabled?: boolean;
  mobileActions?: CellAction[];
}

export function CheckTable({ columns, rows, scope, ticked, onTicked, Pagination, mobileTitle }: {
  columns: TableColumn[]; rows: CheckRow[]; scope?: { key: string; disabled?: boolean }[]; ticked: string[]; onTicked: (next: string[]) => void; Pagination?: ReactNode; mobileTitle?: string;
}) {
  const mob = useBreakpoint() === "Mobile";
  const live = (scope ?? rows).filter((r) => !r.disabled);
  const all = live.length > 0 && live.every((r) => ticked.includes(r.key));
  const some = live.some((r) => ticked.includes(r.key));
  const flip = (k: string, on: boolean) => onTicked(on ? [...ticked, k] : ticked.filter((x) => x !== k));
  const flipAll = () => onTicked(all ? ticked.filter((k) => !live.some((r) => r.key === k)) : [...new Set([...ticked, ...live.map((r) => r.key)])]);
  if (mob && (scope || rows.some((r) => r.mobileActions?.length))) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <ListHeaderItem Title={mobileTitle ?? columns[0].head} checkType={all ? "Selected" : some ? "Indeterminate" : "Unselected"} onCheck={flipAll} />
          {rows.map((r) => (
            <div key={r.key} className="border-b border-gray-200 [&>div:first-child]:border-b-0">
              <ListWithCheckboxItem Text={r.text} SupportingText={r.mobileSub ?? r.sub} Selected={ticked.includes(r.key)} State={r.disabled ? "Disabled" : undefined} onChange={(on) => flip(r.key, on)} />
              {r.mobileActions?.length ? <MobileTableItem Style="Action icons" Actions={r.mobileActions} /> : null}
            </div>
          ))}
        </div>
        {Pagination}
      </div>
    );
  }
  if (mob) {
    return (
      <div className="flex flex-col gap-5">
        <ListWithCheckbox Title={mobileTitle ?? columns[0].head} value={ticked.filter((k) => rows.some((r) => r.key === k))}
          options={rows.map((r) => ({ value: r.key, Text: r.text, SupportingText: r.mobileSub ?? r.sub, Disabled: r.disabled }))}
          onChange={(next) => onTicked([...ticked.filter((k) => !rows.some((r) => r.key === k)), ...next])} />
        {Pagination}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>{columns.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
          <thead>
            <tr>
              {columns.map((c, i) => i === 0
                ? <TableHeaderCell key={i} Text={c.head} Checkbox checkType={all ? "Selected" : some ? "Indeterminate" : "Unselected"} onCheck={flipAll} />
                : <TableHeaderCell key={i} Text={c.head} HeaderText={!!c.head} SortIcon={c.SortIcon} />)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.key}>
                <TableCell Style="Lead checkbox" AlternatingFills={ri % 2 === 1} Text={r.text} SupportingText={r.sub} checked={!r.disabled && ticked.includes(r.key)} checkDisabled={r.disabled} onCheck={(on) => flip(r.key, on)} />
                {columns.slice(1).map((c, ci) => <TableCell key={ci} AlternatingFills={ri % 2 === 1} {...cellProps(r.cells[ci], c.Style)} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Pagination}
    </div>
  );
}
