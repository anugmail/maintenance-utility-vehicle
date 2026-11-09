"use client";
/* ชิ้นประกอบของ S24 (/vehicles/*) — ไม่ใช่ component ใหม่ จัดวางชิ้นไลบรารีตาม maList() / maDetail() / filterPanel() / tbl() + toneText() ของปลั๊กอิน Figma
   ที่มาการออกแบบ: Vehicle list + Filter + Vehicle detail ของหน้า "Vehicle Management" ใน UI Release#2 · Table · Table header cell · Table cell · Mobile table · Mobile table item
   · Background overlay · Featured icon · Tertiary button · Tertiary brand button · Secondary button · Primary button · Input dropdown · Dropdown list ของไฟล์ Component (ดู figma-spec/COMPOSED.md หัวข้อ ซ.)
   MaTable / MaCards = Table / MobileCards ที่ช่อง { text, sub, tone } ทำบรรทัดรอง (Supporting text) เป็นสีเตือน/แดงได้ (Table cell ของต้นแบบมี Supporting text สี gray-600 อย่างเดียว)
   FilterPanel = แผงตัวกรองด้านข้าง (Side panel header / Side panel footer ของไลบรารียังไม่มีในต้นแบบ — ประกอบตามค่าในดัมป์) · มือถือ Bottom sheet */
