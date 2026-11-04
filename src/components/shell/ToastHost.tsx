"use client";
/* แสดง Notification (toast) ที่สั่งด้วย notify() ใน lib/mock/store — ปิดเองหลัง 4 วินาที หรือกดปิด */
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
  return <Notification key={t.id} Type={t.Type} Text={t.Text} onClose={clearToast} />;
}
