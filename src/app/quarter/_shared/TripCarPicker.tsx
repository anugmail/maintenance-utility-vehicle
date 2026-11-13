"use client";
/* popup เพิ่มรถเข้าแผนเดินทาง — tripCarModal() ใน screens.js (S6 E.3 E.10 E.12 · S9 H.3) · spec S6.md P3
   Desktop: patterns/PopupModal กว้าง 1140 (Modal Size=xl · 13 พ.ย. 2569 ทุกจุด · เดิม 800) · หัว "เพิ่มรถเข้าแผนเดินทาง" + บรรทัดรอง (· อีก x คันอยู่ในแผนเดินทางอื่นแล้ว)
            เนื้อหา = ช่องค้นหาของ Table header (Text input ไอคอน search ไม่มีป้าย กว้าง 320 — Table header แบบไม่มีปุ่มตัวกรอง)
                     + ตาราง Lead checkbox ประกอบจาก Table header cell (Checkbox ที่หัวคอลัมน์แรก) + Table cell Style=Lead checkbox (Table ของไลบรารีรับช่องติ๊กไม่ได้)
            รถหมด = Empty state/Data empty · ปุ่มหลัก "เพิ่มเข้าแผนเดินทาง (n)" · ติ๊ก 0 คัน = "เพิ่มเข้าแผนเดินทาง" Disabled
   Mobile: Bottom sheet หัว "เพิ่มรถเข้าแผนเดินทาง" (ไม่มีบรรทัดรอง) · ช่องค้นหา + List with checkbox (หัว "ทะเบียน" · รายการ = ทะเบียน) ตาม mobileCards() ใน core.js
   5 พ.ย. 2569 (รีวิว "รถ 1 คันในไตรมาส สามารถอยู่ได้เพียง 1 แผนการเดินทางเท่านั้น · รถที่ถูกเลือกลงแผนอื่นไปแล้ว จะยังแสดงให้เห็น … แต่ไม่สามารถเลือกลงแผนเดินทางนี้ได้"):
     taken = { รถ: ชื่อแผนเดินทาง } → แถวแสดงแต่ Checkbox State=Disabled + บรรทัดรอง "อยู่ในแผนเดินทาง {ชื่อ}" (มือถือ List with checkbox item State=Disabled) · ติ๊กทั้งหมดนับเฉพาะคันที่เลือกได้
     บรรทัดรองของหัว "รถทุกคันของไตรมาส n · x คันอยู่ในแผนเดินทางอื่นแล้ว เลือกไม่ได้" (tripCarModal)
   แบ่งหน้า (12 พ.ย. 2569 · BACKLOG ข้อ 74 · เจ้าของงาน 12 พ.ย. 2569 "ป๊อบอัพ ควรมีแบ่งหน้า" — popup เพิ่มยานพาหนะเข้าไตรมาส ~370 คัน):
     หน้าละ 10 + Table pagination ของไลบรารี ใต้ตาราง (desktop Breakpoint=Desktop · มือถือ Breakpoint=Mobile ใต้ List with checkbox แบบตารางอื่นของรีโป) · พิมพ์ค้นหา = กลับหน้า 1
     ติ๊กหัวตาราง = เลือกทุกคันที่ตรงคำค้น (ทุกหน้า · คงพฤติกรรมเดิมก่อนแบ่งหน้า) เลือกไม่ได้ (อยู่ในแผนเดินทางอื่น) ไม่นับ · ที่ติ๊กไว้คงอยู่เมื่อเปลี่ยนหน้า/คำค้น
     ใช้ทุก popup ที่เรียก TripCarPicker: หน้าไตรมาส S6 · ฟอร์มแผน S1 S19 (R75) · ฟอร์มแผนเดินทาง S6 S9
   ตัวกรองในตัว popup (areaOf · เจ้าของงาน 12 พ.ย. 2569 "หน้าจอเลือกรถ อยากให้เป็น modal ตามรูป แก้ใน flow ด้วย" · BACKLOG ข้อ 87):
     แบบ vehPickerModal ของ Overhaul (figma-export/overhaul2-plugin/code.js) — Table header (ช่องค้นหา + ปุ่ม "ตัวกรอง" + Pill จำนวน + ชิปตัวกรองกดเอาออกได้)
     desktop = Filter panel กางใต้แถวค้นหาตั้งแต่เปิด popup (13 พ.ย. 2569) กดปุ่มตัวกรองเพื่อหุบ/กาง: Input dropdown with badges (Optional) ×3 แถวเดียว (ภาค · เขต · ประเภทยานพาหนะ · หลายค่า · placeholder "ทั้งหมด")
       + แถวปุ่ม Tertiary brand button "ล้างตัวกรอง" ซ้าย · Secondary "ยกเลิก" + Primary "ตกลง" ขวา · ช่องไฟ 20 · ตกลง = ใช้ค่า แผงยังกาง · ยกเลิก = หุบ ชิปขึ้นใต้แถวค้นหา
     มือถือ = แผงตัวกรอง bottom sheet ของเดิม (FilterShell) ซ้อนบน bottom sheet ของ popup · ค่าในแผงเป็นค่าร่าง กดตกลงจึงใช้ (แบบแผงตัวกรอง S1 เดิม · R69 ช่องเป็นอิสระต่อกัน · เขต = เขตของภาคที่เลือก)
     ไม่มีคันตรงคำค้น/ตัวกรอง = Empty state/Search not found "ไม่พบยานพาหนะ" · ไม่ส่ง areaOf = ช่องค้นหาอย่างเดียว
   ฟอร์มเลือกยานพาหนะแบบเดียวกันทุกจุด (เจ้าของงาน 13 พ.ย. 2569 "อยากให้เลือกรถเข้าแผน ใช้วิธีการเดียวกับเลือกรถเข้าไตรมาส" + "ฟอร์มการเลือกรถอยากให้ใช้เหมือนกัน แต่ต่างกันที่ คอลัมน์ที่ต่างกัน" · BACKLOG ข้อ 89):
     ทุกจุดส่ง areaOf = carArea (lib/mock/carArea.ts · จับคู่ด้วยทะเบียน) ⇒ หน้าไตรมาส S6 · ฟอร์มแผนเดินทาง S6 S9 ได้แผงตัวกรองชุดเดียวกับฟอร์มแผน · หัว บรรทัดรอง ปุ่ม taken ของแต่ละจุดคงเดิม
   ฟอร์มแผน S1 S19 แผน 2 ขั้น (R111 R112 · BACKLOG ข้อ 90 · เจ้าของงาน 13 พ.ย. 2569 · planCarModal ของ screens.js) — ไม่มีช่องเลือกไตรมาสใน popup แล้ว
     แท็บทั้งหมด "เพิ่มยานพาหนะเข้าแผน" (pool = ยานพาหนะที่ยังไม่อยู่ในแผน) · แท็บไตรมาส n "เพิ่มยานพาหนะเข้าไตรมาส n" (pool = ยานพาหนะในแผนที่ยังไม่จัดไตรมาส) — ผู้เรียกส่ง pool หัว ปุ่ม ข้อความว่างเอง
     (ข้อ 89 เคยมี prop pickQuarter / quarterOff = ช่อง "เพิ่มเข้าไตรมาส" ของแท็บทั้งหมด · R110 เลิกใช้วันเดียวกัน ⇒ เอาออก ไม่มีผู้เรียกอื่น)
   ดูบันทึกใน figma-spec/COMPOSED.md */
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

