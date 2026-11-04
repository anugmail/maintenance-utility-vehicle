"use client";
/* ปิดรายการเมื่อคลิกนอกกรอบ (Input dropdown · Dropdown menu) */
import { useEffect, type RefObject } from "react";

export function useOutside(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOutside(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, active, onOutside]);
}
