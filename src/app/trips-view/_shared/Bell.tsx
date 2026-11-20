"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationPanel } from "@/components/patterns/NotificationPanel";
import { setMock, useMock, useRole } from "@/lib/mock/store";
import { notisOf, type NotiRole } from "@/lib/mock/trips";

export const useViewer = (): NotiRole => { const r = useRole(); return r === "ผู้ดูแลยานพาหนะ" ? "owner" : r === "ผู้รับจ้าง" ? "vendor" : "kry"; };

export function useBell(on = true) {
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
    if (!on) return;
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [on]);

  const read = (id: string) => setMock((s) => ({ ...s, notis: notisOf(s).map((n) => (n.id === id ? { ...n, unread: false } : n)) }));
  const panel = (
    <NotificationPanel open={open} onClose={() => setOpen(false)} badge={unread + " แจ้งเตือนใหม่"}
      items={list.map((n) => ({ state: n.status, text: n.text, time: n.time, onClick: () => { read(n.id); setOpen(false); if (n.href) router.push(n.href); else if (n.tripId) router.push("/trips-view/detail/?trip=" + n.tripId); } }))}
      onClearAll={() => { setMock((s) => ({ ...s, notis: notisOf(s).filter((n) => n.role !== who) })); setOpen(false); }} />
  );
  return { bell: unread > 0, panel };
}
