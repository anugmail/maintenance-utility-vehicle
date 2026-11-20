"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
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
import { SAFETY_TITLE, VSTAT_OPTS, countdown, dueCell, safetyDueMatch, useSafetyCars, type SafetyCar } from "@/lib/mock/safety";
import { MA_TODAY, MA_WITHIN_OPTS, thaiDate } from "@/lib/mock/maintenance";
import { notify } from "@/lib/mock/store";
import { downloadCsv } from "@/app/parts/_lib/exportFile";
import { SAFETY_CYCLES, SAFETY_NONE, SAFETY_PILL, cycleText } from "@/lib/mock/safetyStore";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample, type SampleMap } from "@/lib/useSample";
import { useRouter, useSearchParams } from "next/navigation";
import { ALL, FilterShell, MaGrid, type MaValue } from "@/app/vehicles/_lib/ui";
import { SAFETY_ROOT, resultPill, useSafetyAccess } from "./_lib/ui";
import { SafetyPopup } from "./_lib/SafetyPopup";

const SAFETY_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 170, Style: "Lead text" }, { head: "ประเภทยานพาหนะ", width: 190 }, { head: "สังกัดยานพาหนะ" }, { head: "สถานะยานพาหนะ", width: 150, Style: "Badge" },
  { head: "การตรวจ ปจ.2 ล่าสุด", width: 160 }, { head: "ผล", width: 130, Style: "Badge" }, { head: "ครบกำหนดครั้งถัดไป", width: 170 }, { head: "อัปโหลดเอกสาร", width: 130, Style: "Action icons" },
];
const EXPORT_COLS: TableColumn[] = ["ทะเบียน", "รหัสยานพาหนะ", "ยี่ห้อ/รุ่น", "ประเภทยานพาหนะ", "สังกัดยานพาหนะ", "สถานะยานพาหนะ", "การตรวจ ปจ.2 ล่าสุด", "วาระการตรวจ", "ผลการตรวจ ปจ.2",
  "ครบกำหนดครั้งถัดไป", "นับถอยหลัง"].map((head) => ({ head }));
const exportRow = (c: SafetyCar): string[] => [c.car.plate, c.peaId, c.car.model, c.car.type, c.car.owner, c.vstat[0], c.last ?? "-", c.cycle ? cycleText(c.cycle) : "-", resultPill(c)[0],
  c.due != null ? thaiDate(c.due) : "-", c.due != null ? countdown(c.due) : "-"];
const RESULT_OPTS = [...SAFETY_PILL.map((p) => p[0]), SAFETY_NONE[0]];

interface SFilter { types: string[]; units: string[]; vstats: string[]; results: string[]; cycles: string[]; within: string }
const NONE: SFilter = { types: [], units: [], vstats: [], results: [], cycles: [], within: ALL };
type Multi = "types" | "units" | "vstats" | "results" | "cycles";
const CYCLE_OPTS = SAFETY_CYCLES.map((n) => "วาระ " + cycleText(n));
const WITHIN_LABEL = "ครบกำหนดภายใน";
const unitOf = (c: SafetyCar) => c.car.owner.split(" ")[0];
const match = (c: SafetyCar, f: SFilter) =>
  (!f.types.length || f.types.includes(c.car.type)) && (!f.units.length || f.units.includes(unitOf(c))) && (!f.vstats.length || f.vstats.includes(c.vstat[0]))
  && (!f.results.length || f.results.includes(resultPill(c)[0])) && (!f.cycles.length || (c.cycle != null && f.cycles.includes("วาระ " + cycleText(c.cycle)))) && (f.within === ALL || safetyDueMatch(c, f.within, MA_WITHIN_OPTS));
const withinChip = (v: string) => WITHIN_LABEL + " " + v.replace(/^ภายใน /, "");
const chipsOf = (f: SFilter) => [...f.types, ...f.units, ...f.vstats, ...f.results, ...f.cycles, ...(f.within !== ALL ? [withinChip(f.within)] : [])];
const dropChip = (f: SFilter, v: string): SFilter => ({
  types: f.types.filter((x) => x !== v), units: f.units.filter((x) => x !== v), vstats: f.vstats.filter((x) => x !== v), results: f.results.filter((x) => x !== v), cycles: f.cycles.filter((x) => x !== v), within: f.within !== ALL && withinChip(f.within) === v ? ALL : f.within,
});

