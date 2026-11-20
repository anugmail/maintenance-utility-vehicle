"use client";
import { clearToast, resetMock, setRole } from "@/lib/mock/store";
import { hrefOf } from "./match";
import { setGuide } from "./session";
import type { GuideCase } from "./types";

export const GUIDE_MENU = "/guide/";
const fromQ = (from?: string | null) => (from === "menu" ? "&from=menu" : "");
export const startHref = (caseId: string, from?: string | null) => "/scenarios/guide/start/?case=" + encodeURIComponent(caseId) + fromQ(from);
export const scenarioHref = (key: string, from?: string | null) => "/scenarios/guide/?s=" + encodeURIComponent(key) + fromQ(from);

export function startCase(c: GuideCase, from?: string | null): string {
  resetMock();
  c.seed();
  setRole(c.role);
  clearToast();
  setGuide(from === "menu" ? { case: c.id, step: 0, from: "menu" } : { case: c.id, step: 0 });
  return hrefOf(c.steps[0]);
}
