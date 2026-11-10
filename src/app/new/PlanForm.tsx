"use client";
/* ฟอร์มแผนบำรุงรักษา planForm() ใน screens.js แบบ A (เจ้าของงานเลือก 5 พ.ย. 2569 · รีวิวทีมออกแบบ) — ใช้ร่วม S1 สร้างแผน (/new/) และ S19 แก้ไขแผน (/edit/?id=)
   ตาม `Section header` · `Input dropdown with badges` · `Tabs` · `Table header` · `Table cell` (Lead checkbox) · `Empty state/Data empty` (Graphic=vehicle) · `Empty state/Search not found`
   · `Radio text card` ของไฟล์ Component + หน้า 5.2 Vehicle Management (Vehicle list · Export reports - Select vehicles) ของ UI Release#2
   Content ช่องไฟ 32:
     (แก้ไข) Alert — ส่งกลับแก้ไข: Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล · อนุมัติแล้ว: Warning "แผนนี้อนุมัติแล้ว"
     ข้อมูลแผน (Section header) — ชื่อแผน (Text input) · ปีงบประมาณ (สร้าง: Input dropdown · แก้ไข: Readonly)
     เลือกรถเข้าแผนและจัดลงไตรมาส (Section header + ป้าย "จัดลงไตรมาสแล้ว n คัน" ไม่มีตัวหาร (Figma ff5f1f8 9 พ.ย. 2569) · เดิม n/N N = รถทุกคันที่ฟอร์มเห็น UNIT_FLEET = รถจำลองครบชุด CAND · 6 พ.ย. 2569 "ต้องเอารถเข้า ไตรมาสทุกคัน" · 9 พ.ย. 2569 "รถตัวอย่างทำไมมีน้อยตอนแรกมี 250 คันป่ะ" + "ถ้าเลือกภาคแล้วต้องแสดงตามที่เลือกสิ") — ภาค · เขต · ประเภทรถ อยู่ในแผงตัวกรอง (ปุ่ม "ตัวกรอง" ของ Table header · 5 พ.ย. 2569 ย้ายจากแถวบนสุด)
       แผง = Side panel แบบ FilterPanel ของ S24 (มือถือ Bottom sheet) + Input dropdown with badges (Optional) ×3 ตาม "PEA Car Cost Filter" ของ UI Release#2 (ช่อง "ปี" หลายค่า)
       (หลายค่า · ไม่มี Disabled เลือกช่องไหนก่อนก็ได้ R69 · เขต = เขตของภาคที่เลือกในแผง ยังไม่เลือกภาค = ทุกเขต · กดตกลงจึงใช้)
       Tabs + Table header แสดงเสมอ — รถของหน่วยงานที่ตรงทุกช่องที่เลือก (ช่องว่าง = ทั้งหมด): Tabs ทั้งหมด n · ไตรมาส 1–4 n (Pill) → Table header (หัว "รถในพื้นที่ที่เลือก" + Badge "n คัน" / "รถในไตรมาส n" + Badge "กำหนดอะไหล่แล้ว x/y คัน" · ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น"
       · ตัวกรอง + Pill จำนวนตัวกรอง · ปุ่ม "จัดลงไตรมาส (n)" Disabled เมื่อยังไม่ติ๊ก · ชิปตัวกรองกดเอาออกได้) → ตารางติ๊ก + Table pagination
       ทั้งหมด: ทะเบียน (ยี่ห้อ/รุ่น) · ประเภทรถ · เขต / หน่วยงานเจ้าของรถ · ไตรมาส (Pill "ไตรมาส n" Brand / "ยังไม่จัด" Gray)
       ไตรมาส n: Q_COLS (น้ำมันไฮดรอลิก · อะไหล่อื่นๆ ("ไม่เบิกอะไหล่" เมื่อเลือกไม่เบิก) · ปุ่ม "…" (Q_MENU · 6 พ.ย. 2569 เจ้าของงาน "เพิ่ม ... ดูรายละเอียด แก้ไข ลบ ของรถแต่ละคัน") · ไม่มีคอลัมน์ไตรมาส)
         เมนู … ของยานพาหนะ (RowMenu · ชุด MENU เดียวกับรายการแผน): ดูรายละเอียด → /car-parts/view/ (carPartsView อะไหล่ของยานพาหนะคันนั้น ดูอย่างเดียว) · แก้ไข → /car-parts/ (S21)
         · ลบ → ยืนยันการเอายานพาหนะออกจากไตรมาส (Q_OUT_CONFIRM) → กลับเป็นยังไม่จัด ปุ่มบันทึกและส่งอนุมัติกดไม่ได้อีกครั้ง + toast "เอายานพาหนะออกจากไตรมาส n สำเร็จ" · มือถือ List with checkbox บรรทัดรอง "น้ำมัน … · อะไหล่อื่นๆ …" ไม่มีไอคอน (BACKLOG ข้อ 11)
       ยังไม่เลือกช่องใด (แท็บทั้งหมด): Empty state "ยังไม่มีรายการรถ" / "กดตัวกรองเพื่อเลือกภาค เขต หรือประเภทรถ ตารางจะแสดงรถทั้งหมดที่ตรงกัน"
       · ไตรมาสว่าง: "ยังไม่มีรถในไตรมาสนี้" + ปุ่มหลัก "เพิ่มรถเข้าไตรมาส n" (R75 5 พ.ย. 2569 · noCarsInQ) → popup "เพิ่มรถเข้าไตรมาส n" (TripCarPicker แบบ S6 E.1 · รถของพื้นที่ที่เลือกที่ยังไม่อยู่ในไตรมาสใด · มือถือ bottom sheet)
         → ยืนยัน = อยู่แท็บเดิม รถขึ้นในตาราง ตัวเลขบนแท็บเปลี่ยน + toast "จัดรถ k คันลงไตรมาส n สำเร็จ" · ไม่ตรงคำค้น/ตัวกรอง: Search not found + "ล้างตัวกรอง"
     อะไหล่ในไตรมาส n (Section header · ไม่มีตัวเลขจำนวนชนิด 9 พ.ย. 2569) — ตั้งต้นว่าง รวมจากรถที่จัดการแล้วทีละคัน (qAgg: น้ำมันที่เปลี่ยน ลิตรต่อคัน + อะไหล่อื่นๆ + รายการที่ระบุเอง · คันที่ไม่เบิกอะไหล่ไม่รวม)
       Table QPART_COLS (R81: ชนิด · รหัสอะไหล่ · ประเภท · จำนวน · หน่วย — ชุดเดียวกับอะไหล่ในแผน S2) ไม่มีปุ่มเพิ่มอะไหล่และไอคอนแถว / Empty state ตามแท็บ
       แท็บ "ทั้งหมด" (เจ้าของงาน 9 พ.ย. 2569 "หน้าอะใหล่ทั้งไตรมาส ต้องรวมมาให้ด้วย ทั้งไตรมาส"): หัวข้อ "อะไหล่รวมทุกไตรมาส" + Badge จำนวนรายการ = ผลรวมไตรมาส 1–4 (allQuarterRows)
         ยานพาหนะทุกคันที่จัดลงไตรมาสแล้ว ไม่ขึ้นกับตัวกรอง/คำค้น · คันไม่เบิกไม่รวม · ว่าง = "ยังไม่มีรายการอะไหล่" / "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะในแท็บไตรมาส รายการจะรวมมาที่นี่"
     ปุ่ม ย้อนกลับ (แก้ไข: ยกเลิก) · บันทึกและส่งอนุมัติ — Disabled จนกว่า ชื่อแผน · ปีงบประมาณ ครบ · ยานพาหนะในไตรมาสอย่างน้อย 1 คัน · ทุกคันในตารางแท็บทั้งหมด (ตามตัวกรองภาค เขต ประเภท) จัดลงไตรมาสแล้ว · ทุกคันที่จัดกำหนดอะไหล่แล้ว (เบิกพร้อมรายการ หรือ ไม่เบิก) — Figma de74711 9 พ.ย. 2569 ค่ำ (draftComplete)
   popup "จัดลงไตรมาส" (Radio text card ไตรมาส 1–4 เรียงลง ช่องไฟ 12 · ไม่มีตัวเลือกเอาออก) → toast "จัดรถ n คันลงไตรมาส k สำเร็จ" · มือถือ bottom sheet
   เอาภาค เขต ประเภทรถ ชิปตัวกรอง หรือคำค้นออก = เปลี่ยนแค่แถวที่เห็น รถที่จัดแล้วไม่หาย (ไม่มี confirm)
   Validation: ช่องบังคับที่ออกจากช่องโดยยังว่าง (Out of focus) แสดง "กรุณาระบุชื่อแผน" / "กรุณาเลือกปีงบประมาณ"
   popup ยืนยัน: ออกจากหน้าเมื่อมีการแก้ไข · (แก้ไข) ยืนยันการแก้ไข */
