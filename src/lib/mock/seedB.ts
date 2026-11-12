"use client";
/* เปิด scenario จากหน้า /scenarios/ ที่จุดเริ่มของ scenario นั้น (batch B) — ลิงก์ส่ง ?seed=<S> มา ⇒ ตั้งข้อมูลจำลอง + บทบาท แล้วลบ seed ออกจาก URL
   ไม่ใช่ฟีเจอร์ของระบบ (มีเฉพาะต้นแบบ · ไม่มีอะไรแสดงบนจอ) */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { seedDash } from "./partsDash";
import { applySample } from "./jobs";
import { setMock, setRole, type Role } from "./store";
import { DEFAULT_NOTIS, DEFAULT_TRIPS, TRIP_1, TRIP_OTHER, TRIP_V, approvalNotis, type Trip } from "./trips";

const approved = (t: Trip): Trip => ({ ...t, status: "approved", approvedAt: "04/11/2569" });

export const SEEDS: Record<string, { role: Role; run: () => void }> = {
  S4: { role: "กบค.", run: seedDash },   // แดชบอร์ด /parts/ (6 พ.ย. 2569) ตัวเลขเป็นค่าสมมติของจอ (lib/mock/partsDash.ts) · ใส่แผน MRZ7000004 อนุมัติแล้วให้ปุ่ม › เปิดหน้าไตรมาสได้
  /* ตั้งแผนเดินทางใหม่ทั้งชุด = ล้างงานรายคัน (jobs.ts) ของใบเดิมด้วย — ที่เก็บแผนเดินทางมีที่เดียว ใบที่อนุมัติแล้วเปิดหน้างานรายคันได้ทันที */
  S6: { role: "หน่วยงาน (กบผ.)", run: () => setMock((s) => ({ ...s, trips: DEFAULT_TRIPS(), jobs: undefined })) },
  S9: { role: "หน่วยงาน (กบผ.)", run: () => setMock((s) => ({ ...s, trips: [approved(TRIP_1), { ...TRIP_OTHER }], jobs: undefined })) },
  /* S18 ต้นทุน (R92): ใบ T1 ปิดงาน 3 คัน + บำรุงรักษาไม่ได้ 1 คัน (jobs.ts T1_cost) */
  S18: { role: "หน่วยงาน (กบผ.)", run: () => applySample("T1_cost") },
  S7: { role: "ผู้อนุมัติ", run: () => setMock((s) => ({ ...s, trips: [{ ...TRIP_1 }, { ...TRIP_V }, { ...TRIP_OTHER }], jobs: undefined })) },
  S8: { role: "กรย.", run: () => setMock((s) => ({ ...s, trips: [approved(TRIP_1), { ...TRIP_OTHER }], jobs: undefined, notis: [...approvalNotis(approved(TRIP_1)), ...DEFAULT_NOTIS()] })) },
};

export function useSeed() {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const seed = sp.get("seed");
  useEffect(() => {
    if (!seed || !SEEDS[seed]) return;
    SEEDS[seed].run();
    setRole(SEEDS[seed].role);
    const q = new URLSearchParams(sp.toString());
    q.delete("seed");
    router.replace(path + (q.size ? "?" + q.toString() : ""));
  }, [seed, sp, router, path]);
  return !!seed;
}
