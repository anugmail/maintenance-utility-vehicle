/* CARP_PART_COLS ของ screens.js — ตารางอะไหล่อื่นๆ ของยานพาหนะ 1 คัน: ชื่อ · ยี่ห้อ · รุ่น · รหัส · จำนวน · หน่วย · ไอคอนแก้ไข ลบ
   ใช้ร่วม S21 จัดการอะไหล่ของยานพาหนะ (/car-parts/ · มีไอคอน) และ ดูอะไหล่ของยานพาหนะ (/car-parts/view/ · carPartsView ใช้ 6 คอลัมน์แรก ไม่มีไอคอน) */
import type { TableColumn } from "@/components/vms/Table";

export const CARP_PART_COLS: TableColumn[] = [
  { head: "ชื่อ", Style: "Lead text" }, { head: "ยี่ห้อ", width: 140 }, { head: "รุ่น", width: 160 }, { head: "รหัส", width: 130 },
  { head: "จำนวน", width: 90 }, { head: "หน่วย", width: 90 }, { head: "", width: 104, Style: "Action icons" },
];