import { PagedTable } from "@/app/quarter/_shared/ui";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { PopupModal } from "@/components/patterns/PopupModal";
import { Alert } from "@/components/vms/Alert";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TabItem } from "@/components/vms/TabItem";
import { type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { CAND, DISTRICTS, MENU, QUARTERS, REGIONS, UNIT_FLEET, VEHICLE_TYPES, YEARS, shortRegion, type Plan } from "@/lib/mock/data";
import { QPART_COLS, areaPicked, carsFor, decided, draftComplete, emptyDraft, inQuarter, isDirty, matchQuery, planFromDraft, qpartRow, thaiToday, type Draft } from "@/lib/mock/plan";
import { allQuarterRows, carParam, roleUnit, draftFromPlan, draftKey, fillDraft, oilCellOf, otherCellOf, planId, planWithDraft, quarterRows } from "@/lib/mock/planFlow";
import { useProtoForm } from "@/lib/protoForm";
import { notify, setMock, useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { CheckTable, type CheckRow } from "./CheckTable";
import { TripCarPicker } from "@/app/quarter/_shared/TripCarPicker";
import { FilterShell } from "@/app/vehicles/_lib/ui";

/* CARP_COLS (หน้ารายละเอียดแผน PlanBody · ดูอย่างเดียว) + ไอคอน (screens.js) · ตารางอะไหล่ในไตรมาสใช้ QPART_COLS (R81 · lib/mock/plan.ts) */
export const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของยานพาหนะ", width: 180 },
  { head: "น้ำมันไฮดรอลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
/* PICK_COLS — แท็บทั้งหมด · Q_COLS — แท็บไตรมาส n (screens.js) */
const PICK_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 260 }, { head: "ประเภทยานพาหนะ", width: 160 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, { head: "ไตรมาส", width: 160, Style: "Badge" }];
const Q_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 240 }, { head: "ประเภทยานพาหนะ", width: 130 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, { head: "น้ำมันไฮดรอลิก", width: 200 }, { head: "อะไหล่อื่นๆ", width: 200 }, { head: "", width: 60, Style: "Action icons" }];   // 6 พ.ย. 2569 ท้ายแถว = ปุ่ม … (Q_MENU) แทนไอคอนแก้ไข
const PER = 10;
/* S19: Alert เหนือฟอร์มแก้ไข (ALERT_RETURNED · ALERT_APPROVED) */
const ALERT_APPROVED = ["แผนนี้อนุมัติแล้ว", "เมื่อบันทึก แผนจะกลับเป็นสถานะรออนุมัติ และต้องให้ผู้อนุมัติตรวจสอบอีกครั้ง"] as const;

type Open = "" | "year" | "region" | "district" | "type";
type Pending = { spec: ConfirmSpec; run: () => void };

/** mode="create" = S1 (ฟอร์มใน mock.draft) · mode="edit" = S19 (ฟอร์มใน mock.edit ของแผน plan) · from = หน้าที่เปิดฟอร์มแก้ไขมา (ยกเลิกแล้วกลับไป) */
export function PlanForm({ mode, plan, from }: { mode: "create" | "edit"; plan?: Plan; from?: string }) {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const edit = mode === "edit" && plan;
  const base = (): Draft => (edit ? draftFromPlan(plan) : emptyDraft());
  const d: Draft = (edit ? mock.edit : mock.draft) ?? base();
  const [open, setOpen] = useState<Open>("");
  const [query, setQuery] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [assign, setAssign] = useState<string | null>(null);
  const [qAdd, setQAdd] = useState(false);   // popup เพิ่มรถเข้าไตรมาส n (R75)   // popup จัดลงไตรมาส: ตัวเลือกที่เลือก ("" = ยังไม่เลือก · null = ปิด)
  const [touched, setTouched] = useState<{ name?: boolean; year?: boolean }>({});
  const [pending, setPending] = useState<Pending | null>(null);
  const [carMenu, setCarMenu] = useState<{ car: number; anchor: MenuAnchor } | null>(null);   // เมนู … ของยานพาหนะในแท็บไตรมาส
  const role = useRole();

  const put = (patch: Partial<Draft>) => setMock((s) => (edit ? { ...s, edit: { ...(s.edit ?? base()), ...patch } } : { ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggle = (k: Open) => (v: boolean) => {
    if (!v && k === "year" && open === "year" && !d.year) setTouched((t) => ({ ...t, year: true }));   // ปิดรายการปีโดยยังไม่เลือก = out of focus
    setOpen(v ? k : open === k ? "" : open);
  };
  const reset = () => { setPage(1); setTicked([]); };

  /* ---------- ภาค เขต ประเภทรถ — อยู่ในแผงตัวกรอง (เจ้าของงาน 5 พ.ย. 2569 "อยากย้ายสิ่งที่ filter ด้านบน มาไว้ที่เมนู filter ด้านล่างแทน")
     เลือกในแผงเป็นค่าร่าง กดตกลงจึงใช้ · ยกเลิก/ปิด = ไม่เปลี่ยน · ล้างตัวกรอง = ล้างทั้งสามช่องในแผง · เปลี่ยนแค่แถวที่เห็น ไม่แตะรถที่จัดแล้ว ---------- */
  type Area = Pick<Draft, "regions" | "districts" | "types">;
  const [panel, setPanel] = useState(false);
  const [fd, setFd] = useState<Area>({ regions: [], districts: [], types: [] });
  const openPanel = () => { setFd({ regions: d.regions, districts: d.districts, types: d.types }); setOpen(""); setPanel(true); };
  const closePanel = () => { setOpen(""); setPanel(false); };
  const applyPanel = () => { setArea(fd); closePanel(); };
  const fdFlip = (k: keyof Area, v: string) => setFd((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));
  const fdRemove = (k: keyof Area) => (v: string) => setFd((f) => ({ ...f, [k]: f[k].filter((x) => x !== v) }));
  const setArea = (patch: Partial<Area>) => { put(patch); reset(); };
  const removeRegion = (r: string) => setArea({ regions: d.regions.filter((x) => x !== r) });   // R69: ช่องเป็นอิสระต่อกัน ไม่ล้างเขตตาม
  const removeDistrict = (x: string) => setArea({ districts: d.districts.filter((y) => y !== x) });
  const removeType = (t: string) => setArea({ types: d.types.filter((y) => y !== t) });
  const chips = [...d.regions.map(shortRegion), ...d.districts, ...d.types];
  const removeChip = (c: string) => {
    const r = d.regions.find((x) => shortRegion(x) === c);
    if (r) removeRegion(r); else if (d.districts.includes(c)) removeDistrict(c); else removeType(c);
  };

  /* ---------- รถ ---------- */
  const area = carsFor(d);
  const q = d.q;
  const inQ = (k: number) => inQuarter(d, k);
  const k = query.trim();
  const shown = (q ? inQ(q) : area).filter((i) => matchQuery(i, k));
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const rowsOnPage = shown.slice((pg - 1) * PER, pg * PER);
  const picked = areaPicked(d);
  const nTicked = ticked.length;
  const qPill = (i: number): [string, "Brand" | "Gray"] => (d.alloc[i] ? ["ไตรมาส " + d.alloc[i], "Brand"] : ["ยังไม่จัด", "Gray"]);
  const carQuery = (car: number) => "?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&car=" + carParam(car) + (from === "detail" ? "&from=detail" : "");
  const toS21 = (car: number) => router.push("/car-parts/" + carQuery(car));
  /* Q_MENU (MENU) ของยานพาหนะ: ดูรายละเอียด (carPartsView) · แก้ไข (S21) · ลบ = เอาออกจากไตรมาส (Q_OUT_CONFIRM) */
  const outOfQ = (car: number) => setPending({
    spec: { danger: true, title: "ยืนยันการเอายานพาหนะออกจากไตรมาส " + q, sub: CAND[car].plate + " จะกลับเป็นยังไม่จัด ต้องจัดลงไตรมาสอีกครั้งก่อนบันทึกและส่งอนุมัติ", cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => {
      const alloc = { ...d.alloc };
      delete alloc[car];
      put({ alloc });
      setTicked((t) => t.filter((x) => x !== String(car)));
      notify("เอายานพาหนะออกจากไตรมาส " + q + " สำเร็จ");
    },
  });
  const carActs = [(car: number) => router.push("/car-parts/view/" + carQuery(car)), toS21, outOfQ];
  const carItems = carMenu ? MENU.map((m, k) => ({ ...m, onClick: () => carActs[k](carMenu.car) })) : [];
  const rows: CheckRow[] = rowsOnPage.map((i) => {
    const c = CAND[i];
    if (!q) return { key: String(i), text: c.plate, sub: c.model, mobileSub: c.model + " · " + qPill(i)[0], cells: [c.type, c.owner, { pills: [qPill(i)] }] };
    const oil = oilCellOf(d, i), other = otherCellOf(d, i), txt = (v: typeof oil) => (typeof v === "string" ? v : v.text);
    return { key: String(i), text: c.plate, sub: c.model, mobileSub: "น้ำมัน " + txt(oil) + " · อะไหล่อื่นๆ " + (typeof other === "string" ? other : other.text),
      cells: [c.type, c.owner, oil, other, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setCarMenu({ car: i, anchor: anchorOf(e.currentTarget) }) }] }] };
  });
  const doAssign = () => {
    const kq = QUARTERS.indexOf(assign ?? "") + 1;
    if (!kq) return;
    const alloc = { ...d.alloc };
    ticked.forEach((x) => { alloc[Number(x)] = kq; });
    put({ alloc });
    notify("จัดยานพาหนะ " + ticked.length + " คันลงไตรมาส " + kq + " สำเร็จ");
    setTicked([]); setAssign(null);
  };
  /* R75 รถที่เพิ่มเข้าไตรมาสนี้ได้ = รถของพื้นที่ที่เลือก (ยังไม่เลือก = รถทุกคัน) ที่ยังไม่อยู่ในไตรมาสใด · รถในไตรมาสอื่นไม่แสดง (ย้ายไตรมาสใช้ จัดลงไตรมาส ในแท็บทั้งหมด) */
  const addPool = qAdd ? UNIT_FLEET.map((i) => ({ c: CAND[i], i })).filter(({ i }) => !d.alloc[i] && (!picked || area.includes(i)))
    .map(({ c, i }) => ({ id: String(i), plate: c.plate, model: c.model, owner: c.owner, phone: "", ctrl: "" })) : [];
  const addToQ = (ids: string[]) => {
    const alloc = { ...d.alloc };
    ids.forEach((x) => { alloc[Number(x)] = q; });
    put({ alloc });
    notify("จัดยานพาหนะ " + ids.length + " คันลงไตรมาส " + q + " สำเร็จ");
    setQAdd(false);
  };
  const clearFilters = () => { setQuery(""); setArea({ districts: [], types: [] }); };

  /* ---------- อะไหล่ในไตรมาส (รวมจากรถทีละคัน · ไม่มีปุ่มเพิ่ม/ไอคอนแถว — 5 พ.ย. 2569) ---------- */
  const qCars = q ? inQ(q) : [];
  const qRows = q ? quarterRows(d, q) : allQuarterRows(d);   // แท็บทั้งหมด = รวมทุกไตรมาส (9 พ.ย. 2569)

  /* ---------- ออก / ตรวจและบันทึก ---------- */
  const back = from === "detail" && plan ? "/detail/?id=" + planId(plan) : "/";
  /* รีวิว 5 พ.ย. 2569 "ต้องกรอกข้อมูลที่ require ครบถึงจะ enable ปุ่ม" + 6 พ.ย. 2569 เจ้าของงาน "ต้องเอารถเข้า ไตรมาสทุกคัน" "บังคับให้กรอกอะใหล่ทุกคัน ไปหน้าต่อไปไม่ได้" (แบบ ก หน้าเดียว) */
  const complete = draftComplete(d);
  /* ปุ่มต้นแบบ กรอกข้อมูลตัวอย่าง / ล้างค่า (แถบต้นแบบ · lib/protoForm.ts) — ล้างค่า = สร้าง: ฟอร์มว่าง · แก้ไข: ค่าของแผนที่บันทึกไว้ */
  const saved = edit ? draftFromPlan(plan) : emptyDraft();
  useProtoForm({
    fill: () => { setMock((s) => (edit ? { ...s, edit: fillDraft(d) } : { ...s, draft: fillDraft(d) })); setTicked([]); },
    clear: () => { setMock((s) => (edit ? { ...s, edit: { ...saved } } : { ...s, draft: { ...saved } })); setTicked([]); setQuery(""); },
    dirty: edit ? draftKey(d) !== draftKey(saved) : isDirty(d),
  });
  const qDone = q ? inQ(q).filter((i) => decided(d, i)).length : 0;
  const leave = () => {
    if (edit) {
      const go = () => { setMock((s) => ({ ...s, edit: null })); router.push(back); };
      if (draftKey(d) === draftKey(draftFromPlan(plan))) return go();
      return setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: go });
    }
    const go = () => { setMock((s) => ({ ...s, draft: null })); router.push("/"); };
    if (!isDirty(d)) return go();
    setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: go });
  };
  const save = () => {
    if (!complete) return;
    if (edit) {
      return setPending({
        spec: { title: "ยืนยันการแก้ไข", sub: "แผนจะกลับเป็นสถานะรออนุมัติ และส่งให้ผู้อนุมัติตรวจสอบอีกครั้ง โปรดตรวจสอบก่อนยืนยัน", cancel: "ยกเลิก", ok: "ยืนยัน" },
        run: () => {
          if (mock.failSave) { notify("general error", "Error"); return; }
          setMock((s) => ({ ...s, edit: null, plans: s.plans.map((p) => (p.mr === plan.mr ? planWithDraft(p, d, thaiToday()) : p)) }));
          notify("บันทึกการแก้ไขแผนและส่งอนุมัติสำเร็จ");
          router.push("/");
        },
      });
    }
    if (mock.failSave) { notify("general error", "Error"); return; }
    setMock((s) => ({ ...s, draft: null, plans: [planFromDraft(d, s.plans, thaiToday(), s.retiredMr, roleUnit(role)), ...s.plans] }));
    notify("ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ");
    router.push("/");
  };

  /* ตารางในฟอร์ม เกิน 10 แถว = หน้าละ 10 + Table pagination (tblShort ของ screens.js f59001e) · key = ไตรมาสที่เปิด ⇒ เปลี่ยนแท็บกลับหน้า 1 */
  const table = (cols: TableColumn[], rs: TableValue[][]) => <PagedTable key={"t" + q} columns={cols} rows={rs} />;
  const row = (kids: ReactNode, n: number) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const empty = (t: string, s: string) => <EmptyStateDataEmpty Text={t} SupportingText={s} Graphic="vehicle" />;
  const heading = edit ? "แก้ไขแผน " + plan.mr : "สร้างแผนบำรุงรักษา";
  const nameErr = touched.name && !d.name.trim();
  const yearErr = touched.year && !d.year;

  const carBody = !q && !picked
    ? empty("ยังไม่มีรายการยานพาหนะ", "กดตัวกรองเพื่อเลือกภาค เขต หรือประเภทยานพาหนะ ตารางจะแสดงยานพาหนะทั้งหมดที่ตรงกัน")
    : shown.length
      ? <CheckTable columns={q ? Q_COLS : PICK_COLS} rows={rows} ticked={ticked} onTicked={setTicked}
          Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} />
      : q && !k
        ? <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในไตรมาสนี้" SupportingText="เลือกยานพาหนะในพื้นที่ที่ยังไม่ได้จัดลงไตรมาสใด หรือติ๊กยานพาหนะในแท็บทั้งหมดแล้วกดจัดลงไตรมาส" Graphic="vehicle"
            Actions={<PrimaryButton Text={"เพิ่มยานพาหนะเข้าไตรมาส " + q} LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setQAdd(true)} />} />
        : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={clearFilters} />} />;

  return (
    <>
      <PageHeader Title={heading} onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: edit ? heading : "สร้างแผน" }]} />
      <div className="flex flex-col gap-8">
        {edit && plan.status === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        {edit && plan.status === "approved" && <Alert Color="Warning" Text={ALERT_APPROVED[0]} SupportingText={ALERT_APPROVED[1]} />}
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลแผน" />
          {row(<>
            <TextInput LabelText="ชื่อแผน" Text={d.name} Placeholder="ระบุชื่อแผน" onChange={(v) => put({ name: v })} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              State={nameErr ? "Error" : undefined} HelperText={nameErr ? "กรุณาระบุชื่อแผน" : undefined} />
            {edit ? <TextInput LabelText="ปีงบประมาณ" Text={d.year} State="Readonly" readOnly /> : (
              <InputDropdown LabelText="ปีงบประมาณ" Text={d.year} Placeholder="เลือกปีงบประมาณ" open={open === "year"} onOpenChange={toggle("year")}
                State={yearErr ? (open === "year" ? "Error Focused" : "Error") : undefined} HelperText={yearErr ? "กรุณาเลือกปีงบประมาณ" : undefined}>
                <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === d.year ? "Selected" : "Default"} onClick={() => { put({ year: y }); setOpen(""); }} />)}</DropdownList>
              </InputDropdown>
            )}
          </>, 2)}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title="เลือกยานพาหนะเข้าแผนและจัดลงไตรมาส" Badge={"จัดลงไตรมาสแล้ว " + Object.keys(d.alloc).length + " คัน"} />
          <Tabs>
            <TabItem Text="ทั้งหมด" Badge={area.length} Active={q === 0} onClick={() => { put({ q: 0 }); reset(); }} />
            {QUARTERS.map((_, i) => <TabItem key={i} Text={"ไตรมาส " + (i + 1)} Badge={inQ(i + 1).length} Active={q === i + 1} onClick={() => { put({ q: i + 1 }); reset(); }} />)}
          </Tabs>
          <TableHeader Title={q ? "ยานพาหนะในไตรมาส " + q : "ยานพาหนะในพื้นที่ที่เลือก"} Badge={q ? "กำหนดอะไหล่แล้ว " + qDone + "/" + inQ(q).length + " คัน" : shown.length + " คัน"} Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query}
            onQuery={(v) => { setQuery(v); setPage(1); }} onFilter={openPanel} FilterCount={chips.length} Filters={chips} onRemoveFilter={removeChip}
            Actions={<SecondaryButton Text={"จัดลงไตรมาส" + (nTicked ? " (" + nTicked + ")" : "")} Size={mob ? "lg" : "md"} State={nTicked ? "Default" : "Disabled"} onClick={() => nTicked && setAssign("")} />} />
          {carBody}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title={q ? "อะไหล่ในไตรมาส " + q : "อะไหล่รวมทุกไตรมาส"} />{/* 9 พ.ย. 2569 เจ้าของงาน "เอาเลขออกไปเลยได้ป่ะ ถ้าหมายถึงจำนวนชนิด" ⇒ หัวข้ออะไหล่รวมตามรายการไม่มีตัวเลขจำนวนชนิด */}
          {qRows.length
            ? table(QPART_COLS, qRows.map(qpartRow))
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={!q ? "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะในแท็บไตรมาส รายการจะรวมมาที่นี่" : qCars.length ? "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะ รายการจะรวมมาที่นี่" : "จัดยานพาหนะลงไตรมาสนี้ก่อน แล้วจึงจัดการอะไหล่ทีละคันได้"} />}
        </section>

        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text={edit ? "ยกเลิก" : "ย้อนกลับ"} Size="lg" onClick={leave} />
          <PrimaryButton Text="บันทึกและส่งอนุมัติ" Size="lg" State={complete ? "Default" : "Disabled"} onClick={save} />
        </div>
      </div>
      <PopupModal open={assign !== null} title="จัดลงไตรมาส" sub={"ยานพาหนะที่เลือก " + nTicked + " คัน · ยานพาหนะที่จัดไว้แล้วจะย้ายไปไตรมาสที่เลือก"} ok="ยืนยัน" okDisabled={!assign}
        onCancel={() => setAssign(null)} onOk={doAssign}>
        <div role="radiogroup" className="flex flex-col gap-3">
          {QUARTERS.map((t) => <RadioTextCard key={t} Text={t} Selected={assign === t} onClick={() => setAssign(t)} />)}
        </div>
      </PopupModal>
      <TripCarPicker open={qAdd} pool={addPool} nowQ={"ไตรมาส " + q} title={"เพิ่มยานพาหนะเข้าไตรมาส " + q} okText={"เพิ่มเข้าไตรมาส " + q}
        sub={(picked ? "ยานพาหนะในพื้นที่ที่เลือก" : "ยานพาหนะทุกคัน") + "ที่ยังไม่อยู่ในไตรมาสใด · " + addPool.length + " คัน"}
        emptyText="ยานพาหนะในพื้นที่ที่เลือกจัดลงไตรมาสครบแล้ว" emptySub="ย้ายยานพาหนะระหว่างไตรมาสได้ที่ปุ่ม จัดลงไตรมาส ในแท็บทั้งหมด"
        onCancel={() => setQAdd(false)} onAdd={addToQ} />
      <FilterShell open={panel} onClose={closePanel} onClear={() => setFd({ regions: [], districts: [], types: [] })} onApply={applyPanel}>
        <InputDropdownWithBadges LabelText="ภาค" Optional values={fd.regions} Placeholder="เลือกภาค" onRemove={fdRemove("regions")} open={open === "region"} onOpenChange={toggle("region")}>
          <DropdownList>{REGIONS.map((r) => <DropdownListItem key={r} Text={r} State={fd.regions.includes(r) ? "Selected" : "Default"} onClick={() => fdFlip("regions", r)} />)}</DropdownList>
        </InputDropdownWithBadges>
        <InputDropdownWithBadges LabelText="เขต" Optional values={fd.districts} Placeholder="เลือกเขต" onRemove={fdRemove("districts")} open={open === "district"} onOpenChange={toggle("district")}>
          <DropdownList>{(fd.regions.length ? fd.regions : REGIONS).flatMap((r) => DISTRICTS[r]).map((x) => <DropdownListItem key={x} Text={x} State={fd.districts.includes(x) ? "Selected" : "Default"} onClick={() => fdFlip("districts", x)} />)}</DropdownList>
        </InputDropdownWithBadges>
        <InputDropdownWithBadges LabelText="ประเภทยานพาหนะ" Optional values={fd.types} Placeholder="เลือกประเภทยานพาหนะ" onRemove={fdRemove("types")} open={open === "type"} onOpenChange={toggle("type")}>
          <DropdownList>{VEHICLE_TYPES.map((t) => <DropdownListItem key={t} Text={t} State={fd.types.includes(t) ? "Selected" : "Default"} onClick={() => fdFlip("types", t)} />)}</DropdownList>
        </InputDropdownWithBadges>
      </FilterShell>
      <RowMenu anchor={carMenu?.anchor ?? null} items={carItems} onClose={() => setCarMenu(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}
