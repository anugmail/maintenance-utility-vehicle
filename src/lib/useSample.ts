"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { setRole, type Role } from "@/lib/mock/store";

export type SampleMap = Record<string, { role?: Role; apply: () => void }>;

export function useSample(map: SampleMap) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const done = useRef(false);
  const sample = sp.get("sample");
  useEffect(() => {
    if (!sample || done.current) return;
    const m = map[sample];
    done.current = true;
    if (m) { m.apply(); if (m.role) setRole(m.role); }
    const q = new URLSearchParams(sp.toString());
    q.delete("sample");
    router.replace(path + (q.toString() ? "?" + q.toString() : ""));
  }, [sample, map, sp, router, path]);
  return !!sample && !done.current;
}
