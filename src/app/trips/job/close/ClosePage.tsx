"use client";
/* S10 P5 · ปิดงานบำรุงรักษา — workForm() ใน screens.js (หน้าเดียวยาว ไม่มี stepper ไม่มีภาพตอนจบงาน) + S12 K.1 ช่องผลการทดสอบ (ถ้ามี)
   Section header ทุกส่วน: ข้อมูลเอกสาร · บันทึกข้อตกลงลูกค้า (kv อ่านอย่างเดียว) · รายการสภาพวัสดุอะไหล่ (Table 8 คอลัมน์ + "เพิ่มรายการ")
   · ค่าใช้จ่ายของรถคันนี้ (บาท) (แถวละคน: Input dropdown พนักงาน · เบี้ยเลี้ยง/วัน · ที่พัก/วัน · Input dropdown จำนวนวัน · รวม · ปุ่มลบ + "เพิ่มพนักงาน" · ค่าเดินทาง · สรุป · ศูนย์ต้นทุน)
   · ผลการบำรุงรักษา (เลขไมล์ · ชั่วโมงเครื่องจักร บังคับ) · น้ำมันไฮโดรลิก (Radio text card 3 ใบ + ผลการทดสอบ (ถ้ามี) เมื่อมีเก็บตัวอย่าง)
   · InspectionChecklist "ตรวจสภาพรถปิดงาน" (24) + HandoverSignature "ลงนามการส่งคืนรถ" · บันทึกตรวจสอบเอกสารปิดงาน (มี/ไม่มี/ไม่ต้องใช้ + "อัพโหลดเอกสาร")
   → "ย้อนกลับ" · "ปิดงาน" (กดได้เมื่อลงนามส่งคืนรถครบ — Condition ของ userflow) → ตรวจเอง เสร็จสิ้น / จ้าง ดำเนินการบำรุงรักษาแล้ว → หน้ารายละเอียดแผนเดินทาง + toast "บันทึกงานบำรุงรักษาสำเร็จ"
   ช่องในตารางอะไหล่เป็นข้อความตามจอ Figma (Table cell ไม่มีช่องกรอก) — กดแถวเปิด popup แก้ไขอะไหล่ (โครง partEditModal ของ screens.js) · "เพิ่มรายการ" = popup "เพิ่มอะไหล่ที่ใช้จริง" (partAddModal) */
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { HandoverSignature } from "@/components/maintain-d/HandoverSignature";
import { InspectionChecklist } from "@/components/maintain-d/InspectionChecklist";
import { ModalSignature } from "@/components/maintain-d/ModalSignature";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { HorizontalRadioGroups } from "@/components/vms/HorizontalRadioGroups";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import type { TableColumn } from "@/components/vms/Table";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import {
  carOf, closeJob, JOB_TIMES, closeRows, costSummary, emptyClose, nf, oilSampled, ownerCostCenter, patchJob, PEOPLE, personSum, tripDays, tripLoc, tripPhone,
  type ClosePartRow, type CloseForm, type CostRow, type DocSel,
} from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ButtonRow, DataTable, Grid, jobCrumbs, jobHref, KvBox, LastOil, OilCards, OilResultFields, PartAddModal, PartEditModal, Section, toUpload, tripHref, useBack, useTripCar, type PartEditValue } from "../../_lib/ui";

const PART_COLS: TableColumn[] = ["ชื่ออะไหล่", "ราคาต่อหน่วย", "จำนวนที่ใช้", "ราคารวมที่ใช้", "จำนวนที่คืน", "ราคารวมที่คืน", "จำนวนอะไหล่เก่า", "หมายเหตุ"]
  .map((head, i) => ({ head, width: i === 0 ? 220 : i === 7 ? undefined : 118, Style: i === 0 ? "Lead text" : "Text" }));
const RETURN_SLOTS = [
  { LabelText: "ผู้ส่งมอบรถ (กบค.)", Placeholder: "เลือกผู้ส่งมอบรถ (กบค.)" },
  { LabelText: "ผู้รับมอบรถ (หน่วยงานเจ้าของรถ)", Placeholder: "เลือกผู้รับมอบรถ (หน่วยงานเจ้าของรถ)" },
];
/* ตัวเลขมีจุลภาค "182,640" */
const digits = (v: string) => { const d = v.replace(/\D/g, ""); return d ? Number(d).toLocaleString("en-US") : ""; };

