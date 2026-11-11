"use client";
/* S26 Safety Inspection · หน้ารายการยานพาหนะที่ต้องตรวจ Safety Inspection (/safety/) — เจ้าของงาน 11 พ.ย. 2569 (BACKLOG ข้อ 67 · ทำเว็บก่อน Figma)
   _"อยากทำหน้าลิสต์รถ เป็นอีก scen นึง โดยท้ายเป็นลิสต์คอลัมน์มีให้อัปโหลดเอกสาร inspection safety โดยกดเข้าไปเจอหน้าอัปโหลดเอกสาร"_
   โครงหน้ารายการแบบแดชบอร์ด S24 (Vehicle list ของหน้า "Vehicle Management" ใน UI Release#2 + Table · Mobile table · Table header · Side panel ของไฟล์ Component):
     Page header "Safety Inspection" (Breadcrumbs งานซ่อมและบำรุงรักษา) → Table header (ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" + ตัวกรอง + ชิป)
     เฉพาะยานพาหนะรหัสประเภท 09 (รหัสยานพาหนะ "น.3-09-1650" · เจ้าของงาน "รถ type 09 ที่จะมาแสดงที่หน้า list" · lib/mock/safety.ts)
     → Table 8 คอลัมน์ SAFETY_COLS (ทะเบียน/ยี่ห้อรุ่น · รหัสยานพาหนะ · ประเภท · สังกัด · ล่าสุด · ผล · ครบกำหนดครั้งถัดไป · อัปโหลดเอกสาร) + Table pagination / Empty state/Search not found + ล้างตัวกรอง
     คอลัมน์สุดท้าย "อัปโหลดเอกสาร" = Action icons (Tertiary button ไอคอน upload_file) เปิดหน้าอัปโหลดเอกสารของคันนั้น (ผู้ดูแลยานพาหนะ = ไอคอนดู เปิดดูอย่างเดียว)
   ตัวกรอง 4 ช่อง (FilterShell ชุดเดียวกับ S24): ประเภทยานพาหนะ · สังกัดยานพาหนะ (เขต) · ผล Safety Inspection (หลายค่า) · ครบกำหนดภายใน (ค่าเดียว ตัวเลือก MA_WITHIN_OPTS)
   บทบาท: ผู้ดำเนินการ (หน่วยงาน กกฟ.1 กกฟ.2 กรย. · กบค.) เห็นทุกคันและอัปโหลดได้ · ผู้ดูแลยานพาหนะ เห็นเฉพาะยานพาหนะที่ดูแล ดูอย่างเดียว (PERMISSIONS.md)
   ?sample=S26 = งานรายคันชุด T1_afterClose (82-6789 ปิดงานแล้ว 04/11/2569) + เอกสาร Safety Inspection ตอนปิดงาน (ยังไม่มีผล) */
import { Suspense, useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { applySample, patchJob, SAFETY_TYPES } from "@/lib/mock/jobs";
import { MA_WITHIN_OPTS } from "@/lib/mock/maintenance";
import { SAFETY_TITLE, dueCell, safetyDueMatch, uploadHref, useSafetyCars, type SafetyCar } from "@/lib/mock/safety";
import { SAFETY_NONE, SAFETY_PILL } from "@/lib/mock/safetyStore";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample, type SampleMap } from "@/lib/useSample";
import { useRouter } from "next/navigation";
import { ALL, FilterShell, MaGrid, type MaValue } from "@/app/vehicles/_lib/ui";
import { SAFETY_ROOT, resultPill, useSafetyAccess } from "./_lib/ui";

const SAFETY_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 190, Style: "Lead text" }, { head: "รหัสยานพาหนะ", width: 140 }, { head: "ประเภทยานพาหนะ", width: 140 }, { head: "สังกัดยานพาหนะ" },
  { head: "Safety Inspection ล่าสุด", width: 170 }, { head: "ผล", width: 140, Style: "Badge" }, { head: "ครบกำหนดครั้งถัดไป", width: 200 }, { head: "อัปโหลดเอกสาร", width: 130, Style: "Action icons" },
];
const RESULT_OPTS = [...SAFETY_PILL.map((p) => p[0]), SAFETY_NONE[0]];

interface SFilter { types: string[]; units: string[]; results: string[]; within: string }
const NONE: SFilter = { types: [], units: [], results: [], within: ALL };
type Multi = "types" | "units" | "results";
const WITHIN_LABEL = "ครบกำหนดภายใน";
const unitOf = (c: SafetyCar) => c.car.owner.split(" ")[0];
const match = (c: SafetyCar, f: SFilter) =>
  (!f.types.length || f.types.includes(c.car.type)) && (!f.units.length || f.units.includes(unitOf(c)))
  && (!f.results.length || f.results.includes(resultPill(c)[0])) && (f.within === ALL || safetyDueMatch(c, f.within, MA_WITHIN_OPTS));
