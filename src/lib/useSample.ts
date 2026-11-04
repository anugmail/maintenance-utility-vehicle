"use client";
/* ?sample=<ชื่อ> จากหน้า /scenarios/ (ของต้นแบบเท่านั้น) → ใส่ข้อมูลตั้งต้นของ scenario + สลับบทบาท ครั้งเดียว แล้วเอา sample ออกจาก URL (คงพารามิเตอร์อื่น)
   คืน true ระหว่างรอใส่ข้อมูล (หน้าไม่ต้องวาดค่าเก่าก่อน) · map ต้องเป็นค่าคงที่ระดับไฟล์ */
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
