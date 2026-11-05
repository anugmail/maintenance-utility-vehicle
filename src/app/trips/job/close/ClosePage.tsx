"use client";
/* S10 Step 2 · สรุปงานก่อนปิดงาน (/trips/job/close/) — stepPage({ step: 2 }) ใน screens.js (รีวิวทีมออกแบบ 5 พ.ย. 2569 · หน้าปิดงานเดิมย้ายมาเป็นขั้นที่ 2) + S12 K.1 ผลการทดสอบ (ถ้ามี)
   กรอบ StepFrame (แถบขั้นตอน 2/2 · ข้อมูลยานพาหนะ · การนัดหมาย · ปุ่ม "บำรุงรักษาไม่ได้" ที่หัว — คืนตามจำนวนที่ใช้ที่กรอก)
   Section header ทุกส่วน: ข้อมูลเอกสาร · บันทึกข้อตกลงลูกค้า (kv อ่านอย่างเดียว)
   · รายการสภาพวัสดุอะไหล่ (8 คอลัมน์ · desktop "จำนวนที่ใช้" = Number input ในช่อง R74 แบบ ReturnPart ของงานซ่อม · มือถือ การ์ดกดแก้ไข + "เพิ่มรายการ")
   · ค่าใช้จ่ายของรถคันนี้ (บาท) (แถวละคน + "เพิ่มพนักงาน" · ค่าเดินทาง · สรุป) + งบที่ตัด (ตั้งต้น งบทำการ หน่วยงานต้นสังกัด) · ศูนย์ต้นทุน (Readonly ของหน่วยงานเจ้าของรถ · หน่วยงานอื่น = Input dropdown "ระบุศูนย์ต้นทุน") — R72 แบบ Request Repair/Budget ของงานซ่อม
   · ผลการบำรุงรักษา (เลขไมล์ · ชั่วโมงเครื่องจักร บังคับ · error out of focus) · น้ำมันไฮโดรลิก (Radio text card 3 ใบ + "วันที่เปลี่ยนน้ำมันครั้งล่าสุด (ถ้ามี)" ปฏิทินวันเดียว R73 + ผลการทดสอบ (ถ้ามี) เมื่อเก็บตัวอย่าง)
   · (เฉพาะรถเครน/รถกระเช้า) Safety Inspection (ถ้ามี) · HandoverSignature "ลงนามการส่งคืนรถ" · บันทึกตรวจสอบเอกสารปิดงาน (มี/ไม่มี/ไม่ต้องใช้ + "อัพโหลดเอกสาร")
   → "ย้อนกลับ" (Step 1) · "ปิดงาน" (Disabled จนครบ: เลขไมล์ ชั่วโมงเครื่องจักร ลงนามส่งคืนครบ — R59) → "เสร็จสิ้น" → หน้ารายละเอียดแผนเดินทาง + toast "บันทึกงานบำรุงรักษาสำเร็จ"
   แผนจ้างดำเนินการใช้หน้าเดียวกัน กบค. กรอกตามที่ผู้รับจ้างทำจริง · ใบจ้างไม่มีพนักงานในใบ ⇒ ตัวเลือกพนักงาน = พนักงาน กบค. ทั้งหมด (staffOf · COMPOSED.md) */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HandoverSignature } from "@/components/maintain-d/HandoverSignature";
import { ModalSignature } from "@/components/maintain-d/ModalSignature";
import { DropdownList } from "@/components/vms/DropdownList";
import { FileUpload } from "@/components/vms/FileUpload";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { DatePicker } from "@/components/vms/DatePicker";
import { HorizontalRadioGroups } from "@/components/vms/HorizontalRadioGroups";
import { NumberInput } from "@/components/vms/NumberInput";
import { TableCell } from "@/components/vms/TableCell";
import { TableHeaderCell } from "@/components/vms/TableHeaderCell";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import type { TableColumn } from "@/components/vms/Table";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import {
  BUDGET_CUT, carOf, closeJob, JOB_TIMES, OTHER_CC, closeRows, costSummary, emptyClose, nf, oilSampled, ownerCostCenter, patchJob, PEOPLE, personSum, safetyOn, staffOf, tripDays, tripLoc, tripPhone,
  type ClosePartRow, type CloseForm, type CostRow, type DocSel,
} from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useOutside } from "@/lib/useOutside";
import { ButtonRow, DataTable, Grid, jobHref, KvBox, OilCards, OilResultFields, PartAddModal, PartEditModal, Section, toUpload, tripHref, useTripCar, type PartEditValue } from "../../_lib/ui";
import { StepFrame } from "../StepFrame";

