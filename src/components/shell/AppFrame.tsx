"use client";
/* กรอบหน้าแบบจอ Figma (shell() ใน core.js):
   Desktop (≥ 768): Sidebar navigation State=Collapsed ซ้าย + Header navigation Breakpoint=Tablet + Page ขอบใน 32 ช่องไฟ 32
   Mobile (402 · < 768): ไม่มี Sidebar · Header navigation Breakpoint=Mobile + Page ขอบใน 16 ช่องไฟ 24
   บนสุดมีแถบต้นแบบ (PrototypeBar) · toast ผ่าน ToastHost */
import type { ReactNode } from "react";
import { HeaderNavigation } from "@/components/vms/HeaderNavigation";
import { SidebarNavigation } from "@/components/vms/SidebarNavigation";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PrototypeBar } from "./PrototypeBar";
import { ToastHost } from "./ToastHost";

export function AppFrame({ children, bell }: { children: ReactNode; bell?: boolean }) {
  const mob = useBreakpoint() === "Mobile";
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PrototypeBar />
      <div className="flex flex-1">
        {!mob && <SidebarNavigation />}
        <div className="flex min-w-0 flex-1 flex-col">
          <HeaderNavigation Breakpoint={mob ? "Mobile" : "Tablet"} bell={bell} />
          <main className={mob ? "flex flex-col gap-6 p-4" : "flex flex-col gap-8 p-8"}>{children}</main>
        </div>
      </div>
      <ToastHost />
    </div>
  );
}
