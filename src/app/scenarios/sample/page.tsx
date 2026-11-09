"use client";
/* หน้าของต้นแบบ (ไม่ใช่จอของระบบ): เปิด scenario จากหน้า /scenarios/ ที่จุดเริ่มของ scenario นั้น — ใส่แผนตัวอย่าง MRZ7000004 (NEW_PLAN + EDIT_FORM ของ screens.js)
   ในสถานะที่ scenario ใช้ · ตั้งบทบาท · แล้วพาไปหน้าแรกของ scenario
   ?plan=review|returned|approved (acked= ของ S22 เอาออก 6 พ.ย. 2569) · ?draft=1 (ฟอร์มสร้างแผนที่จัดรถ 6 คันแล้ว ยังไม่เลือกอะไหล่ — S21 T.1) · ?role=<บทบาท> · ?go=<หน้า>
   แผน Z7000004 เดิม (ถ้ามี) ถูกแทนที่ · ดู figma-spec/COMPOSED.md */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type { PlanStatus } from "@/lib/mock/data";
import { samplePlan, sampleDraft } from "@/lib/mock/planFlow";
import { ROLES, setMock, setRole, type Role } from "@/lib/mock/store";

function Sample() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const st = sp.get("plan") as PlanStatus | null, role = sp.get("role") as Role | null;
    if (role && (ROLES as readonly string[]).includes(role)) setRole(role);
    setMock((s) => {
      let n = { ...s };
      if (st) { const p = samplePlan(st); n = { ...n, plans: [p, ...n.plans.filter((x) => x.mr !== p.mr)], retiredMr: (n.retiredMr ?? []).filter((m) => m !== p.mr), edit: null }; }
      if (sp.get("draft")) n = { ...n, draft: sampleDraft() };
      return n;
    });
    const go = sp.get("go") ?? "/";
    router.replace(go.startsWith("/") ? go : "/");
  }, [sp, router]);
  return <p className="p-4 text-sm text-gray-600">กำลังเปิด scenario</p>;
}

export default function Page() {
  return <Suspense><Sample /></Suspense>;
}
