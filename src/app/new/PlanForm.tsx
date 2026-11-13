"use client";
/* ฟอร์มแผนบำรุงรักษา planForm() ใน screens.js แบบ A (เจ้าของงานเลือก 5 พ.ย. 2569 · รีวิวทีมออกแบบ) — ใช้ร่วม S1 สร้างแผน (/new/) และ S19 แก้ไขแผน (/edit/?id=)
   ตาม `Section header` · `Input dropdown` · `Tabs` · `Table header` · `Table header cell` (Checkbox) · `Table cell` (Lead checkbox · Badge · Action icons) · `Table pagination`
   · `Empty state/Data empty` (Graphic=vehicle) · `Empty state/Search not found` · `Radio text card` · `Dropdown menu` · `Modal header` · `Modal footer` ของไฟล์ Component
   + หน้า 5.2 Vehicle Management (Vehicle list · Export reports - Select vehicles) ของ UI Release#2 · popup เพิ่มยานพาหนะแบบ vehPickerModal ของ Overhaul (BACKLOG ข้อ 87 89)
   แผน 2 ขั้น (R111 R112 · BACKLOG ข้อ 90 · เจ้าของงาน 13 พ.ย. 2569 "เลือกรถเข้ามาในแผนก่อน แล้วหลังจากนั้นเลือกรถเข้าไตรมาส จะเงื่อนไขว่า รถที่เลือกแล้วจะไม่แสดงตอนเลือกไตรมาสอื่นได้
     และ รถในไตรมาส อยากให้ สามารถ ย้ายไปไตรมาสอื่นได้") — ขั้นที่ 1 แท็บทั้งหมด เพิ่มยานพาหนะเข้าแผน (alloc 0 = ยังไม่จัดไตรมาส) · ขั้นที่ 2 แท็บไตรมาส n จัดจากยานพาหนะในแผนที่ยังไม่จัดไตรมาส
     (แทน BACKLOG ข้อ 87 เพิ่มเข้าไตรมาสที่เปิดอยู่ทันที · ข้อ 89 ช่อง "เพิ่มเข้าไตรมาส" ใน popup ของแท็บทั้งหมด · ข้อ 86 ไอคอนถังขยะ)
   Content ช่องไฟ 32:
     (แก้ไข) Alert — ส่งกลับแก้ไข: Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล · อนุมัติแล้ว: Warning "แผนนี้อนุมัติแล้ว"
     ข้อมูลแผน (Section header) — ชื่อแผน (Text input) · ปีงบประมาณ (สร้าง: Input dropdown · แก้ไข: Readonly)
     ยานพาหนะในแผน (Section header + Badge "ในแผน n คัน" นับทุกคันรวมที่ยังไม่จัดไตรมาส) · Tabs ทั้งหมด n · ไตรมาส 1–4 n (นับเฉพาะคันในไตรมาสนั้น) · ฟอร์มสร้างใหม่เปิดที่แท็บทั้งหมด
       ทั้งสองแท็บ = ตารางติ๊ก CheckTable (Lead checkbox + ติ๊กทั้งหมดที่หัวคอลัมน์แรก · หน้าละ 10 + Table pagination · มือถือ List with checkbox + ไอคอนใต้รายการ CLAUDE.md ข้อ 14)
         · Table header ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" ไม่มีปุ่มตัวกรอง · ติ๊กแล้วมีปุ่มรอง "กำหนดอะไหล่ (k)" (R112 · ไม่ได้ติ๊ก = ไม่มีปุ่ม ตาม planForm) · Secondary button "เพิ่มยานพาหนะ" ไอคอน + ขวาสุด
         · กำหนดอะไหล่ (k) → หน้า S21 แบบหลายคัน /car-parts/?cars=…&q=แท็บที่เปิด (q 0 = ทุกคันในแผน) บันทึกแล้วกลับแท็บเดิม · แก้รายคันภายหลังได้จากเมนู …
       แท็บทั้งหมด: หัว "ยานพาหนะทั้งหมดในแผน" + Badge "n คัน" · PICK_COLS ทะเบียน (ยี่ห้อ/รุ่น) · ประเภทยานพาหนะ · เขต / หน่วยงาน (ไฟล์ 34 ข้อ 1 ไม่มีคอลัมน์ประวัติเครื่องจักรแล้ว)
           · ไตรมาส (Pill Brand "ไตรมาส n" · Pill Gray "ยังไม่จัดไตรมาส" แบบป้าย "ยังไม่มีแผนเดินทาง" ของหน้าไตรมาส S6) · อะไหล่อื่นๆ (ช่องเดียวกับแท็บไตรมาส) · ปุ่ม …
         เมนู … (MENU): ดูรายละเอียด → /car-parts/view/ · แก้ไข → /car-parts/ (S21 q=0) · ลบ → ยืนยันการลบยานพาหนะออกจากแผน (PLAN_OUT_CONFIRM · ยังไม่จัดไตรมาส = ไม่อ้างไตรมาส)
           → ออกจากแผน ล้างอะไหล่ของคันนั้น + toast "ลบยานพาหนะออกจากแผนสำเร็จ" · มือถือ = ไอคอนดู แก้ไข ลบ ใต้รายการ
         เพิ่มยานพาหนะ → popup "เพิ่มยานพาหนะเข้าแผน" / "ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน" (ไม่มีช่องเลือกไตรมาส) → "เพิ่มเข้าแผน (k)"
           → ยังไม่จัดไตรมาส · อยู่แท็บทั้งหมด + toast "เพิ่มยานพาหนะ k คันเข้าแผนสำเร็จ" · แท็บนี้เพิ่มเข้าแผนได้เสมอ (รวมแผนที่ดำเนินการ)
         แผนยังไม่มียานพาหนะ: Empty state "ยังไม่มียานพาหนะในแผน" / "กดเพิ่มยานพาหนะเพื่อเลือกยานพาหนะเข้าแผน แล้วจึงจัดเข้าไตรมาส" + ปุ่มหลัก "เพิ่มยานพาหนะเข้าแผน" (noCarsInPlan)
       แท็บไตรมาส n: หัว "ยานพาหนะในไตรมาส n" + Badge "กำหนดอะไหล่แล้ว x/y คัน" · Q_COLS
         เมนู … (Q_MENU): ดูรายละเอียด · แก้ไข · ย้ายไปไตรมาสอื่น (popup Radio text card ไตรมาส 1–4 · ไตรมาสปัจจุบันเลือกไม่ได้ · ปุ่ม "ย้ายยานพาหนะ" → toast "ย้ายยานพาหนะ {ทะเบียน} ไปไตรมาส m สำเร็จ" · ติ๊กหลายคัน "ย้ายไตรมาส (k)" → "ย้ายยานพาหนะ k คันไปไตรมาส m สำเร็จ" ไฟล์ 34 ข้อ 4 27)
           · เอาออกจากไตรมาส (ไอคอน remove · ไม่มี confirm · กลับเป็นยังไม่จัดไตรมาส ยังอยู่ในแผน อะไหล่คงอยู่ → toast "เอายานพาหนะออกจากไตรมาส n แล้ว") · มือถือ = ไอคอนดู แก้ไข ย้าย เอาออก
         เพิ่มยานพาหนะ → popup "เพิ่มยานพาหนะเข้าไตรมาส n" / "ยานพาหนะในแผนที่ยังไม่จัดไตรมาส" — เฉพาะ alloc 0 (คันที่อยู่ไตรมาสอื่นไม่แสดง) → "เพิ่มเข้าไตรมาส n (k)"
           → toast "เพิ่มยานพาหนะ k คันเข้าไตรมาส n สำเร็จ" · ไม่มีให้เลือก = "ยานพาหนะในแผนจัดเข้าไตรมาสครบแล้ว" (แผนว่าง "ยังไม่มียานพาหนะในแผน") / "เพิ่มยานพาหนะเข้าแผนที่แท็บทั้งหมดก่อน แล้วจึงจัดเข้าไตรมาส"
         ไตรมาสว่าง: Empty state "ยังไม่มียานพาหนะในไตรมาสนี้" / "เลือกจากยานพาหนะในแผนที่ยังไม่จัดไตรมาส" + ปุ่มหลัก "เพิ่มยานพาหนะเข้าไตรมาส n" (R75 · noCarsInQ) · ไม่ตรงคำค้น: Search not found
     อะไหล่ในไตรมาส n (Section header · ไม่มีตัวเลขจำนวนชนิด 9 พ.ย. 2569) — ตั้งต้นว่าง รวมจากยานพาหนะที่จัดการแล้วทีละคัน (qAgg: น้ำมันที่เปลี่ยน ลิตรต่อคัน + อะไหล่อื่นๆ + รายการที่ระบุเอง · คันที่ไม่เบิกอะไหล่ไม่รวม)
       Table QPART_COLS (R81: ชนิด · รหัสอะไหล่ · ประเภท · จำนวน · หน่วย — ชุดเดียวกับอะไหล่ในแผน S2) ไม่มีปุ่มเพิ่มอะไหล่และไอคอนแถว / Empty state ตามแท็บ
       แท็บ "ทั้งหมด" (เจ้าของงาน 9 พ.ย. 2569 "หน้าอะใหล่ทั้งไตรมาส ต้องรวมมาให้ด้วย ทั้งไตรมาส"): หัวข้อ "อะไหล่รวมทุกไตรมาส" = ทุกคันในแผนรวมคันที่ยังไม่จัดไตรมาส (allQuarterRows)
     ปุ่ม ย้อนกลับ (แก้ไข: ยกเลิก) · บันทึกและส่งอนุมัติ — Disabled จนกว่า ชื่อแผน · ปีงบประมาณ ครบ · ยานพาหนะในแผนอย่างน้อย 1 คัน · ทุกคันจัดเข้าไตรมาสแล้ว · ทุกคันกำหนดอะไหล่แล้ว
       (draftComplete / carsComplete · 13 พ.ย. 2569 R111 เจ้าของงาน "ต้องจัดครบก่อน และต้องระบุอะใหล่รายคันให้ครบ" · 12 พ.ย. ข้อ 87 เคยตัดเงื่อนไขจัดครบ)
   Validation: ช่องบังคับที่ออกจากช่องโดยยังว่าง (Out of focus) แสดง "กรุณาระบุชื่อแผน" / "กรุณาเลือกปีงบประมาณ"
   popup ยืนยัน: ออกจากหน้าเมื่อมีการแก้ไข · (แก้ไข) ยืนยันการแก้ไข
   แผนที่ดำเนินการแล้ว (11 พ.ย. 2569 เจ้าของงาน "แผนที่ดำเนินการแล้ว ยังสามารถแก้ไขได้" + เคาะ "เฉพาะไตรมาสที่ยังไม่เสร็จ" · "ไม่ต้อง บันทึกแล้วมีผลเลย" · BACKLOG ข้อ 64 · lib/mock/liveEdit.ts)
     Alert Info "แผนนี้อยู่ระหว่างดำเนินการ" · แท็บไตรมาสที่เสร็จแล้ว = Alert Success "ไตรมาส n บำรุงรักษาเสร็จทุกคันแล้ว" ดูอย่างเดียว (ติ๊ก เพิ่ม ย้าย เอาออก กำหนดอะไหล่ ไม่ได้ · เมนู = ดูรายละเอียด)
     · ยานพาหนะที่ปิดงานแล้วในไตรมาสที่ยังไม่เสร็จ ล็อกแบบเดียวกัน (บรรทัดรอง "ปิดงานแล้ว") ทั้งแท็บไตรมาสและแท็บทั้งหมด (ลบออกจากแผนไม่ได้) · popup ย้ายไปไตรมาสอื่น: ไตรมาสที่เสร็จแล้ว Disabled
     · แท็บทั้งหมดเพิ่มเข้าแผนได้เสมอ · ไตรมาสที่เสร็จแล้วรับยานพาหนะเพิ่มไม่ได้ (ปุ่มเพิ่ม Disabled)
     · ปุ่ม "บันทึก" (ชื่อแผน + เงื่อนไขยานพาหนะชุดเดียวกับส่งอนุมัติ) ไม่มี popup ยืนยัน → toast "บันทึกการแก้ไขแผนสำเร็จ" → หน้ารายละเอียดแผน · แผนคงสถานะดำเนินการ */
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
import { CAND, CAR_PICK, MENU, QUARTERS, UNIT_FLEET, YEARS, type Plan } from "@/lib/mock/data";
import { carArea } from "@/lib/mock/carArea";
import { QPART_COLS, carsComplete, decided, draftComplete, emptyDraft, inQuarter, isDirty, matchQuery, planCars, planFromDraft, qpartRow, removeCar, thaiToday, unassignedCars, type Draft } from "@/lib/mock/plan";
import { allQuarterRows, carParam, roleUnit, draftFromPlan, draftKey, fillDraft, oilCellOf, otherCellOf, planId, planWithDraft, quarterRows } from "@/lib/mock/planFlow";
import { useProtoForm } from "@/lib/protoForm";
import { notify, setMock, useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { isLive, liveLocks, saveLive } from "@/lib/mock/liveEdit";
import { CheckTable, type CheckRow } from "./CheckTable";
import { TripCarPicker } from "@/app/quarter/_shared/TripCarPicker";

/* CARP_COLS (หน้ารายละเอียดแผน PlanBody · ดูอย่างเดียว) + ไอคอน (screens.js) · ตารางอะไหล่ในไตรมาสใช้ QPART_COLS (R81 · lib/mock/plan.ts) */
export const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของยานพาหนะ", width: 180 },
  { head: "น้ำมันไฮดรอลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
/* PICK_COLS — แท็บทั้งหมด · Q_COLS — แท็บไตรมาส n (screens.js) */
/* ไฟล์ 34 ข้อ 1 (เจ้าของงานเลือก ก 13 พ.ย. 2569): คอลัมน์ "บำรุงรักษาเครื่องจักรล่าสุด" "ซ่อมเครื่องจักรล่าสุด" มีเฉพาะในหน้าต่างเพิ่มยานพาหนะ (TripCarPicker) และ S24
   ⇒ ตารางในฟอร์มแผนเอาออกทั้งสองแท็บ (เดิม HIST_COLS BACKLOG ข้อ 64) · คอลัมน์และความกว้างตาม PICK_COLS Q_COLS ของ screens.js (6 คอลัมน์ ≤ 8 ของ Table ไลบรารี R25)
   แท็บทั้งหมด: ทะเบียน (ช่องติ๊ก บรรทัดรอง ยี่ห้อ/รุ่น) · ประเภทยานพาหนะ · เขต / หน่วยงาน · ไตรมาส (Pill "ไตรมาส n" / "ยังไม่จัดไตรมาส") · อะไหล่อื่นๆ · ปุ่ม … (MENU)
   แท็บไตรมาส n: ทะเบียน · ประเภทยานพาหนะ · เขต / หน่วยงาน · น้ำมันไฮดรอลิก · อะไหล่อื่นๆ · ปุ่ม … (Q_MENU) */
const PICK_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 260 }, { head: "ประเภทยานพาหนะ", width: 160 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, { head: "ไตรมาส", width: 170, Style: "Badge" }, { head: "อะไหล่อื่นๆ", width: 200 }, { head: "", width: 60, Style: "Action icons" }];
const Q_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 240 }, { head: "ประเภทยานพาหนะ", width: 130 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, { head: "น้ำมันไฮดรอลิก", width: 200 }, { head: "อะไหล่อื่นๆ", width: 200 }, { head: "", width: 60, Style: "Action icons" }];   // 6 พ.ย. 2569 ท้ายแถว = ปุ่ม … (Q_MENU) แทนไอคอนแก้ไข
const PER = 10;
/* เมนู "ย้ายไปไตรมาสอื่น" ของยานพาหนะในแท็บไตรมาส (BACKLOG ข้อ 87) — ไอคอนชุดเดียวกับเมนูย้ายไตรมาสของหน้าไตรมาส S25 */
const MOVE_ITEM = { Text: "ย้ายไปไตรมาสอื่น", IconSwap: "swap_driving_apps_wheel-24-300-round" };
/* เมนู "เอาออกจากไตรมาส" แทน "ลบ" ของแท็บไตรมาส (R111 · Q_MENU ของ screens.js · BACKLOG ข้อ 90) — ไอคอน remove ของไฟล์ Component หน้า Icons (ไอคอนยังไม่เคาะ) */
const OUT_Q_ITEM = { Text: "เอาออกจากไตรมาส", IconSwap: "remove-24-300-round" };
const NO_Q = "ยังไม่จัดไตรมาส";
const ADD_PLAN_FIRST = "เพิ่มยานพาหนะเข้าแผนที่แท็บทั้งหมดก่อน แล้วจึงจัดเข้าไตรมาส";   // ADD_PLAN_FIRST ของ screens.js (popup เพิ่มยานพาหนะเข้าไตรมาสที่ไม่มีให้เลือก)
/* S19: Alert เหนือฟอร์มแก้ไข (ALERT_RETURNED · ALERT_APPROVED) */
const ALERT_APPROVED = ["แผนนี้อนุมัติแล้ว", "เมื่อบันทึก แผนจะกลับเป็นสถานะรออนุมัติ และต้องให้ผู้อนุมัติตรวจสอบอีกครั้ง"] as const;
/* แผนที่ดำเนินการ (BACKLOG ข้อ 64) — ข้อความของเว็บ (Figma ตามทีหลัง) */
const ALERT_LIVE = ["แผนนี้อยู่ระหว่างดำเนินการ", "แก้ไขได้เฉพาะไตรมาสที่ยังบำรุงรักษาไม่เสร็จ และยานพาหนะที่ยังไม่ปิดงาน เมื่อบันทึกจะมีผลทันที ไม่ต้องส่งอนุมัติใหม่"] as const;

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
  const [qAdd, setQAdd] = useState(false);   // popup เพิ่มยานพาหนะ: แท็บทั้งหมด = เข้าแผน · แท็บไตรมาส n = เข้าไตรมาส n (R111 · BACKLOG ข้อ 90)
  const [move, setMove] = useState<{ cars: number[]; to: number } | null>(null);   // popup ย้ายไปไตรมาสอื่น (to 0 = ยังไม่เลือก) · cars หลายคัน = ติ๊กแล้วกด "ย้ายไตรมาส (k)" (ไฟล์ 34 ข้อ 4)
  const [assign, setAssign] = useState<{ cars: number[]; skip: number; to: number } | null>(null);   // popup จัดเข้าไตรมาส (แท็บทั้งหมด · ติ๊กแล้วกด "จัดเข้าไตรมาส (k)" · เฉพาะคันที่ยังไม่จัดไตรมาส · skip = คันที่ติ๊กแต่อยู่ในไตรมาสแล้ว)
  const [touched, setTouched] = useState<{ name?: boolean; year?: boolean }>({});
  const [pending, setPending] = useState<Pending | null>(null);
  const [carMenu, setCarMenu] = useState<{ car: number; anchor: MenuAnchor } | null>(null);   // เมนู … ของยานพาหนะ (แท็บทั้งหมด MENU · แท็บไตรมาส Q_MENU)
  const role = useRole();

  const put = (patch: Partial<Draft>) => setMock((s) => (edit ? { ...s, edit: { ...(s.edit ?? base()), ...patch } } : { ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggleYear = (v: boolean) => {
    if (!v && yearOpen && !d.year) setTouched((t) => ({ ...t, year: true }));   // ปิดรายการปีโดยยังไม่เลือก = out of focus
    setYearOpen(v);
  };
  const reset = () => { setPage(1); setTicked([]); };

  /* ---------- ยานพาหนะในแผน (planCars = ทุกคีย์ของ alloc รวมคันที่ยังไม่จัดไตรมาส alloc 0 · R111 BACKLOG ข้อ 90) ---------- */
  const cars = planCars(d);
  const q = d.q;
  const inQ = (k: number) => inQuarter(d, k);
  const k = query.trim();
  const shown = (q ? inQ(q) : cars).filter((i) => matchQuery(i, k));
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const rowsOnPage = shown.slice((pg - 1) * PER, pg * PER);
  const nTicked = ticked.length;
  /* ไตรมาสของคันในแท็บทั้งหมด: Pill Brand "ไตรมาส n" · ยังไม่จัด = Pill Gray "ยังไม่จัดไตรมาส" (planForm R111) */
  const qPill = (i: number): [string, "Brand" | "Gray"] => (d.alloc[i] ? ["ไตรมาส " + d.alloc[i], "Brand"] : [NO_Q, "Gray"]);
  const carQuery = (car: number) => "?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&car=" + carParam(car) + (from === "detail" ? "&from=detail" : "");
  const toS21 = (car: number) => router.push("/car-parts/" + carQuery(car));
  const untick = (car: number) => setTicked((t) => t.filter((x) => x !== String(car)));
  /* ลบ (เมนู … ของแท็บทั้งหมด · PLAN_OUT_CONFIRM ของ screens.js) = ลบยานพาหนะคันนั้นออกจากแผน (ล้างอะไหล่ที่กำหนดไว้) · เพิ่มกลับได้จาก popup เพิ่มยานพาหนะเข้าแผน
     ยังไม่จัดไตรมาส = ข้อความไม่อ้างไตรมาส · แผนที่ดำเนินการ + อยู่ในไตรมาส = ออกจากแผนเดินทางของไตรมาสนั้นเมื่อบันทึกด้วย (liveEdit.ts) */
  const outOfPlan = (car: number) => {
    const n = d.alloc[car];
    setPending({
      spec: { danger: true, title: "ยืนยันการลบยานพาหนะออกจากแผน", cancel: "ยกเลิก", ok: "ลบ",
        sub: CAND[car].plate + (n ? " จะออกจากไตรมาส " + n + " และไม่อยู่ในแผนนี้" + (live ? " รวมถึงออกจากแผนเดินทางของไตรมาสนี้เมื่อบันทึก" : "") : " จะไม่อยู่ในแผนนี้") + " เพิ่มกลับได้จากปุ่มเพิ่มยานพาหนะ" },
      run: () => {
        put(removeCar(d, car));
        untick(car);
        notify("ลบยานพาหนะออกจากแผนสำเร็จ");
      },
    });
  };
  /* เอาออกจากไตรมาส (เมนู … ของแท็บไตรมาส · R111) — ไม่มี confirm · alloc 0 = ยังอยู่ในแผนแต่ยังไม่จัดไตรมาส · อะไหล่ที่กำหนดไว้คงอยู่ ⇒ กลับมาให้เลือกใน popup ของทุกไตรมาส */
  const outOfQ = (car: number) => {
    const n = d.alloc[car];
    put({ alloc: { ...d.alloc, [car]: 0 } });
    untick(car);
    notify("เอายานพาหนะออกจากไตรมาส " + n + " แล้ว");
  };
  /* ย้ายไปไตรมาสอื่น (popup Radio text card เดิมของ "จัดลงไตรมาส") — อะไหล่ที่กำหนดไว้ย้ายไปพร้อมยานพาหนะ
     ทีละคันจากเมนู … · หลายคันจากปุ่ม "ย้ายไตรมาส (k)" ของแท็บไตรมาส (ไฟล์ 34 ข้อ 4 เจ้าของงานเลือก ก 13 พ.ย. 2569)
     toast คันเดียว "ย้ายยานพาหนะ {ทะเบียน} ไปไตรมาส m สำเร็จ" (ไฟล์ 34 ข้อ 27 · ชุดเดียวกับหน้าไตรมาส S25) · หลายคัน "ย้ายยานพาหนะ k คันไปไตรมาส m สำเร็จ" */
  const doMove = () => {
    if (!move?.to) return;
    const alloc = { ...d.alloc };
    move.cars.forEach((c) => { alloc[c] = move.to; });
    put({ alloc });
    setTicked((t) => t.filter((x) => !move.cars.includes(Number(x))));
    notify(move.cars.length === 1 ? "ย้ายยานพาหนะ " + CAND[move.cars[0]].plate + " ไปไตรมาส " + move.to + " สำเร็จ" : "ย้ายยานพาหนะ " + move.cars.length + " คันไปไตรมาส " + move.to + " สำเร็จ");
    setMove(null);
  };
  /* จัดเข้าไตรมาสหลายคัน (แท็บทั้งหมด · ไฟล์ 34 ข้อ 4) — เข้าเฉพาะคันที่ยังไม่จัดไตรมาส คันที่อยู่ในไตรมาสแล้วไม่เปลี่ยน (บอกในหน้าต่าง) · toast ชุดเดียวกับหน้าต่างเพิ่มยานพาหนะเข้าไตรมาส */
  const doAssign = () => {
    if (!assign?.to) return;
    const alloc = { ...d.alloc };
    assign.cars.forEach((c) => { alloc[c] = assign.to; });
    put({ alloc });
    setTicked([]);
    notify("เพิ่มยานพาหนะ " + assign.cars.length + " คันเข้าไตรมาส " + assign.to + " สำเร็จ");
    setAssign(null);
  };
  /* เมนู … ของยานพาหนะ — แท็บทั้งหมด MENU: ดูรายละเอียด (carPartsView) · แก้ไข (S21) · ลบ (ออกจากแผน)
     แท็บไตรมาส Q_MENU: ดูรายละเอียด · แก้ไข · ย้ายไปไตรมาสอื่น · เอาออกจากไตรมาส — คันที่ล็อก (แผนที่ดำเนินการ) = ดูรายละเอียดอย่างเดียวทั้งสองแท็บ */
  const carMenuItems = (car: number) => {
    const view = { ...MENU[0], act: () => router.push("/car-parts/view/" + carQuery(car)) };
    if (lockedCar(car)) return [view];
    const change = { ...MENU[1], act: () => toS21(car) };
    return q
      ? [view, change, { ...MOVE_ITEM, act: () => setMove({ cars: [car], to: 0 }) }, { ...OUT_Q_ITEM, act: () => outOfQ(car) }]
      : [view, change, { ...MENU[2], act: () => outOfPlan(car) }];
  };
  const carItems = carMenu ? carMenuItems(carMenu.car).map(({ act, ...m }) => ({ ...m, onClick: act })) : [];
  const lockSubOf = (i: number) => (lockedCar(i) ? (locks?.closed.has(i) ? "ปิดงานแล้ว · " : "ไตรมาสบำรุงรักษาเสร็จแล้ว · ") : "");
  const txt = (v: string | { text: string }) => (typeof v === "string" ? v : v.text);
  /* แถวของทั้งสองแท็บ (CheckTable) — มือถือ: บรรทัดรองสรุปคอลัมน์ (CLAUDE.md ข้อ 11) + ไอคอนตามเมนู … ใต้รายการ (ข้อ 14 · ทั้งหมด ดู แก้ไข ลบ · ไตรมาส ดู แก้ไข ย้าย เอาออก) */
  const rows: CheckRow[] = rowsOnPage.map((i) => {
    const c = CAND[i], lockSub = lockSubOf(i);
    const other = otherCellOf(d, i);
    const mobileActions = carMenuItems(i).map((m) => ({ IconSwap: m.IconSwap, label: m.Text + " " + c.plate, onClick: m.act }));
    const menu: TableValue = { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setCarMenu({ car: i, anchor: anchorOf(e.currentTarget) }) }] };
    const base = { key: String(i), text: c.plate, sub: lockSub + c.model, disabled: lockedCar(i), mobileActions };
    if (!q) return { ...base, mobileSub: lockSub + c.model + " · " + qPill(i)[0] + " · อะไหล่อื่นๆ " + txt(other), cells: [c.type, c.owner, { pills: [qPill(i)] }, other, menu] };
    const oil = oilCellOf(d, i);
    return { ...base, mobileSub: lockSub + "น้ำมัน " + txt(oil) + " · อะไหล่อื่นๆ " + txt(other), cells: [c.type, c.owner, oil, other, menu] };
  });
  /* กำหนดอะไหล่หลายคันครั้งเดียว (เจ้าของงาน 11 พ.ย. 2569 "อยากเพิ่มอะไหล่ครั้งเดียวในรถประเภทเดียวกัน" + "ทุกคันที่เลือกได้มั้ย คือต้องเลือกรถที่ต้องการเพิ่มอะไหล่" · BACKLOG ข้อ 64)
     ติ๊กยานพาหนะ → "กำหนดอะไหล่ (n)" → หน้า S21 แบบหลายคัน (/car-parts/?cars=…) ค่าที่เลือกใช้กับทุกคันที่ติ๊ก · แก้รายคันภายหลังได้จากเมนู … ตามเดิม
     13 พ.ย. 2569 (R112 · BACKLOG ข้อ 90) ได้ทั้งแท็บทั้งหมดและแท็บไตรมาส (q=0 = ทุกคันในแผน) · บันทึกแล้วกลับแท็บที่เปิดมา */
  const toBulk = () => router.push("/car-parts/?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&cars=" + ticked.map((x) => carParam(Number(x))).join(",") + (from === "detail" ? "&from=detail" : ""));
  /* popup เพิ่มยานพาหนะ (TripCarPicker + ตัวกรองภาค เขต ประเภทยานพาหนะในตัว popup · planCarModal ของ screens.js R111)
     แท็บทั้งหมด = "เพิ่มยานพาหนะเข้าแผน" pool = ยานพาหนะที่ยังไม่อยู่ในแผนนี้ → alloc 0
     แท็บไตรมาส n = "เพิ่มยานพาหนะเข้าไตรมาส n" pool = ยานพาหนะในแผนที่ยังไม่จัดไตรมาสเท่านั้น (unassignedCars · คันที่อยู่ไตรมาสอื่นไม่แสดง) → alloc n */
  const pickCar = (i: number) => { const c = CAND[i]; return { id: String(i), plate: c.plate, model: c.model, owner: c.owner, phone: "", ctrl: "" }; };
  const addPool = !qAdd ? [] : (q ? unassignedCars(d) : UNIT_FLEET.filter((i) => d.alloc[i] == null)).map(pickCar);
  const addCars = (ids: string[]) => {
    const alloc = { ...d.alloc };
    ids.forEach((x) => { alloc[Number(x)] = q; });
    put({ alloc });
    notify(q ? "เพิ่มยานพาหนะ " + ids.length + " คันเข้าไตรมาส " + q + " สำเร็จ" : "เพิ่มยานพาหนะ " + ids.length + " คันเข้าแผนสำเร็จ");
    setQAdd(false);
  };
  /* แผนที่ดำเนินการ: ไตรมาสที่เสร็จแล้วรับยานพาหนะเพิ่มไม่ได้ · แท็บทั้งหมดเพิ่มเข้าแผนได้เสมอ */
  const canAdd = q > 0 ? !qLocked(q) : true;

  /* ---------- อะไหล่ในไตรมาส (รวมจากรถทีละคัน · ไม่มีปุ่มเพิ่ม/ไอคอนแถว — 5 พ.ย. 2569) ---------- */
  const qCars = q ? inQ(q) : [];
  const qRows = q ? quarterRows(d, q) : allQuarterRows(d);   // แท็บทั้งหมด = รวมทุกคันในแผน (9 พ.ย. 2569 · 13 พ.ย. รวมคันที่ยังไม่จัดไตรมาส R111)

  /* ---------- ออก / ตรวจและบันทึก ---------- */
  const back = from === "detail" && plan ? "/detail/?id=" + planId(plan) : "/";
  /* รีวิว 5 พ.ย. 2569 "ต้องกรอกข้อมูลที่ require ครบถึงจะ enable ปุ่ม" + 6 พ.ย. 2569 เจ้าของงาน "บังคับให้กรอกอะใหล่ทุกคัน ไปหน้าต่อไปไม่ได้" (แบบ ก หน้าเดียว) */
  /* ชื่อแผน + ปีงบประมาณ + ยานพาหนะในแผนอย่างน้อย 1 คัน + ทุกคันจัดเข้าไตรมาสแล้ว + ทุกคันกำหนดอะไหล่แล้ว (R111 · BACKLOG ข้อ 90)
     แผนที่ดำเนินการ: เงื่อนไขยานพาหนะชุดเดียวกัน (ปีงบประมาณผูกกับแผนอยู่แล้ว) */
  const complete = live ? !!d.name.trim() && carsComplete(d) : draftComplete(d);
  /* ปุ่มต้นแบบ กรอกข้อมูลตัวอย่าง / ล้างค่า (แถบต้นแบบ · lib/protoForm.ts) — ล้างค่า = สร้าง: ฟอร์มว่าง · แก้ไข: ค่าของแผนที่บันทึกไว้ */
  const saved = edit ? draftFromPlan(plan, mock) : emptyDraft();
  useProtoForm({
    /* แผนที่ดำเนินการ: ไม่เพิ่มยานพาหนะให้ (ไตรมาสที่เสร็จแล้วล็อก) · คันที่ยังไม่จัดไตรมาส = ไตรมาสแรกที่ยังไม่เสร็จ (R111) · กำหนดอะไหล่ให้คันที่ยังไม่กำหนด (ไส้กรอง CAR_PICK · เก็บตัวอย่างน้ำมัน) */
    fill: () => {
      if (live) {
        const picks = { ...d.picks }, oils = { ...(d.oils ?? {}) }, alloc = { ...d.alloc }, open = [1, 2, 3, 4].find((n) => !qLocked(n));
        cars.forEach((i) => { if (!alloc[i] && open) alloc[i] = open; });
        cars.filter((i) => !lockedCar(i) && !decided(d, i)).forEach((i) => { picks[i] = [...CAR_PICK]; oils[i] = 0; });
        put({ name: d.name.trim() ? d.name : plan.name, alloc, picks, oils });
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

  /* ตารางติ๊กทั้งสองแท็บ (R111) · ไม่มีแถว: คำค้นไม่ตรง = Search not found · แท็บไตรมาสว่าง = noCarsInQ · แผนว่าง = noCarsInPlan */
  const carBody = shown.length
    ? <CheckTable key={"c" + q} columns={q ? Q_COLS : PICK_COLS} rows={rows} ticked={ticked} onTicked={setTicked}
        Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} />
    : k
      ? <EmptyStateSearchNotFound />
      : q
        ? <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในไตรมาสนี้" SupportingText="เลือกจากยานพาหนะในแผนที่ยังไม่จัดไตรมาส" Graphic="vehicle"
            Actions={canAdd ? addBtn("เพิ่มยานพาหนะเข้าไตรมาส " + q, true) : undefined} />
        : <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในแผน" SupportingText="กดเพิ่มยานพาหนะเพื่อเลือกยานพาหนะเข้าแผน แล้วจึงจัดเข้าไตรมาส" Graphic="vehicle"
            Actions={addBtn("เพิ่มยานพาหนะเข้าแผน", true)} />;
  const mq = move ? d.alloc[move.cars[0]] : 0;   // ทุกคันที่ย้ายพร้อมกันอยู่ไตรมาสเดียวกัน (แท็บไตรมาสที่เปิด)
  const tickedIds = ticked.map(Number), unassignedTicked = tickedIds.filter((i) => !d.alloc[i]);

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
          {/* R112: ปุ่ม "กำหนดอะไหล่ (k)" ขึ้นเมื่อติ๊กแล้ว ทั้งแท็บทั้งหมดและแท็บไตรมาส (more: bulk ของ planForm) */}
          <TableHeader Title={q ? "ยานพาหนะในไตรมาส " + q : "ยานพาหนะทั้งหมดในแผน"} Badge={q ? "กำหนดอะไหล่แล้ว " + qDone + "/" + inQ(q).length + " คัน" : cars.length + " คัน"} Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query}
            onQuery={(v) => { setQuery(v); setPage(1); }} FilterButton={false}
            Actions={[...(nTicked ? [<SecondaryButton key="parts" Text={"กำหนดอะไหล่ (" + nTicked + ")"} Size={mob ? "lg" : "md"} onClick={toBulk} />] : []),
              /* ไฟล์ 34 ข้อ 4: ติ๊กหลายคัน — แท็บไตรมาส "ย้ายไตรมาส (k)" · แท็บทั้งหมด "จัดเข้าไตรมาส (k)" เมื่อมีคันที่ยังไม่จัดไตรมาส (k = คันที่ยังไม่จัด) */
              ...(q && nTicked ? [<SecondaryButton key="move" Text={"ย้ายไตรมาส (" + nTicked + ")"} Size={mob ? "lg" : "md"} onClick={() => setMove({ cars: tickedIds, to: 0 })} />] : []),
              ...(!q && unassignedTicked.length ? [<SecondaryButton key="assign" Text={"จัดเข้าไตรมาส (" + unassignedTicked.length + ")"} Size={mob ? "lg" : "md"} onClick={() => setAssign({ cars: unassignedTicked, skip: nTicked - unassignedTicked.length, to: 0 })} />] : []),
              addBtn("เพิ่มยานพาหนะ")]} />
          {live && q > 0 && qLocked(q) && <Alert Color="Success" Text={"ไตรมาส " + q + " บำรุงรักษาเสร็จทุกคันแล้ว"} SupportingText="ดูอย่างเดียว เพิ่ม ย้าย เอาออก หรือกำหนดอะไหล่ของยานพาหนะในไตรมาสนี้ไม่ได้" />}
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
      <PopupModal open={move !== null} title={"ย้ายไปไตรมาสอื่น · " + (move ? (move.cars.length === 1 ? CAND[move.cars[0]].plate : move.cars.length + " คัน") : "")}
        sub={move && move.cars.length > 1 ? "ยานพาหนะ " + move.cars.length + " คันและอะไหล่ที่กำหนดไว้จะย้ายไปไตรมาสที่เลือก" : "ยานพาหนะและอะไหล่ที่กำหนดไว้ของยานพาหนะคันนี้จะย้ายไปไตรมาสที่เลือก"} ok="ย้ายยานพาหนะ" okDisabled={!move?.to}
        onCancel={() => setMove(null)} onOk={doMove}>
        <div role="radiogroup" className="flex flex-col gap-3">
          {QUARTERS.map((t, i) => {
            const n = i + 1, off = n === mq || qLocked(n);
            return <RadioTextCard key={t} Text={t} SupportingText={n === mq ? "ไตรมาสปัจจุบัน" : qLocked(n) ? "บำรุงรักษาเสร็จทุกคันแล้ว" : undefined} State={off ? "Disabled" : "Default"} Selected={move?.to === n} onClick={() => !off && move && setMove({ ...move, to: n })} />;
          })}
        </div>
      </PopupModal>
      {/* จัดเข้าไตรมาส (แท็บทั้งหมด · ไฟล์ 34 ข้อ 4) — popup แบบย้ายไปไตรมาสอื่น (Radio text card ไตรมาส 1–4) · คันที่อยู่ในไตรมาสแล้วข้ามไป บอกด้วย Alert Info · ไตรมาสที่เสร็จแล้ว (แผนที่ดำเนินการ) Disabled */}
      <PopupModal open={assign !== null} title={"จัดเข้าไตรมาส · " + (assign?.cars.length ?? 0) + " คัน"} sub="ยานพาหนะที่ยังไม่จัดไตรมาสจะเข้าไตรมาสที่เลือก พร้อมอะไหล่ที่กำหนดไว้" ok="จัดเข้าไตรมาส" okDisabled={!assign?.to}
        onCancel={() => setAssign(null)} onOk={doAssign}>
        <div className="flex flex-col gap-3">
          {!!assign?.skip && <Alert Color="Info" Text={"ยานพาหนะ " + assign.skip + " คันอยู่ในไตรมาสแล้ว ไม่เปลี่ยน"} SupportingText="ย้ายไตรมาสของคันเหล่านั้นได้ที่แท็บไตรมาส" />}
          <div role="radiogroup" className="flex flex-col gap-3">
            {QUARTERS.map((t, i) => {
              const n = i + 1, off = qLocked(n);
              return <RadioTextCard key={t} Text={t} SupportingText={off ? "บำรุงรักษาเสร็จทุกคันแล้ว" : undefined} State={off ? "Disabled" : "Default"} Selected={assign?.to === n} onClick={() => !off && assign && setAssign({ ...assign, to: n })} />;
            })}
          </div>
        </div>
      </PopupModal>
      {/* planCarModal (R111): แท็บทั้งหมด = เข้าแผน · แท็บไตรมาส n = จัดเข้าไตรมาส n จากยานพาหนะในแผนที่ยังไม่จัดไตรมาส */}
      <TripCarPicker open={qAdd} pool={addPool} nowQ={"ไตรมาส " + q} title={q ? "เพิ่มยานพาหนะเข้าไตรมาส " + q : "เพิ่มยานพาหนะเข้าแผน"} okText={q ? "เพิ่มเข้าไตรมาส " + q : "เพิ่มเข้าแผน"}
        sub={q ? "ยานพาหนะในแผนที่ยังไม่จัดไตรมาส" : "ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน"} areaOf={carArea}
        emptyText={!q ? "ยานพาหนะทุกคันอยู่ในแผนแล้ว" : cars.length ? "ยานพาหนะในแผนจัดเข้าไตรมาสครบแล้ว" : "ยังไม่มียานพาหนะในแผน"}
        emptySub={q ? ADD_PLAN_FIRST : "ไม่มียานพาหนะที่เพิ่มเข้าแผนนี้ได้"}
        onCancel={() => setQAdd(false)} onAdd={addCars} />
      <RowMenu anchor={carMenu?.anchor ?? null} items={carItems} onClose={() => setCarMenu(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}
