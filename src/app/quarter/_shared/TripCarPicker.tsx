"use client";
/* popup เพิ่มรถเข้าแผนเดินทาง — tripCarModal() ใน screens.js (S6 E.3 E.10 E.12 · S9 H.3) · spec S6.md P3
   Desktop: patterns/PopupModal กว้าง 800 · หัว "เพิ่มรถเข้าแผนเดินทาง" + บรรทัดรอง (· อีก x คันอยู่ในแผนเดินทางอื่นแล้ว)
            เนื้อหา = ช่องค้นหาของ Table header (Text input ไอคอน search ไม่มีป้าย กว้าง 320 — Table header แบบไม่มีปุ่มตัวกรอง)
                     + ตาราง Lead checkbox ประกอบจาก Table header cell (Checkbox ที่หัวคอลัมน์แรก) + Table cell Style=Lead checkbox (Table ของไลบรารีรับช่องติ๊กไม่ได้)
            รถหมด = Empty state/Data empty · ปุ่มหลัก "เพิ่มเข้าแผนเดินทาง (n)" · ติ๊ก 0 คัน = "เพิ่มเข้าแผนเดินทาง" Disabled
   Mobile: Bottom sheet หัว "เพิ่มรถเข้าแผนเดินทาง" (ไม่มีบรรทัดรอง) · ช่องค้นหา + List with checkbox (หัว "ทะเบียน" · รายการ = ทะเบียน) ตาม mobileCards() ใน core.js
   5 พ.ย. 2569 (รีวิว "รถ 1 คันในไตรมาส สามารถอยู่ได้เพียง 1 แผนการเดินทางเท่านั้น · รถที่ถูกเลือกลงแผนอื่นไปแล้ว จะยังแสดงให้เห็น … แต่ไม่สามารถเลือกลงแผนเดินทางนี้ได้"):
     taken = { รถ: ชื่อแผนเดินทาง } → แถวแสดงแต่ Checkbox State=Disabled + บรรทัดรอง "อยู่ในแผนเดินทาง {ชื่อ}" (มือถือ List with checkbox item State=Disabled) · ติ๊กทั้งหมดนับเฉพาะคันที่เลือกได้
     บรรทัดรองของหัว "รถทุกคันของไตรมาส n · x คันอยู่ในแผนเดินทางอื่นแล้ว เลือกไม่ได้" (tripCarModal)
   ดูบันทึกใน figma-spec/COMPOSED.md */
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { TextInput } from "@/components/vms/TextInput";
import type { TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { CheckTable } from "@/app/new/CheckTable";

const COLS = [{ head: "ทะเบียน", width: 240 }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 200 }];
const SEARCH = "ค้นหาทะเบียน, ยี่ห้อ/รุ่น, หน่วยงาน";

/* title / sub / okText / emptyText = popup "เพิ่มรถเข้าไตรมาส n" ของ E.1 (qAddModal() → tripCarModal(o.cars o.title o.sub o.okText)) · taken = รถที่อยู่ในแผนเดินทางอื่น (แสดงแต่เลือกไม่ได้) */
interface PickerProps { pool: TripCar[]; taken?: Record<string, string>; nowQ: string; onAdd: (ids: string[]) => void; onCancel: () => void; title?: string; sub?: string; okText?: string; emptyText?: string; emptySub?: string }
export function TripCarPicker({ open, ...p }: PickerProps & { open: boolean }) {
  if (!open) return null;
  return <Picker {...p} />;
}

function Picker({ pool, taken = {}, nowQ, onAdd, onCancel, title = "เพิ่มรถเข้าแผนเดินทาง", sub: subText, okText = "เพิ่มเข้าแผนเดินทาง", emptyText, emptySub }: PickerProps) {
  const mob = useBreakpoint() === "Mobile";
  const [q, setQ] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const k = q.trim();
  const shown = k ? pool.filter((c) => c.plate.includes(k) || c.model.includes(k) || c.owner.includes(k)) : pool;
  const nTaken = pool.filter((c) => taken[c.id]).length;
  const n = ticked.length;
  const sub = subText ?? "รถทุกคันของ" + nowQ + (nTaken ? " · " + nTaken + " คันอยู่ในแผนเดินทางอื่นแล้ว เลือกไม่ได้" : "");
  const search = <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={q} Placeholder={SEARCH} onChange={setQ} aria-label={SEARCH} className={mob ? "w-full" : "w-80"} />;
  const rows = shown.map((c) => ({ key: c.id, text: c.plate, sub: taken[c.id] ? "อยู่ในแผนเดินทาง " + taken[c.id] : undefined, disabled: !!taken[c.id], cells: [c.model, c.owner] }));

  const body = !pool.length
    ? (emptyText ? <EmptyStateDataEmpty Text={emptyText} SupportingText={emptySub} Graphic="vehicle" /> : <EmptyStateDataEmpty Graphic="vehicle" Text={"รถทุกคันของ" + nowQ + " อยู่ในแผนเดินทางแล้ว"} SupportingText="ไม่มีรถที่เพิ่มเข้าแผนเดินทางนี้ได้" />)
    : <>{search}<CheckTable columns={COLS} rows={rows} ticked={ticked} onTicked={setTicked} /></>;

  return (
    <PopupModal open title={title} sub={sub} width={800} ok={okText + (n ? " (" + n + ")" : "")} okDisabled={!n}
      onCancel={onCancel} onOk={() => onAdd(pool.filter((c) => ticked.includes(c.id) && !taken[c.id]).map((c) => c.id))}>
      {body}
    </PopupModal>
  );
}
