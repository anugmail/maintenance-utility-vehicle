"use client";
/* ส่วนของแผนเดินทางที่ใช้ร่วม S7 S8 S10 S12 — ไม่ใช่ component ใหม่ จัดวางชิ้นไลบรารีตาม screens.js
   TripPartsSection = tripPartsSec(sel, detail) (R84): Section label "อะไหล่ของแผนเดินทาง (n)" + Table QPART_COLS ดูอย่างเดียว · ไม่มียานพาหนะ = Empty state/Data empty
   TripExportButton + TripExportPopup = TRIP_EXPORT_BTN + tripExport() (R84): Secondary button "ส่งออก" ไอคอน download ที่หัวหน้า → popup แบบส่งออกของ S4 (PopupModal + Radio text card รูปแบบไฟล์)
     หัว "ส่งออกแผนเดินทาง" บรรทัดรอง "{ชื่อแผนเดินทาง} · รายละเอียดแผนเดินทาง ยานพาหนะ {n} คัน และอะไหล่ของแผนเดินทาง" · ไม่มีการ์ดขอบเขต · ปุ่ม ยกเลิก / ส่งออก → toast "ส่งออกไฟล์สำเร็จ"
     ไฟล์ (tripPdf / tripXls): PDF 2 หน้า หัว "แผนเดินทาง · {ชื่อ} · หน้า n/2" (หน้า 1 รายละเอียด + ยานพาหนะ หน่วยงานเป็นบรรทัดรอง · หน้า 2 อะไหล่) · Excel ชีต "ยานพาหนะในแผนเดินทาง" "อะไหล่ของแผนเดินทาง" (คอลัมน์ชุดกลาง R81 R82) */
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { MobileCards } from "@/components/vms/MobileTable";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { Table } from "@/components/vms/Table";
import { EXPORT_CARDS } from "@/lib/mock/partsDash";
import type { QPartRow } from "@/lib/mock/moves";
import { QPART_COLS, qpartRow } from "@/lib/mock/plan";
import { notify } from "@/lib/mock/store";
import { tripVCells, tripVCols, type VCar, type VTrip } from "@/lib/mock/tripCols";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { downloadCsvSheets, openPrintPages } from "../../parts/_lib/exportFile";
import { RadioPick } from "../../parts/_lib/ui";

export const TRIP_PARTS_EMPTY = "เพิ่มยานพาหนะเข้าแผนเดินทางแล้ว อะไหล่ของยานพาหนะแต่ละคันจะรวมมาที่นี่";
export const TRIP_SHEETS = ["ยานพาหนะในแผนเดินทาง", "อะไหล่ของแผนเดินทาง"];

export function TripPartsSection({ parts }: { parts: QPartRow[] }) {
  const mob = useBreakpoint() === "Mobile";
  const rows = parts.map(qpartRow);
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title={"อะไหล่ของแผนเดินทาง (" + parts.length + ")"} />
      {!parts.length ? <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={TRIP_PARTS_EMPTY} />
        : mob ? <MobileCards columns={QPART_COLS} rows={rows} rowKey={(_, i) => parts[i].key} /> : <Table columns={QPART_COLS} rows={rows} rowKey={(_, i) => parts[i].key} />}
    </section>
  );
}

export function TripExportButton({ onClick }: { onClick: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  return <SecondaryButton Text="ส่งออก" LeadingIconSwap="download-24-300-round" Size={mob ? "lg" : "md"} onClick={onClick} />;
}

export interface TripDoc { name: string; unit: string; planLabel: string; printer: string; kv: [string, string][]; cars: VCar[]; trip: VTrip; parts: QPartRow[] }
export function TripExportPopup({ open, doc, onClose }: { open: boolean; doc: TripDoc; onClose: () => void }) {
  const [format, setFormat] = useState("PDF");
  const run = () => {
    const file = "แผนเดินทาง-" + doc.name;
    const info: [string, string][] = [["หน่วยงานที่ออกเอกสาร", doc.unit], ["แผน", doc.planLabel], ["พิมพ์เมื่อ", new Date().toLocaleString("th-TH")], ["ผู้พิมพ์", doc.printer]];
    const parts = { title: "อะไหล่ของแผนเดินทาง (" + doc.parts.length + ")", cols: QPART_COLS, rows: doc.parts.map(qpartRow) };
    if (format === "PDF") openPrintPages(file, [
      { heading: "แผนเดินทาง · " + doc.name + " · หน้า 1/2", info, sections: [{ title: "รายละเอียดแผนเดินทาง", pairs: doc.kv },
        { title: "ยานพาหนะในแผนเดินทาง (" + doc.cars.length + ")", cols: tripVCols({ unitSub: true }), rows: doc.cars.map((c) => tripVCells(c, doc.trip, { unitSub: true })) }] },
      { heading: "แผนเดินทาง · " + doc.name + " · หน้า 2/2", info, sections: [parts] },
    ]);
    else downloadCsvSheets(file, [{ title: TRIP_SHEETS[0], cols: tripVCols(), rows: doc.cars.map((c) => tripVCells(c, doc.trip)) }, { ...parts, title: TRIP_SHEETS[1] }]);
    onClose();
    notify("ส่งออกไฟล์สำเร็จ");
  };
  return (
    <PopupModal open={open} title="ส่งออกแผนเดินทาง" sub={doc.name + " · รายละเอียดแผนเดินทาง ยานพาหนะ " + doc.cars.length + " คัน และอะไหล่ของแผนเดินทาง"} ok="ส่งออก" onCancel={onClose} onOk={run}>
      <RadioPick title="รูปแบบไฟล์" options={EXPORT_CARDS} value={format} onChange={setFormat} />
    </PopupModal>
  );
}