const PART_COLS: TableColumn[] = ["ชื่ออะไหล่", "ราคาต่อหน่วย", "จำนวนที่ใช้", "ราคารวมที่ใช้", "จำนวนที่คืน", "ราคารวมที่คืน", "จำนวนอะไหล่เก่า", "หมายเหตุ"]
  .map((head, i) => ({ head, width: i === 0 ? 220 : i === 7 ? undefined : 118, Style: i === 0 ? "Lead text" : "Text" }));
const RETURN_SLOTS = [
  { LabelText: "ผู้ส่งมอบรถ (กบค.)", Placeholder: "เลือกผู้ส่งมอบรถ (กบค.)" },
  { LabelText: "ผู้รับมอบรถ (หน่วยงานเจ้าของรถ)", Placeholder: "เลือกผู้รับมอบรถ (หน่วยงานเจ้าของรถ)" },
];
/* วันที่แบบไทย dd/mm/ปี พ.ศ. ↔ Date (ช่องวันที่เปลี่ยนน้ำมันครั้งล่าสุด) */
const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
const fromThai = (v: string) => { const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };
/* ตัวเลขมีจุลภาค "182,640" */
const digits = (v: string) => { const d = v.replace(/\D/g, ""); return d ? Number(d).toLocaleString("en-US") : ""; };

