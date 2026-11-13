"use client";
/* S6 P1 · หน้า "ไตรมาส n" (/quarter/trips/?id=Z7000001&q=1) — tripList() ใน screens.js · spec S6.md (E.1 E.9 E.11 E.13 E.15 · S9 H.7)
   ทางเข้า (รีวิว 5 พ.ย. 2569): เมนูบำรุงรักษาตามวาระ → รายการแผน → "…" ดูรายละเอียด (แผนอนุมัติแล้ว/ดำเนินการ) → รายละเอียดแผน → "ไปหน้าไตรมาส n" → หน้านี้
   Page header "ไตรมาส n" + Badge สถานะแผน (ย้อนกลับ) · Breadcrumbs บำรุงรักษาตามวาระ › <ชื่อแผน> › ไตรมาส n → Content ช่องไฟ 32:
     รายละเอียดแผน (VehicleAndReporterInfo ของไฟล์ Maintain-D · มือถือ DisplayBox) — PLAN_KV ไตรมาส = ไตรมาสของหน้านี้ "ไตรมาส n (n คัน)" (tripList o.q · 9 พ.ย. 2569 เดิมแสดงไตรมาสที่กำลังทำของแผนทุกหน้า) · รถของไตรมาส = quarterCars() (แผนจากฟอร์ม S1 = รถที่จัดลงไตรมาส · แผนตัวอย่าง = TRIP_CARS 10 คัน)
     Section label "ยานพาหนะในไตรมาส 1 (n)" + Secondary button "เพิ่มยานพาหนะ" (หน่วยงาน) + Table (TRIP_Q_COLS + ไอคอนแก้ไข ลบ · คอลัมน์ "เบอร์ติดต่อ" เบอร์ + ชื่อผู้ดูแลยานพาหนะบรรทัดรอง 6 พ.ย. 2569) — รถที่ยังไม่มีใบ = Pill Gray "ยังไม่มีแผนเดินทาง" · เกิน 10 คันแบ่งหน้า
       TRIP_Q_COLS = ชุดกลาง TRIP_V_COLS (R82) ไม่มีสถานที่ + แผนเดินทาง: ประเภทยานพาหนะ · วันดำเนินการรายคัน (อยู่ในใบ = วันของคันนั้น + บรรทัดรอง ค่าเริ่มต้น/แก้จากช่วงวันเดินทาง · ยังไม่มีใบ = "—")
       ไอคอนแก้ไข คันที่อยู่ในใบ = popup "แก้ไขยานพาหนะในแผนเดินทาง" มีวันดำเนินการ (R83) · ยังไม่อยู่ = popup 3 ช่องเดิม
       · รถที่อยู่ในใบแล้ว ช่องแผนเดินทาง = ชื่อแผนเดินทาง + บรรทัดรอง "เพิ่มเข้าแผนเดินทางแล้ว" (เจ้าของงาน "หลังจากสร้างแผนการเดินทางแล้ว รถที่เพิ่ม จะแสดงว่าถูกเพิ่มแล้ว")
     Section label "อะไหล่ในไตรมาส n" (ไม่มีตัวเลขจำนวนชนิด 9 พ.ย. 2569) + Table QPART_COLS (R81 · lib/mock/plan.ts) ดูอย่างเดียว ต่อจากตารางยานพาหนะ — 6 พ.ย. 2569 เจ้าของงาน "หน้าที่ รวมรถในไตรมาส จะเป็นรวมแยกตามรายการ ไม่ต้องมีจาก smart inventory"
       (แทนหน้าความคืบหน้าอะไหล่ S4 เดิม · ยอด quarterPartRows ใน lib/mock/moves.ts · S25 รถที่ย้ายมา บรรทัดรองใต้ชนิด "รวม n หน่วย ของ {ทะเบียน} ที่ย้ายมา")
       · ไม่มีรายการ = Empty state/Data empty "ยังไม่มีรายการอะไหล่" / "ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" (noParts ของอะไหล่ในแผน S2 · จอหน้าไตรมาสไม่มีแบบว่าง)
     E.16–E.20 (เพิ่ม ลด แก้ไข รถในไตรมาส 4 พ.ย. 2569 · tripList o.added o.removed · Q_EXTRA · Q_REMOVE_CONFIRM · qAddModal): popup "เพิ่มรถเข้าไตรมาส n" (TripCarPicker)
       · 11 พ.ย. 2569 เพิ่มรายคันได้เฉพาะไตรมาสที่ยังบำรุงรักษาไม่เสร็จทุกคัน (quarterFinished · เสร็จสิ้น + บำรุงรักษาไม่ได้ นับว่าเสร็จ) — เสร็จครบแล้ว ปุ่ม "เพิ่มยานพาหนะ" Disabled
       · 12 พ.ย. 2569 (เจ้าของงาน 12 พ.ย. 2569 เลือกตามไฟล์สรุปประชุม VMS Plus (Notion "meeting 11/11/68" หัวข้อ 9) · BACKLOG ข้อ 71) ตัวเลือก = ยานพาหนะทุกคันที่ยังไม่อยู่ในแผนนี้ ไม่จำกัดภาค เขต ประเภทของแผน (รับมอบระหว่างปีเพิ่มได้ · quarterPool)
         บรรทัดรองของ popup "ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน รวมยานพาหนะที่รับมอบระหว่างปี" (เดิม "ยานพาหนะในขอบเขตของแผน (ภาค เขต และประเภทยานพาหนะเดียวกัน) ที่ยังไม่อยู่ในไตรมาสใด")
       · 13 พ.ย. 2569 เจ้าของงาน "ฟอร์มการเลือกรถอยากให้ใช้เหมือนกัน แต่ต่างกันที่ คอลัมน์ที่ต่างกัน" (BACKLOG ข้อ 89) ⇒ popup ส่ง areaOf = carArea — แผงตัวกรองภาค เขต ประเภทยานพาหนะกางตั้งแต่เปิด (desktop)
         แบบ popup ของฟอร์มแผน S1 · กว้าง 1140 · หัว บรรทัดรอง คอลัมน์ ปุ่ม toast คงเดิม
       · ไอคอนแก้ไข = TripCarEditModal (คันที่อยู่ในแผนเดินทางแล้ว = แก้ที่ใบนั้น) · ไอคอนลบ = ConfirmDialog "ยืนยันการเอารถออกจากไตรมาส n" · ไม่ต้องส่งอนุมัติแผนใหม่
     Section label "แผนเดินทาง (n)" + Tertiary brand button "สร้างแผนเดินทาง" → Table (TRIP_COLS ไอคอน ›) / Empty state/Data empty + Primary button "สร้างแผนเดินทาง"
       รถทุกคันอยู่ในแผนเดินทางแล้ว = ปุ่ม "สร้างแผนเดินทาง" Disabled (5 พ.ย. 2569 "สร้างแผนได้จนกว่าจะไม่เหลือรถ" · ตัด popup "รถทุกคันของไตรมาสอยู่ในแผนเดินทางแล้ว")
   S25 (5 พ.ย. 2569 · BACKLOG ข้อ 12 · 10 พ.ย. 2569 Figma 5c47568 BACKLOG ข้อ 55): รถที่งาน "บำรุงรักษาไม่ได้" = Pill Error แทนชื่อแผนเดินทาง + ปุ่ม "…" 2 รายการ
     "ดำเนินการบำรุงรักษา" (car_repair · ยืนยัน MAINT_CONFIRM → ออกจากแผนเดินทางเดิม เป็น "ยังไม่มีแผนเดินทาง" ในไตรมาสนี้ อะไหล่คงอยู่ + toast) · "ย้ายไปไตรมาสอื่น" (ไตรมาส 4 = Disabled)
     · มือถือ Mobile table item Style=Action buttons 2 ปุ่ม · ย้าย: MoveModal → ยืนยัน → กลับหน้านี้ รถคันนั้นหาย + toast · ไตรมาสใหม่ รถขึ้นก่อน บรรทัดรอง "ย้ายมาจากไตรมาส n"
   11 พ.ย. 2569 เจ้าของงาน "ตรงที่รายละเอียดรถที่เลือกเข้าไตรมาส อยากให้มี filter ยี่ห้อเครื่องจักรเพิ่ม และ search ได้ ยี่ห้อ รุ่น ทะเบียน เพิ่ม column รถในไตรมาส คือยี่ห้อเครื่องจักร รุ่นเครื่องจักร" (BACKLOG ข้อ 64)
     ตาราง "ยานพาหนะในไตรมาส n" — Table header (ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" + ตัวกรอง + ชิป · แบบฟอร์มแผน S1) → แผงตัวกรอง (FilterShell · Input dropdown with badges "ยี่ห้อเครื่องจักร" หลายค่า)
     คอลัมน์ (8 = เต็ม Table ของไลบรารี R25): ทะเบียน (บรรทัดรอง ยี่ห้อ/รุ่นของยานพาหนะ "Isuzu FTR" แทนคอลัมน์ยี่ห้อ/รุ่น) · ประเภทยานพาหนะ · ยี่ห้อเครื่องจักร · รุ่นเครื่องจักร (machineOf ของ data.ts
     · รถพ่วงฉีดน้ำ ยี่ห้อ "-" รุ่น = สเปกถัง) · หน่วยงานเจ้าของยานพาหนะ · เบอร์ติดต่อ · แผนเดินทาง (บรรทัดรอง = วันดำเนินการของคันนั้น แทนคอลัมน์วันดำเนินการ) · ไอคอน
     ไม่ตรงคำค้น/ตัวกรอง = Empty state/Search not found + "ล้างตัวกรอง" · มือถือ Mobile table ช่องเดียวกัน
   ไอคอน ›: อนุมัติแล้ว → รายละเอียดแผนเดินทาง (/trips/detail/ · batch C) · ส่งกลับแก้ไข → แก้ไข (E.14) · รออนุมัติ = ไม่มีจอ (ไม่มีไอคอน) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { mrOf, planKv, planOf } from "@/lib/mock/closeout";
import { PST, machineOf, uniq } from "@/lib/mock/data";
import { FilterShell } from "@/app/vehicles/_lib/ui";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { TableHeader } from "@/components/vms/TableHeader";
import { applySample, getJob, jobsOf, WSTAT } from "@/lib/mock/jobs";
import { MAINT_CONFIRM, MAINT_ITEM, carPlanParts, cannotTrip, maintainCar, moveCar, movedInto, quarterFinished, quarterPartRows } from "@/lib/mock/moves";
import { QPART_COLS, qpartRow } from "@/lib/mock/plan";
import { useSeed } from "@/lib/mock/seedB";
import { setMock } from "@/lib/mock/store";
import { useSample, type SampleMap } from "@/lib/useSample";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { MoveModal, type MoveTarget } from "../_shared/MoveModal";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { canManage, usePlanGate } from "@/lib/mock/planFlow";
import { TST, addQuarterCars, badgeOf, ctrlCell, editQuarterCar, putTrip, qEditOf, quarterCars, quarterPool, quarterTrips, removeQuarterCar, tripBy, tripPlaces, tripRange, vTrip, type TripCar } from "@/lib/mock/trips";
import { UNIT_COL, tripVCells, tripVCols, tripWork, workOf } from "@/lib/mock/tripCols";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { TripCarEditModal } from "../_shared/TripCarEditModal";
import { TripCarPicker } from "../_shared/TripCarPicker";
import { carArea } from "@/lib/mock/carArea";
import { Content, DataTable, PagedTable, Section, go, planDetailHref, quarterCrumbs, useBack } from "../_shared/ui";

/* TRIP_Q_COLS ของ screens.js = ชุดกลาง TRIP_V_COLS (R82 · lib/mock/tripCols.ts) ไม่มีสถานที่บำรุงรักษา (สถานที่อยู่กับแผนเดินทาง) + แผนเดินทาง
   11 พ.ย. 2569 (BACKLOG ข้อ 64): ยี่ห้อ/รุ่น → บรรทัดรองของทะเบียน · วันดำเนินการ → บรรทัดรองของแผนเดินทาง · + ยี่ห้อเครื่องจักร รุ่นเครื่องจักร ต่อจากประเภท */
