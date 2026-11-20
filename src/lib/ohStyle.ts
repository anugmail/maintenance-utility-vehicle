"use client";
import { useSyncExternalStore } from "react";

const OH_KEY = "mt-next-v1:oh-style";
let on: boolean | null = null;
const subs = new Set<() => void>();
function load(): boolean {
  if (on !== null) return on;
  try { on = window.localStorage.getItem(OH_KEY) !== "0"; } catch { on = true; }
  return on;
}
export function useOhStyle(): boolean {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, load, () => true);
}
export function setOhStyle(v: boolean) {
  on = v;
  try { window.localStorage.setItem(OH_KEY, v ? "1" : "0"); } catch { }
  subs.forEach((f) => f());
}
