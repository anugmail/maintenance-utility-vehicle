import type { Car } from "./data";

export interface RefVehicleType { code: string; name: string; hasEquipment: boolean }
export const REF_VEHICLE_TYPE: RefVehicleType[] = [
  { code: "04", name: "ประเภท 04", hasEquipment: true },
  { code: "06", name: "ประเภท 06", hasEquipment: false },
  { code: "07", name: "ประเภท 07", hasEquipment: true },
  { code: "08", name: "ประเภท 08", hasEquipment: true },
  { code: "09", name: "ประเภท 09", hasEquipment: true },
  { code: "10", name: "ประเภท 10", hasEquipment: true },
];
const BY_CODE = new Map(REF_VEHICLE_TYPE.map((r) => [r.code, r]));
export const refTypeOf = (code: string) => BY_CODE.get(code);
export const hasEquipment = (code: string) => !!BY_CODE.get(code)?.hasEquipment;

const OVERRIDE: Record<string, string> = { "81-2210": "04", "80-4458": "06" };
const SPREAD = ["04", "07", "08", "10"];
const BOOM = /กระเช้า/;
export function sideCodeOf(c: Pick<Car, "plate" | "model">): string {
  const id = c.plate.split(" ")[0];
  if (OVERRIDE[id]) return OVERRIDE[id];
  if (!BOOM.test(c.model)) return "06";
  if (/^[679]/.test(id)) { const n = Number(id.replace(/\D/g, "")); if (n % 9 === 0) return SPREAD[Math.floor(n / 9) % 4]; }
  return "09";
}
