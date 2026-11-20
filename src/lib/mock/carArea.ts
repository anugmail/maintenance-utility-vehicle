import { CAND, dCode, regionOf } from "./data";

export interface PickerArea { region: string; district: string; type: string }
const NONE: PickerArea = { region: "", district: "", type: "" };
const BY_PLATE = new Map(CAND.map((c): [string, PickerArea] => [c.plate, { region: regionOf(c), district: dCode(c), type: c.type }]));

export const carArea = (c: { plate: string }): PickerArea => BY_PLATE.get(c.plate) ?? NONE;
