"use client";
/* เมนู "…" ท้ายแถว ตาม menuAt() / planMenu() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Desktop: Dropdown menu ลอยใต้ปุ่ม "…" ชิดขวาของปุ่ม (ตำแหน่งคำนวณตอนรันจากปุ่มที่กด)
   Mobile: Bottom sheet (ไม่มีหัว) + Dropdown menu ไม่มีกรอบ */
import { useEffect, useRef } from "react";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { DropdownMenu, type MenuEntry } from "@/components/vms/DropdownMenu";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface MenuAnchor { top: number; right: number }

export function RowMenu({ anchor, items, onClose }: { anchor: MenuAnchor | null; items: MenuEntry[]; onClose: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!anchor || mob) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    window.addEventListener("scroll", onClose, true);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); window.removeEventListener("scroll", onClose, true); };
  }, [anchor, mob, onClose]);
  if (!anchor) return null;
  const wrap = items.map((it) => ({ ...it, onClick: () => { onClose(); it.onClick?.(); } }));
  if (mob) return <BottomSheet open onClose={onClose} flush><DropdownMenu items={wrap} bare /></BottomSheet>;
  return (
    <div ref={ref} className="fixed z-50" style={{ top: anchor.top, right: anchor.right }}>
      <DropdownMenu items={wrap} />
    </div>
  );
}

/* ตำแหน่งเมนูจากปุ่มที่กด: ใต้ปุ่ม ชิดขวาของปุ่ม */
export const anchorOf = (el: HTMLElement): MenuAnchor => { const r = el.getBoundingClientRect(); return { top: r.bottom, right: window.innerWidth - r.right }; };
