"use client";
/* แถบต้นแบบบนสุด (ไม่ใช่หน้าจอของระบบ — มีเฉพาะต้นแบบ) · สลับบทบาท + ล้างข้อมูลจำลอง (CLAUDE.md ข้อ 5 และ 7)
   ประกอบจากชิ้นไลบรารี: Input dropdown + Dropdown list (บทบาท) · Tertiary button (ล้างข้อมูลจำลอง) · Tertiary brand button (ไปหน้ารายการ scenario) — บันทึกใน figma-spec/COMPOSED.md */
import Link from "next/link";
import { useState } from "react";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { Ms } from "@/components/vms/Ms";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { notify, resetMock, ROLES, setRole, useRole } from "@/lib/mock/store";

export function PrototypeBar() {
  const role = useRole();
  const [open, setOpen] = useState(false);
  return (
    <div data-proto-bar className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gray-200 bg-gray-50 px-4 py-1">
      <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-900"><Ms name="home-20-300-round" size={16} />ต้นแบบบำรุงรักษาตามวาระ</Link>
      <span className="text-xs text-gray-600">บทบาท</span>
      <InputDropdown Label={false} LabelText="บทบาท" Text={role} open={open} onOpenChange={setOpen} className="w-52">
        <DropdownList>
          {ROLES.map((r) => <DropdownListItem key={r} Text={r} State={r === role ? "Selected" : "Default"} onClick={() => { setRole(r); setOpen(false); }} />)}
        </DropdownList>
      </InputDropdown>
      <TertiaryButton Text="ล้างข้อมูลจำลอง" LeadingIconSwap="restart_alt-24-300-round" className="ml-auto" onClick={() => { resetMock(); notify("ล้างข้อมูลจำลองแล้ว"); }} />
    </div>
  );
}