import { useEffect, useState, type ReactNode } from "react";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { BackgroundOverlay } from "@/components/vms/BackgroundOverlay";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { FeaturedIcon } from "@/components/vms/FeaturedIcon";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { MobileTable } from "@/components/vms/MobileTable";
import { MobileTableItem } from "@/components/vms/MobileTableItem";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { cellProps, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableCell, type CellAction } from "@/components/vms/TableCell";
import { TableHeaderCell } from "@/components/vms/TableHeaderCell";
import { TablePagination } from "@/components/vms/TablePagination";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { cx } from "@/lib/cx";
import type { DueTone } from "@/lib/mock/maintenance";
import { useRoleGuard, UNIT_ROLES } from "@/lib/mock/planFlow";
import { useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

/* หน้าเมนู Vehicle Management ของระบบ (pageHead o.root ของ maList / maDetail) */
export const VEHICLE_ROOT = "ยานพาหนะ";
export const LIST_TITLE = "ข้อมูลยานพาหนะ";
export const LIST_HREF = "/vehicles/maintenance/";
export const detailHref = (carId: string) => "/vehicles/detail/?car=" + carId;
export const PER = 10;

/* Permission ของ Scenario 24: กบค. เห็นทุกคัน · หน่วยงานเจ้าของรถ เห็นเฉพาะรถในสังกัด · บทบาทอื่นกลับราก (useRoleGuard) */
/* 9 พ.ย. 2569 ตรวจสิทธิ์: หน่วยงานผู้ดำเนินการทุกหน่วยงาน (กกฟ.1 กกฟ.2 กรย.) เห็นเฉพาะยานพาหนะในแผนของตัวเอง (unit) · กบค. ทุกคัน · เดิมเฉพาะ กกฟ.1 */
export const MA_ROLES = ["หน่วยงาน (กกฟ.1)", "หน่วยงาน (กกฟ.2)", "หน่วยงาน (กรย.)", "กบค.", "หน่วยงานเจ้าของยานพาหนะ"] as const;
export function useMaAccess() {
  const ok = useRoleGuard(MA_ROLES);
  const role = useRole();
  const owner = role === "หน่วยงานเจ้าของยานพาหนะ";
  return { ok, owner, unit: UNIT_ROLES[role] };
}

/* ---------- ช่องตาราง: { text, sub, tone } = บรรทัดรองสีตามสถานะ (toneText() ใน core.js) ---------- */
export type MaValue = TableValue | { text: string; sub?: string; tone?: DueTone };
const TONE: Record<DueTone, string> = { warning: "text-warning-600", error: "text-error-600" };
const isTone = (v: MaValue): v is { text: string; sub?: string; tone: DueTone } => !!v && typeof v === "object" && "tone" in v && !!v.tone;
const toneNode = (v: { text: string; sub?: string; tone: DueTone }) => (
  <>{v.text}{v.sub && <span className={cx("block text-xs font-normal", TONE[v.tone])}>{v.sub}</span>}</>
);

/* desktop: Table (Content = Table header cell + Table cell) + Table pagination — แบบเดียวกับ components/vms/Table */
export function MaTable({ cols, rows, Pagination }: { cols: TableColumn[]; rows: MaValue[][]; Pagination?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>{cols.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
          <thead><tr>{cols.map((c, i) => <TableHeaderCell key={i} Text={c.head} HeaderText={!!c.head} />)}</tr></thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {cols.map((c, ci) => {
                  const v = r[ci];
                  const p = isTone(v) ? { Style: c.Style ?? "Text", Text: toneNode(v) } : cellProps(v as TableValue, c.Style);
                  return <TableCell key={ci} AlternatingFills={ri % 2 === 1} {...p} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Pagination}
    </div>
  );
}

/* มือถือ: Mobile table + Mobile table item ตาม mobileCards() — แถวแรก Lead text · { text, sub } → Supporting text (กติกาข้อ 11) · ปุ่ม → แถวท้าย Action icons (mobileActions · กติกาข้อ 14) */
export function MaCards({ cols, rows }: { cols: TableColumn[]; rows: MaValue[][] }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, ri) => {
        let acts: CellAction[] | null = null;
        const data: { head: string; v: MaValue }[] = [];
        cols.forEach((c, ci) => {
          const v = r[ci];
          if (v && typeof v === "object" && "actions" in v) acts = v.mobileActions ?? v.actions;
          else if (c.head) data.push({ head: c.head, v });
        });
        const a = acts as CellAction[] | null;
        return (
          <MobileTable key={ri}>
            {data.map(({ head, v }, i) => {
              const Style = i === 0 ? "Lead text" : "Text";
              const last = i === data.length - 1 && !a?.length;
              if (isTone(v)) return <MobileTableItem key={i} Style={Style} Header={head} Text={toneNode(v)} last={last} />;
              if (v && typeof v === "object" && "text" in v) return <MobileTableItem key={i} Style={Style} Header={head} Text={v.text} SupportingText={v.sub || undefined} last={last} />;
              return <MobileTableItem key={i} Style={Style} Header={head} Text={v == null ? "" : String(v)} last={last} />;
            })}
            {a && a.length > 0 && <MobileTableItem Style="Action icons" Actions={a} />}
          </MobileTable>
        );
      })}
    </div>
  );
}

/* ตาราง + pagination ตามขนาดจอ (หน้าละ PER แถว) */
export function MaGrid({ cols, rows, page, onPage }: { cols: TableColumn[]; rows: MaValue[][]; page: number; onPage: (p: number) => void }) {
  const mob = useBreakpoint() === "Mobile";
  const shown = rows.slice((page - 1) * PER, page * PER);
  const pg = <TablePagination total={rows.length} page={page} perPage={PER} onPage={onPage} />;
  if (mob) return <div className="flex flex-col gap-5"><MaCards cols={cols} rows={shown} />{pg}</div>;
  return <MaTable cols={cols} rows={shown} Pagination={pg} />;
}

/* ---------- แผงตัวกรอง (filterPanel() ใน core.js · Filter ของ Vehicle list ใน UI Release#2) ---------- */
export interface FilterField { label: string; options: string[] }
export const ALL = "ทั้งหมด";

function Select({ f, value, onChange, mob }: { f: FilterField; value: string; onChange: (v: string) => void; mob: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <InputDropdown LabelText={f.label} Optional Size={mob ? "lg" : "md"} Text={value} open={open} onOpenChange={setOpen}>
      <DropdownList>
        {[ALL, ...f.options].map((o) => <DropdownListItem key={o} Text={o} State={o === value ? "Selected" : "Default"} onClick={() => { onChange(o); setOpen(false); }} />)}
      </DropdownList>
    </InputDropdown>
  );
}

