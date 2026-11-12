/* แผง "ตัวกรอง" พับได้ — เลียนแบบ VMS+ หน้า "แดชบอร์ดฟลีทการ์ด" (page-fleetcard.png): กรอบไอคอนกรอง + "ตัวกรอง" + บรรทัดอธิบาย · ขวา ป้าย "n ตัวกรอง" · "ล้างทั้งหมด" · ลูกศรพับ/กาง
   กางแล้วเป็นช่องตัวกรองเดิมของหน้า (Input dropdown / Input dropdown with badges ของไลบรารี · ส่งเป็น children) เรียงกริด 4 คอลัมน์ (มือถือ 1) · เลือกแล้วข้อมูลทั้งหน้าเปลี่ยนทันที
   ใต้แผง "ตัวกรองที่เลือก:" + ชิป × (Badge outline with remove icon Color=Brand ของไลบรารี) — รวมตัวกรองจากช่องและจากการคลิกกราฟ แสดงแม้แผงพับอยู่
   ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 เฉพาะแดชบอร์ด S4 S24 */
import { useId, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "@/components/vms/Ms";
import { BadgeOutlineWithRemoveIcon } from "@/components/vms/BadgeOutlineWithRemoveIcon";
import { PillOutline } from "@/components/vms/PillOutline";

export interface FilterPanelProps {
  open: boolean; onToggle: () => void;
  text: string;
  chips: string[]; onRemove: (chip: string) => void; onClear: () => void;
  children: ReactNode;
}

export function FilterPanel({ open, onToggle, text, chips, onRemove, onClear, children }: FilterPanelProps) {
  const id = useId();
  return (
    <section aria-label="ตัวกรอง" data-filter-panel className="rounded-xl border border-gray-200 bg-white shadow-field">
      <div className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-50 text-info-600"><Ms name="filter_alt-24-300-round" size={24} /></span>
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2 text-md font-semibold text-gray-900">ตัวกรอง{chips.length > 0 && <PillOutline Text={chips.length + " ตัวกรอง"} Color="Brand" />}</span>
            <span className="text-xs text-gray-600">{text}</span>
          </span>
        </button>
        {chips.length > 0 && <button type="button" onClick={onClear} className="shrink-0 cursor-pointer text-sm font-semibold text-brand-900 hover:text-brand-950">ล้างทั้งหมด</button>}
        <button type="button" aria-label={open ? "พับตัวกรอง" : "กางตัวกรอง"} aria-expanded={open} aria-controls={id} onClick={onToggle} className="inline-flex shrink-0 cursor-pointer text-gray-500">
          <Ms name={open ? "keyboard_arrow_up-24-300-round" : "keyboard_arrow_down-24-300-round"} size={24} />
        </button>
      </div>
      {open && <div id={id} className="grid grid-cols-1 gap-4 border-t border-gray-200 px-4 py-4 md:grid-cols-2 md:px-5 xl:grid-cols-4">{children}</div>}
      {chips.length > 0 && (
        <div data-chips className="flex flex-wrap items-center gap-2 border-t border-gray-200 px-4 py-3 md:px-5">
          <span className="text-xs font-semibold text-gray-600">ตัวกรองที่เลือก:</span>
          {chips.map((c) => <BadgeOutlineWithRemoveIcon key={c} Text={c} Color="Brand" onRemove={() => onRemove(c)} />)}
        </div>
      )}
    </section>
  );
}