/* 11 พ.ย. 2569 เจ้าของงาน "อยากเพิ่ม วันที่ซ่อมล่าสุดด้วย ตอนเลือกรถเข้าแผน และตอนเลือกเข้าแผนการเดินทาง" (BACKLOG ข้อ 64) ⇒ บำรุงรักษาล่าสุด · ซ่อมล่าสุด (lib/mock/vehicleHistory.ts)
   ใช้ทุก popup ที่เรียก TripCarPicker: เพิ่มยานพาหนะเข้าแผนเดินทาง (S6 S9) · เพิ่มยานพาหนะเข้าไตรมาส (หน้าไตรมาส S6 · ฟอร์มแผน S1 S19 R75) · มือถือ = บรรทัดรองของรายการ */
/* แก้คำ 11 พ.ย. 2569 เป็นวันของเครื่องจักร (MA_HEAD REPAIR_HEAD) — popup กว้าง 800 ⇒ หน่วยงานเจ้าของยานพาหนะย้ายเป็นบรรทัดรองของทะเบียน (แบบ unitSub ของ tripVCols) */
const COLS = [{ head: "ทะเบียน", width: 190 }, { head: "ยี่ห้อ/รุ่น" }, { head: MA_HEAD, width: 200 }, { head: REPAIR_HEAD, width: 165 }];
const SEARCH = "ค้นหาทะเบียน, ยี่ห้อ/รุ่น, หน่วยงาน";
const PER = 10;

