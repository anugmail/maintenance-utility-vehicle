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
   แบ่งหน้า (12 พ.ย. 2569 · BACKLOG ข้อ 74 · เจ้าของงาน 12 พ.ย. 2569 "ป๊อบอัพ ควรมีแบ่งหน้า" — popup เพิ่มยานพาหนะเข้าไตรมาส ~370 คัน):
     หน้าละ 10 + Table pagination ของไลบรารี ใต้ตาราง (desktop Breakpoint=Desktop · มือถือ Breakpoint=Mobile ใต้ List with checkbox แบบตารางอื่นของรีโป) · พิมพ์ค้นหา = กลับหน้า 1
     ติ๊กหัวตาราง = เลือกทุกคันที่ตรงคำค้น (ทุกหน้า · คงพฤติกรรมเดิมก่อนแบ่งหน้า) เลือกไม่ได้ (อยู่ในแผนเดินทางอื่น) ไม่นับ · ที่ติ๊กไว้คงอยู่เมื่อเปลี่ยนหน้า/คำค้น
     ใช้ทุก popup ที่เรียก TripCarPicker: หน้าไตรมาส S6 · ฟอร์มแผน S1 S19 (R75) · ฟอร์มแผนเดินทาง S6 S9
   ดูบันทึกใน figma-spec/COMPOSED.md */
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { TablePagination } from "@/components/vms/TablePagination";
import { TextInput } from "@/components/vms/TextInput";
import type { TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { MA_HEAD, REPAIR_HEAD, histText, useMachineDates } from "@/lib/mock/vehicleHistory";
import { CheckTable } from "@/app/new/CheckTable";

/* 11 พ.ย. 2569 เจ้าของงาน "อยากเพิ่ม วันที่ซ่อมล่าสุดด้วย ตอนเลือกรถเข้าแผน และตอนเลือกเข้าแผนการเดินทาง" (BACKLOG ข้อ 64) ⇒ บำรุงรักษาล่าสุด · ซ่อมล่าสุด (lib/mock/vehicleHistory.ts)
   ใช้ทุก popup ที่เรียก TripCarPicker: เพิ่มยานพาหนะเข้าแผนเดินทาง (S6 S9) · เพิ่มยานพาหนะเข้าไตรมาส (หน้าไตรมาส S6 · ฟอร์มแผน S1 S19 R75) · มือถือ = บรรทัดรองของรายการ */
/* แก้คำ 11 พ.ย. 2569 เป็นวันของเครื่องจักร (MA_HEAD REPAIR_HEAD) — popup กว้าง 800 ⇒ หน่วยงานเจ้าของยานพาหนะย้ายเป็นบรรทัดรองของทะเบียน (แบบ unitSub ของ tripVCols) */
const COLS = [{ head: "ทะเบียน", width: 190 }, { head: "ยี่ห้อ/รุ่น" }, { head: MA_HEAD, width: 200 }, { head: REPAIR_HEAD, width: 165 }];
const SEARCH = "ค้นหาทะเบียน, ยี่ห้อ/รุ่น, หน่วยงาน";
const PER = 10;

/* title / sub / okText / emptyText = popup "เพิ่มรถเข้าไตรมาส n" ของ E.1 (qAddModal() → tripCarModal(o.cars o.title o.sub o.okText)) · taken = รถที่อยู่ในแผนเดินทางอื่น (แสดงแต่เลือกไม่ได้) */
interface PickerProps { pool: TripCar[]; taken?: Record<string, string>; nowQ: string; onAdd: (ids: string[]) => void; onCancel: () => void; title?: string; sub?: string; okText?: string; emptyText?: string; emptySub?: string }
export function TripCarPicker({ open, ...p }: PickerProps & { open: boolean }) {
  if (!open) return null;
  return <Picker {...p} />;
}

function Picker({ pool, taken = {}, nowQ, onAdd, onCancel, title = "เพิ่มยานพาหนะเข้าแผนเดินทาง", sub: subText, okText = "เพิ่มเข้าแผนเดินทาง", emptyText, emptySub }: PickerProps) {
  const mob = useBreakpoint() === "Mobile";
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [ticked, setTicked] = useState<string[]>([]);
  const mDates = useMachineDates();
  const k = q.trim();
  const shown = k ? pool.filter((c) => c.plate.includes(k) || c.model.includes(k) || c.owner.includes(k)) : pool;
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const nTaken = pool.filter((c) => taken[c.id]).length;
  const n = ticked.length;
  const sub = subText ?? "ยานพาหนะทุกคันของ" + nowQ + (nTaken ? " · " + nTaken + " คันอยู่ในแผนเดินทางอื่นแล้ว เลือกไม่ได้" : "");
  const search = <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={q} Placeholder={SEARCH} onChange={(v) => { setQ(v); setPage(1); }} aria-label={SEARCH} className={mob ? "w-full" : "w-80"} />;
  const rows = shown.slice((pg - 1) * PER, pg * PER).map((c) => {
    const inTrip = taken[c.id] ? "อยู่ในแผนเดินทาง " + taken[c.id] : undefined, md = mDates(c.plate);
    return { key: c.id, text: c.plate, sub: c.owner + (inTrip ? " · " + inTrip : ""), mobileSub: (inTrip ? inTrip + " · " : "") + histText(md), disabled: !!taken[c.id], cells: [c.model, md.ma, md.repair] };
  });

  const body = !pool.length
    ? (emptyText ? <EmptyStateDataEmpty Text={emptyText} SupportingText={emptySub} Graphic="vehicle" /> : <EmptyStateDataEmpty Graphic="vehicle" Text={"ยานพาหนะทุกคันของ" + nowQ + " อยู่ในแผนเดินทางแล้ว"} SupportingText="ไม่มียานพาหนะที่เพิ่มเข้าแผนเดินทางนี้ได้" />)
    : <>{search}<CheckTable columns={COLS} rows={rows} scope={shown.map((c) => ({ key: c.id, disabled: !!taken[c.id] }))} ticked={ticked} onTicked={setTicked}
      Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} /></>;

  return (
    <PopupModal open title={title} sub={sub} width={800} ok={okText + (n ? " (" + n + ")" : "")} okDisabled={!n}
      onCancel={onCancel} onOk={() => onAdd(pool.filter((c) => ticked.includes(c.id) && !taken[c.id]).map((c) => c.id))}>
      {body}
    </PopupModal>
  );
}
