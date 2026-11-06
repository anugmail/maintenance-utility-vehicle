"use client";
/* ประวัติงานบำรุงรักษาของแผน (S15 · S16 · S17) จากงานรายคันจริง (jobs.ts) — แทนแถวตัวอย่าง HIST_ROWS / PROGRESS_DONE / reportSummary คงที่ (BACKLOG ข้อ 6)
   รถของแผน = รถในแผนเดินทางที่อนุมัติแล้วของแผน (ไม่มีใบ = จำนวนรถของแผน) · 1 แถว = 1 คันที่ "เสร็จสิ้น" หรือ "บำรุงรักษาไม่ได้"
   ช่องตาม HIST_COLS ของ screens.js: ทะเบียน · วันที่ทำ · งานที่ทำ · อะไหล่ที่ใช้ (รวมตามหน่วย) · ผลน้ำมัน · ผู้ทำ · การยอมรับ */
import type { PillColor } from "@/components/vms/PillOutline";
import type { TableValue } from "@/components/vms/Table";
import { ACC } from "./closeout";
import type { Plan } from "./data";
import { carOf, closeRows, getJob, jobsOf, nf, oilSampled, WSTAT, type Job } from "./jobs";
import type { MockState } from "./store";

const dkey = (d: string) => d.split("/").reverse().join("");
const OIL_PILL: [string, PillColor][] = [["ผ่าน", "Success"], ["ไม่ผ่าน", "Error"]];

export interface PlanHistory {
  total: number; done: number; cannot: number; todo: number; accepted: number;
  rows: TableValue[][]; trips: number;
  partsUsed: number; partsReturned: number; oilPass: number; oilFail: number; range: string;
}

function usedSummary(j: Job): string {
  if (!j.close) return "-";
  const by = new Map<string, number>();
  closeRows(j.close).filter((r) => r.used > 0).forEach((r) => by.set(r.unit, (by.get(r.unit) ?? 0) + r.used));
  return [...by].map(([u, n]) => nf(n) + " " + u).join(" · ") || "-";
}
function workText(j: Job): string {
  if (j.status === "cannot") return WSTAT.cannot[0];
  if (!j.close) return "-";
  const task = (part: string) => j.parts.find((p) => p.part === part)?.task ?? part;
  return closeRows(j.close).filter((r) => r.used > 0).map((r) => task(r.part)).join(" · ") || "-";
}

export function planHistory(m: MockState, plan: Plan): PlanHistory {
  const s = jobsOf(m), planId = plan.mr.replace(/^MR /, "");
  const trips = Object.values(s.trips).filter((t) => t.planId === planId);
  const cars = trips.flatMap((t) => t.carIds.map((id) => ({ t, id, j: getJob(s, t.id, id) })));
  const fin = cars.filter((x) => x.j.status === "done" || x.j.status === "cannot");
  const rows: TableValue[][] = fin.map(({ id, j }) => {
    const c = carOf(id);
    const date = (j.status === "cannot" ? j.cannot?.at : j.closedAt)?.slice(0, 10) ?? "-";
    const r = j.oilResult, oil = j.status === "done" && oilSampled(j.close?.oilChoice ?? j.oilChoice) && r && r.sel >= 0 ? [OIL_PILL[r.sel]] : [];
    const by = (j.status === "cannot" ? j.cannot?.by : j.recordedBy) ?? "-";
    return [c?.plate ?? id, date, workText(j), j.status === "cannot" ? "-" : usedSummary(j), { pills: oil }, by.replace(/ \((กบค\.|ผู้รับจ้าง)\)$/, "") /* "(ผู้รับจ้าง)" = งานเก่าในที่เก็บก่อนตัด S23 */, { pills: [j.acceptedAt ? ACC.ok : ACC.wait] }];
  });
  const done = fin.filter((x) => x.j.status === "done");
  const parts = new Set<string>(), back = new Set<string>();
  done.forEach(({ j }) => j.close && closeRows(j.close).forEach((p) => { if (p.used > 0) parts.add(p.part); if (p.planQty - p.used > 0) back.add(p.part); }));
  const dates = fin.map((x) => (x.j.status === "cannot" ? x.j.cannot?.at : x.j.closedAt)?.slice(0, 10)).filter((d): d is string => !!d).sort((a, b) => dkey(a).localeCompare(dkey(b)));
  const total = cars.length || plan.cars;
  return {
    total, done: done.length, cannot: fin.length - done.length, todo: total - fin.length, accepted: fin.filter((x) => !!x.j.acceptedAt).length,
    rows, trips: trips.length, partsUsed: parts.size, partsReturned: back.size,
    oilPass: done.filter((x) => x.j.oilResult?.sel === 0).length, oilFail: done.filter((x) => x.j.oilResult?.sel === 1).length,
    range: !dates.length ? "-" : dates[0] === dates[dates.length - 1] ? dates[0] : dates[0] + " – " + dates[dates.length - 1],
  };
}

/* สรุปรายงานผลการบำรุงรักษา (S17 reportScreen) — 8 คู่ตามจอ */
export const reportSummary = (h: PlanHistory): [string, string][] => [
  ["ยานพาหนะตามแผน", h.total + " คัน"], ["บำรุงรักษาแล้ว", h.done + " คัน"], ["ทำไม่ได้", h.cannot + " คัน"], ["ใบเดินทาง", h.trips + " ใบ"],
  ["อะไหล่ที่ใช้", h.partsUsed + " รายการ · คืนคลัง " + h.partsReturned + " รายการ"], ["ผลน้ำมันไฮโดรลิก", "ผ่าน " + h.oilPass + " · ไม่ผ่าน " + h.oilFail],
  ["หน่วยงานยอมรับผล", h.accepted + " / " + h.total + " คัน"], ["ช่วงดำเนินการ", h.range],
];
