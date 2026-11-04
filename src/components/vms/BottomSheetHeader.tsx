"use client";
/* Figma: "Bottom sheet header" — ไฟล์ (Component) VMS Plus หน้า Bottom sheets (node 1180:2) · สเปก figma-spec/Bottom sheet header.json
   โครง: Drag handle (ขอบใน 18 บน/ล่าง · ขีด 32×4 รัศมี 4 gray-200) · Text and action (ขอบในข้าง 16 ช่องไฟ 4: ปุ่มย้อนกลับ · หัวข้อ 20 SemiBold black · Tertiary brand button)
         · Divider (ปิด R2/R13) · Padding bottom 24
   ใช้แบบ sheet() ใน core.js: ไม่มีหัวข้อ = ซ่อน Text and action */
import { TertiaryBrandButton } from "./TertiaryBrandButton";
import { TertiaryButton } from "./TertiaryButton";

export function BottomSheetHeader({ Text, ActionText, onAction, onBack }: { Text?: string; ActionText?: string; onAction?: () => void; onBack?: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center py-[18px]"><span className="h-1 w-8 rounded-xs bg-gray-200" /></div>
      {Text && (
        <div className="flex min-h-10 items-center gap-1 px-4">
          {onBack && <TertiaryButton LeadingIconSwap="keyboard_arrow_left-20-400-round" ButtonText={false} aria-label="ย้อนกลับ" onClick={onBack} />}
          <h2 className="min-w-0 flex-1 text-lg font-semibold text-black">{Text}</h2>
          {ActionText && <TertiaryBrandButton Text={ActionText} onClick={onAction} />}
        </div>
      )}
      <div className={Text ? "h-6" : "h-0"} />
    </div>
  );
}
