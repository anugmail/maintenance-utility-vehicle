import type { TableColumn, TableValue } from "@/components/vms/Table";
import { typeOf } from "./data";

export const UNIT_COL = "หน่วยงานเจ้าของยานพาหนะ";
export const TRIP_V_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 150, Style: "Lead text" }, { head: "ประเภทยานพาหนะ", width: 120 }, { head: "ยี่ห้อ/รุ่น" }, { head: UNIT_COL, width: 140 },
  { head: "เบอร์ติดต่อ", width: 160 }, { head: "สถานที่บำรุงรักษา", width: 190 }, { head: "วันดำเนินการ", width: 180 },
];
export interface TripVOpts { drop?: string[]; unitSub?: boolean }
export const tripVCols = (o: TripVOpts = {}): TableColumn[] =>
  TRIP_V_COLS.filter((c) => !(o.drop ?? []).includes(c.head) && !(o.unitSub && c.head === UNIT_COL));

export interface VCar { id: string; plate: string; model: string; owner: string; ctrl: string; phone: string }
export interface VTrip { d1?: string; d2?: string; works?: Record<string, [string, string]>; locs?: Record<string, string>; phones?: Record<string, string>; names?: Record<string, string>; hire?: boolean }

export const rangeName = (t: VTrip) => (t.hire ? "ช่วงวันทำงาน" : "ช่วงวันเดินทาง");
export const workOf = (t: VTrip, id: string): [string, string] => t.works?.[id] ?? [t.d1 ?? "", t.d2 ?? ""];
export const tripWork = (t: VTrip, id: string) => { const w = workOf(t, id); return w[0] + " – " + w[1]; };
export const workCell = (t: VTrip, id: string): TableValue => (t.d1 && t.d2 ? { text: tripWork(t, id), sub: (t.works?.[id] ? "แก้จาก" : "ค่าเริ่มต้น ") + rangeName(t) } : "—");

export function tripVCells(c: VCar, t: VTrip, o: TripVOpts = {}): TableValue[] {
  const loc = t.locs?.[c.id];
  const cell: Record<string, TableValue> = {
    "ทะเบียน": o.unitSub ? { text: c.plate, sub: c.owner } : c.plate,
    "ประเภทยานพาหนะ": typeOf(c.model),
    "ยี่ห้อ/รุ่น": c.model,
    [UNIT_COL]: c.owner,
    "เบอร์ติดต่อ": { text: t.phones?.[c.id] || c.phone || "-", sub: t.names?.[c.id] || c.ctrl || "-" },
    "สถานที่บำรุงรักษา": { text: loc || "สำนักงาน " + c.owner, sub: loc ? "แก้จากสำนักงานเจ้าของยานพาหนะ" : "ค่าเริ่มต้น สำนักงานที่ยานพาหนะอยู่" },
    "วันดำเนินการ": workCell(t, c.id),
  };
  return tripVCols(o).map((col) => cell[col.head]);
}
