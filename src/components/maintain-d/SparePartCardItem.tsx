"use client";
/* Figma: "Spare Part Card Item" — ไฟล์ Maintain-D หน้า Local Component (node 8:133440) · สเปก figma-spec/Spare Part Card Item.json (CLAUDE.md ข้อ 12)
   การ์ดอะไหล่ใน PartsInventoryPanel / RequestedPartsPanel · variant: อะไหล่ = รายการในคลัง | รายการที่เลือก | V2 รายการที่เลือก | เพิ่มอะไหล่
   ค่า: การ์ด พื้น white ขอบ 1 รัศมี 12 ขอบใน 16 (สีขอบของไฟล์ไม่มี token → gray-200 ใกล้สุด — COMPOSED.md ข.)
        หัว: ชื่อ 16 SemiBold black + Pill outline Info "แนะนำ" (Suggestion) ช่องไฟ 8 · บรรทัดรหัส: รหัส 14 gray-600 · "·" "1 <หน่วย>" · "|" "<ราคา> บาท" ช่องไฟ 8
        คลัง: "<คลัง> : คงเหลือ <n> <หน่วย>" 14 gray-600 (+ "| ซื้อเพิ่ม n หน่วย" + ข้อความแจ้ง error-600 "อะไหล่ที่จัดซื้อจะใช้เวลา 30 วันทำการ" เมื่อของไม่พอ)
        รายการในคลัง: แถวเดียว ช่องไฟ 16 · ท้าย Selecte Spare Part (Add / Checked)
        รายการที่เลือก (V2): เรียงลง ช่องไฟ 16 · ไอคอนลบ delete 24 ท้ายหัว (สีไอคอนของไฟล์ไม่มี token → Tertiary button ไอคอนอย่างเดียว — COMPOSED.md ข.) · แถวล่าง ราคารวม 16 SemiBold gray-600 ซ้าย + Number input กว้าง 120 ขวา
        รายการที่เลือก (V1): + "เลือกผู้จัดซื้ออะไหล่เพิ่ม" Radio text card 2 ใบ (ส่ง buyerOptions)
        เพิ่มอะไหล่: หัว "รายการเพิ่มเติม" + ไอคอนลบ · Text input 3 ช่อง ช่องไฟ 16 · ราคารวม + Number input */
import type { ReactNode } from "react";
import { InputLabel } from "@/components/vms/InputLabel";
import { NumberInput } from "@/components/vms/NumberInput";
import { PillOutline } from "@/components/vms/PillOutline";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { SelecteSparePart } from "./SelecteSparePart";

export interface SparePart { name: string; code?: string; unit: string; price: number; warehouse?: string; stock?: number; suggestion?: boolean }
export const baht = (n: number) => n.toLocaleString("en-US") + " บาท";

export type SparePartCardType = "รายการในคลัง" | "รายการที่เลือก" | "V2 รายการที่เลือก" | "เพิ่มอะไหล่";

export interface SparePartCardItemProps {
  อะไหล่?: SparePartCardType;
  part?: SparePart;
  /** รายการในคลัง: เลือกแล้ว (Selecte Spare Part State=Checked) */
  picked?: boolean;
  onPick?: () => void;
  /** รายการที่เลือก / เพิ่มอะไหล่ */
  qty?: number;
  onQty?: (n: number) => void;
  onDelete?: () => void;
  /** จำนวนที่ต้องซื้อเพิ่ม (ของไม่พอ) */
  buyMore?: number;
  buyerOptions?: string[];
  buyer?: string | null;
  onBuyer?: (v: string) => void;
  /** เพิ่มอะไหล่: ช่องกรอก */
  manual?: { name: string; code: string; price: string };
  onManual?: (patch: Partial<{ name: string; code: string; price: string }>) => void;
  className?: string;
}

const Card = ({ row, children, className }: { row?: boolean; children: ReactNode; className?: string }) => (
  <div className={cx("rounded-lg border border-gray-200 bg-white p-4", row ? "flex items-center gap-4" : "flex flex-col gap-4", className)}>{children}</div>
);