/** value = ค่าที่ใช้อยู่ (ทั้งหมด = ไม่กรอง) · ตกลง → onApply(ค่าใหม่) · ยกเลิก/ปิด → onClose (ไม่เปลี่ยน) · ล้างตัวกรอง = ทุกช่องกลับเป็น ทั้งหมด (กดตกลงเพื่อใช้) */
export function FilterPanel({ open, fields, value, onApply, onClose }: { open: boolean; fields: FilterField[]; value: string[]; onApply: (v: string[]) => void; onClose: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  const [draft, setDraft] = useState(value);
  useEffect(() => { if (open) setDraft(value); }, [open, value]);
  return (
    <FilterShell open={open} onClose={onClose} onClear={() => setDraft(fields.map(() => ALL))} onApply={() => onApply(draft)}>
      {fields.map((f, i) => <Select key={f.label} f={f} mob={mob} value={draft[i] ?? ALL} onChange={(v) => setDraft(draft.map((x, j) => (j === i ? v : x)))} />)}
    </FilterShell>
  );
}

/** กรอบแผงตัวกรอง (desktop Side panel ชิดขวา · มือถือ Bottom sheet) — เนื้อหาช่องส่งเป็น children · ใช้ร่วม FilterPanel และฟอร์มสร้างแผน (ภาค เขต ประเภทรถ หลายค่า) */
export function FilterShell({ open, onClose, onClear, onApply, children }: { open: boolean; onClose: () => void; onClear: () => void; onApply: () => void; children: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  useEffect(() => {
    if (!open || mob) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, mob, onClose]);
  if (!open) return null;
  if (mob) {
    return (
      <BottomSheet open onClose={onClose} Title="ตัวกรอง" ActionText="ล้างตัวกรอง" onAction={onClear}
        Footer={<BottomSheetFooter SecondaryAction={<SecondaryButton Text="ยกเลิก" Size="lg" onClick={onClose} />} PrimaryAction={<PrimaryButton Text="ตกลง" Size="lg" onClick={onApply} />} />}>
        {children}
      </BottomSheet>
    );
  }
  return (
    <>
      <BackgroundOverlay onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="ma-filter-title" className="fixed inset-y-0 right-0 z-50 flex w-[480px] max-w-full flex-col gap-6 bg-white">
        {/* Side panel header: ขอบใน 24 ช่องไฟ 16 เส้นล่าง gray-300 · Featured icon Gray md filter_list · หัวข้อ 20 SemiBold black · Supporting text 14 gray-600 · ปุ่มปิด (Tabs ปิด) */}
        <div className="relative flex flex-col gap-4 border-b border-gray-300 p-6">
          <div className="flex items-center gap-4 pr-10">
            <FeaturedIcon Color="Gray" IconSwap="filter_list-24-400-round" />
            <div className="flex min-w-0 flex-col">
              <h2 id="ma-filter-title" className="text-lg font-semibold text-black">ตัวกรอง</h2>
              <p className="text-sm text-gray-600">กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ</p>
            </div>
          </div>
          <div className="absolute top-4 right-4"><TertiaryButton LeadingIconSwap="close-24-300-round" ButtonText={false} aria-label="ปิด" onClick={onClose} /></div>
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6">{children}</div>
        {/* Side panel footer: ขอบใน 16/24 ช่องไฟ 12 เส้นบน gray-300 · Tertiary brand button ซ้าย · Secondary + Primary ขวา */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-300 px-6 py-4">
          <TertiaryBrandButton Text="ล้างตัวกรอง" onClick={onClear} />
          <div className="flex gap-3">
            <SecondaryButton Text="ยกเลิก" onClick={onClose} />
            <PrimaryButton Text="ตกลง" onClick={onApply} />
          </div>
        </div>
      </div>
    </>
  );
}
