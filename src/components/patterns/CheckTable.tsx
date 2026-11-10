"use client";
/* ตารางรายการตรวจ (ประกอบจากชิ้นไลบรารี · ข้อ 13) — checkTable() + checkCard() + radioCell() + noteCell() ใน screens.js (แบบสำรองของ ReceiptChecklist / InspectionChecklist)
   ใช้ที่ S10 Step 1 "รายการตรวจสภาพ" แบบตรวจสภาพตามประเภทยานพาหนะ (R86 · 9 พ.ย. 2569 · inspectStep() ใน screens.js)
   InspectionChecklist ของไฟล์ Maintain-D มี 25 แถวตายตัว + ส่วนสาเหตุส่งซ่อม (instance เพิ่มแถวไม่ได้) ⇒ จอ Figma ประกอบตารางเอง ที่นี่ประกอบตามนั้น (COMPOSED.md หัวข้อ พ.)
   Desktop: Section header (Title + Badge จำนวน) → ห่าง 16 → ตาราง Table header cell + Table cell วางเป็นคอลัมน์ (ค่าเดียวกับ _checklist ของ ReceiptChecklist / InspectionChecklist)
            คอลัมน์ รายการ (ยืด) · ตัวเลือกละ 100 (Radio button) · หมายเหตุ 448 (Text input ไม่มีป้าย "ระบุหมายเหตุ") · แถวท้าย Secondary button md "เพิ่มรายการ" (ไอคอน add)
   Mobile: การ์ดละรายการ (กรอบ/พื้นของ Mobile table มุม 12): Section label ชื่อรายการ → Radio text card ตัวเลือกละใบ ช่องไฟ 16 · ปุ่ม "เพิ่มรายการ" lg เต็มกว้างท้ายสุด
            (checkCard ของ inspectStep ไม่มีช่องหมายเหตุ — ตามจอ Figma) */
import { ChecklistCard, TH, td } from "@/components/maintain-d/_checklist";
import { RadioButton } from "@/components/vms/RadioButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export interface CheckRow {
  name: string;
  /** ตัวเลือกที่เลือก (ลำดับใน options) · ยังไม่เลือก = null */
  sel: number | null;
  note: string;
}

export interface CheckTableProps {
  Title: string;
  /** ป้ายจำนวน (ค่าเริ่ม = จำนวนรายการ) */
  Badge?: string | number | null;
  /** หัวคอลัมน์ตัวเลือก เช่น ["ปกติ", "แก้ไข"] */
  options: string[];
  items: CheckRow[];
  onChange?: (i: number, patch: Partial<CheckRow>) => void;
  onAdd?: () => void;
  readonly?: boolean;
  Breakpoint?: Breakpoint;
  className?: string;
}

/* ชื่อรายการมีเลขลำดับนำหน้า "1. น้ำมันไฮดรอลิก" ตาม inspectStep() */
const label = (it: CheckRow, i: number) => i + 1 + ". " + it.name;

export function CheckTable({ Title, Badge, options, items, onChange, onAdd, readonly, Breakpoint: bp, className }: CheckTableProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  const set = (i: number, p: Partial<CheckRow>) => !readonly && onChange?.(i, p);
  const head = <SectionHeader Title={Title} Badge={Badge ?? items.length} Breakpoint={bp} />;
  const add = !readonly && <SecondaryButton Text="เพิ่มรายการ" Size={mob ? "lg" : "md"} LeadingIconSwap="add-24-300-round" onClick={onAdd} className={mob ? "w-full" : undefined} />;
  if (mob) {
    return (
      <section className={cx("flex flex-col gap-4", className)}>
        {head}
        {items.map((it, i) => (
          <ChecklistCard key={i}>
            <SectionLabel Title={label(it, i)} className="min-h-10" />
            <div className="flex gap-4 [&>*]:flex-1 [&>*]:basis-0">
              {options.map((o, k) => <RadioTextCard key={o} compact Text={o} Selected={it.sel === k} State={readonly ? "Disabled" : "Default"} onClick={() => set(i, { sel: k })} />)}
            </div>
          </ChecklistCard>
        ))}
        {add}
      </section>
    );
  }
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      {head}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1296px] border-separate border-spacing-0">
          <colgroup><col />{options.map((o) => <col key={o} className="w-25" />)}<col className="w-[448px]" /></colgroup>
          <thead>
            <tr>
              <th scope="col" className={cx(TH, "rounded-tl-lg")}>รายการ</th>
              {options.map((o) => <th key={o} scope="col" className={TH}>{o}</th>)}
              <th scope="col" className={TH}>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className={td(i, "text-md text-black")}>{label(it, i)}</td>
                {options.map((o, k) => (
                  <td key={o} className={td(i)}><RadioButton Selected={it.sel === k} label={label(it, i) + " " + o} State={readonly ? "Disabled" : "Default"} onChange={() => set(i, { sel: k })} /></td>
                ))}
                <td className={td(i)}><TextInput Label={false} Text={it.note} Placeholder="ระบุหมายเหตุ" readOnly={readonly} onChange={(v) => set(i, { note: v })} aria-label={label(it, i) + " หมายเหตุ"} /></td>
              </tr>
            ))}
            {add && <tr><td className={td(items.length)} colSpan={options.length + 2}>{add}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
