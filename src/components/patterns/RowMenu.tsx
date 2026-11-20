"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { DropdownMenu, type MenuEntry } from "@/components/vms/DropdownMenu";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface MenuAnchor { top: number; right: number; up?: number; el?: HTMLElement }

const EDGE = 8;

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

export const anchorOf = (el: HTMLElement): MenuAnchor => {
  const r = el.getBoundingClientRect();
  return { top: r.bottom + window.scrollY, up: r.top + window.scrollY, right: document.documentElement.clientWidth - r.right, el };
};