const SAMPLES: SampleMap = {
  S26: { role: "หน่วยงาน (กบผ.)", apply: () => { applySample("T1_afterClose"); patchJob("T1", "82-6789", (j) => ({ ...j, safety: { files: [{ name: "Safety-Inspection-82-6789.pdf", size: "1.2 MB", bar: true }] } })); } },
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
  const sp = useSearchParams();
  const [sel, setSel] = useState<string | null>(null);
  const carQ = sp.get("car");
  useEffect(() => {
    if (!carQ || seeding || !ok) return;
    setSel(carQ);
    const q = new URLSearchParams(sp.toString()); q.delete("car");
    router.replace("/safety/" + (q.toString() ? "?" + q.toString() : ""));
  }, [carQ, seeding, ok, sp, router]);

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
  const exportShown = () => {
    if (!shown.length) return;
    downloadCsv({ title: SAFETY_TITLE, info: [], section: "", cols: EXPORT_COLS, rows: shown.map(exportRow), file: "การตรวจ-ปจ2-" + MA_TODAY.replace(/\//g, "-") });
    notify("ส่งออกไฟล์สำเร็จ");
  };
  const row = (c: SafetyCar): MaValue[] => {
    const plate = c.car.plate;
    const a = [owner ? { IconSwap: "quick_reference_all-24-300-round", label: "ดูผล " + plate, onClick: () => setSel(c.id) }
      : { IconSwap: "upload_file-24-300-round", label: "อัปโหลดเอกสาร " + plate, onClick: () => setSel(c.id) }];
    return [{ text: plate, sub: c.peaId }, { text: c.car.type, sub: c.car.model }, c.car.owner, { pills: [c.vstat] }, c.last ? { text: c.last, sub: c.cycle ? "วาระ " + cycleText(c.cycle) : undefined } : "-", { pills: [resultPill(c)] }, dueCell(c), { actions: a, mobileActions: a }];
  };

  return (
    <>
      <PageHeader Title={SAFETY_TITLE} crumbs={[{ Text: SAFETY_ROOT }]} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="เลขทะเบียน, รหัสยานพาหนะ, ยี่ห้อ, รุ่น" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} onFilter={() => { setDraft(filter); setOpen(""); setPanel(true); }}
          FilterCount={chips.length} Filters={chips} onRemoveFilter={(v) => put(dropChip(filter, v))}
          Actions={<SecondaryButton Text="ส่งออก" LeadingIconSwap="download-24-300-round" Size={mob ? "lg" : "md"} State={shown.length ? "Default" : "Disabled"} disabled={!shown.length} onClick={exportShown} />} />
        {shown.length ? <MaGrid cols={SAFETY_COLS} rows={shown.map(row)} page={page} onPage={setPage} />
          : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
      </section>
      <FilterShell open={panel} onClose={() => setPanel(false)} onClear={() => setDraft(NONE)} onApply={() => { put(draft); setPanel(false); }}>
        {multi("types", "ประเภทยานพาหนะ", SAFETY_TYPES)}
        {multi("units", "สังกัดยานพาหนะ", units)}
        {multi("vstats", "สถานะยานพาหนะ", VSTAT_OPTS)}
        {multi("results", "ผลการตรวจ ปจ.2", RESULT_OPTS)}
        {multi("cycles", "วาระการตรวจ", CYCLE_OPTS)}
        <InputDropdown LabelText={WITHIN_LABEL} Optional Size={mob ? "lg" : "md"} Text={draft.within} open={open === "within"} onOpenChange={toggle("within")}>
          <DropdownList>{[ALL, ...MA_WITHIN_OPTS].map((o) => <DropdownListItem key={o} Text={o} State={o === draft.within ? "Selected" : "Default"} onClick={() => { setDraft({ ...draft, within: o }); setOpen(""); }} />)}</DropdownList>
        </InputDropdown>
      </FilterShell>
      <SafetyPopup car={cars.find((c) => c.id === sel) ?? null} readonly={owner} onClose={() => setSel(null)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SafetyList /></Suspense></AppFrame>;
}
