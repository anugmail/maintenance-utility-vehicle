"use client";
/* Figma: "Header navigation" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/Header navigation.json
   variant: Breakpoint = Desktop | Tablet | Mobile — จอ desktop ใช้ Tablet (รีวิว 19 ต.ค. 2569 ใน shell() ของ core.js) · มือถือใช้ Mobile
   ค่า: สูง 64 · พื้น white · เส้นล่าง gray-200 · ช่องไฟ 8
        Desktop: ขอบใน 12/32 · ขวา Nav button (search · light_mode · notifications) + Avatar 36
        Tablet: ขอบใน 12/16 · ซ้าย Brand logo + Nav button menu · ขวาเหมือน Desktop
        Mobile: ขอบใน 12/16 · Brand logo 40 · ปุ่ม Menu (Icon button วงกลม ขอบ gray-300 ไอคอน 20 gray-600) · Search (Text input) · Nav button notifications + menu
   Brand logo / Avatar: ดู COMPOSED.md (โลโก้จากภาพส่งออกหน้าจอ · avatar พื้นม่วงอ่อน + ภาพ (ไม่ผูก Variable · ไม่มี token ตรง) → purple-200 ใกล้สุด) */
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import { NavButton } from "./NavButton";

export interface HeaderNavigationProps {
  Breakpoint?: "Desktop" | "Tablet" | "Mobile";
  /** จุดแดงบนกระดิ่ง */
  bell?: boolean;
  onMenu?: () => void;
  className?: string;
}

function Logo({ size }: { size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset("/pea-logo.svg")} alt="PEA" width={size} height={size} className="shrink-0" />;
}

export function HeaderNavigation({ Breakpoint = "Tablet", bell, onMenu, className }: HeaderNavigationProps) {
  const right = (
    <div className="flex items-center gap-2">
      {Breakpoint !== "Mobile" && <NavButton IconSwap="search-24-300-round" Text="ค้นหา" />}
      {Breakpoint !== "Mobile" && <NavButton IconSwap="light_mode-24-300-round" Text="ธีม" />}
      <NavButton IconSwap="notifications-24-300-round" Text="การแจ้งเตือน" Indicator={bell} />
      {Breakpoint === "Mobile" ? <NavButton IconSwap="menu-24-300-round" Text="เมนู" onClick={onMenu} /> : <span aria-hidden="true" className="size-9 shrink-0 rounded-pill bg-purple-200" />}
    </div>
  );
  if (Breakpoint === "Mobile") {
    return (
      <header className={cx("flex h-16 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3", className)}>
        <span className="inline-flex size-10 shrink-0 items-center justify-center"><Logo size={32} /></span>
        <button type="button" aria-label="เมนู" onClick={onMenu} className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-gray-300 bg-white p-2 text-gray-600"><Ms name="menu-24-300-round" size={20} /></button>
        <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
          <Ms name="search-24-300-round" size={24} className="text-gray-500" />
          <input aria-label="ค้นหา" placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-md outline-none placeholder:text-gray-400" />
        </label>
        {right}
      </header>
    );
  }
  return (
    <header className={cx("flex h-16 items-center justify-between gap-2 border-b border-gray-200 bg-white py-3", Breakpoint === "Desktop" ? "px-8" : "px-4", className)}>
      {Breakpoint === "Tablet" ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 items-center px-1"><Logo size={32} /></span>
          <NavButton IconSwap="menu-24-300-round" Text="เมนู" onClick={onMenu} />
        </div>
      ) : <span />}
      {right}
    </header>
  );
}