const Q_DROP = { drop: ["สถานที่บำรุงรักษา", "ยี่ห้อ/รุ่น", "วันดำเนินการ"] };
const [Q_PLATE, Q_TYPE, ...Q_REST] = tripVCols(Q_DROP);
const TRIP_Q_COLS: TableColumn[] = [{ ...Q_PLATE, width: 170 }, { ...Q_TYPE, width: 145 }, { head: "ยี่ห้อเครื่องจักร", width: 130 }, { head: "รุ่นเครื่องจักร", width: 130 },
  ...Q_REST.map((c) => (c.head === UNIT_COL ? { head: c.head } : c)), { head: "แผนเดินทาง", width: 210 }];
const TRIP_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวัน", width: 220 }, { head: "ยานพาหนะ (คัน)", width: 100 },
  { head: "ผู้ดำเนินการ", width: 260 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" },
];

/* ?sample=S25 (หน้า /scenarios/): ใบ T1 อนุมัติแล้ว 80-9981 ลำปาง บำรุงรักษาไม่ได้ (T1_afterCannot) · ล้างการย้ายและรถในไตรมาสที่แก้ของแผนตัวอย่าง */
const SAMPLES: SampleMap = { S25: { role: "หน่วยงาน (กบผ.)", apply: () => { applySample("T1_afterCannot"); setMock((s) => ({ ...s, moves: (s.moves ?? []).filter((m) => m.planId !== "Z7000001"), qcars: Object.fromEntries(Object.entries(s.qcars ?? {}).filter(([k]) => !k.startsWith("Z7000001-"))) })); } } };
const MOVE_ICON = "swap_driving_apps_wheel-24-300-round";

