"use client";
/* S8 · กระดิ่ง + แผงแจ้งเตือนของ กรย. / หน่วยงานเจ้าของรถ — bell() + notiPanel() ใน screens.js
   กระดิ่ง = Nav button ใน Header navigation (AppFrame prop bell = จุด Indicator เมื่อมีแจ้งเตือนที่ยังไม่อ่าน)
   AppFrame/HeaderNavigation ยังไม่มี prop กดกระดิ่ง ⇒ หน้านี้ดักคลิกปุ่ม aria-label "การแจ้งเตือน" ใน header เอง (ไม่แก้ src/components/ — รอ lead เพิ่ม prop onBell)
   แผง = patterns/NotificationPanel (desktop Notification card ใต้หัว · มือถือ Bottom sheet) · ป้าย "<n> แจ้งเตือนใหม่"
   กดแจ้งเตือนแผนเดินทาง → อ่านแล้ว (จุดแดงหาย) + เปิดหน้าแผนเดินทาง ดูอย่างเดียว · "ลบข้อความแจ้งเตือนทั้งหมด" = ลบแจ้งเตือนของบทบาทนี้ (ผลยังไม่กำหนดในสเปก) */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationPanel } from "@/components/patterns/NotificationPanel";
import { setMock, useMock, useRole } from "@/lib/mock/store";
import { notisOf, type NotiRole } from "@/lib/mock/trips";

export const useViewer = (): NotiRole => (useRole() === "หน่วยงานเจ้าของยานพาหนะ" ? "owner" : "kry");

export function useBell() {
  const router = useRouter();
  const mock = useMock();
  const who = useViewer();
  const [open, setOpen] = useState(false);
  const list = notisOf(mock).filter((n) => n.role === who);
  const unread = list.filter((n) => n.unread).length;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const b = (e.target as Element | null)?.closest?.('header button[aria-label="การแจ้งเตือน"]');
      if (b) { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, []);

  const read = (id: string) => setMock((s) => ({ ...s, notis: notisOf(s).map((n) => (n.id === id ? { ...n, unread: false } : n)) }));
  const panel = (
    <NotificationPanel open={open} onClose={() => setOpen(false)} badge={unread + " แจ้งเตือนใหม่"}
      items={list.map((n) => ({ state: n.status, text: n.text, time: n.time, onClick: () => { read(n.id); setOpen(false); if (n.tripId) router.push("/trips-view/detail/?trip=" + n.tripId); } }))}
      onClearAll={() => { setMock((s) => ({ ...s, notis: notisOf(s).filter((n) => n.role !== who) })); setOpen(false); }} />
  );
  return { bell: unread > 0, panel };
}