export function ClosePage() {
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const { trip, car, job, actor, vendor } = useTripCar();
  const [errors, setErrors] = useState(false);
  const [sign, setSign] = useState(-1);
  const [edit, setEdit] = useState<number | null>(null);
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState("");   // ช่อง dropdown ที่เปิด
  const [query, setQuery] = useState("");
  const result = useRef<HTMLDivElement>(null);
  const docFile = useRef<HTMLInputElement>(null);
  const [docAt, setDocAt] = useState(-1);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;

  const f: CloseForm = job.close ?? emptyClose(job, trip, car);
  const put = (fn: (f: CloseForm) => CloseForm) => patchJob(trip.id, car.id, (j) => ({ ...j, close: fn(j.close ?? emptyClose(j, trip, car)) }));
  const setCost = (i: number, p: Partial<CostRow>) => put((x) => ({ ...x, costs: x.costs.map((r, k) => (k === i ? { ...r, ...p } : r)) }));
  const rows = closeRows(f);
  const sum = costSummary(f);
  const signed = f.signers.every((s) => !!s.sig);
  const toggle = (k: string) => (v: boolean) => { setOpen(v ? k : ""); setQuery(""); };
  const loc = tripLoc(trip, car);
  const start = job.startedAt ?? "";
  const staffOptions = trip.staff.length ? trip.staff : [PEOPLE.vendor.replace(/ \(.*\)$/, "")];
  const centers = [...new Set(trip.carIds.map((id) => ownerCostCenter(carOf(id)!)))];
  const days = Array.from({ length: tripDays(trip) }, (_, i) => i + 1);
  const E = (m: string, v: string) => (errors && !v.trim() ? m : undefined);

  const submit = () => {
    if (!actor || !signed) return;
    if (!f.km.trim() || !f.hours.trim()) { setErrors(true); result.current?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    closeJob(trip, car.id, f, vendor);
    notify("บันทึกงานบำรุงรักษาสำเร็จ");
    router.push(tripHref(trip));
  };

  /* ---------- popup แก้ไขอะไหล่ / เพิ่มอะไหล่ที่ใช้จริง ---------- */
  const editRow = edit != null ? rows[edit] ?? null : null;
  const openEdit = (i: number) => { if (actor && rows[i]) setEdit(i); };
  const saveEdit = (v: PartEditValue) => {
    if (!editRow) return;
    put((x) => ({ ...x, parts: x.parts.map((r) => (r === editRow || (r.part === editRow.part && !r.added === !editRow.added) ? { ...r, used: v.used, old: v.old, note: v.note } : r)) }));
    setEdit(null);
  };
  const saveAdd = (p: { name: string; code: string; qty: string; unit: string }) => {
    const row: ClosePartRow = { part: p.name.trim(), code: p.code.trim() || undefined, unit: p.unit, unitPrice: 0, planQty: 0, used: Number(p.qty) || 0, old: 0, note: "", added: true };
    put((x) => ({ ...x, parts: [...x.parts, row] }));
    setAdd(false);
  };
  const partRows = rows.map((r) => {
    const ret = Math.max(0, r.planQty - r.used);
    return [r.part, nf(r.unitPrice), String(r.used), nf(r.used * r.unitPrice), String(ret), nf(ret * r.unitPrice), String(r.old), r.note || "-"];
  });

  /* ---------- แถวค่าใช้จ่ายรายคน ---------- */
  const costRow = (r: CostRow, i: number) => {
    const k = "staff" + i, kd = "days" + i;
    const kids = [
      <InputDropdown key="n" LabelText="พนักงาน กบค. ซ่อม" Text={open === k ? query : r.name ?? ""} Placeholder="ค้นหาชื่อ-นามสกุล, รหัสพนักงาน" LeadingIconSwap="search-24-300-round"
        open={open === k} onOpenChange={toggle(k)} onQuery={setQuery}>
        <DropdownList emptyText="ไม่พบข้อมูล">
          {staffOptions.filter((o) => !query || o.includes(query)).map((o) => <DropdownListItem key={o} Text={o} State={o === r.name ? "Selected" : "Default"} onClick={() => { setCost(i, { name: o }); setOpen(""); }} />)}
        </DropdownList>
      </InputDropdown>,
      <TextInput key="p" LabelText="ค่าเบี้ยเลี้ยง (บาท/วัน)" Optional Text={r.perDiem} Placeholder="0" inputMode="numeric" onChange={(v) => setCost(i, { perDiem: digits(v) })} />,
      <TextInput key="l" LabelText="ค่าที่พัก (บาท/วัน)" Optional Text={r.lodging} Placeholder="0" inputMode="numeric" onChange={(v) => setCost(i, { lodging: digits(v) })} />,
      <InputDropdown key="d" LabelText="จำนวนวัน" Text={r.days ? r.days + " วัน" : ""} Placeholder="เลือกจำนวนวัน" open={open === kd} onOpenChange={toggle(kd)}>
        <DropdownList>{days.map((d) => <DropdownListItem key={d} Text={d + " วัน"} State={d === r.days ? "Selected" : "Default"} onClick={() => { setCost(i, { days: d }); setOpen(""); }} />)}</DropdownList>
      </InputDropdown>,
      <TextInput key="t" LabelText="รวม (บาท)" Text={nf(personSum(r))} State="Readonly" readOnly />,
    ];
    const del = <TertiaryButton LeadingIconSwap="delete-24-300-round" ButtonText={false} aria-label={"ลบพนักงาน " + (r.name ?? i + 1)}
      onClick={() => put((x) => ({ ...x, costs: x.costs.filter((_, kk) => kk !== i) }))} />;
    return mob
      ? <div key={i} className="flex flex-col gap-4">{kids}<div className="flex">{del}</div></div>
      : <div key={i} className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] items-end gap-6">{kids}{del}</div>;
  };

  return (
    <>
      <PageHeader Title={"ปิดงานบำรุงรักษา · " + car.plate} crumbs={jobCrumbs(trip, "ปิดงาน")} onBack={() => back(jobHref(trip, car.id))} />
      <Section>
        <SectionHeader Title="ข้อมูลเอกสาร" />
        <KvBox pairs={[["เลขที่งาน", trip.planMr], ["หน่วยงานผู้ใช้บริการ", car.owner], ["ชื่องาน", "บำรุงรักษารถกระเช้า " + car.model + " ทะเบียน " + car.plate + " ณ " + loc],
          ["วันที่รับงาน", start.slice(0, 10) || "-"], ["วันที่เสร็จงาน", (trip.mode === "hire" ? JOB_TIMES.hire.end : JOB_TIMES.self.end).slice(0, 10)]]} />
      </Section>
      <Section>
        <SectionHeader Title="บันทึกข้อตกลงลูกค้า" />
        <KvBox pairs={[["ติดต่อลูกค้าชื่อ", PEOPLE.ownerSigner], ["ตำแหน่ง", "หัวหน้าแผนก " + car.owner], ["เมื่อวันที่", trip.d1], ["เบอร์โทรศัพท์", tripPhone(trip, car)],
          ["ความต้องการลูกค้า", "บำรุงรักษาตามแผน ณ " + loc]]} />
      </Section>
      <Section>
        <SectionHeader Title="รายการสภาพวัสดุอะไหล่" Badge={rows.length} />
        <DataTable cols={PART_COLS} rows={partRows} onRow={openEdit} />
        <div className="flex"><SecondaryButton Text="เพิ่มรายการ" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} className={mob ? "w-full" : undefined}
          onClick={() => actor && setAdd(true)} /></div>
      </Section>
      <Section>
        <SectionHeader Title="ค่าใช้จ่ายของรถคันนี้ (บาท)" Badge={f.costs.length + " คน"} />
        {f.costs.map(costRow)}
        <div className="flex"><SecondaryButton Text="เพิ่มพนักงาน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} className={mob ? "w-full" : undefined}
          onClick={() => put((x) => ({ ...x, costs: [...x.costs, { name: null, perDiem: "", lodging: "", days: null }] }))} /></div>
        <Grid><TextInput LabelText="ค่าเดินทาง (รวมทุกคน)" Optional Text={f.travel} Placeholder="0" inputMode="numeric" onChange={(v) => put((x) => ({ ...x, travel: digits(v) }))} /></Grid>
        <KvBox pairs={[["รวมค่าเบี้ยเลี้ยง", nf(sum.perDiem) + " บาท"], ["รวมค่าที่พัก", nf(sum.lodging) + " บาท"], ["ค่าเดินทาง", nf(sum.travel) + " บาท"], ["รวมค่าใช้จ่ายของรถคันนี้", nf(sum.total) + " บาท"]]} />
        <Grid>
          <InputDropdown LabelText="งบประมาณ (ศูนย์ต้นทุน)" Text={f.costCenter ?? ""} Placeholder="เลือกศูนย์ต้นทุน" open={open === "cc"} onOpenChange={toggle("cc")}>
            <DropdownList>{centers.map((c) => <DropdownListItem key={c} Text={c} State={c === f.costCenter ? "Selected" : "Default"} onClick={() => { put((x) => ({ ...x, costCenter: c })); setOpen(""); }} />)}</DropdownList>
          </InputDropdown>
        </Grid>
      </Section>
      <div ref={result}>
        <Section>
          <SectionHeader Title="ผลการบำรุงรักษา" />
          <Grid>
            <TextInput LabelText="เลขไมล์รถ (กม.)" Text={f.km} Placeholder="0" inputMode="numeric" onChange={(v) => put((x) => ({ ...x, km: digits(v) }))}
              State={E("x", f.km) ? "Error" : undefined} HelperText={E("กรุณาระบุเลขไมล์รถ", f.km)} />
            <TextInput LabelText="ชั่วโมงเครื่องจักร (ชม.)" Text={f.hours} Placeholder="0" inputMode="numeric" onChange={(v) => put((x) => ({ ...x, hours: digits(v) }))}
              State={E("x", f.hours) ? "Error" : undefined} HelperText={E("กรุณาระบุชั่วโมงเครื่องจักร", f.hours)} />
          </Grid>
        </Section>
      </div>
      <Section>
        <SectionHeader Title="น้ำมันไฮโดรลิก" />
        <OilCards value={f.oilChoice} onChange={(k) => put((x) => ({ ...x, oilChoice: k }))} />
        <LastOil car={car} />
        {oilSampled(f.oilChoice) && (
          <OilResultFields optional sel={f.oilSel} files={f.oilFiles} onSel={(v) => put((x) => ({ ...x, oilSel: v }))}
            onFiles={(fs) => put((x) => ({ ...x, oilFiles: [...x.oilFiles, ...fs.map(toUpload)].slice(0, 10) }))}
            onDelete={(i) => put((x) => ({ ...x, oilFiles: x.oilFiles.filter((_, k) => k !== i) }))} />
        )}
      </Section>
      <InspectionChecklist Title="ตรวจสภาพรถปิดงาน" items={f.inspect}
        onChange={(i, p) => put((x) => ({ ...x, inspect: x.inspect.map((it, k) => (k === i ? { ...it, ...p } : it)) }))} />
      <HandoverSignature Title="ลงนามการส่งคืนรถ"
        slots={RETURN_SLOTS.map((s, i) => ({ ...s, options: i === 0 ? staffOptions : [PEOPLE.ownerSigner], value: f.signers[i].name, signed: !!f.signers[i].sig }))}
        onPick={(i, name) => put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? { name, sig: s.name === name ? s.sig : null } : s)) as CloseForm["signers"] }))}
        onSign={setSign} />
      <Section>
        <SectionHeader Title="บันทึกตรวจสอบเอกสารปิดงาน" Badge={f.docs.length} />
        {f.docs.map((d, i) => (
          <div key={i} className={cx(mob ? "flex flex-col gap-3" : "flex items-end gap-6")}>
            <HorizontalRadioGroups Label={d.name} options={["มี", "ไม่มี", "ไม่ต้องใช้"]} value={d.sel} className="min-w-0 flex-1"
              onChange={(v) => put((x) => ({ ...x, docs: x.docs.map((dd, k) => (k === i ? { ...dd, sel: v as DocSel } : dd)) }))} />
            <div className="flex"><SecondaryButton Text="อัพโหลดเอกสาร" LeadingIconSwap="cloud_upload-24-300-round" State={d.sel && d.sel !== "มี" ? "Disabled" : "Default"}
              onClick={() => { setDocAt(i); docFile.current?.click(); }} /></div>
          </div>
        ))}
        <input ref={docFile} type="file" hidden onChange={(e) => {
          const names = Array.from(e.target.files ?? []).map((x) => x.name); e.target.value = "";
          if (docAt >= 0 && names.length) put((x) => ({ ...x, docs: x.docs.map((dd, k) => (k === docAt ? { ...dd, files: [...dd.files, ...names] } : dd)) }));
        }} />
        <div className="flex"><SecondaryButton Text="เพิ่มรายการ" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} className={mob ? "w-full" : undefined} /></div>
      </Section>
      <ButtonRow>
        <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => back(jobHref(trip, car.id))} />
        <PrimaryButton Text="ปิดงาน" Size="lg" State={signed && actor ? "Default" : "Disabled"} onClick={submit} />
      </ButtonRow>

      <ModalSignature open={sign >= 0} Title="ลงนามการส่งคืนรถ" signer={[RETURN_SLOTS[Math.max(0, sign)].LabelText, f.signers[Math.max(0, sign)].name ?? ""]}
        value={sign >= 0 && f.signers[sign].sig !== "sample" ? f.signers[sign].sig : null}
        onSave={(url) => { const i = sign; put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? { ...s, sig: url } : s)) as CloseForm["signers"] })); setSign(-1); }}
        onClose={() => setSign(-1)} />
      <PartEditModal extra item={editRow && { part: editRow.part, task: job.parts.find((p) => p.part === editRow.part)?.task ?? "-", planQty: editRow.planQty, unit: editRow.unit,
        used: editRow.used, old: editRow.old, note: editRow.note, added: editRow.added }} onSave={saveEdit} onCancel={() => setEdit(null)} />
      <PartAddModal open={add} onAdd={saveAdd} onCancel={() => setAdd(false)} />
    </>
  );
}
