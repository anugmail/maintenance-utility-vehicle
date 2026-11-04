"use client";
/* Figma: "Notification card" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/Notification card.json
   แผงแจ้งเตือนใต้กระดิ่ง (notiPanel() ใน screens.js · S8) — ไลบรารีไม่มี variant มือถือ (มือถือวางใน BottomSheet ดู patterns/NotificationPanel)
   โครง: Container กว้าง 314 รัศมี 8 พื้น white ขอบ 1 gray-200 เงา --shadow-lg (Variable Color/effect/shadow-8)
        _Notification header: ขอบใน 12 เส้นล่าง gray-200 · "แจ้งเตือน" 18 SemiBold black · Badge outline Gray ("n แจ้งเตือนใหม่")
        Content สูง 400 (เลื่อนได้) = _Notification item base × n
        _Notification footer: ขอบใน 12 เส้นบน gray-200 · Primary button md เต็มกว้าง "ลบข้อความแจ้งเตือนทั้งหมด" (ค่าเริ่มไลบรารี) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { BadgeOutline } from "./BadgeOutline";
import { PrimaryButton } from "./PrimaryButton";

export function NotificationCard({ Badge, children, Header = true, Footer = true, FooterText = "ลบข้อความแจ้งเตือนทั้งหมด", onFooter, className }: {
  Badge?: string; children: ReactNode; Header?: boolean; Footer?: boolean; FooterText?: string; onFooter?: () => void; className?: string;
}) {
  return (
    <div className={cx("flex w-[314px] max-w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg-lib", className)}>
      {Header && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-3">
          <span className="text-[18px] leading-[27px] font-semibold text-black">แจ้งเตือน</span>
          {Badge && <BadgeOutline Text={Badge} Color="Gray" />}
        </div>
      )}
      <div className="flex max-h-100 flex-col overflow-y-auto">{children}</div>
      {Footer && <div className="border-t border-gray-200 p-3"><PrimaryButton Text={FooterText} className="w-full" onClick={onFooter} /></div>}
    </div>
  );
}
