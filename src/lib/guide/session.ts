"use client";
import { useSyncExternalStore } from "react";

export const GUIDE_KEY = "mt-guide-v1";
export interface GuideState { case: string; step: number; from?: "menu" }

let cur: GuideState | null | undefined;
const subs = new Set<() => void>();

function load(): GuideState | null {
  if (cur !== undefined) return cur;
  try {
    const raw = window.sessionStorage.getItem(GUIDE_KEY);
    const j = raw ? (JSON.parse(raw) as GuideState) : null;
    cur = j && typeof j.case === "string" && Number.isInteger(j.step) && j.step >= 0 ? j : null;
  } catch {
    cur = null;
  }
  return cur;
}

export function useGuide(): GuideState | null {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, load, () => null);
}

export function setGuide(g: GuideState | null) {
  cur = g;
  try {
    if (g) window.sessionStorage.setItem(GUIDE_KEY, JSON.stringify(g));
    else window.sessionStorage.removeItem(GUIDE_KEY);
  } catch { }
  subs.forEach((f) => f());
}
