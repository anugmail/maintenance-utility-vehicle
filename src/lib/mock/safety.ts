"use client";
import { useMemo } from "react";
import { CAND, type Car, type CarStatus } from "./data";
import type { PillColor } from "@/components/vms/PillOutline";
import { jobsOf } from "./jobs";
import { sideCodeOf } from "./vehicleTypes";
import type { UploadFile } from "@/components/vms/FileUpload";
import { MA_DUE, MA_VSTAT, TODAY, addMonths, baseSafetyOf, dayOf, maCars, thaiDate, type DueStatus, type DueTone } from "./maintenance";
import { latestUpload, safetyUploads, type SafetyCycle, type SafetyRec, type SafetyResult } from "./safetyStore";
import { useMock, type MockState } from "./store";
import { CARETAKER, carOf } from "./trips";

export const SAFETY_TITLE = "การตรวจ ปจ.2";
export const SAFETY_HREF = "/safety/";
export const popupHref = (carId: string) => "/safety/?car=" + carId;
const idOf = (plate: string) => plate.split(" ")[0];
export const SAFETY_TYPE_CODE = "09";
export const peaTypeOf = (c: Car) => sideCodeOf(c);
export const peaIdOf = (c: Car) => c.owner.split(" ")[0].replace("กฟ", "") + "-" + peaTypeOf(c) + "-" + (idOf(c.plate).split("-")[1] ?? "0000").padStart(4, "0");

const pad = (n: number) => String(n).padStart(2, "0");
const seedDate = (i: number) => { const y = 2567 + (i % 3), m = 1 + ((i * 5) % 12); return pad(1 + ((i * 7) % 28)) + "/" + pad(y === 2569 && m > 10 ? m - 6 : m) + "/" + y; };
const CYCLE_OF = (i: number): SafetyCycle => (i % 5 === 0 ? 3 : i % 5 === 1 ? 6 : 12);
const shortDate = (i: number, cycle: number) => { const back = cycle === 3 ? 1 + (i % 4) : 2 + (i % 7); const t = addMonths(TODAY, -back) - ((i * 3) % 27) * 86400000; return thaiDate(t); };
const seedOf = (i: number): { date: string; result: SafetyResult; cycle: SafetyCycle } | undefined => {
  if (i % 7 === 3) return undefined;
  const cycle = CYCLE_OF(i);
  return { date: cycle === 12 ? seedDate(i) : shortDate(i, cycle), result: i % 23 === 7 ? 2 : i % 11 === 5 ? 1 : 0, cycle };
};
export const daysLeft = (due: number) => Math.round((due - TODAY) / 86400000);
export const NEAR_DAYS = 30;
const safetyStatus = (due: number): DueStatus | undefined => { const d = daysLeft(due); return d < 0 ? "over" : d <= NEAR_DAYS ? "near" : undefined; };

export const CAR_VSTAT: Record<CarStatus, [string, PillColor]> = { ok: MA_VSTAT.ok, repair: MA_VSTAT.repair, transfer: ["โอนย้าย", "Info"], dispose: ["จำหน่าย", "Gray"] };
export const VSTAT_OPTS = [...new Set([...Object.values(MA_VSTAT), ...Object.values(CAR_VSTAT)].map((p) => p[0]))];

export interface SafetyCar {
  car: Car; id: string; peaId: string;
  vstat: [string, PillColor];
  last?: string; result?: SafetyResult; due?: number; status?: DueStatus;
  cycle?: SafetyCycle;
  uploads: SafetyRec[];
  base?: { date: string; result?: SafetyResult; cycle?: SafetyCycle; fromJob?: boolean; files?: UploadFile[] };
}

export function safetyCars(m: MockState, owner = false): SafetyCar[] {
  const s24 = new Map(maCars(m).map((c) => [c.car.id, c]));
  const jobFiles = new Map(Object.values(jobsOf(m).jobs).filter((j) => j.closedAt).map((j) => [j.carId + "|" + j.closedAt!.slice(0, 10), j.safety?.files ?? j.close?.safetyFiles ?? []]));
  return CAND.flatMap((car, i): SafetyCar[] => {
    if (peaTypeOf(car) !== SAFETY_TYPE_CODE || (owner && carOf(idOf(car.plate))?.ctrl !== CARETAKER)) return [];
    const id = idOf(car.plate), up = latestUpload(m, id), ma = s24.get(id);
    let base: SafetyCar["base"];
    if (ma) {
      const rec = ma.records.filter((r) => r.safety).sort((x, y) => dayOf(y.date) - dayOf(x.date))[0], b0 = baseSafetyOf(id);
      const d = rec && (!b0 || dayOf(rec.date) >= dayOf(b0)) ? rec.date : b0;
      const job = !!rec?.fromJob && rec.date === d;
      base = d ? { date: d, result: job ? undefined : 0, cycle: 12, fromJob: job, files: job ? jobFiles.get(id + "|" + d) : undefined } : undefined;
    } else { const sd = seedOf(i); base = sd && { date: sd.date, result: sd.result, cycle: sd.cycle }; }
    let last = base?.date, result = base?.result, cycle = base?.cycle;
    if (up && (!last || dayOf(up.date) >= dayOf(last))) { last = up.date; result = up.result; cycle = up.cycle ?? 12; }
    const due = last ? addMonths(dayOf(last), cycle ?? 12) : undefined;
    return [{ car, id, peaId: peaIdOf(car), vstat: ma ? MA_VSTAT[ma.vstat] : CAR_VSTAT[car.status], base, last, result, cycle: last ? cycle ?? 12 : undefined, due, status: due == null ? undefined : safetyStatus(due), uploads: safetyUploads(m, id) }];
  }).sort((a, b) => (a.due ?? Infinity) - (b.due ?? Infinity) || a.car.plate.localeCompare(b.car.plate));
}
export function useSafetyCars(owner: boolean) { const m = useMock(); return useMemo(() => safetyCars(m, owner), [m, owner]); }

export const countdown = (due: number) => { const d = daysLeft(due); return d > 0 ? "เหลือ " + d + " วัน" : d === 0 ? "ครบกำหนดวันนี้" : "เลยกำหนด " + -d + " วัน"; };
export const dueCell = (c: SafetyCar): { text: string; sub?: string; tone?: DueTone } | string =>
  c.due == null ? "-" : { text: thaiDate(c.due), sub: countdown(c.due), tone: c.status ? MA_DUE[c.status][1] : undefined };
export function safetyDueMatch(c: SafetyCar, v: string, opts: readonly string[]) {
  if (c.due == null) return false;
  if (v === opts[0]) return c.status === "over";
  const n = v === opts[1] ? 1 : v === opts[2] ? 3 : 6;
  return c.due <= addMonths(TODAY, n);
}
