"use client";
import { useState } from "react";
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";
import { NavButton } from "./NavButton";
import { NavItem } from "./NavItem";
import { NavListItem } from "./NavListItem";
import { TertiaryButton } from "./TertiaryButton";

export interface SideLink { Text: string; href?: string; badge?: string }
export interface SideGroup { IconSwap: string; Text: string; items?: SideLink[]; href?: string; badge?: string }
export interface SideFooter { IconSwap: string; Text: string; SupportingText?: string; TrailingIconSwap?: string; avatar?: boolean }

export const MT_LABEL = "บำรุงรักษาตามวาระ";
export const GUIDE_LABEL = "พาดูทีละเรื่อง";
export const PARTS_LABEL = "อะไหล่ของแผนที่อนุมัติแล้ว";
export const SAFETY_LABEL = "การตรวจ ปจ.2";
export const APPROVE_PLANS_LABEL = "แผนรออนุมัติ";
export const APPROVE_TRIPS_LABEL = "แผนเดินทางรออนุมัติ";
export const SAT_LABEL = "แบบประเมินความพึงพอใจ";

export const SIDEBAR_MENU: SideGroup[] = [
  { IconSwap: "home-24-300-round", Text: "หน้าหลัก" },
  { IconSwap: "car_rental-24-300-round", Text: "ระบบจองยานพาหนะ", items: [{ Text: "คำขอใช้ยานพาหนะ" }, { Text: "อนุมัติคำขอ" }] },
  { IconSwap: "traffic_jam-24-300-round", Text: "จัดการคำขอใช้ยานพาหนะ", items: [{ Text: "ตรวจสอบและจัดการคำขอ" }, { Text: "อนุมัติใช้ยานพาหนะ" }] },
  { IconSwap: "database-24-300-round", Text: "ข้อมูลพนักงานและยานพาหนะ", items: [{ Text: "ผู้ดูแลยานพาหนะ" }, { Text: "ข้อมูลพนักงานขับยานพาหนะ" }, { Text: "ข้อมูลยานพาหนะ" }, { Text: "กลุ่มยานพาหนะ" }, { Text: "บริหารสัญญา" }] },
  { IconSwap: "ev_station", Text: "การอัดประจุไฟฟ้า", items: [{ Text: "สถานีอัดประจุไฟฟ้า" }, { Text: "อัตราค่าไฟฟ้า" }, { Text: "ค่าใช้จ่ายอัดประจุยานพาหนะ" }, { Text: "บันทึกการอัดประจุ Wall Charger" }, { Text: "ต้นทุนและค่าใช้จ่ายในการอัดประจุ" }] },
  { IconSwap: "build", Text: "งานซ่อมและบำรุงรักษา", items: [{ Text: "ภาพรวมการซ่อมบำรุง" }, { Text: "ตารางบำรุงรักษา" }, { Text: "นัดหมายบำรุงรักษา" }, { Text: "งานซ่อม" }, { Text: "ยานพาหนะทดแทน" }, { Text: MT_LABEL, href: "/" }, { Text: PARTS_LABEL, href: "/parts/" }, { Text: SAFETY_LABEL, href: "/safety/" }, { Text: APPROVE_PLANS_LABEL, href: "/approvals/plans/" }, { Text: APPROVE_TRIPS_LABEL, href: "/approvals/trips/" }, { Text: GUIDE_LABEL, href: "/guide/" }] },
  { IconSwap: "e911_emergency", Text: "จัดการเหตุการณ์", items: [{ Text: "จัดการเหตุยานพาหนะเสีย" }, { Text: "จัดการเหตุอุบัติเหตุ" }] },
  { IconSwap: "star-24-300-round", Text: SAT_LABEL, href: "/satisfaction/" },
  { IconSwap: "news", Text: "รายงาน" },
];
export const SIDEBAR_FOOTER: SideFooter[] = [
  { IconSwap: "light_mode-24-300-round", Text: "โหมดสว่าง" },
  { IconSwap: "lock-24-300-round", Text: "ล็อกหน้าจอ" },
  { IconSwap: "id_card-24-300-round", Text: "ใบอนุญาตขับขี่" },
  { IconSwap: "", Text: "นายสมคิด จงจองหอ", SupportingText: "ผู้ใช้งานทั่วไป", TrailingIconSwap: "logout-24-300-round", avatar: true },
];

