"use client";
/* เมนู "…" ท้ายแถว ตาม menuAt() / planMenu() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Desktop: Dropdown menu ลอยใต้ปุ่ม "…" ชิดขวาของปุ่ม (ตำแหน่งคำนวณตอนรันจากปุ่มที่กด)
     · พฤติกรรม (BACKLOG ข้อ 7 · หน้าตาเดิม): ที่ว่างใต้ปุ่มไม่พอ = พลิกขึ้นเหนือปุ่ม · วางตามพิกัดของหน้า (portal ที่ body) เลื่อนหน้าแล้วเมนูเลื่อนตามปุ่ม ไม่ปิด
     · ปิดเมื่อคลิกนอกเมนู · Esc · เปลี่ยนขนาดจอ = คำนวณตำแหน่งใหม่จากปุ่ม (ไม่ปิด)
   Mobile: Bottom sheet (ไม่มีหัว) + Dropdown menu ไม่มีกรอบ */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { DropdownMenu, type MenuEntry } from "@/components/vms/DropdownMenu";
import { useBreakpoint } from "@/lib/useBreakpoint";

/** พิกัดของหน้า (รวมระยะเลื่อน): top = ขอบล่างของปุ่ม · up = ขอบบนของปุ่ม · right = ระยะจากขอบขวาของหน้าจอถึงขอบขวาของปุ่ม */
export interface MenuAnchor { top: number; right: number; up?: number; /** ปุ่มที่กด — ใช้คำนวณตำแหน่งใหม่เมื่อเปลี่ยนขนาดจอ */ el?: HTMLElement }

const EDGE = 8;   // ระยะห่างขั้นต่ำจากขอบจอเมื่อพลิก

export function RowMenu({ anchor, items, onClose }: { anchor: MenuAnchor | null; items: MenuEntry[]; onClose: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);
  const [pos, setPos] = useState<MenuAnchor | null>(anchor);
  useEffect(() => { setPos(anchor); }, [anchor]);
  useEffect(() => {
    if (!anchor || mob) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    const r = () => { if (anchor.el?.isConnected) setPos(anchorOf(anchor.el)); else onClose(); };
    window.addEventListener("resize", r);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); window.removeEventListener("resize", r); };
  }, [anchor, mob, onClose]);
  /* วัดความสูงเมนูก่อนแสดง: ล้นขอบล่างของจอ และเหนือปุ่มมีที่พอ = พลิกขึ้น (ค่าที่คำนวณตอนรัน) */
  useLayoutEffect(() => {
    const a = pos ?? anchor;
    if (!a || mob || !ref.current) { setTop(null); return; }
    const h = ref.current.offsetHeight, sy = window.scrollY, vh = window.innerHeight;
    const up = a.up ?? a.top;
    setTop(a.top - sy + h <= vh - EDGE || up - sy - h < EDGE ? a.top : up - h);
  }, [pos, anchor, mob, items.length]);
  if (!anchor) return null;
  const at = pos ?? anchor;
  const wrap = items.map((it) => ({ ...it, onClick: () => { onClose(); it.onClick?.(); } }));
  if (mob) return <BottomSheet open onClose={onClose} flush><DropdownMenu items={wrap} bare /></BottomSheet>;
  return createPortal(
    <div ref={ref} className={top == null ? "invisible absolute z-50" : "absolute z-50"} style={{ top: top ?? at.top, right: at.right }}>
      <DropdownMenu items={wrap} />
    </div>,
    document.body,
  );
}

/* ตำแหน่งเมนูจากปุ่มที่กด: ใต้ปุ่ม ชิดขวาของปุ่ม (พิกัดของหน้า) */
export const anchorOf = (el: HTMLElement): MenuAnchor => {
  const r = el.getBoundingClientRect();
  return { top: r.bottom + window.scrollY, up: r.top + window.scrollY, right: document.documentElement.clientWidth - r.right, el };
};
