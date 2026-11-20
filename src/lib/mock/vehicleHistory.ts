import { useMemo } from "react";
import { CAND } from "./data";
import { jobsOf } from "./jobs";
import { useMock, type MockState } from "./store";

export const NO_HIST = "ไม่มีข้อมูล";
const id = (plate: string) => plate.split(" ")[0];
const pad = (n: number) => String(n).padStart(2, "0");
const MA_LAST: Record<string, string> = {
  "80-4458": "01/10/2568", "80-5738": "14/10/2568", "80-3316": "20/11/2568", "80-9981": "10/01/2569", "82-7720": "02/02/2569", "82-1145": "18/06/2569", "81-6604": "20/09/2569",
  "81-2210": NO_HIST, "82-6789": NO_HIST,
};
const REPAIR_LAST: Record<string, string> = { "82-1145": "02/09/2569" };
const date = (d: number, m: number, y: number) => pad(d) + "/" + pad(y === 2569 && m > 10 ? m - 6 : m) + "/" + y;
const maOf = (i: number) => (i % 9 === 4 ? NO_HIST : date(1 + ((i * 11) % 28), 1 + ((i * 7) % 12), 2567 + (i % 3)));
const repairOf = (i: number) => (i % 5 === 2 ? NO_HIST : date(1 + ((i * 13) % 28), 1 + ((i * 5) % 12), 2566 + (i % 4)));

export const LAST_MA: string[] = CAND.map((c, i) => MA_LAST[id(c.plate)] ?? maOf(i));
export const LAST_REPAIR: string[] = CAND.map((c, i) => REPAIR_LAST[id(c.plate)] ?? repairOf(i));
const byId = new Map(CAND.map((c, i) => [id(c.plate), i]));
export const lastMaOf = (plate: string) => { const i = byId.get(id(plate)); return i != null ? LAST_MA[i] : MA_LAST[id(plate)] ?? NO_HIST; };
export const lastRepairOf = (plate: string) => { const i = byId.get(id(plate)); return i != null ? LAST_REPAIR[i] : REPAIR_LAST[id(plate)] ?? NO_HIST; };
const dayOf = (s: string) => { const [d, m, y] = s.slice(0, 10).split("/").map(Number); return Date.UTC(y - 543, m - 1, d); };
const isDate = (s?: string): s is string => !!s && /^\d{2}\/\d{2}\/\d{4}/.test(s);
export interface MachineDates { ma: string; repair: string }
export function machineDates(m: MockState): (plate: string) => MachineDates {
  const closed = new Map<string, string>();
  Object.values(jobsOf(m).jobs).forEach((j) => {
    if (j.status !== "done" || !j.closedAt) return;
    const d = j.closedAt.slice(0, 10), cur = closed.get(j.carId);
    if (isDate(d) && (!cur || dayOf(d) > dayOf(cur))) closed.set(j.carId, d);
  });
  return (plate) => {
    const base = lastMaOf(plate), job = closed.get(id(plate));
    return { ma: job && (!isDate(base) || dayOf(job) > dayOf(base)) ? job : base, repair: lastRepairOf(plate) };
  };
}
export function useMachineDates() { const m = useMock(); return useMemo(() => machineDates(m), [m]); }
export const histText = (d: MachineDates) => "บำรุงรักษาเครื่องจักรล่าสุด " + d.ma + " · ซ่อมเครื่องจักรล่าสุด " + d.repair;
export const MA_HEAD = "บำรุงรักษาเครื่องจักรล่าสุด", REPAIR_HEAD = "ซ่อมเครื่องจักรล่าสุด";