function Head({ part, onDelete }: { part: SparePart; onDelete?: () => void }) {
  return (
    <div className="flex items-start gap-1">
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span className="text-md font-semibold text-black">{part.name}</span>
        {part.suggestion && <PillOutline Text="แนะนำ" Color="Info" />}
      </span>
      {onDelete && <TertiaryButton LeadingIconSwap="delete-24-300-round" ButtonText={false} aria-label={"เอา " + part.name + " ออก"} onClick={onDelete} className="-my-2 -mr-2" />}
    </div>
  );
}
const CodeLine = ({ part }: { part: SparePart }) => (
  <span className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
    {part.code && <span>{part.code}</span>}
    <span className="flex items-center gap-2"><span className="text-md text-black">·</span><span>1 {part.unit}</span></span>
    <span className="flex items-center gap-2"><span>|</span><span>{baht(part.price)}</span></span>
  </span>
);

export function SparePartCardItem({ อะไหล่: type = "รายการในคลัง", part, picked, onPick, qty = 1, onQty, onDelete, buyMore, buyerOptions, buyer, onBuyer, manual, onManual, className }: SparePartCardItemProps) {
  if (type === "เพิ่มอะไหล่") {
    const m = manual ?? { name: "", code: "", price: "" };
    const total = (parseFloat(m.price.replace(/,/g, "")) || 0) * qty;
    return (
      <Card className={className}>
        <div className="flex items-center justify-between gap-4">
          <span className="text-md font-semibold text-black">รายการเพิ่มเติม</span>
          {onDelete && <TertiaryButton LeadingIconSwap="delete-24-300-round" ButtonText={false} aria-label="เอารายการเพิ่มเติมออก" onClick={onDelete} className="-my-2 -mr-2" />}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput LabelText="ชื่ออะไหล่" Text={m.name} Placeholder="ระบุชื่ออะไหล่" onChange={(v) => onManual?.({ name: v })} />
          <TextInput LabelText="รหัสอะไหล่" Optional Text={m.code} Placeholder="ระบุรหัสอะไหล่" onChange={(v) => onManual?.({ code: v })} />
          <TextInput LabelText="ราคาต่อหน่วย" Text={m.price} Placeholder="0" inputMode="numeric" onChange={(v) => onManual?.({ price: v })} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-md font-semibold text-gray-600">{baht(total)}</span>
          <NumberInput Label={false} Number={qty} min={1} onChange={onQty} className="w-30" />
        </div>
      </Card>
    );
  }
  if (!part) return null;
  const stock = part.warehouse && <span>{part.warehouse} : คงเหลือ {part.stock ?? 0} {part.unit}</span>;
  if (type === "รายการในคลัง") {
    return (
      <Card row className={className}>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1"><Head part={part} /><CodeLine part={part} /></div>
          <span className="text-sm text-gray-600">{stock}</span>
        </div>
        <SelecteSparePart State={picked ? "Checked" : "Add"} label={(picked ? "เลือกแล้ว " : "เลือก ") + part.name} onClick={onPick} />
      </Card>
    );
  }
  return (
    <Card className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1"><Head part={part} onDelete={onDelete} /><CodeLine part={part} /></div>
        <span className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          {stock}
          {!!buyMore && <><span>|</span><span>ซื้อเพิ่ม {buyMore} {part.unit}</span><span className="text-error-600">อะไหล่ที่จัดซื้อจะใช้เวลา 30 วันทำการ</span></>}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-md font-semibold text-gray-600">{baht(part.price * qty)}</span>
        <NumberInput Label={false} Number={qty} min={1} onChange={onQty} className="w-30" />
      </div>
      {type === "รายการที่เลือก" && buyerOptions && (
        <div className="flex flex-col gap-2">
          <InputLabel LabelText="เลือกผู้จัดซื้ออะไหล่เพิ่ม" />
          <div className="flex gap-4 [&>*]:flex-1 [&>*]:basis-0">{buyerOptions.map((o) => <RadioTextCard key={o} Text={o} Selected={o === buyer} onClick={() => onBuyer?.(o)} />)}</div>
        </div>
      )}
    </Card>
  );
}
