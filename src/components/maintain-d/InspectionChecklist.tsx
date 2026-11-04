"use client";
/* Figma: "InspectionChecklist" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/InspectionChecklist.json (CLAUDE.md ข้อ 12)
   ตรวจสภาพรถ (S10 รับรถ / ปิดงาน) · variant: Breakpoint = Desktop | Mobile · State = Default | Filled · property: AfterRepair (ปิดงาน)
   ค่าเริ่มหัวข้อของไฟล์ "รายละเอียดการตรวจสภาพก่อนซ่อม" · หัวกลุ่ม "การตรวจสอบสภาพซ่อมจากสาเหตุส่งซ่อม" — S10 ปิดงานส่ง Title "ตรวจสภาพรถปิดงาน"
   Desktop: Section header (Title + Badge) → ตาราง 2 ส่วนเท่ากัน: รายการ (หัวสูง 88 = 2 ชั้น) | MA table section: หัวกลุ่ม 44 + ปกติ 100 · ต้องแก้ไข 100 · หมายเหตุ 448 (44)
            แถว 56 พื้นสลับ · ปกติ/ต้องแก้ไข = Radio button · หมายเหตุ = Text input "ระบุหมายเหตุ" · แถวท้าย Secondary button lg "เพิ่มรายการ"
   Mobile: การ์ดละรายการ (InspectionChecklistCard): Section label ชื่อ → Radio text card "ปกติ"/"ต้องแก้ไข" (ข้อความ 14) → Text area "หมายเหตุ" (ถ้ามี) · "เพิ่มรายการ" lg เต็มกว้าง */
import { RadioButton } from "@/components/vms/RadioButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { ChecklistCard, TH, td } from "./_checklist";

export interface InspectionItem { name: string; /** ปกติ = true · ต้องแก้ไข = false · ยังไม่เลือก = null */ ok?: boolean | null; note?: string }

export interface InspectionChecklistProps {
  Title?: string;
  GroupTitle?: string;
  Badge?: string | number | null;
  items: InspectionItem[];
  onChange?: (i: number, patch: Partial<InspectionItem>) => void;
  onAdd?: () => void;
  readonly?: boolean;
  Breakpoint?: Breakpoint;
  className?: string;
}

export function InspectionChecklist({ Title = "รายละเอียดการตรวจสภาพก่อนซ่อม", GroupTitle = "การตรวจสอบสภาพซ่อมจากสาเหตุส่งซ่อม", Badge, items, onChange, onAdd, readonly, Breakpoint: bp, className }: InspectionChecklistProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  const set = (i: number, p: Partial<InspectionItem>) => !readonly && onChange?.(i, p);
  const head = <SectionHeader Title={Title} Badge={Badge ?? items.length} Breakpoint={bp} />;
  const add = !readonly && <SecondaryButton Text="เพิ่มรายการ" Size="lg" LeadingIconSwap="add-24-300-round" onClick={onAdd} className={mob ? "w-full" : undefined} />;
  if (mob) {
    return (
      <section className={cx("flex flex-col gap-4", className)}>
        {head}
        {items.map((it, i) => (
          <ChecklistCard key={i}>
            <SectionLabel Title={it.name} className="min-h-10" />
            <div className="flex gap-4 [&>*]:flex-1 [&>*]:basis-0">
              <RadioTextCard compact Text="ปกติ" Selected={it.ok === true} onClick={() => set(i, { ok: true })} />
              <RadioTextCard compact Text="ต้องแก้ไข" Selected={it.ok === false} onClick={() => set(i, { ok: false })} />
            </div>
            <TextArea LabelText="หมายเหตุ" Optional Text={it.note} Placeholder="ระบุหมายเหตุ" readOnly={readonly} onChange={(v) => set(i, { note: v })} />
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
          <colgroup><col className="w-1/2" /><col className="w-25" /><col className="w-25" /><col /></colgroup>
          <thead>
            <tr className="h-11">
              <th scope="col" rowSpan={2} className={cx(TH, "h-22")}>รายการ</th>
              <th scope="colgroup" colSpan={3} className={TH}>{GroupTitle}</th>
            </tr>
            <tr className="h-11">{["ปกติ", "ต้องแก้ไข", "หมายเหตุ"].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className={td(i, "text-md text-black")}>{it.name}</td>
                <td className={td(i)}><RadioButton Selected={it.ok === true} label={it.name + " ปกติ"} State={readonly ? "Disabled" : "Default"} onChange={() => set(i, { ok: true })} /></td>
                <td className={td(i)}><RadioButton Selected={it.ok === false} label={it.name + " ต้องแก้ไข"} State={readonly ? "Disabled" : "Default"} onChange={() => set(i, { ok: false })} /></td>
                <td className={td(i)}><TextInput Label={false} Text={it.note} Placeholder="ระบุหมายเหตุ" readOnly={readonly} onChange={(v) => set(i, { note: v })} aria-label={it.name + " หมายเหตุ"} /></td>
              </tr>
            ))}
            {add && <tr><td className="h-14 bg-white px-4 py-2" colSpan={4}>{add}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