/* ชิป: หลายค่า = ค่าที่เลือก · ครบกำหนดภายใน = "ครบกำหนดภายใน 3 เดือน" / "ครบกำหนดภายใน เลยกำหนดแล้ว" (แบบ S24) */
const withinChip = (v: string) => WITHIN_LABEL + " " + v.replace(/^ภายใน /, "");
const chipsOf = (f: SFilter) => [...f.types, ...f.units, ...f.results, ...(f.within !== ALL ? [withinChip(f.within)] : [])];
const dropChip = (f: SFilter, v: string): SFilter => ({
  types: f.types.filter((x) => x !== v), units: f.units.filter((x) => x !== v), results: f.results.filter((x) => x !== v), within: f.within !== ALL && withinChip(f.within) === v ? ALL : f.within,
});

const SAMPLES: SampleMap = {
  S26: { role: "หน่วยงาน (กกฟ.1)", apply: () => { applySample("T1_afterClose"); patchJob("T1", "82-6789", (j) => ({ ...j, safety: { files: [{ name: "Safety-Inspection-82-6789.pdf", size: "1.2 MB", bar: true }] } })); } },
};

function SafetyList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const seeding = useSample(SAMPLES);
  const { ok, owner } = useSafetyAccess();
  const cars = useSafetyCars(owner);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SFilter>(NONE);
  const [draft, setDraft] = useState<SFilter>(NONE);
  const [panel, setPanel] = useState(false);
  const [open, setOpen] = useState("");
  const [page, setPage] = useState(1);

  const units = useMemo(() => [...new Set(cars.map(unitOf))], [cars]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => (!q || [c.car.plate, c.car.model, c.peaId].some((s) => s.toLowerCase().includes(q))) && match(c, filter));
  }, [cars, query, filter]);
  if (seeding || !ok) return null;

  const chips = chipsOf(filter);
  const put = (f: SFilter) => { setFilter(f); setPage(1); };
  const reset = () => { setQuery(""); put(NONE); };
  const toggle = (k: string) => (o: boolean) => setOpen(o ? k : "");
  const flip = (k: Multi, v: string) => setDraft({ ...draft, [k]: draft[k].includes(v) ? draft[k].filter((x) => x !== v) : [...draft[k], v] });
  const multi = (k: Multi, label: string, options: string[]) => (
    <InputDropdownWithBadges key={k} LabelText={label} Optional values={draft[k]} Placeholder={ALL} onRemove={(v) => setDraft({ ...draft, [k]: draft[k].filter((x) => x !== v) })} open={open === k} onOpenChange={toggle(k)}>
      <DropdownList>{options.map((o) => <DropdownListItem key={o} Text={o} State={draft[k].includes(o) ? "Selected" : "Default"} onClick={() => flip(k, o)} />)}</DropdownList>
    </InputDropdownWithBadges>
  );
  const row = (c: SafetyCar): MaValue[] => {
    const plate = c.car.plate;
    const act = owner ? { IconSwap: "quick_reference_all-24-300-round", label: "ดูเอกสาร " + plate } : { IconSwap: "upload_file-24-300-round", label: "อัปโหลดเอกสาร " + plate };
    const a = [{ ...act, onClick: () => router.push(uploadHref(c.id)) }];
    return [{ text: plate, sub: c.car.model }, c.peaId, c.car.type, c.car.owner, c.last ?? "-", { pills: [resultPill(c)] }, dueCell(c), { actions: a, mobileActions: a }];
  };

  return (
    <>
      <PageHeader Title={SAFETY_TITLE} crumbs={[{ Text: SAFETY_ROOT }]} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="เลขทะเบียน, รหัสยานพาหนะ, ยี่ห้อ, รุ่น" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} onFilter={() => { setDraft(filter); setOpen(""); setPanel(true); }}
          FilterCount={chips.length} Filters={chips} onRemoveFilter={(v) => put(dropChip(filter, v))} />
        {shown.length ? <MaGrid cols={SAFETY_COLS} rows={shown.map(row)} page={page} onPage={setPage} />
          : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
      </section>
      <FilterShell open={panel} onClose={() => setPanel(false)} onClear={() => setDraft(NONE)} onApply={() => { put(draft); setPanel(false); }}>
        {multi("types", "ประเภทยานพาหนะ", SAFETY_TYPES)}
        {multi("units", "สังกัดยานพาหนะ", units)}
        {multi("results", "ผล Safety Inspection", RESULT_OPTS)}
        <InputDropdown LabelText={WITHIN_LABEL} Optional Size={mob ? "lg" : "md"} Text={draft.within} open={open === "within"} onOpenChange={toggle("within")}>
          <DropdownList>{[ALL, ...MA_WITHIN_OPTS].map((o) => <DropdownListItem key={o} Text={o} State={o === draft.within ? "Selected" : "Default"} onClick={() => { setDraft({ ...draft, within: o }); setOpen(""); }} />)}</DropdownList>
        </InputDropdown>
      </FilterShell>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SafetyList /></Suspense></AppFrame>;
}
