"use client";
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
