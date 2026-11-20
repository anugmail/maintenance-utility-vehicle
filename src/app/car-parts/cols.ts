import type { TableColumn } from "@/components/vms/Table";

export const CARP_PART_COLS: TableColumn[] = [
  { head: "ชื่อ", Style: "Lead text" }, { head: "ยี่ห้อ", width: 140 }, { head: "รุ่น", width: 160 }, { head: "รหัส", width: 130 },
  { head: "จำนวน", width: 90 }, { head: "หน่วย", width: 90 }, { head: "", width: 104, Style: "Action icons" },
];
