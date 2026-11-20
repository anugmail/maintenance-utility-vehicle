"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";

export interface ProtoForm { fill: () => void; clear: () => void; dirty?: boolean }
let current: { ref: { current: ProtoForm | null } } | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function useProtoFormTools() {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => current, () => null);
}
export function useProtoForm(form: ProtoForm | null) {
  const ref = useRef<ProtoForm | null>(form);
  ref.current = form;
  const on = !!form;
  useEffect(() => {
    if (!on) return;
    const me = { ref };
    current = me; emit();
    return () => { if (current === me) { current = null; emit(); } };
  }, [on]);
}