/* title / sub / okText / emptyText = popup "เพิ่มรถเข้าไตรมาส n" ของ E.1 (qAddModal() → tripCarModal(o.cars o.title o.sub o.okText)) · taken = รถที่อยู่ในแผนเดินทางอื่น (แสดงแต่เลือกไม่ได้)
   areaOf = ภาค เขต ประเภทยานพาหนะของแต่ละคัน (ส่งมา = มีปุ่มตัวกรองในตัว popup · BACKLOG ข้อ 87 · ทุกจุดส่ง carArea ข้อ 89) */
interface PickerProps { pool: TripCar[]; taken?: Record<string, string>; nowQ: string; onAdd: (ids: string[]) => void; onCancel: () => void; title?: string; sub?: string; okText?: string; emptyText?: string; emptySub?: string; areaOf?: (c: TripCar) => PickerArea }
type Area = { regions: string[]; districts: string[]; types: string[] };
const NO_AREA: Area = { regions: [], districts: [], types: [] };
export function TripCarPicker({ open, ...p }: PickerProps & { open: boolean }) {
  if (!open) return null;
  return <Picker {...p} />;
}

function Picker({ pool, taken = {}, nowQ, onAdd, onCancel, title = "เพิ่มยานพาหนะเข้าแผนเดินทาง", sub: subText, okText = "เพิ่มเข้าแผนเดินทาง", emptyText, emptySub, areaOf }: PickerProps) {
  const mob = useBreakpoint() === "Mobile";
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [ticked, setTicked] = useState<string[]>([]);
  /* ตัวกรองในตัว popup (areaOf) — area = ที่ใช้อยู่ · fd = ค่าร่างในแผง · dd = ช่อง dropdown ที่เปิด */
  const [area, setArea] = useState<Area>(NO_AREA);
  /* 13 พ.ย. 2569 เจ้าของงาน (ภาพ modal Overhaul) "ใน modal ต้องมี filter แบบ ที่ตอนเลือก filter ของเดิม" + เลือก "ช่องเดิม S1 + กางไว้ตั้งแต่เปิด"
     ⇒ desktop แผงตัวกรองกางตั้งแต่เปิด popup (panel) · ตกลง = ใช้ค่าแล้วแผงยังกางอยู่ · ยกเลิก/กดปุ่มตัวกรอง = คืนค่าร่างแล้วหุบ · มือถือ = bottom sheet เปิดเมื่อกดปุ่มตัวกรอง (sheet) */
  const [panel, setPanel] = useState(!!areaOf);
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
  const applyPanel = () => { setArea(fd); setPage(1); setDd(""); if (mob) setSheet(false); };   // desktop แผงยังกางอยู่หลังตกลง
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
  /* ตัวกรองในตัว popup: Table header (ไม่มีหัวตาราง) + Filter panel (desktop) · ชิปตัวกรองซ่อนระหว่างแผงกาง (ค่าอยู่ในช่องของแผงแล้ว) */
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
      <PopupModal open title={title} sub={sub} width={1140} ok={okText + (n ? " (" + n + ")" : "")} okDisabled={!n}
        onCancel={onCancel} onOk={() => onAdd(pool.filter((c) => ticked.includes(c.id) && !taken[c.id]).map((c) => c.id))}>
        {body}
      </PopupModal>
      {areaOf && mob && <FilterShell open={sheet} onClose={closePanel} onClear={() => setFd(NO_AREA)} onApply={applyPanel}>{dropdowns}</FilterShell>}
    </>
  );
}
