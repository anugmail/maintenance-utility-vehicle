"use client";
/* แถบต้นแบบบนสุด (ไม่ใช่หน้าจอของระบบ — มีเฉพาะต้นแบบ) · สลับบทบาท + ล้างข้อมูลจำลอง (CLAUDE.md ข้อ 5 และ 7)
   + ปุ่มช่วยฟอร์ม "กรอกข้อมูลตัวอย่าง" · "ล้างค่า" (เจ้าของงาน 10 พ.ย. 2569 · ของต้นแบบเท่านั้น ไม่ใส่ใน Figma) — ขึ้นเฉพาะหน้าที่มีฟอร์มลงทะเบียน (lib/protoForm.ts) · ล้างค่าเมื่อมีค่าที่กรอกไว้ = ยืนยันก่อน
   ประกอบจากชิ้นไลบรารี: Input dropdown + Dropdown list (บทบาท) · Tertiary button (ล้างข้อมูลจำลอง) · Checkbox (จำลองบันทึกไม่สำเร็จ — ให้เห็นจอ "บันทึกไม่สำเร็จ") · Tertiary brand button (ไปหน้ารายการ scenario · ไปเมนูพาดูทีละเรื่อง /guide/) — บันทึกใน figma-spec/COMPOSED.md */
import Link from "next/link";
import { useState } from "react";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { Ms } from "@/components/vms/Ms";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { Checkbox } from "@/components/vms/Checkbox";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { notify, resetMock, ROLES, setMock, setRole, useMock, useRole } from "@/lib/mock/store";
import { useProtoFormTools } from "@/lib/protoForm";
import { PopupModal } from "@/components/patterns/PopupModal";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { confirmSign, pendingSigns } from "@/lib/mock/jobs";

export function PrototypeBar() {
  const role = useRole();
  const mock = useMock();
  const fail = !!mock.failSave;
  /* คำขอลงนาม (11 พ.ย. 2569 · ของต้นแบบ): ระบบจริงส่งแจ้งเตือนถึงผู้ลงนาม ผู้ลงนามเข้าระบบแล้วยืนยัน — ต้นแบบไม่มีบทบาทของผู้ลงนามรายคน
     ⇒ แถบต้นแบบมีปุ่ม "คำขอลงนาม (n)" เปิดรายการที่รอยืนยัน แล้วกดยืนยันในฐานะผู้ลงนามคนนั้น */
  const pend = pendingSigns(mock);
  const [signs, setSigns] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useProtoFormTools();
  const [ask, setAsk] = useState(false);
  const clear = () => { form?.ref.current?.clear(); setAsk(false); notify("ล้างค่าในฟอร์มนี้แล้ว"); };
  return (
    <div data-proto-bar className="relative z-[55] flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gray-200 bg-gray-50 px-4 py-1">{/* z-[55] เหนือ popup (z-50) ให้กดปุ่มกรอกข้อมูลตัวอย่างตอน popup เปิดได้ · ต่ำกว่า toast (z-[60]) */}
      <Link href="/scenarios/" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-900"><Ms name="home-20-300-round" size={16} />ต้นแบบบำรุงรักษาตามวาระ</Link>
      {/* เมนูพาดูทีละเรื่อง (G1 · เจ้าของงาน 5 พ.ย. 2569 "อยากให้มีเมนูแยกออกมาเลย ว่า เป็นเรื่องที่แยก scen") — ของต้นแบบ อยู่ที่แถบนี้ และเป็นเมนูย่อยต่อจาก "บำรุงรักษาตามวาระ" ใน Sidebar ด้วย (เจ้าของงาน 5 พ.ย. 2569 "สร้างเป็นอีกเมนู เป็นเมนูย่อยของ บำรุงรักษาตามวาระก็ได้") */}
      <Link href="/guide/" data-guide-menu className="inline-flex items-center gap-1 text-xs font-semibold text-brand-900"><Ms name="school-20-300-round" size={16} />พาดูทีละเรื่อง</Link>
      <span className="text-xs text-gray-600">บทบาท</span>
      <InputDropdown Label={false} LabelText="บทบาท" Text={role} open={open} onOpenChange={setOpen} className="w-52">
        <DropdownList>
          {ROLES.map((r) => <DropdownListItem key={r} Text={r} State={r === role ? "Selected" : "Default"} onClick={() => { setRole(r); setOpen(false); }} />)}
        </DropdownList>
      </InputDropdown>
      {pend.length > 0 && (
        <TertiaryButton Text={"คำขอลงนาม (" + pend.length + ")"} LeadingIconSwap="notifications_active-24-300-round" onClick={() => setSigns(true)} />
      )}
      {form && (
        <span data-proto-form className="flex items-center gap-1 border-l border-gray-200 pl-3">
          <TertiaryButton Text="กรอกข้อมูลตัวอย่าง" LeadingIconSwap="edit_note-24-300-round" onClick={() => { form.ref.current?.fill(); notify("กรอกข้อมูลตัวอย่างแล้ว"); }} />
          <TertiaryButton Text="ล้างค่า" LeadingIconSwap="ink_eraser-24-300-round" onClick={() => (form.ref.current?.dirty ? setAsk(true) : clear())} />
        </span>
      )}
      <label className="ml-auto flex items-center gap-2 text-xs text-gray-600">
        <Checkbox Type={fail ? "Selected" : "Unselected"} label="จำลองบันทึกไม่สำเร็จ" onChange={(v) => setMock((s) => ({ ...s, failSave: v }))} />
        จำลองบันทึกไม่สำเร็จ
      </label>
      <TertiaryButton Text="ล้างข้อมูลจำลอง" LeadingIconSwap="restart_alt-24-300-round" onClick={() => { resetMock(); notify("ล้างข้อมูลจำลองแล้ว"); }} />
      <PopupModal open={signs && pend.length > 0} title="คำขอลงนามที่รอยืนยัน" sub="จำลองฝั่งผู้ลงนาม: ผู้ลงนามได้รับแจ้งเตือน เข้าระบบ แล้วกดยืนยัน (ของต้นแบบ ไม่ใช่หน้าจอของระบบ)"
        showOk={false} cancel="ปิด" onCancel={() => setSigns(false)}>
        <div className="flex flex-col gap-3">
          {pend.map((p) => (
            <div key={p.tripId + p.carId + p.k + p.i} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold text-black">{p.name}</span>
                <span className="text-xs text-gray-600">{p.title + " · " + p.plate + " · ส่งเมื่อ " + p.req}</span>
              </div>
              <SecondaryButton Text="ยืนยันลงนาม" onClick={() => { confirmSign(p.tripId, p.carId, p.k, p.i); notify(p.name + " ยืนยันลงนามแล้ว"); }} />
            </div>
          ))}
        </div>
      </PopupModal>
      <ConfirmDialog spec={ask ? { danger: true, title: "ล้างค่าในฟอร์มนี้", sub: "ค่าที่กรอกไว้ในฟอร์มของหน้านี้จะกลับเป็นค่าเริ่มต้น แผนและงานอื่นที่บันทึกไว้ไม่เปลี่ยน", cancel: "ยกเลิก", ok: "ล้างค่า" } : null}
        onCancel={() => setAsk(false)} onOk={clear} />
    </div>
  );
}
