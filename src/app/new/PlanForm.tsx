"use client";
/* ฟอร์มแผนบำรุงรักษา planForm() ใน screens.js แบบ A (เจ้าของงานเลือก 5 พ.ย. 2569 · รีวิวทีมออกแบบ) — ใช้ร่วม S1 สร้างแผน (/new/) และ S19 แก้ไขแผน (/edit/?id=)
   ตาม `Section header` · `Input dropdown with badges` · `Tabs` · `Table header` · `Table` · `Table cell` (Lead checkbox · Action icons) · `Empty state/Data empty` (Graphic=vehicle) · `Empty state/Search not found`
   · `Radio text card` · `Modal header` · `Modal footer` ของไฟล์ Component + หน้า 5.2 Vehicle Management (Vehicle list · Export reports - Select vehicles) ของ UI Release#2
   · popup เพิ่มยานพาหนะแบบ vehPickerModal ของ Overhaul (เจ้าของงาน 12 พ.ย. 2569 · BACKLOG ข้อ 87)
   Content ช่องไฟ 32:
     (แก้ไข) Alert — ส่งกลับแก้ไข: Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล · อนุมัติแล้ว: Warning "แผนนี้อนุมัติแล้ว"
     ข้อมูลแผน (Section header) — ชื่อแผน (Text input) · ปีงบประมาณ (สร้าง: Input dropdown · แก้ไข: Readonly)
     ยานพาหนะในแผน (Section header + Badge "ในแผน n คัน") — เจ้าของงาน 12 พ.ย. 2569 ส่งภาพ modal "เพิ่มรถเข้า Purchase Order" ของ Overhaul + _"หน้าจอเลือกรถ อยากให้เป็น modal ตามรูป แก้ใน flow ด้วย"_
       เคาะ: ยานพาหนะที่เลือกใน modal เข้าไตรมาสที่เปิดอยู่ทันที ไม่มีขั้นจัดลงไตรมาสแยก (BACKLOG ข้อ 87 · เดิม แผงตัวกรองภาค เขต ประเภท + ตารางยานพาหนะในพื้นที่ที่เลือก + ติ๊กแล้ว "จัดลงไตรมาส")
       ยานพาหนะในแผน = ทุกคันที่อยู่ในไตรมาส (planCars = alloc · lib/mock/plan.ts) · Tabs ทั้งหมด n · ไตรมาส 1–4 n (Pill) · ฟอร์มสร้างใหม่เปิดที่แท็บไตรมาส 1
       แท็บไตรมาส n: Table header (หัว "ยานพาหนะในไตรมาส n" + Badge "กำหนดอะไหล่แล้ว x/y คัน" · ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" ในยานพาหนะของไตรมาสนี้ · ไม่มีปุ่มตัวกรอง
         · "กำหนดอะไหล่ (n)" (ติ๊กหลายคัน · BACKLOG ข้อ 64) · Secondary button "เพิ่มยานพาหนะ" ไอคอน + ขวาสุด) → ตารางติ๊ก Q_COLS + Table pagination
         เมนู … (RowMenu): ดูรายละเอียด → /car-parts/view/ · แก้ไข → /car-parts/ (S21) · ย้ายไปไตรมาสอื่น → popup Radio text card ไตรมาส 1–4 (ไตรมาสปัจจุบันของคันนั้นเลือกไม่ได้) ปุ่ม "ย้ายยานพาหนะ"
           → toast "ย้ายยานพาหนะไปไตรมาส m สำเร็จ" · ลบ → ยืนยันการลบยานพาหนะออกจากแผน → toast "ลบยานพาหนะออกจากแผนสำเร็จ" · มือถือ = ไอคอนดู แก้ไข ย้าย ลบ ใต้รายการ (CLAUDE.md ข้อ 14)
         ไตรมาสว่าง: Empty state "ยังไม่มียานพาหนะในไตรมาสนี้" + ปุ่มหลัก "เพิ่มยานพาหนะเข้าไตรมาส n" (R75) เปิด popup เดียวกัน · ไม่ตรงคำค้น: Search not found
       popup "เพิ่มยานพาหนะเข้าไตรมาส n" (TripCarPicker + areaOf · ตัวกรองภาค เขต ประเภทยานพาหนะในตัว popup แบบ vehPickerModal ของ Overhaul · มือถือ bottom sheet)
         ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน → ปุ่ม "เพิ่มเข้าไตรมาส n (k)" → อยู่แท็บเดิม ตัวเลขบนแท็บเปลี่ยน + toast "เพิ่มยานพาหนะ k คันเข้าไตรมาส n สำเร็จ"
       แท็บทั้งหมด: ยานพาหนะทุกคันในแผน ไม่มี checkbox ไม่มีปุ่มเพิ่ม (Table · PICK_COLS: ทะเบียน (ยี่ห้อ/รุ่น) · ประเภทยานพาหนะ · เขต / หน่วยงาน · บำรุงรักษา/ซ่อมเครื่องจักรล่าสุด · ไตรมาส Pill · ไอคอนถังขยะ BACKLOG ข้อ 86)
         แผนยังไม่มียานพาหนะ: Empty state "ยังไม่มียานพาหนะในแผน" / "เปิดแท็บไตรมาสแล้วกดเพิ่มยานพาหนะ"
     อะไหล่ในไตรมาส n (Section header · ไม่มีตัวเลขจำนวนชนิด 9 พ.ย. 2569) — ตั้งต้นว่าง รวมจากยานพาหนะที่จัดการแล้วทีละคัน (qAgg: น้ำมันที่เปลี่ยน ลิตรต่อคัน + อะไหล่อื่นๆ + รายการที่ระบุเอง · คันที่ไม่เบิกอะไหล่ไม่รวม)
       Table QPART_COLS (R81: ชนิด · รหัสอะไหล่ · ประเภท · จำนวน · หน่วย — ชุดเดียวกับอะไหล่ในแผน S2) ไม่มีปุ่มเพิ่มอะไหล่และไอคอนแถว / Empty state ตามแท็บ
       แท็บ "ทั้งหมด" (เจ้าของงาน 9 พ.ย. 2569 "หน้าอะใหล่ทั้งไตรมาส ต้องรวมมาให้ด้วย ทั้งไตรมาส"): หัวข้อ "อะไหล่รวมทุกไตรมาส" = ผลรวมไตรมาส 1–4 (allQuarterRows)
     ปุ่ม ย้อนกลับ (แก้ไข: ยกเลิก) · บันทึกและส่งอนุมัติ — Disabled จนกว่า ชื่อแผน · ปีงบประมาณ ครบ · ยานพาหนะในแผนอย่างน้อย 1 คัน · ทุกคันในแผนกำหนดอะไหล่แล้ว (เบิกพร้อมรายการ หรือ ไม่เบิก)
       (draftComplete · 12 พ.ย. 2569 ตัดเงื่อนไข "ยานพาหนะในตารางต้องจัดครบ" ของ de74711)
   Validation: ช่องบังคับที่ออกจากช่องโดยยังว่าง (Out of focus) แสดง "กรุณาระบุชื่อแผน" / "กรุณาเลือกปีงบประมาณ"
   popup ยืนยัน: ออกจากหน้าเมื่อมีการแก้ไข · (แก้ไข) ยืนยันการแก้ไข
   แผนที่ดำเนินการแล้ว (11 พ.ย. 2569 เจ้าของงาน "แผนที่ดำเนินการแล้ว ยังสามารถแก้ไขได้" + เคาะ "เฉพาะไตรมาสที่ยังไม่เสร็จ" · "ไม่ต้อง บันทึกแล้วมีผลเลย" · BACKLOG ข้อ 64 · lib/mock/liveEdit.ts)
     Alert Info "แผนนี้อยู่ระหว่างดำเนินการ" · แท็บไตรมาสที่เสร็จแล้ว = Alert Success "ไตรมาส n บำรุงรักษาเสร็จทุกคันแล้ว" ดูอย่างเดียว (ติ๊ก เพิ่ม ย้าย ลบ กำหนดอะไหล่ ไม่ได้ · เมนู = ดูรายละเอียด)
     · ยานพาหนะที่ปิดงานแล้วในไตรมาสที่ยังไม่เสร็จ ล็อกแบบเดียวกัน (บรรทัดรอง "ปิดงานแล้ว") · popup ย้ายไปไตรมาสอื่น: ไตรมาสที่เสร็จแล้ว Disabled
     · ปุ่ม "บันทึก" (คันในแผนต้องกำหนดอะไหล่ครบ) ไม่มี popup ยืนยัน → toast "บันทึกการแก้ไขแผนสำเร็จ" → หน้ารายละเอียดแผน · แผนคงสถานะดำเนินการ */
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
import { CAND, CAR_PICK, MENU, QUARTERS, UNIT_FLEET, YEARS, dCode, regionOf, type Plan } from "@/lib/mock/data";
import { QPART_COLS, decided, draftComplete, emptyDraft, inQuarter, isDirty, matchQuery, planCars, planFromDraft, qpartRow, removeCar, thaiToday, type Draft } from "@/lib/mock/plan";
import { allQuarterRows, carParam, roleUnit, draftFromPlan, draftKey, fillDraft, oilCellOf, otherCellOf, planId, planWithDraft, quarterRows } from "@/lib/mock/planFlow";
import { useProtoForm } from "@/lib/protoForm";
import { notify, setMock, useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { isLive, liveLocks, saveLive } from "@/lib/mock/liveEdit";
import { MA_HEAD, REPAIR_HEAD, histText, useMachineDates } from "@/lib/mock/vehicleHistory";
import { CheckTable, type CheckRow } from "./CheckTable";
import { TripCarPicker } from "@/app/quarter/_shared/TripCarPicker";

/* CARP_COLS (หน้ารายละเอียดแผน PlanBody · ดูอย่างเดียว) + ไอคอน (screens.js) · ตารางอะไหล่ในไตรมาสใช้ QPART_COLS (R81 · lib/mock/plan.ts) */
export const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของยานพาหนะ", width: 180 },
  { head: "น้ำมันไฮดรอลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
/* PICK_COLS — แท็บทั้งหมด · Q_COLS — แท็บไตรมาส n (screens.js) */
/* 11 พ.ย. 2569 เจ้าของงาน "เพิ่มตอนเลือกรถเข้าแผน เพิ่มคอลัมน์ วันที่บำรุงล่าสุดเมื่อไร และอยากเพิ่ม วันที่ซ่อมล่าสุดด้วย" (BACKLOG ข้อ 64) ⇒ HIST_COLS ต่อจากเขต / หน่วยงาน
   ทั้งสองแท็บ (ทั้งหมด 7 คอลัมน์ · ไตรมาส 8 คอลัมน์ = เต็ม Table ของไลบรารี R25) · ไม่มีข้อมูล = "ไม่มีข้อมูล" (lib/mock/vehicleHistory.ts) · มือถือ = บรรทัดรองของรายการ
   แก้คำ 11 พ.ย. 2569 "วันที่บำรุงเครื่องจักรล่าสุด … วันที่ซ่อมเครื่องจักรล่าสุด" ⇒ หัว "บำรุงรักษาเครื่องจักรล่าสุด" "ซ่อมเครื่องจักรล่าสุด" (MA_HEAD REPAIR_HEAD) */
const HIST_COLS: TableColumn[] = [{ head: MA_HEAD, width: 200 }, { head: REPAIR_HEAD, width: 170 }];
/* 12 พ.ย. 2569 เจ้าของงาน "อยากให้เพิ่มรถรายคันได้ และสามารถลบรถออกรายคันได้ มี icon ถังขยะ ก็ได้" (BACKLOG ข้อ 86) ⇒ แท็บทั้งหมด ท้ายแถว = ไอคอนลบ (Action icons · Delete)
   BACKLOG ข้อ 87 แท็บทั้งหมดไม่มี checkbox แล้ว ⇒ Table ของไลบรารี (ทะเบียน Lead text + บรรทัดรอง ยี่ห้อ/รุ่น · มือถือ Mobile table) */
const PICK_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ประเภทยานพาหนะ", width: 150 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, ...HIST_COLS, { head: "ไตรมาส", width: 120, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" }];
const Q_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 200 }, { head: "ประเภทยานพาหนะ", width: 152 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, ...HIST_COLS, { head: "น้ำมันไฮดรอลิก", width: 140 }, { head: "อะไหล่อื่นๆ", width: 130 }, { head: "", width: 60, Style: "Action icons" }];   // 6 พ.ย. 2569 ท้ายแถว = ปุ่ม … (Q_MENU) แทนไอคอนแก้ไข
const PER = 10;
/* เมนู "ย้ายไปไตรมาสอื่น" ของยานพาหนะในแท็บไตรมาส (BACKLOG ข้อ 87) — ไอคอนชุดเดียวกับเมนูย้ายไตรมาสของหน้าไตรมาส S25 */
const MOVE_ITEM = { Text: "ย้ายไปไตรมาสอื่น", IconSwap: "swap_driving_apps_wheel-24-300-round" };
/* S19: Alert เหนือฟอร์มแก้ไข (ALERT_RETURNED · ALERT_APPROVED) */
const ALERT_APPROVED = ["แผนนี้อนุมัติแล้ว", "เมื่อบันทึก แผนจะกลับเป็นสถานะรออนุมัติ และต้องให้ผู้อนุมัติตรวจสอบอีกครั้ง"] as const;
/* แผนที่ดำเนินการ (BACKLOG ข้อ 64) — ข้อความของเว็บ (Figma ตามทีหลัง) */
const ALERT_LIVE = ["แผนนี้อยู่ระหว่างดำเนินการ", "แก้ไขได้เฉพาะไตรมาสที่ยังบำรุงรักษาไม่เสร็จ และยานพาหนะที่ยังไม่ปิดงาน เมื่อบันทึกจะมีผลทันที ไม่ต้องส่งอนุมัติใหม่"] as const;
/* ภาค เขต ประเภทยานพาหนะของแต่ละคัน — ตัวกรองใน popup เพิ่มยานพาหนะ (TripCarPicker areaOf · BACKLOG ข้อ 87) */
const areaOf = (id: string) => { const c = CAND[Number(id)]; return { region: regionOf(c), district: dCode(c), type: c.type }; };

