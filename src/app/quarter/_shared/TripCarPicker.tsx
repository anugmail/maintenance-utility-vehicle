"use client";
/* popup เพิ่มรถเข้าแผนเดินทาง — tripCarModal() ใน screens.js (S6 E.3 E.10 E.12 · S9 H.3) · spec S6.md P3
   Desktop: patterns/PopupModal กว้าง 800 · หัว "เพิ่มรถเข้าแผนเดินทาง" + บรรทัดรอง (· อีก x คันอยู่ในแผนเดินทางอื่นแล้ว)
            เนื้อหา = ช่องค้นหาของ Table header (Text input ไอคอน search ไม่มีป้าย กว้าง 320 — Table header แบบไม่มีปุ่มตัวกรอง)
                     + ตาราง Lead checkbox ประกอบจาก Table header cell (Checkbox ที่หัวคอลัมน์แรก) + Table cell Style=Lead checkbox (Table ของไลบรารีรับช่องติ๊กไม่ได้)
            รถหมด = Empty state/Data empty · ปุ่มหลัก "เพิ่มเข้าแผนเดินทาง (n)" · ติ๊ก 0 คัน = "เพิ่มเข้าแผนเดินทาง" Disabled
   Mobile: Bottom sheet หัว "เพิ่มรถเข้าแผนเดินทาง" (ไม่มีบรรทัดรอง) · ช่องค้นหา + List with checkbox (หัว "ทะเบียน" · รายการ = ทะเบียน) ตาม mobileCards() ใน core.js
   ดูบันทึกใน figma-spec/COMPOSED.md */
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { ListWithCheckbox } from "@/components/vms/ListWithCheckbox";
import { TableCell } from "@/components/vms/TableCell";
import { TableHeaderCell } from "@/components/vms/TableHeaderCell";
import { TextInput } from "@/components/vms/TextInput";
import type { TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS = [{ head: "ทะเบียน", width: 240 }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 200 }];
const SEARCH = "ค้นหาทะเบียน, ยี่ห้อ/รุ่น, หน่วยงาน";

/* title / sub / okText / emptyText = popup "เพิ่มรถเข้าไตรมาส n" ของ E.1 (qAddModal() → tripCarModal(o.cars o.title o.sub o.okText)) */
interface PickerProps { pool: TripCar[]; used: number; nowQ: string; onAdd: (ids: string[]) => void; onCancel: () => void; title?: string; sub?: string; okText?: string; emptyText?: string }
export function TripCarPicker({ open, ...p }: PickerProps & { open: boolean }) {
  if (!open) return null;
  return <Picker {...p} />;
}

function Picker({ pool, used, nowQ, onAdd, onCancel, title = "เพิ่มรถเข้าแผนเดินทาง", sub: subText, okText = "เพิ่มเข้าแผนเดินทาง", emptyText }: PickerProps) {
  const mob = useBreakpoint() === "Mobile";
  const [q, setQ] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const k = q.trim();
  const shown = k ? pool.filter((c) => c.plate.includes(k) || c.model.includes(k) || c.owner.includes(k)) : pool;
  const n = ticked.length;
  const allShown = shown.length > 0 && shown.every((c) => ticked.includes(c.id));
  const someShown = shown.some((c) => ticked.includes(c.id));
  const flip = (id: string, on: boolean) => setTicked((t) => (on ? [...t, id] : t.filter((x) => x !== id)));
  const flipAll = () => setTicked((t) => (allShown ? t.filter((x) => !shown.some((c) => c.id === x)) : [...new Set([...t, ...shown.map((c) => c.id)])]));
  const sub = subText ?? "รถของ" + nowQ + "ที่ยังไม่อยู่ในแผนเดินทางใด" + (used ? " · อีก " + used + " คันอยู่ในแผนเดินทางอื่นแล้ว" : "");
  const search = <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={q} Placeholder={SEARCH} onChange={setQ} aria-label={SEARCH} className={mob ? "w-full" : "w-80"} />;

  const body = !pool.length
    ? (emptyText ? <EmptyStateDataEmpty Text={emptyText} Graphic="vehicle" /> : <EmptyStateDataEmpty Graphic="vehicle" Text={"รถทุกคันของ" + nowQ + "อยู่ในแผนเดินทางแล้ว"} SupportingText="ไม่มีรถที่เพิ่มเข้าแผนเดินทางนี้ได้" />)
    : mob
      ? <>{search}<ListWithCheckbox Title="ทะเบียน" options={shown.map((c) => ({ value: c.id, Text: c.plate }))} value={ticked} onChange={setTicked} /></>
      : (
        <>
          {search}
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <colgroup><col className="w-60" /><col /><col className="w-50" /></colgroup>
              <thead>
                <tr>
                  <TableHeaderCell Text={COLS[0].head} Checkbox checkType={allShown ? "Selected" : someShown ? "Indeterminate" : "Unselected"} onCheck={flipAll} />
                  <TableHeaderCell Text={COLS[1].head} />
                  <TableHeaderCell Text={COLS[2].head} />
                </tr>
              </thead>
              <tbody>
                {shown.map((c, i) => (
                  <tr key={c.id}>
                    <TableCell Style="Lead checkbox" AlternatingFills={i % 2 === 1} Text={c.plate} checked={ticked.includes(c.id)} onCheck={(on) => flip(c.id, on)} />
                    <TableCell AlternatingFills={i % 2 === 1} Text={c.model} />
                    <TableCell AlternatingFills={i % 2 === 1} Text={c.owner} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );

  return (
    <PopupModal open title={title} sub={sub} width={800} ok={okText + (n ? " (" + n + ")" : "")} okDisabled={!n}
      onCancel={onCancel} onOk={() => onAdd(pool.filter((c) => ticked.includes(c.id)).map((c) => c.id))}>
      {body}
    </PopupModal>
  );
}
