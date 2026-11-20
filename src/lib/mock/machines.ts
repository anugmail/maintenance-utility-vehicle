"use client";
import { useMemo } from "react";
import { CAND, machineOf, type Car } from "./data";
import { hasEquipment, sideCodeOf } from "./vehicleTypes";
import { setMock, useMock, type MockState } from "./store";

declare module "./store" {
  interface MockState { machines?: Record<string, Machine[]> }
}

export const MACHINE_TYPES = ["กระเช้า", "เครน", "ถังฉีดน้ำ", "สว่านขุดเจาะ", "หัวจับเสา", "อื่นๆ"] as const;
export const NO_LIFT = ["ถังฉีดน้ำ", "อื่นๆ"];
export const LIFT_UNIT = "กก.";

export interface Machine {
  key: string; type: string; brand: string; model: string;
  asset: string; subAsset: string;
  lift?: number; hc?: string; serial?: string; engineNo?: string;
  engineHours: number; craneHours: number;
}

const idOf = (plate: string) => plate.split(" ")[0];
const digits = (plate: string) => idOf(plate).replace(/\D/g, "").padStart(6, "0").slice(-6);
const typeOfModel = (m: string) => (/ถังฉีดน้ำ/.test(m) ? "ถังฉีดน้ำ" : /เครน/.test(m) ? "เครน" : /กระเช้า/.test(m) ? "กระเช้า" : "อื่นๆ");
const PREFILL = ["09", "08", "10"];
export function defaultMachines(car: Car, i: number): Machine[] {
  const code = sideCodeOf(car);
  if (!hasEquipment(code) || !PREFILL.includes(code)) return [];
  const mc = machineOf(car.model), type = typeOfModel(car.model);
  const d = digits(car.plate);
  return [{
    key: "m1", type, brand: mc.brand === "-" ? "" : mc.brand, model: mc.model === "-" ? "" : mc.model,
    asset: "500000" + d, subAsset: "0001",
    lift: NO_LIFT.includes(type) ? undefined : /Tadano/.test(car.model) ? 300 : 200,
    hc: type === "กระเช้า" || type === "เครน" ? "HC - " + d.slice(-4) : undefined,
    engineHours: 2000 + ((i * 397) % 6000), craneHours: 800 + ((i * 211) % 3000),
  }];
}
const INDEX = new Map(CAND.map((c, i) => [idOf(c.plate), i]));

export function machinesOf(m: MockState, carId: string, car?: Car): Machine[] {
  const saved = m.machines?.[carId];
  if (saved) return saved;
  const i = INDEX.get(carId);
  const c = car ?? (i != null ? CAND[i] : undefined);
  return c ? defaultMachines(c, i ?? 0) : [];
}
export function useMachines(carId: string, car?: Car) { const m = useMock(); return useMemo(() => machinesOf(m, carId, car), [m, carId, car]); }

export function usedAssets(m: MockState, except?: { carId: string; key: string }): Set<string> {
  const out = new Set<string>();
  const ids = new Set([...INDEX.keys(), ...Object.keys(m.machines ?? {})]);
  ids.forEach((id) => machinesOf(m, id).forEach((x) => { if (!(except && except.carId === id && except.key === x.key)) out.add(x.asset + "-" + x.subAsset); }));
  return out;
}
export function saveMachine(carId: string, car: Car | undefined, x: Machine) {
  setMock((s) => {
    const list = machinesOf(s, carId, car);
    const next = list.some((y) => y.key === x.key) ? list.map((y) => (y.key === x.key ? x : y)) : [...list, x];
    return { ...s, machines: { ...s.machines, [carId]: next } };
  });
}
export const nf0 = (n?: number) => (n == null ? "-" : n.toLocaleString("en-US"));