type Pending = { spec: ConfirmSpec; run: () => void };

/** mode="create" = S1 (ฟอร์มใน mock.draft) · mode="edit" = S19 (ฟอร์มใน mock.edit ของแผน plan) · from = หน้าที่เปิดฟอร์มแก้ไขมา (ยกเลิกแล้วกลับไป) */
export function PlanForm({ mode, plan, from }: { mode: "create" | "edit"; plan?: Plan; from?: string }) {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const edit = mode === "edit" && plan;
  const base = (): Draft => (edit ? draftFromPlan(plan, mock) : emptyDraft());
  /* แผนที่ดำเนินการแล้ว: ไตรมาสที่เสร็จ + คันที่ปิดงาน = ล็อก (liveEdit.ts) */
  const live = !!edit && isLive(plan);
  const locks = live ? liveLocks(mock, plan) : null;
  const lockedCar = (i: number) => !!locks?.locked(i);
  const qLocked = (n: number) => !!locks?.finished.has(n);
  const d: Draft = (edit ? mock.edit : mock.draft) ?? base();
  const [yearOpen, setYearOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [qAdd, setQAdd] = useState(false);   // popup เพิ่มยานพาหนะเข้าไตรมาส n (BACKLOG ข้อ 87 · เดิม R75 เฉพาะไตรมาสว่าง)
  const [move, setMove] = useState<{ car: number; to: number } | null>(null);   // popup ย้ายไปไตรมาสอื่น (to 0 = ยังไม่เลือก)
  const [touched, setTouched] = useState<{ name?: boolean; year?: boolean }>({});
  const [pending, setPending] = useState<Pending | null>(null);
  const [carMenu, setCarMenu] = useState<{ car: number; anchor: MenuAnchor } | null>(null);   // เมนู … ของยานพาหนะในแท็บไตรมาส
  const role = useRole();

  const put = (patch: Partial<Draft>) => setMock((s) => (edit ? { ...s, edit: { ...(s.edit ?? base()), ...patch } } : { ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggleYear = (v: boolean) => {
    if (!v && yearOpen && !d.year) setTouched((t) => ({ ...t, year: true }));   // ปิดรายการปีโดยยังไม่เลือก = out of focus
    setYearOpen(v);
  };
  const reset = () => { setPage(1); setTicked([]); };

  /* ---------- ยานพาหนะในแผน (planCars = alloc · BACKLOG ข้อ 87) ---------- */
  const cars = planCars(d);
  const q = d.q;
  const inQ = (k: number) => inQuarter(d, k);
  const k = query.trim();
  const shown = (q ? inQ(q) : cars).filter((i) => matchQuery(i, k));
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const rowsOnPage = shown.slice((pg - 1) * PER, pg * PER);
  const nTicked = ticked.length;
  const qPill = (i: number): [string, "Brand"] => ["ไตรมาส " + d.alloc[i], "Brand"];
  const carQuery = (car: number) => "?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&car=" + carParam(car) + (from === "detail" ? "&from=detail" : "");
  const toS21 = (car: number) => router.push("/car-parts/" + carQuery(car));
  /* ลบ (เมนู … ของแท็บไตรมาส · ไอคอนถังขยะของแท็บทั้งหมด) = ลบยานพาหนะคันนั้นออกจากแผน (ออกจากไตรมาส + ล้างอะไหล่ที่กำหนดไว้) · เพิ่มกลับได้จาก popup เพิ่มยานพาหนะ */
  const outOfPlan = (car: number) => setPending({
    spec: { danger: true, title: "ยืนยันการลบยานพาหนะออกจากแผน", sub: CAND[car].plate + " จะออกจากไตรมาส " + d.alloc[car] + " และไม่อยู่ในแผนนี้" + (live ? " รวมถึงออกจากแผนเดินทางของไตรมาสนี้เมื่อบันทึก" : "") + " เพิ่มกลับได้จากปุ่มเพิ่มยานพาหนะ", cancel: "ยกเลิก", ok: "ลบ" },
    run: () => {
      put(removeCar(d, car));
      setTicked((t) => t.filter((x) => x !== String(car)));
      notify("ลบยานพาหนะออกจากแผนสำเร็จ");
    },
  });
  /* ย้ายไปไตรมาสอื่น (popup Radio text card เดิมของ "จัดลงไตรมาส" · ทีละคันจากเมนู …) — อะไหล่ที่กำหนดไว้ย้ายไปพร้อมยานพาหนะ */
  const doMove = () => {
    if (!move?.to) return;
    put({ alloc: { ...d.alloc, [move.car]: move.to } });
    setTicked((t) => t.filter((x) => x !== String(move.car)));
    notify("ย้ายยานพาหนะไปไตรมาส " + move.to + " สำเร็จ");
    setMove(null);
  };
  /* Q_MENU ของยานพาหนะ: ดูรายละเอียด (carPartsView) · แก้ไข (S21) · ย้ายไปไตรมาสอื่น · ลบ — คันที่ล็อก (แผนที่ดำเนินการ) = ดูรายละเอียดอย่างเดียว */
  const carMenuItems = (car: number) => {
    const view = { ...MENU[0], act: () => router.push("/car-parts/view/" + carQuery(car)) };
    if (lockedCar(car)) return [view];
    return [view, { ...MENU[1], act: () => toS21(car) }, { ...MOVE_ITEM, act: () => setMove({ car, to: 0 }) }, { ...MENU[2], act: () => outOfPlan(car) }];
  };
  const carItems = carMenu ? carMenuItems(carMenu.car).map(({ act, ...m }) => ({ ...m, onClick: act })) : [];
  const mDates = useMachineDates();
  const lockSubOf = (i: number) => (lockedCar(i) ? (locks?.closed.has(i) ? "ปิดงานแล้ว · " : "ไตรมาสบำรุงรักษาเสร็จแล้ว · ") : "");
  /* แท็บทั้งหมด: Table (ไม่มี checkbox) · ไอคอนลบ (MENU[2]) ท้ายแถว · มือถือ Mobile table item Action icons (CLAUDE.md ข้อ 14) · คันที่ล็อกลบไม่ได้ */
  const allRows: TableValue[][] = q ? [] : shown.map((i) => {
    const c = CAND[i], md = mDates(c.plate);
    const del = lockedCar(i) ? [] : [{ IconSwap: MENU[2].IconSwap, label: MENU[2].Text + " " + c.plate, onClick: () => outOfPlan(i) }];
    return [{ text: c.plate, sub: lockSubOf(i) + c.model }, c.type, c.owner, md.ma, md.repair, { pills: [qPill(i)] }, { actions: del }];
  });
  const rows: CheckRow[] = !q ? [] : rowsOnPage.map((i) => {
    const c = CAND[i], md = mDates(c.plate), hist = [md.ma, md.repair], lk = lockedCar(i), lockSub = lockSubOf(i);
    const oil = oilCellOf(d, i), other = otherCellOf(d, i), txt = (v: typeof oil) => (typeof v === "string" ? v : v.text);
    /* มือถือ: ไอคอนดู แก้ไข (S21) ย้าย ลบ ใต้รายการ (CLAUDE.md ข้อ 14 · BACKLOG ข้อ 64 · ข้อ 87 เพิ่มย้ายไปไตรมาสอื่น) */
    const mobileActions = carMenuItems(i).map((m) => ({ IconSwap: m.IconSwap, label: m.Text + " " + c.plate, onClick: m.act }));
    return { key: String(i), text: c.plate, sub: lockSub + c.model, disabled: lk, mobileSub: lockSub + "น้ำมัน " + txt(oil) + " · อะไหล่อื่นๆ " + (typeof other === "string" ? other : other.text) + " · " + histText(md), mobileActions,
      cells: [c.type, c.owner, ...hist, oil, other, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setCarMenu({ car: i, anchor: anchorOf(e.currentTarget) }) }] }] };
  });
  /* กำหนดอะไหล่หลายคันครั้งเดียว (เจ้าของงาน 11 พ.ย. 2569 "อยากเพิ่มอะไหล่ครั้งเดียวในรถประเภทเดียวกัน" + "ทุกคันที่เลือกได้มั้ย คือต้องเลือกรถที่ต้องการเพิ่มอะไหล่" · BACKLOG ข้อ 64)
     แท็บไตรมาส n: ติ๊กยานพาหนะ → "กำหนดอะไหล่ (n)" → หน้า S21 แบบหลายคัน (/car-parts/?cars=…) ค่าที่เลือกใช้กับทุกคันที่ติ๊ก · แก้รายคันภายหลังได้จากเมนู … ตามเดิม */
  const toBulk = () => router.push("/car-parts/?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&cars=" + ticked.map((x) => carParam(Number(x))).join(",") + (from === "detail" ? "&from=detail" : ""));
  /* popup เพิ่มยานพาหนะเข้าไตรมาส n (BACKLOG ข้อ 87): ยานพาหนะทุกคันที่ยังไม่อยู่ในแผนนี้ (ทุกไตรมาส) · ตัวกรองภาค เขต ประเภทยานพาหนะอยู่ในตัว popup (areaOf) */
  const pickCar = (i: number) => { const c = CAND[i]; return { id: String(i), plate: c.plate, model: c.model, owner: c.owner, phone: "", ctrl: "" }; };
  const addPool = qAdd ? UNIT_FLEET.filter((i) => d.alloc[i] == null).map(pickCar) : [];
  const addToQ = (ids: string[]) => {
    const alloc = { ...d.alloc };
    ids.forEach((x) => { alloc[Number(x)] = q; });
    put({ alloc });
    notify("เพิ่มยานพาหนะ " + ids.length + " คันเข้าไตรมาส " + q + " สำเร็จ");
    setQAdd(false);
  };
  const canAdd = q > 0 && !qLocked(q);

  /* ---------- อะไหล่ในไตรมาส (รวมจากรถทีละคัน · ไม่มีปุ่มเพิ่ม/ไอคอนแถว — 5 พ.ย. 2569) ---------- */
  const qCars = q ? inQ(q) : [];
  const qRows = q ? quarterRows(d, q) : allQuarterRows(d);   // แท็บทั้งหมด = รวมทุกไตรมาส (9 พ.ย. 2569)

  /* ---------- ออก / ตรวจและบันทึก ---------- */
  const back = from === "detail" && plan ? "/detail/?id=" + planId(plan) : "/";
  /* รีวิว 5 พ.ย. 2569 "ต้องกรอกข้อมูลที่ require ครบถึงจะ enable ปุ่ม" + 6 พ.ย. 2569 เจ้าของงาน "บังคับให้กรอกอะใหล่ทุกคัน ไปหน้าต่อไปไม่ได้" (แบบ ก หน้าเดียว) */
  /* แผนที่ดำเนินการ: ชื่อแผน + ยานพาหนะในแผนอย่างน้อย 1 คัน + ทุกคันกำหนดอะไหล่แล้ว (ปีงบประมาณผูกกับแผนอยู่แล้ว) */
  const complete = live ? !!d.name.trim() && cars.length > 0 && cars.every((i) => decided(d, i)) : draftComplete(d);
  /* ปุ่มต้นแบบ กรอกข้อมูลตัวอย่าง / ล้างค่า (แถบต้นแบบ · lib/protoForm.ts) — ล้างค่า = สร้าง: ฟอร์มว่าง · แก้ไข: ค่าของแผนที่บันทึกไว้ */
  const saved = edit ? draftFromPlan(plan, mock) : emptyDraft();
  useProtoForm({
    /* แผนที่ดำเนินการ: ไม่เพิ่มยานพาหนะให้ (ไตรมาสที่เสร็จแล้วล็อก) · กำหนดอะไหล่ให้คันที่ยังไม่กำหนด (ไส้กรอง CAR_PICK · เก็บตัวอย่างน้ำมัน) */
    fill: () => {
      if (live) {
        const picks = { ...d.picks }, oils = { ...(d.oils ?? {}) };
        cars.filter((i) => !lockedCar(i) && !decided(d, i)).forEach((i) => { picks[i] = [...CAR_PICK]; oils[i] = 0; });
        put({ name: d.name.trim() ? d.name : plan.name, picks, oils });
      } else setMock((s) => (edit ? { ...s, edit: fillDraft(d) } : { ...s, draft: fillDraft(d) }));
      setTicked([]);
    },
    clear: () => { setMock((s) => (edit ? { ...s, edit: { ...saved } } : { ...s, draft: { ...saved } })); setTicked([]); setQuery(""); },
    dirty: edit ? draftKey(d) !== draftKey(saved) : isDirty(d),
  });
  const qDone = q ? inQ(q).filter((i) => decided(d, i)).length : 0;
  const leave = () => {
    if (edit) {
      const go = () => { setMock((s) => ({ ...s, edit: null })); router.push(back); };
      if (draftKey(d) === draftKey(draftFromPlan(plan, mock))) return go();
      return setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: go });
    }
    const go = () => { setMock((s) => ({ ...s, draft: null })); router.push("/"); };
    if (!isDirty(d)) return go();
    setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: go });
  };
  const save = () => {
    if (!complete) return;
    if (live) {
      if (mock.failSave) { notify("general error", "Error"); return; }
      saveLive(plan, d);
      notify("บันทึกการแก้ไขแผนสำเร็จ");
      router.push("/detail/?id=" + planId(plan));
      return;
    }
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
  const heading = edit ? "แก้ไขแผน " + plan.mr : "สร้างแผนบำรุงรักษา";
  const nameErr = touched.name && !d.name.trim();
  const yearErr = touched.year && !d.year;
  const addBtn = (text: string, primary = false) => primary
    ? <PrimaryButton Text={text} LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setQAdd(true)} />
    : <SecondaryButton key="add" Text={text} LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} State={canAdd ? "Default" : "Disabled"} onClick={() => canAdd && setQAdd(true)} />;

  const carBody = !q
    ? (!cars.length
      ? <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในแผน" SupportingText="เปิดแท็บไตรมาสแล้วกดเพิ่มยานพาหนะ" Graphic="vehicle" />
      : allRows.length ? <PagedTable key={"all" + k} columns={PICK_COLS} rows={allRows} /> : <EmptyStateSearchNotFound />)
    : shown.length
      ? <CheckTable columns={Q_COLS} rows={rows} ticked={ticked} onTicked={setTicked}
          Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} />
      : !k
        ? <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในไตรมาสนี้" SupportingText="เลือกยานพาหนะที่ยังไม่อยู่ในแผนเข้าไตรมาสนี้ได้ทุกคัน" Graphic="vehicle"
            Actions={canAdd ? addBtn("เพิ่มยานพาหนะเข้าไตรมาส " + q, true) : undefined} />
        : <EmptyStateSearchNotFound />;
  const mq = move ? d.alloc[move.car] : 0;

  return (
    <>
      <PageHeader Title={heading} onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: edit ? heading : "สร้างแผน" }]} />
      <div className="flex flex-col gap-8">
        {edit && plan.status === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        {edit && plan.status === "approved" && <Alert Color="Warning" Text={ALERT_APPROVED[0]} SupportingText={ALERT_APPROVED[1]} />}
        {live && <Alert Color="Info" Text={ALERT_LIVE[0]} SupportingText={ALERT_LIVE[1]} />}
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลแผน" />
          {row(<>
            <TextInput LabelText="ชื่อแผน" Text={d.name} Placeholder="ระบุชื่อแผน" onChange={(v) => put({ name: v })} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              State={nameErr ? "Error" : undefined} HelperText={nameErr ? "กรุณาระบุชื่อแผน" : undefined} />
            {edit ? <TextInput LabelText="ปีงบประมาณ" Text={d.year} State="Readonly" readOnly /> : (
              <InputDropdown LabelText="ปีงบประมาณ" Text={d.year} Placeholder="เลือกปีงบประมาณ" open={yearOpen} onOpenChange={toggleYear}
                State={yearErr ? (yearOpen ? "Error Focused" : "Error") : undefined} HelperText={yearErr ? "กรุณาเลือกปีงบประมาณ" : undefined}>
                <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === d.year ? "Selected" : "Default"} onClick={() => { put({ year: y }); setYearOpen(false); }} />)}</DropdownList>
              </InputDropdown>
            )}
          </>, 2)}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title="ยานพาหนะในแผน" Badge={"ในแผน " + cars.length + " คัน"} />
          <Tabs>
            <TabItem Text="ทั้งหมด" Badge={cars.length} Active={q === 0} onClick={() => { put({ q: 0 }); reset(); }} />
            {QUARTERS.map((_, i) => <TabItem key={i} Text={"ไตรมาส " + (i + 1)} Badge={inQ(i + 1).length} Active={q === i + 1} onClick={() => { put({ q: i + 1 }); reset(); }} />)}
          </Tabs>
          <TableHeader Title={q ? "ยานพาหนะในไตรมาส " + q : "ยานพาหนะทั้งหมดในแผน"} Badge={q ? "กำหนดอะไหล่แล้ว " + qDone + "/" + inQ(q).length + " คัน" : shown.length + " คัน"} Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query}
            onQuery={(v) => { setQuery(v); setPage(1); }} FilterButton={false}
            Actions={q ? [<SecondaryButton key="parts" Text={"กำหนดอะไหล่" + (nTicked ? " (" + nTicked + ")" : "")} Size={mob ? "lg" : "md"} State={nTicked ? "Default" : "Disabled"} onClick={() => nTicked && toBulk()} />, addBtn("เพิ่มยานพาหนะ")] : undefined} />
          {live && q > 0 && qLocked(q) && <Alert Color="Success" Text={"ไตรมาส " + q + " บำรุงรักษาเสร็จทุกคันแล้ว"} SupportingText="ดูอย่างเดียว เพิ่ม ย้าย ลบ หรือกำหนดอะไหล่ของยานพาหนะในไตรมาสนี้ไม่ได้" />}
          {carBody}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title={q ? "อะไหล่ในไตรมาส " + q : "อะไหล่รวมทุกไตรมาส"} />{/* 9 พ.ย. 2569 เจ้าของงาน "เอาเลขออกไปเลยได้ป่ะ ถ้าหมายถึงจำนวนชนิด" ⇒ หัวข้ออะไหล่รวมตามรายการไม่มีตัวเลขจำนวนชนิด */}
          {qRows.length
            ? table(QPART_COLS, qRows.map(qpartRow))
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={!q ? "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะในแท็บไตรมาส รายการจะรวมมาที่นี่" : qCars.length ? "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะ รายการจะรวมมาที่นี่" : "เพิ่มยานพาหนะเข้าไตรมาสนี้ก่อน แล้วจึงจัดการอะไหล่ทีละคันได้"} />}
        </section>

        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text={edit ? "ยกเลิก" : "ย้อนกลับ"} Size="lg" onClick={leave} />
          <PrimaryButton Text={live ? "บันทึก" : "บันทึกและส่งอนุมัติ"} Size="lg" State={complete ? "Default" : "Disabled"} onClick={save} />
        </div>
      </div>
      {/* ย้ายไปไตรมาสอื่น — popup เดิมของ "จัดลงไตรมาส" (Radio text card ไตรมาส 1–4 เรียงลง ช่องไฟ 12) หัวและปุ่มเปลี่ยน · ไตรมาสปัจจุบันของคันนั้น / ไตรมาสที่เสร็จแล้ว = Disabled */}
      <PopupModal open={move !== null} title={"ย้ายไปไตรมาสอื่น · " + (move ? CAND[move.car].plate : "")} sub="ยานพาหนะและอะไหล่ที่กำหนดไว้ของยานพาหนะคันนี้จะย้ายไปไตรมาสที่เลือก" ok="ย้ายยานพาหนะ" okDisabled={!move?.to}
        onCancel={() => setMove(null)} onOk={doMove}>
        <div role="radiogroup" className="flex flex-col gap-3">
          {QUARTERS.map((t, i) => {
            const n = i + 1, off = n === mq || qLocked(n);
            return <RadioTextCard key={t} Text={t} SupportingText={n === mq ? "ไตรมาสปัจจุบัน" : qLocked(n) ? "บำรุงรักษาเสร็จทุกคันแล้ว" : undefined} State={off ? "Disabled" : "Default"} Selected={move?.to === n} onClick={() => !off && move && setMove({ ...move, to: n })} />;
          })}
        </div>
      </PopupModal>
      <TripCarPicker open={qAdd} pool={addPool} nowQ={"ไตรมาส " + q} title={"เพิ่มยานพาหนะเข้าไตรมาส " + q} okText={"เพิ่มเข้าไตรมาส " + q}
        sub="ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน" areaOf={areaOf}
        emptyText="ยานพาหนะทุกคันอยู่ในแผนแล้ว" emptySub="ไม่มียานพาหนะที่เพิ่มเข้าแผนนี้ได้"
        onCancel={() => setQAdd(false)} onAdd={addToQ} />
      <RowMenu anchor={carMenu?.anchor ?? null} items={carItems} onClose={() => setCarMenu(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}
