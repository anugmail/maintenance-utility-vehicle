"use client";
/* Figma: "Sidebar navigation" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Sidebar navigation.json
   variant: State = Collapsed (ที่จอใช้ ตาม shell() ใน core.js) | Expanded (ยังไม่ทำ)
   ค่า Collapsed: กว้าง 80 · ขอบใน 12/16 · ช่องไฟ 20 · พื้น white · เส้นขวา gray-200 · PEA logo 32 · Menu = Nav button ช่องไฟ 8 · Footer menu ชิดล่าง ช่องไฟ 8
   ไอคอนเมนู: ไลบรารีเป็นไอคอนตั้งต้น (crop_free) → ใช้ชุดของ Sidebar ในหน้าจอ UI Release#2 (home · car_rental · traffic_jam · database / light_mode · lock · id_card)
   Nav button ตัวแรกเป็น Active ตาม shell() */
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";
import { NavButton } from "./NavButton";

export interface SideItem { IconSwap: string; Text: string; href?: string; active?: boolean }

export const SIDEBAR_MENU: SideItem[] = [
  { IconSwap: "home-24-300-round", Text: "หน้าแรก" },
  { IconSwap: "car_rental-24-300-round", Text: "ยานพาหนะ" },
  { IconSwap: "traffic_jam-24-300-round", Text: "การเดินทาง" },
  { IconSwap: "database-24-300-round", Text: "ข้อมูลหลัก" },
];
export const SIDEBAR_FOOTER: SideItem[] = [
  { IconSwap: "light_mode-24-300-round", Text: "ธีม" },
  { IconSwap: "lock-24-300-round", Text: "สิทธิ์" },
  { IconSwap: "id_card-24-300-round", Text: "ผู้ใช้" },
];

export function SidebarNavigation({ State = "Collapsed", menu = SIDEBAR_MENU, footer = SIDEBAR_FOOTER, activeIndex = 0, className }: { State?: "Collapsed"; menu?: SideItem[]; footer?: SideItem[]; activeIndex?: number; className?: string }) {
  return (
    <nav aria-label="เมนูหลัก" data-state={State} className={cx("flex w-20 shrink-0 flex-col items-center gap-5 border-r border-gray-200 bg-white px-4 py-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/pea-logo.svg")} alt="PEA" width={32} height={32} />
      <div className="flex flex-col gap-2">
        {menu.map((m, i) => <NavButton key={m.Text} IconSwap={m.IconSwap} Text={m.Text} href={m.href} State={i === activeIndex ? "Active" : "Default"} />)}
      </div>
      <div className="mt-auto flex flex-col gap-2">
        {footer.map((m) => <NavButton key={m.Text} IconSwap={m.IconSwap} Text={m.Text} href={m.href} />)}
      </div>
    </nav>
  );
}
