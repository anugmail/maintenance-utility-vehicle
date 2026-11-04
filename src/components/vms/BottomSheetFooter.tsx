/* Figma: "Bottom sheet footer" — ไฟล์ (Component) VMS Plus หน้า Bottom sheets (node 1180:2) · สเปก figma-spec/Bottom sheet footer.json
   โครง: Padding top 24 · Divider (ปิด) · Actions ขอบในข้าง 16 ล่าง 16 ช่องไฟ 16 ปุ่ม Size=lg แบ่งครึ่ง (Secondary ซ้าย · Primary ขวา) · iOS Tab bar footer (ไม่แสดงบนเว็บ) */
import type { ReactNode } from "react";

export function BottomSheetFooter({ SecondaryAction, PrimaryAction }: { SecondaryAction?: ReactNode; PrimaryAction?: ReactNode }) {
  return (
    <div className="pt-6">
      <div className="flex gap-4 px-4 pb-4 [&>*]:flex-1 [&>*]:basis-0">{SecondaryAction}{PrimaryAction}</div>
    </div>
  );
}