export function ClosePage() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const { trip, car, job, actor } = useTripCar();
  const [touched, setTouched] = useState<{ km?: boolean; hours?: boolean }>({});
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const [closeDate] = useState(() => () => setDateOpen(false));
  useOutside(dateRef, dateOpen, closeDate);
  const away = !!trip && !!car && !!job && job.status !== "doing";   // ยังไม่เริ่ม / ปิดแล้ว → หน้างานรายคัน
  /* เปิดหน้านี้ตอนงานไม่ได้อยู่ระหว่างบำรุงรักษา → หน้างานรายคัน · ปิดงาน/บำรุงรักษาไม่ได้จากหน้านี้เอง (สถานะเปลี่ยนระหว่างอยู่หน้า) ไม่พาไปไหน ให้ปุ่มพากลับหน้าแผนเดินทาง */
  const [awayAtOpen] = useState(() => ({ v: null as boolean | null }));
  if (awayAtOpen.v === null && trip && car && job) awayAtOpen.v = away;
  useEffect(() => { if (awayAtOpen.v && trip && car) router.replace(jobHref(trip, car.id)); }, [awayAtOpen, trip, car, router]);
  const [sign, setSign] = useState(-1);
  const [edit, setEdit] = useState<number | null>(null);
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState("");   // ช่อง dropdown ที่เปิด
  const [query, setQuery] = useState("");
  const result = useRef<HTMLDivElement>(null);
  const docFile = useRef<HTMLInputElement>(null);
  const [docAt, setDocAt] = useState(-1);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  if (awayAtOpen.v) return null;

  const f: CloseForm = job.close ?? emptyClose(job, trip, car);
  const put = (fn: (f: CloseForm) => CloseForm) => patchJob(trip.id, car.id, (j) => ({ ...j, close: fn(j.close ?? emptyClose(j, trip, car)) }));
  const setCost = (i: number, p: Partial<CostRow>) => put((x) => ({ ...x, costs: x.costs.map((r, k) => (k === i ? { ...r, ...p } : r)) }));
  const rows = closeRows(f);
  const sum = costSummary(f);
  const signed = f.signers.every((s) => !!s.sig);
  const toggle = (k: string) => (v: boolean) => { setOpen(v ? k : ""); setQuery(""); };
  const loc = tripLoc(trip, car);
  const start = job.startedAt ?? "";
  const staffOptions = staffOf(trip);
  const centers = [...new Set(trip.carIds.map((id) => ownerCostCenter(carOf(id)!)))];
  const days = Array.from({ length: tripDays(trip) }, (_, i) => i + 1);
  const E = (k: "km" | "hours", m: string, v: string) => (touched[k] && !v.trim() ? m : undefined);
  const complete = signed && !!f.km.trim() && !!f.hours.trim();   // R59 ปุ่มปิดงาน Disabled จนกว่าครบ
  const budget = f.budgetType ?? 0;
  const oilDate = f.oilDate ?? car.lastOil;
  /* จำนวนที่ใช้ตามแถวอะไหล่ตามแผน (ส่งต่อ popup บำรุงรักษาไม่ได้ระหว่าง Step 2) */
  const usedOfPlan = job.parts.map((p) => f.parts.find((r) => r.part === p.part && !r.added)?.used ?? 0);

  const submit = () => {
    if (!actor || !complete) return;
    closeJob(trip, car.id, f);
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
  const setUsed = (r: ClosePartRow, used: number) => put((x) => ({ ...x, parts: x.parts.map((p) => (p === r || (p.part === r.part && !p.added === !r.added) ? { ...p, used } : p)) }));
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
    <StepFrame trip={trip} car={car} job={job} step={2} used={usedOfPlan} actor={actor}>
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
        {mob ? <DataTable cols={PART_COLS} rows={partRows} onRow={openEdit} /> : (
          /* desktop: ช่อง "จำนวนที่ใช้" = Number input (R74 · ReturnPart ของงานซ่อม — Table ของไลบรารีไม่มีช่องกรอก ⇒ Table header cell + Table cell เรียงเป็นตาราง) · กดชื่ออะไหล่ = popup แก้ไขอะไหล่เก่า หมายเหตุ */
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px] table-fixed border-collapse">
              <colgroup>{PART_COLS.map((c, i) => <col key={i} style={{ width: i === 2 ? 160 : c.width }} />)}</colgroup>
              <thead><tr>{PART_COLS.map((c, i) => <TableHeaderCell key={i} Text={c.head} />)}</tr></thead>
              <tbody>
                {rows.map((r, ri) => (
                  <tr key={r.part + ri}>
                    {partRows[ri].map((v, ci) => ci === 2
                      ? <TableCell key={ci} AlternatingFills={ri % 2 === 1} Text={<NumberInput Label={false} Number={r.used} State={actor ? "Filled" : "Disabled"} onChange={(n) => setUsed(r, n)} className="w-32" />} />
                      : <TableCell key={ci} Style={ci === 0 ? "Lead text" : "Text"} AlternatingFills={ri % 2 === 1} Text={ci === 0 && actor ? <button type="button" className="cursor-pointer text-left" onClick={() => openEdit(ri)}>{String(v)}</button> : String(v)} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        {/* งบที่ตัด + ศูนย์ต้นทุน (R72 · Request Repair/Budget ของงานซ่อม): หน่วยงานต้นสังกัด = ศูนย์ต้นทุนของหน่วยงานเจ้าของรถ Readonly · หน่วยงานอื่น = Input dropdown "ระบุศูนย์ต้นทุน" · ประเภทอื่นยังไม่ออกแบบช่อง */}
        <Grid>
          <InputDropdown LabelText="งบที่ตัด" Text={BUDGET_CUT[budget]} Placeholder="เลือกงบที่ตัด" open={open === "cut"} onOpenChange={toggle("cut")}>
            <DropdownList>{BUDGET_CUT.map((b, k) => <DropdownListItem key={b} Text={b} State={k === budget ? "Selected" : "Default"}
              onClick={() => { put((x) => ({ ...x, budgetType: k, costCenter: k === 0 ? ownerCostCenter(car) : k === 1 ? null : x.costCenter })); setOpen(""); }} />)}</DropdownList>
          </InputDropdown>
          {budget === 0 ? <TextInput LabelText="ศูนย์ต้นทุน" Text={ownerCostCenter(car)} State="Readonly" readOnly LeadingIconSwap="account_balance-24-300-round" />
            : budget === 1 ? (
              <InputDropdown LabelText="ศูนย์ต้นทุน" Text={f.costCenter ?? ""} Placeholder="ระบุศูนย์ต้นทุน" open={open === "cc"} onOpenChange={toggle("cc")}>
                <DropdownList>{[...centers.filter((c) => c !== ownerCostCenter(car)), OTHER_CC].filter((c, k, a) => a.indexOf(c) === k).map((c) => <DropdownListItem key={c} Text={c} State={c === f.costCenter ? "Selected" : "Default"} onClick={() => { put((x) => ({ ...x, costCenter: c })); setOpen(""); }} />)}</DropdownList>
              </InputDropdown>
            ) : <span />}
        </Grid>
      </Section>
      <div ref={result}>
        <Section>
          <SectionHeader Title="ผลการบำรุงรักษา" />
          <Grid>
            <TextInput LabelText="เลขไมล์รถ (กม.)" Text={f.km} Placeholder="0" inputMode="numeric" onChange={(v) => put((x) => ({ ...x, km: digits(v) }))} onBlur={() => setTouched((t) => ({ ...t, km: true }))}
              State={E("km", "x", f.km) ? "Error" : undefined} HelperText={E("km", "กรุณาระบุเลขไมล์รถ", f.km)} />
            <TextInput LabelText="ชั่วโมงเครื่องจักร (ชม.)" Text={f.hours} Placeholder="0" inputMode="numeric" onChange={(v) => put((x) => ({ ...x, hours: digits(v) }))} onBlur={() => setTouched((t) => ({ ...t, hours: true }))}
              State={E("hours", "x", f.hours) ? "Error" : undefined} HelperText={E("hours", "กรุณาระบุชั่วโมงเครื่องจักร", f.hours)} />
          </Grid>
        </Section>
      </div>
      <Section>
        <SectionHeader Title="น้ำมันไฮโดรลิก" />
        <OilCards value={f.oilChoice} onChange={(k) => put((x) => ({ ...x, oilChoice: k }))} />
        {/* วันที่เปลี่ยนน้ำมันครั้งล่าสุด (ถ้ามี) — R73 กรอกได้ ตั้งต้นค่าในข้อมูลรถ · desktop โฟกัสแล้วเปิด Date picker Type=Single ใต้ช่อง (แบบช่องวันที่ของ S6) */}
        <div ref={dateRef} className="relative">
          <Grid><TextInput LabelText="วันที่เปลี่ยนน้ำมันครั้งล่าสุด" Optional Text={oilDate} Placeholder="วว/ดด/ปปปป" onChange={(v) => put((x) => ({ ...x, oilDate: v }))}
            onFocus={() => !mob && setDateOpen(true)} State={dateOpen ? "Focused" : undefined} /></Grid>
          {dateOpen && !mob && (
            <div className="absolute top-full left-0 z-30 mt-1">
              <DatePicker Type="Single" value={{ start: fromThai(oilDate), end: fromThai(oilDate) }} onCancel={() => setDateOpen(false)}
                onApply={(r) => { put((x) => ({ ...x, oilDate: r.start ? toThai(r.start) : "" })); setDateOpen(false); }} />
            </div>
          )}
        </div>
        {oilSampled(f.oilChoice) && (
          <OilResultFields optional sel={f.oilSel} files={f.oilFiles} onSel={(v) => put((x) => ({ ...x, oilSel: v }))}
            onFiles={(fs) => put((x) => ({ ...x, oilFiles: [...x.oilFiles, ...fs.map(toUpload)].slice(0, 10) }))}
            onDelete={(i) => put((x) => ({ ...x, oilFiles: x.oilFiles.filter((_, k) => k !== i) }))} />
        )}
      </Section>
      {safetyOn(car) && (
        /* ตาม "File upload" + "Section header" ของไฟล์ Component + จอ S10 "ปิดงาน — แนบเอกสาร Safety Inspection (ถ้ามี)" (ลอกบล็อก M ของ Overhaul) */
        <Section>
          <SectionHeader Title="Safety Inspection" />
          <FileUpload LabelText="เอกสาร Safety Inspection" Optional files={f.safetyFiles ?? []} hint="PDF, PNG, or JPG (สูงสุด 10 ไฟล์)" bar accept=".pdf,.jpg,.jpeg,.png"
            onFiles={(fs) => put((x) => ({ ...x, safetyFiles: [...(x.safetyFiles ?? []), ...fs.map(toUpload)].slice(0, 10) }))}
            onDelete={(i) => put((x) => ({ ...x, safetyFiles: (x.safetyFiles ?? []).filter((_, k) => k !== i) }))} />
        </Section>
      )}
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
        <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => router.push(jobHref(trip, car.id, "receive/"))} />
        <PrimaryButton Text="ปิดงาน" Size="lg" State={complete && actor ? "Default" : "Disabled"} onClick={submit} />
      </ButtonRow>

      <ModalSignature open={sign >= 0} Title="ลงนามการส่งคืนรถ" signer={[RETURN_SLOTS[Math.max(0, sign)].LabelText, f.signers[Math.max(0, sign)].name ?? ""]}
        value={sign >= 0 && f.signers[sign].sig !== "sample" ? f.signers[sign].sig : null}
        onSave={(url) => { const i = sign; put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? { ...s, sig: url } : s)) as CloseForm["signers"] })); setSign(-1); }}
        onClose={() => setSign(-1)} />
      <PartEditModal extra item={editRow && { part: editRow.part, task: job.parts.find((p) => p.part === editRow.part)?.task ?? "-", planQty: editRow.planQty, unit: editRow.unit,
        used: editRow.used, old: editRow.old, note: editRow.note, added: editRow.added }} onSave={saveEdit} onCancel={() => setEdit(null)} />
      <PartAddModal open={add} onAdd={saveAdd} onCancel={() => setAdd(false)} />
    </StepFrame>
  );
}
