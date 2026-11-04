"use client";
/* Breakpoint ของไลบรารี: Desktop / Mobile — จอกว้างน้อยกว่า 768 ใช้แบบ Mobile (กติกา core.js "ใช้กับจอ < 768 (รวม tablet)")
   component ที่มี variant Breakpoint ใช้ค่านี้เมื่อไม่ได้ส่ง prop Breakpoint มาเอง */
import { useSyncExternalStore } from "react";

export type Breakpoint = "Desktop" | "Mobile";
const QUERY = "(max-width: 767.98px)";

function subscribe(cb: () => void) {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

export function useBreakpoint(override?: Breakpoint): Breakpoint {
  const mobile = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  return override ?? (mobile ? "Mobile" : "Desktop");
}
