import type { GuideStep } from "./types";

const slash = (p: string) => (p.endsWith("/") ? p : p + "/");

export function matchAt(at: string, path: string, search: string): boolean {
  const [p, q = ""] = at.split("?");
  if (slash(path) !== slash(p)) return false;
  const have = new URLSearchParams(search);
  for (const [k, v] of new URLSearchParams(q)) {
    const h = have.get(k);
    if (h === null || (v !== "*" && h !== v)) return false;
  }
  return true;
}

export const hrefOf = (s: GuideStep) => s.href ?? s.at;
