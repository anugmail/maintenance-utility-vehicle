"use client";
/* แสดง Notification (toast) ที่สั่งด้วย notify() ใน lib/mock/store — ปิดเองหลัง 4 วินาที หรือกดปิด
   ตำแหน่ง (เจ้าของงานยืนยัน 5 พ.ย. 2569 R60 "toast ต้องแสดงด้านมุมบนขวามือเสมอเลย"): มุมบนขวาเสมอทั้ง desktop และมือถือ ไม่อยู่กลาง ไม่อยู่ล่าง
   notify() ใน core.js — Desktop: Notification วางชิดขอบบนขวา ขอบนอกบน 24 ขวา 24 · Mobile: จัดการ์ดบนขวา ขอบ 16
   ชั้นสูงกว่าแถบต้นแบบและ Header navigation (z-[60]) — ไม่ถูกแถบบนบัง · กำหนดที่นี่ที่เดียว (Notification floating=false) */
import { useEffect } from "react";
import { Notification } from "@/components/vms/Notification";
import { clearToast, useToast } from "@/lib/mock/store";

export function ToastHost() {
  const t = useToast();
  useEffect(() => {
    if (!t) return;
    const h = setTimeout(clearToast, 4000);
    return () => clearTimeout(h);
  }, [t]);
  if (!t) return null;
  return (
    <div data-toast className="pointer-events-none fixed top-4 right-4 left-4 z-[60] flex justify-end md:top-6 md:right-6 md:left-auto">
      <div className="pointer-events-auto w-full animate-fade-in md:w-[400px]"><Notification key={t.id} Type={t.Type} Text={t.Text} onClose={clearToast} floating={false} /></div>
    </div>
  );
}