let openMemo: string[] | null = null;

const Avatar = () => <span aria-hidden="true" className="size-6 shrink-0 rounded-pill bg-purple-200" />;

export interface SidebarNavigationProps {
  State?: "Collapsed" | "Expanded";
  menu?: SideGroup[];
  footer?: SideFooter[];
  active?: string;
  onToggle?: () => void;
  toggleLabel?: string;
  className?: string;
}

export function SidebarNavigation({ State = "Collapsed", menu = SIDEBAR_MENU, footer = SIDEBAR_FOOTER, active = MT_LABEL, onToggle, toggleLabel = "ย่อเมนู", className }: SidebarNavigationProps) {
  const holds = (g: SideGroup) => g.Text === active || !!g.items?.some((s) => s.Text === active);
  const [open, setOpen] = useState<string[]>(() => openMemo ?? menu.filter((g) => g.items && holds(g)).map((g) => g.Text));
  const flip = (t: string) => setOpen((o) => { const n = o.includes(t) ? o.filter((x) => x !== t) : [...o, t]; openMemo = n; return n; });

  if (State === "Collapsed") {
    return (
      <nav aria-label="เมนูหลัก" data-state="Collapsed" className={cx("flex w-20 shrink-0 flex-col items-center gap-5 border-r border-b border-l border-gray-200 bg-white px-4 py-3", className)}>
        <button type="button" aria-label="ขยายเมนู" onClick={onToggle} className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/pea-logo.svg")} alt="PEA" width={32} height={32} />
        </button>
        <div className="flex flex-col gap-2">
          {menu.map((g) => <NavButton key={g.Text} IconSwap={g.IconSwap} Text={g.Text} State={holds(g) ? "Active" : "Default"} Indicator={!!g.badge} onClick={onToggle} />)}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          {footer.map((f) => <NavButton key={f.Text} IconSwap={f.avatar ? <Avatar /> : f.IconSwap} Text={f.Text} onClick={onToggle} />)}
        </div>
      </nav>
    );
  }
  return (
    <nav aria-label="เมนูหลัก" data-state="Expanded" className={cx("flex w-70 shrink-0 flex-col gap-5 border-r border-gray-200 bg-white px-4 py-3", className)}>
      <div className="flex h-10 shrink-0 items-center justify-between px-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/pea-logo.svg")} alt="PEA" width={32} height={32} />
        {onToggle && <TertiaryButton LeadingIconSwap="keyboard_tab-24-300-round" ButtonText={false} aria-label={toggleLabel} title={toggleLabel} onClick={onToggle} />}
      </div>
      <div className="flex flex-col gap-2">
        {menu.map((g) => {
          if (!g.items) return <NavItem key={g.Text} Text={g.Text} LeadingIconSwap={g.IconSwap} href={g.href} State={g.Text === active ? "Active" : "Default"} Badge={!!g.badge} BadgeText={g.badge} />;
          const on = open.includes(g.Text);
          return (
            <div key={g.Text} className="flex flex-col gap-1">
              <NavItem Text={g.Text} LeadingIconSwap={g.IconSwap} TrailingIcon TrailingIconSwap={on ? "keyboard_arrow_up-20-outline-300-round" : "keyboard_arrow_down-20-400-round"} expanded={on} onClick={() => flip(g.Text)} />
              {on && (
                <div className="flex flex-col gap-1">
                  {g.items.map((s) => <NavListItem key={s.Text} Text={s.Text} href={s.href} State={s.Text === active ? "Active" : "Default"} Badge={!!s.badge} BadgeText={s.badge} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col gap-2">
        {footer.map((f) => (
          <NavItem key={f.Text} Text={f.Text} LeadingIconSwap={f.avatar ? <Avatar /> : f.IconSwap} ShowDescription={!!f.SupportingText} SupportingText={f.SupportingText}
            TrailingIcon={!!f.TrailingIconSwap} TrailingIconSwap={f.TrailingIconSwap} />
        ))}
      </div>
    </nav>
  );
}
