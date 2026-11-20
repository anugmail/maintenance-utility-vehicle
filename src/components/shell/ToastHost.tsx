"use client";
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
    <div data-toast className="pointer-events-none fixed top-[calc(var(--guide-bottom,0px)+16px)] right-4 left-4 z-[60] flex justify-end md:top-[calc(var(--guide-bottom,0px)+24px)] md:right-6 md:left-auto">
      <div className="pointer-events-auto w-full animate-fade-in md:w-[400px]"><Notification key={t.id} Type={t.Type} Text={t.Text} onClose={clearToast} floating={false} /></div>
    </div>
  );
}
