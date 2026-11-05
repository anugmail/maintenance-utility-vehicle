"use client";
/* หน้าของต้นแบบ (ไม่ใช่จอของระบบ): เริ่มเคสของโหมดพาดูทีละเรื่อง ?case=<รหัสเคส> — ล้างข้อมูลจำลอง ใส่ข้อมูลของเคส ตั้งบทบาท แล้วพาไปหน้าแรกของเคส
   แบบเดียวกับ /scenarios/sample/ · ไม่มีเคสนี้ → กลับหน้ารายการ scenario */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { findCase } from "@/lib/guide/scenarios";
import { startCase } from "@/lib/guide/start";

function Start() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const f = findCase(sp.get("case"));
    router.replace(f ? startCase(f.c) : "/scenarios/");
  }, [sp, router]);
  return <p className="p-4 text-sm text-gray-600">กำลังเปิดเคส</p>;
}

export default function Page() {
  return <Suspense><Start /></Suspense>;
}
