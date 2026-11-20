"use client";
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { TextInput } from "@/components/vms/TextInput";
import { DISTRICTS, REGIONS, VEHICLE_TYPES, shortRegion } from "@/lib/mock/data";
import type { PickerArea } from "@/lib/mock/carArea";
import { FilterShell } from "@/app/vehicles/_lib/ui";
import type { TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { MA_HEAD, REPAIR_HEAD, histText, useMachineDates } from "@/lib/mock/vehicleHistory";
import { CheckTable } from "@/app/new/CheckTable";
import { useOhStyle } from "@/lib/ohStyle";

const COLS = [{ head: "ทะเบียน", width: 190 }, { head: "ยี่ห้อ/รุ่น" }, { head: MA_HEAD, width: 200 }, { head: REPAIR_HEAD, width: 165 }];
const SEARCH = "ค้นหาทะเบียน, ยี่ห้อ/รุ่น, หน่วยงาน";
const PER = 10;
const OH_TITLE = "เพิ่มยานพาหนะ";

interface PickerProps { pool: TripCar[]; taken?: Record<string, string>; nowQ: string; onAdd: (ids: string[]) => void; onCancel: () => void; title?: string; sub?: string; okText?: string; emptyText?: string; emptySub?: string; areaOf?: (c: TripCar) => PickerArea }
type Area = { regions: string[]; districts: string[]; types: string[] };
const NO_AREA: Area = { regions: [], districts: [], types: [] };
export function TripCarPicker({ open, ...p }: PickerProps & { open: boolean }) {
  if (!open) return null;
  return <Picker {...p} />;
}

function Picker({ pool, taken = {}, nowQ, onAdd, onCancel, title = "เพิ่มยานพาหนะเข้าแผนเดินทาง", sub: subText, okText = "เพิ่มเข้าแผนเดินทาง", emptyText, emptySub, areaOf }: PickerProps) {
  const mob = useBreakpoint() === "Mobile";
  const oh = useOhStyle();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [ticked, setTicked] = useState<string[]>([]);
  const [area, setArea] = useState<Area>(NO_AREA);
  const [panel, setPanel] = useState(!!areaOf && !oh);
  const [sheet, setSheet] = useState(false);
  const [fd, setFd] = useState<Area>(NO_AREA);
  const [dd, setDd] = useState("");
  const mDates = useMachineDates();
  const k = q.trim();
  const inArea = (c: TripCar) => {
    if (!areaOf) return true;
    const a = areaOf(c);
    return (!area.regions.length || area.regions.includes(a.region)) && (!area.districts.length || area.districts.includes(a.district)) && (!area.types.length || area.types.includes(a.type));
  };
  const shown = pool.filter((c) => (!k || c.plate.includes(k) || c.model.includes(k) || c.owner.includes(k)) && inArea(c));
  const chips = [...area.regions.map(shortRegion), ...area.districts, ...area.types];
  const removeChip = (x: string) => {
    const r = area.regions.find((y) => shortRegion(y) === x);
    setArea(r ? { ...area, regions: area.regions.filter((y) => y !== r) } : area.districts.includes(x) ? { ...area, districts: area.districts.filter((y) => y !== x) } : { ...area, types: area.types.filter((y) => y !== x) });
    setPage(1);
  };
  const openPanel = () => { if (!mob && panel) return closePanel(); setFd(area); setDd(""); if (mob) setSheet(true); else setPanel(true); };
  const closePanel = () => { setDd(""); setFd(area); if (mob) setSheet(false); else setPanel(false); };
  const applyPanel = () => { setArea(fd); setPage(1); setDd(""); if (mob) setSheet(false); };
  const flip = (key: keyof Area, v: string) => setFd((f) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] }));
  const drop = (key: keyof Area) => (v: string) => setFd((f) => ({ ...f, [key]: f[key].filter((x) => x !== v) }));
  const ddOpen = (key: string) => (v: boolean) => setDd(v ? key : dd === key ? "" : dd);
  const dropdowns = <>
    <InputDropdownWithBadges LabelText="ภาค" Optional values={fd.regions} Placeholder="ทั้งหมด" onRemove={drop("regions")} open={dd === "region"} onOpenChange={ddOpen("region")}>
      <DropdownList>{REGIONS.map((r) => <DropdownListItem key={r} Text={r} State={fd.regions.includes(r) ? "Selected" : "Default"} onClick={() => flip("regions", r)} />)}</DropdownList>
    </InputDropdownWithBadges>
    <InputDropdownWithBadges LabelText="เขต" Optional values={fd.districts} Placeholder="ทั้งหมด" onRemove={drop("districts")} open={dd === "district"} onOpenChange={ddOpen("district")}>
      <DropdownList>{(fd.regions.length ? fd.regions : REGIONS).flatMap((r) => DISTRICTS[r]).map((x) => <DropdownListItem key={x} Text={x} State={fd.districts.includes(x) ? "Selected" : "Default"} onClick={() => flip("districts", x)} />)}</DropdownList>
    </InputDropdownWithBadges>
    <InputDropdownWithBadges LabelText="ประเภทยานพาหนะ" Optional values={fd.types} Placeholder="ทั้งหมด" onRemove={drop("types")} open={dd === "type"} onOpenChange={ddOpen("type")}>
      <DropdownList>{VEHICLE_TYPES.map((t) => <DropdownListItem key={t} Text={t} State={fd.types.includes(t) ? "Selected" : "Default"} onClick={() => flip("types", t)} />)}</DropdownList>
    </InputDropdownWithBadges>
  </>;
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const nTaken = pool.filter((c) => taken[c.id]).length;
  const n = ticked.length;
  const sub = subText ?? "ยานพาหนะทุกคันของ" + nowQ + (nTaken ? " · " + nTaken + " คันอยู่ในแผนเดินทางอื่นแล้ว เลือกไม่ได้" : "");
  const search = <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={q} Placeholder={SEARCH} onChange={(v) => { setQ(v); setPage(1); }} aria-label={SEARCH} className={mob ? "w-full" : "w-80"} />;
  const rows = shown.slice((pg - 1) * PER, pg * PER).map((c) => {
    const inTrip = taken[c.id] ? "อยู่ในแผนเดินทาง " + taken[c.id] : undefined, md = mDates(c.plate);
    return { key: c.id, text: c.plate, sub: c.owner + (inTrip ? " · " + inTrip : ""), mobileSub: (inTrip ? inTrip + " · " : "") + histText(md), disabled: !!taken[c.id], cells: [c.model, md.ma, md.repair] };
  });

  const table = <CheckTable columns={COLS} rows={rows} scope={shown.map((c) => ({ key: c.id, disabled: !!taken[c.id] }))} ticked={ticked} onTicked={setTicked}
    Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} />;
  const filtered = areaOf && <>
    <TableHeader query={q} Placeholder={SEARCH} onQuery={(v) => { setQ(v); setPage(1); }} onFilter={openPanel} FilterCount={chips.length}
      Filters={panel && !mob ? undefined : chips} onRemoveFilter={removeChip} />
    {panel && !mob && (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-4">{dropdowns}</div>
        <div className="flex items-center justify-between gap-3">
          <TertiaryBrandButton Text="ล้างตัวกรอง" onClick={() => setFd(NO_AREA)} />
          <div className="flex gap-3">
            <SecondaryButton Text="ยกเลิก" onClick={closePanel} />
            <PrimaryButton Text="ตกลง" onClick={applyPanel} />
          </div>
        </div>
      </div>
    )}
    {shown.length ? table : <EmptyStateSearchNotFound Text="ไม่พบยานพาหนะ" />}
  </>;
  const body = !pool.length
    ? (emptyText ? <EmptyStateDataEmpty Text={emptyText} SupportingText={emptySub} Graphic="vehicle" /> : <EmptyStateDataEmpty Graphic="vehicle" Text={"ยานพาหนะทุกคันของ" + nowQ + " อยู่ในแผนเดินทางแล้ว"} SupportingText="ไม่มียานพาหนะที่เพิ่มเข้าแผนเดินทางนี้ได้" />)
    : filtered || <>{search}{table}</>;

  return (
    <>
      <PopupModal open title={oh ? OH_TITLE : title} sub={sub} width={1140} ok={(oh ? OH_TITLE : okText) + (n ? " (" + n + ")" : "")} okDisabled={!n}
        onCancel={onCancel} onOk={() => onAdd(pool.filter((c) => ticked.includes(c.id) && !taken[c.id]).map((c) => c.id))}>
        {body}
      </PopupModal>
      {areaOf && mob && <FilterShell open={sheet} onClose={closePanel} onClear={() => setFd(NO_AREA)} onApply={applyPanel}>{dropdowns}</FilterShell>}
    </>
  );
}
