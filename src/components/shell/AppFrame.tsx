"use client";
/* กรอบหน้าแบบจอ Figma (shell() ใน core.js) + เมนูแบบระบบจริง (เจ้าของงาน 4 พ.ย. 2569 "เป็นเมนูจาก sidebar กด แล้ว expand ออกมา")
   Desktop (≥ 768): Sidebar navigation ซ้าย ตั้งต้น State=Collapsed (80)
     · ชี้เมาส์ที่ Sidebar = State=Expanded (280) ลอยทับเนื้อหา · เลื่อนเมาส์ออก = กลับ Collapsed
     · กดโลโก้หรือปุ่มใน Collapsed / กดปุ่ม keyboard_tab ใน Logo wrap = ค้าง Expanded ไว้ (ลอยทับเหมือนกัน ไม่ดันเนื้อหา
       ⇒ เนื้อหาวางตามจอ Figma ที่ Sidebar กว้าง 80 เสมอ) · ย่อด้วยปุ่ม keyboard_tab อีกครั้ง · คลิกนอก Sidebar · Esc
     · Sidebar ติดขอบบนตอนเลื่อนหน้า (สูงเท่าจอ เลื่อนในตัวเองเมื่อเมนูยาวกว่าจอ)
     Header navigation Breakpoint=Desktop (ไม่มีโลโก้และปุ่ม hamburger · ขอบใน 12/32 · ปุ่มขวาอย่างเดียว) + Page ขอบใน 32 ช่องไฟ 32
       — เจ้าของงาน 5 พ.ย. 2569 _"เอาตรงที่เป็น hambuger ออก … อันนี้บนเว็บนะ"_ (ต่างจาก R1 ของปลั๊กอินที่ให้ desktop ใช้ Tablet · COMPOSED.md)
   Mobile (402 · < 768): ไม่มี Sidebar · ปุ่ม menu ของ Header navigation Breakpoint=Mobile เปิด Sidebar navigation State=Expanded จากซ้าย ทับ Background overlay (ประกอบ — ดู figma-spec/COMPOSED.md)
     Page ขอบใน 16 ช่องไฟ 24
   เมนูที่ Active ใน Sidebar: "พาดูทีละเรื่อง" ที่ /guide/ และหน้าเรื่อง /scenarios/guide/ ที่เปิดจากเมนูนั้น (from=menu) · "อะไหล่ของแผนที่อนุมัติแล้ว" ที่ /parts/ (S4) · หน้าอื่น "บำรุงรักษาตามวาระ"
   บนสุดมีแถบต้นแบบ (PrototypeBar) · toast ผ่าน ToastHost */
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackgroundOverlay } from "@/components/vms/BackgroundOverlay";
import { HeaderNavigation } from "@/components/vms/HeaderNavigation";
import { APPROVE_PLANS_LABEL, APPROVE_TRIPS_LABEL, GUIDE_LABEL, MT_LABEL, PARTS_LABEL, SAFETY_LABEL, SAT_LABEL, SIDEBAR_MENU, SidebarNavigation } from "@/components/vms/SidebarNavigation";
import { useMock } from "@/lib/mock/store";
import { tripsOf } from "@/lib/mock/trips";
import { satRows } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useOutside } from "@/lib/useOutside";
import { GuideBar } from "@/components/guide/GuideBar";
import { PrototypeBar } from "./PrototypeBar";
import { ToastHost } from "./ToastHost";

export function AppFrame({ children, bell }: { children: ReactNode; bell?: boolean }) {
  const mob = useBreakpoint() === "Mobile";
  const [pinned, setPinnedState] = useState(false);
  const [hover, setHover] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const side = useRef<HTMLDivElement>(null);
  const setPinned = (v: boolean) => { setPinnedState(v); if (!v) setHover(false); };
  const [unpin] = useState(() => () => { setPinnedState(false); setHover(false); });
  useOutside(side, pinned, unpin);

  useEffect(() => {
    if (!drawer && !pinned) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setDrawer(false); unpin(); } };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [drawer, pinned, unpin]);
  useEffect(() => { if (!mob) setDrawer(false); }, [mob]);

  /* from=menu อ่านจาก location.search หลังโหลด (useSearchParams ต้องมี Suspense ครอบทุกหน้า) */
  const path = (usePathname() || "/").replace(/\/$/, "");
  const [fromMenu, setFromMenu] = useState(false);
  useEffect(() => { setFromMenu(new URLSearchParams(window.location.search).get("from") === "menu"); }, [path]);
  const sideActive = path === "/guide" || (path.startsWith("/scenarios/guide") && fromMenu) ? GUIDE_LABEL : path === "/parts" ? PARTS_LABEL : path.startsWith("/safety") ? SAFETY_LABEL
    : path.startsWith("/approvals/plans") ? APPROVE_PLANS_LABEL : path.startsWith("/approvals/trips") ? APPROVE_TRIPS_LABEL : path.startsWith("/satisfaction") ? SAT_LABEL : MT_LABEL;
  /* เมนูอนุมัติของทุกบทบาท + Badge จำนวนที่รออนุมัติ (ตัวเดียวกับรายการ S2 S7 · 9 พ.ย. 2569) */
  const mock = useMock();
  const nPlans = mock.plans.filter((p) => p.status === "review").length, nTrips = tripsOf(mock).filter((t) => t.status === "review").length;
  const nSat = satRows(mock).filter((r) => !r.evaluated).length;   // S27 ยังไม่ได้ประเมิน (11 พ.ย. 2569)
  const menu = SIDEBAR_MENU.map((g) => (g.items ? { ...g, items: g.items.map((s) => (s.Text === APPROVE_PLANS_LABEL && nPlans ? { ...s, badge: String(nPlans) } : s.Text === APPROVE_TRIPS_LABEL && nTrips ? { ...s, badge: String(nTrips) } : s.Text === SAT_LABEL && nSat ? { ...s, badge: String(nSat) } : s)) } : g));

  const expanded = pinned || hover;
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PrototypeBar />
      <div className="flex flex-1">
        {!mob && (
          <div ref={side} className="relative z-30 w-20 shrink-0" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <SidebarNavigation State={expanded ? "Expanded" : "Collapsed"} menu={menu} active={sideActive} onToggle={() => setPinned(!pinned)} toggleLabel={pinned ? "ย่อเมนู" : "ค้างเมนูไว้"}
              className="sticky top-0 h-screen overflow-y-auto" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <GuideBar />{/* โหมดพาดูทีละเรื่อง (ของต้นแบบ · components/guide/GuideBar) */}
          <HeaderNavigation Breakpoint={mob ? "Mobile" : "Desktop"} bell={bell} onMenu={mob ? () => setDrawer(true) : undefined} />
          <main className={mob ? "flex flex-col gap-6 p-4" : "flex flex-col gap-8 p-8"}>{children}</main>
        </div>
      </div>
      {mob && drawer && (
        <>
          <BackgroundOverlay onClick={() => setDrawer(false)} />
          <div role="dialog" aria-modal="true" aria-label="เมนูหลัก" className="fixed inset-y-0 left-0 z-50 flex max-w-full">
            <SidebarNavigation State="Expanded" menu={menu} active={sideActive} onToggle={() => setDrawer(false)} toggleLabel="ปิดเมนู" className="h-dvh overflow-y-auto" />
          </div>
        </>
      )}
      <ToastHost />
    </div>
  );
}