function TripList() {
  useSeed();
  const sampling = useSample(SAMPLES);
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const role = useRole();
  const id = sp.get("id") ?? "Z7000001", q = Number(sp.get("q") ?? 1);
  const nowQ = "ไตรมาส " + q;
  const plan = planOf(mock, id);
  /* ผู้ดำเนินการ = หน่วยงานเจ้าของแผน (canManage · กบผ. กปส. กรย. กส.1 กส.2 กบค.) — 9 พ.ย. 2569 เดิมเฉพาะ กบผ. ("แผนอนุมัติแล้ว แต่ไม่เจอแผนการเดินทางที่อนุมัติแล้ว") */
  const kbk = !!plan && canManage(role, plan);   // อื่น (กบค. ดูแผนของหน่วยงานอื่น · A.32) = ดูอย่างเดียว ไม่มีปุ่มเพิ่ม แก้ไข สร้าง
  const denied = usePlanGate(plan);   // หน่วยงานเปิดแผนของหน่วยงานอื่น → หน้ารายการ (ตรวจสิทธิ์ 9 พ.ย. 2569)
  const trips = quarterTrips(mock, id, q);
  const cars = quarterCars(mock, id, q);
  const mob = useBreakpoint() === "Mobile";
  const [adding, setAdding] = useState(false);
  const [editCar, setEditCar] = useState<TripCar | null>(null);
  const [dropCar, setDropCar] = useState<TripCar | null>(null);
  const [menu, setMenu] = useState<{ car: TripCar; anchor: MenuAnchor } | null>(null);
  const [moving, setMoving] = useState<MoveTarget | null>(null);
  const [maint, setMaint] = useState<TripCar | null>(null);   // S25 ดำเนินการบำรุงรักษา (ยืนยัน)
  const [query, setQuery] = useState("");
  const [brandF, setBrandF] = useState<string[]>([]);   // ตัวกรองยี่ห้อเครื่องจักรที่ใช้อยู่
  const [panel, setPanel] = useState<string[] | null>(null);   // แผงตัวกรอง: ค่าร่าง (null = ปิด)
  const [brandOpen, setBrandOpen] = useState(false);
  const back = useBack(planDetailHref(id));
  const newHref = "/quarter/trips/new/?id=" + id + "&q=" + q;

  /* E.1 เพิ่ม ลด แก้ไข รถในไตรมาส (กบค.) — ไอคอนแก้ไข = ผู้ดูแลยานพาหนะ เบอร์ติดต่อ และสถานที่ (6 พ.ย. 2569) · ลบ = เอาออกจากไตรมาส (คันที่อยู่ในแผนเดินทางแล้วมีแค่แก้ไข) */
  const edits = qEditOf(mock, id, q);
  const tripOf = (c: TripCar) => trips.find((x) => x.carIds.includes(c.id));
  const moved = new Map(movedInto(mock, id, q).map((m) => [m.carId, m]));
  const finished = quarterFinished(mock, id, q);   // 11 พ.ย. 2569 บำรุงรักษาเสร็จทุกคันแล้ว (เสร็จสิ้น + บำรุงรักษาไม่ได้) ⇒ เพิ่มยานพาหนะเข้าไตรมาสนี้ไม่ได้
  const lastQ = q >= 4;   // ไตรมาสสุดท้ายของแผน = ย้ายไม่ได้ (Disabled · ยังไม่เคาะเรื่องแผนปีถัดไป)
  /* S25 ย้ายไปไตรมาสอื่น — 13 พ.ย. 2569 ไฟล์ 34 ข้อ 26 (เจ้าของงานเลือก ก · เดิม 10 พ.ย. "ไม่จำเป็นว่าต้องเป็นรถที่บำรุงไม่ได้"): ย้ายได้ทั้งคันที่บำรุงรักษาไม่ได้ และคันที่ยังไม่อยู่ในแผนเดินทาง
     ย้ายได้เฉพาะไตรมาสถัดไปของแผนเดียวกัน · ไตรมาส 4 ย้ายไม่ได้ · ไม่ต้องอนุมัติใหม่ */
  const openMove = (c: TripCar) => {
    if (lastQ) return;
    const x = cannotTrip(mock, id, q, c.id);
    if (x) return setMoving({ car: c, tripName: x.trip.name, reason: x.reason, parts: carPlanParts(mock, id, c.id, x.trip.id) });
    if (!tripOf(c)) setMoving({ car: c, tripName: "ยังไม่มีแผนเดินทาง", reason: "", parts: carPlanParts(mock, id, c.id) });
  };
  /* ค้นหา (ทะเบียน ยี่ห้อ รุ่น ทั้งยานพาหนะและเครื่องจักร) + ตัวกรองยี่ห้อเครื่องจักร */
  const brands = uniq(cars.map((c) => machineOf(c.model).brand).filter((b) => b !== "-")).sort();
  const kq = query.trim().toLowerCase();
  const shownCars = cars.filter((c) => (!kq || (c.plate + " " + c.model).toLowerCase().includes(kq)) && (!brandF.length || brandF.includes(machineOf(c.model).brand)));
  const carRows: TableValue[][] = shownCars.map((c) => {
    const t = tripOf(c), cannot = t ? cannotTrip(mock, id, q, c.id) : null, from = moved.get(c.id);
    const done = !!t && t.status === "approved" && getJob(jobsOf(mock), t.id, c.id).status === "done";   // Figma E.26 (R93 132a652): ปิดงานเสร็จสิ้น = Pill เสร็จสิ้น ไม่มีไอคอน/เมนู
    const acts = [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + c.plate, onClick: () => setEditCar(c) },
      ...(t || lastQ ? [] : [{ IconSwap: MOVE_ICON, label: "ย้ายไปไตรมาสอื่น " + c.plate, onClick: () => openMove(c) }]),   // ไฟล์ 34 ข้อ 26 คันที่ยังไม่อยู่ในแผนเดินทาง
      ...(t ? [] : [{ IconSwap: "delete-24-300-round", label: "ลบ " + c.plate, onClick: () => setDropCar(c) }])];
    /* R82 ช่องตามชุดกลาง · ยังไม่อยู่ในแผนเดินทาง = ผู้ดูแลจากข้อมูลยานพาหนะ/ค่าที่แก้ในไตรมาส (E.18) · วันดำเนินการ "—" */
    const [, type, ...rest] = tripVCells(c, t ? vTrip(t) : { phones: edits.phones, names: edits.names }, Q_DROP);
    const mc = machineOf(c.model);
    const plate: TableValue = { text: c.plate, sub: mc.vehicle + (from ? " · ย้ายมาจาก" + "ไตรมาส " + from.from : "") };
    const r: TableValue[] = [plate, type, mc.brand, mc.model, ...rest, cannot ? { pills: [WSTAT.cannot] } : done ? { pills: [WSTAT.done] } : t ? { text: t.name, sub: "วันดำเนินการ " + tripWork(vTrip(t), c.id) } : { pills: [["ยังไม่มีแผนเดินทาง", "Gray"]] }];
    if (!kbk || done) return done && kbk ? [...r, null] : r;
    if (cannot) return [...r, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setMenu({ car: c, anchor: anchorOf(e.currentTarget) }) }],
      /* 2 ปุ่ม (Action 2 ของ Mobile table item) — กว้าง 402 วางคู่กันแล้วข้อความล้นการ์ด ⇒ เรียงลงเต็มแถว (BACKLOG ค.) */
      mobileButtons: <div className="flex flex-col gap-3 [&>*]:w-full">
        <SecondaryButton Text={MAINT_ITEM.Text} LeadingIconSwap={MAINT_ITEM.IconSwap} Size="lg" onClick={() => setMaint(c)} />
        <SecondaryButton Text="ย้ายไปไตรมาสอื่น" LeadingIconSwap={MOVE_ICON} Size="lg" State={lastQ ? "Disabled" : "Default"} onClick={() => openMove(c)} />
      </div> }];
    return [...r, { actions: acts, mobileActions: acts }];
  });
  const editTrip = editCar ? tripOf(editCar) : undefined;
  const open = (tid: string, st: string) => (st === "approved" ? router.push("/trips/detail/?trip=" + tid) : router.push("/quarter/trips/edit/?trip=" + tid));
  const canOpen = (st: string) => st === "approved" || (st === "returned" && kbk);   // ส่งกลับแก้ไข = ฟอร์มแก้ไขของผู้สร้างแผนเดินทางเท่านั้น
  const tripRows: TableValue[][] = trips.map((t) => [{ text: t.name, sub: tripPlaces(t) }, tripRange(t), String(t.carIds.length), tripBy(t), { pills: [TST[t.status]] },
    !canOpen(t.status) ? null : go("เปิด " + t.name, () => open(t.id, t.status))]);
  const qparts = quarterPartRows(mock, id, q);
  const partRows: TableValue[][] = qparts.map((r) => { const v = qpartRow(r); return r.sub ? [{ text: r.name, sub: r.sub }, ...v.slice(1)] : v; });
  const free = cars.some((c) => !tripOf(c));   // รถที่ยังไม่อยู่ในแผนเดินทางใด
  const create = (Btn: typeof PrimaryButton | typeof TertiaryBrandButton) => kbk ? <Btn Text="สร้างแผนเดินทาง" LeadingIconSwap="add-24-300-round" State={free ? "Default" : "Disabled"} onClick={() => free && router.push(newHref)} /> : undefined;

  if (sampling) return null;
  if (denied) return null;
  return (
    <>
      <PageHeader Title={nowQ} Badge={badgeOf(PST[plan?.status ?? "active"])} onBack={back} crumbs={quarterCrumbs(id, plan?.name ?? mrOf(id), q)} />
      <Content>
        {plan && <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan).map(([k, v]): [string, string] => (k === "ไตรมาส" ? [k, nowQ + " (" + cars.length + " คัน)"] : [k, v]))} />}
        <Section>
          <SectionLabel Title={"ยานพาหนะใน" + nowQ + " (" + cars.length + ")"}
            Actions={kbk ? <SecondaryButton Text="เพิ่มยานพาหนะ" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} State={finished ? "Disabled" : "Default"} onClick={() => !finished && setAdding(true)} /> : undefined} />
          {cars.length > 0 && <TableHeader Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query} onQuery={setQuery} onFilter={() => setPanel([...brandF])} FilterCount={brandF.length}
            Filters={brandF} onRemoveFilter={(b) => setBrandF(brandF.filter((x) => x !== b))} />}
          {cars.length > 0 && !shownCars.length
            ? <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={() => { setQuery(""); setBrandF([]); }} />} />
            : <PagedTable key={kq + brandF.join()} columns={kbk ? [...TRIP_Q_COLS, { head: "", width: 136, Style: "Action icons" }] : TRIP_Q_COLS} rows={carRows} rowKey={(r) => (r[0] as { text: string }).text} />}
        </Section>
        <Section>
          <SectionLabel Title={"อะไหล่ใน" + nowQ} />{/* 9 พ.ย. 2569 เจ้าของงาน "เอาเลขออกไปเลยได้ป่ะ ถ้าหมายถึงจำนวนชนิด" ⇒ หัวข้ออะไหล่รวมตามรายการไม่มีตัวเลขจำนวนชนิด */}
          {partRows.length
            ? <DataTable columns={QPART_COLS} rows={partRows} rowKey={(_, i) => qparts[i].key} />
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText="ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" />}
        </Section>
        <Section>
          <SectionLabel Title={"แผนเดินทาง (" + trips.length + ")"} Actions={create(TertiaryBrandButton)} />
          {trips.length
            ? <DataTable columns={TRIP_COLS} rows={tripRows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีแผนเดินทาง" SupportingText="สร้างแผนเดินทางเพื่อนัดวันเข้าตรวจ แจ้งผู้ดูแลยานพาหนะและ กรย." Actions={create(PrimaryButton)} />}
        </Section>
      </Content>
      <FilterShell open={panel !== null} onClose={() => { setPanel(null); setBrandOpen(false); }} onClear={() => setPanel([])} onApply={() => { setBrandF(panel ?? []); setPanel(null); setBrandOpen(false); }}>
        <InputDropdownWithBadges LabelText="ยี่ห้อเครื่องจักร" Optional values={panel ?? []} Placeholder="เลือกยี่ห้อเครื่องจักร" open={brandOpen} onOpenChange={setBrandOpen}
          onRemove={(b) => setPanel((p) => (p ?? []).filter((x) => x !== b))}>
          <DropdownList>{brands.map((b) => <DropdownListItem key={b} Text={b} State={(panel ?? []).includes(b) ? "Selected" : "Default"}
            onClick={() => setPanel((p) => ((p ?? []).includes(b) ? (p ?? []).filter((x) => x !== b) : [...(p ?? []), b]))} />)}</DropdownList>
        </InputDropdownWithBadges>
      </FilterShell>
      <TripCarPicker open={adding} pool={quarterPool(mock, id, q)} nowQ={nowQ} title={"เพิ่มยานพาหนะเข้า" + nowQ}
        sub="ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน รวมยานพาหนะที่รับมอบระหว่างปี" okText={"เพิ่มเข้า" + nowQ} emptyText="ไม่มียานพาหนะที่เพิ่มเข้าไตรมาสนี้ได้" areaOf={carArea}
        onCancel={() => setAdding(false)} onAdd={(ids) => { addQuarterCars(id, q, ids); setAdding(false); notify("เพิ่มยานพาหนะเข้า" + nowQ + " สำเร็จ"); }} />
      {/* S25 (Figma 5c47568 X.2 X.11): ดำเนินการบำรุงรักษา + ย้ายไปไตรมาสอื่น · ไตรมาส 4 ย้ายกดไม่ได้ ดำเนินการบำรุงรักษากดได้ */}
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ ...MAINT_ITEM, onClick: () => setMaint(menu.car) }, { Text: "ย้ายไปไตรมาสอื่น", IconSwap: MOVE_ICON, Disabled: lastQ, onClick: () => openMove(menu.car) }] : []} onClose={() => setMenu(null)} />
      <ConfirmDialog spec={maint ? MAINT_CONFIRM(maint.plate, q) : null} onCancel={() => setMaint(null)}
        onOk={() => { if (maint) { const x = cannotTrip(mock, id, q, maint.id); if (x) maintainCar(maint, q, x.trip.id); } setMaint(null); }} />
      <MoveModal target={moving} cur={q} counts={(k) => quarterCars(mock, id, k).length} onCancel={() => setMoving(null)}
        onMove={(k) => { if (moving) { const tid = cannotTrip(mock, id, q, moving.car.id)?.trip.id ?? ""; moveCar(id, moving.car, q, k, tid); } setMoving(null); }} />
      {/* คันที่อยู่ในแผนเดินทาง = popup แบบแผนเดินทาง มีวันดำเนินการ (R83) · ยังไม่อยู่ = 3 ช่องหัวเดิม */}
      <TripCarEditModal car={editCar} trip={editTrip ?? edits} work={editTrip && editCar ? { d1: editTrip.d1, d2: editTrip.d2, value: workOf(editTrip, editCar.id) } : undefined} onCancel={() => setEditCar(null)}
        onSave={(o, w) => {
          if (editTrip && editCar) { const works = { ...(editTrip.works ?? {}) }; if (w) works[editCar.id] = w; else delete works[editCar.id]; putTrip({ ...editTrip, ...o, works }); }
          else editQuarterCar(id, q, o);
          setEditCar(null);
        }} />
      <ConfirmDialog spec={dropCar ? { danger: true, title: "ยืนยันการเอายานพาหนะออกจาก" + nowQ, sub: dropCar.plate + " จะถูกเอาออกจาก" + nowQ + " ของแผนนี้ และอะไหล่ของยานพาหนะคันนี้ออกจากรายการเบิกของไตรมาส", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onCancel={() => setDropCar(null)} onOk={() => { if (dropCar) { removeQuarterCar(id, q, dropCar.id); notify("เอายานพาหนะออกจาก" + nowQ + " สำเร็จ"); } setDropCar(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><TripList /></Suspense></AppFrame>;
}
