"use client";
/* หน้า /kit/ ส่วนเพิ่ม 4 พ.ย. 2569 — component ที่ scenario ที่เหลือ (S2–S24 · S11 S23 ตัดออก) ต้องใช้ · ไลบรารี (Component) VMS Plus + ไฟล์ Maintain-D + pattern ที่ประกอบ (COMPOSED.md)
   ข้อความตัวอย่างจาก maintainance-yearly-specs/S*.md (ค่าจาก screens.js) */
import { useState } from "react";
import { HandoverSignature, type SignerSlot } from "@/components/maintain-d/HandoverSignature";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { InspectionChecklist, type InspectionItem } from "@/components/maintain-d/InspectionChecklist";
import { ModalSignature } from "@/components/maintain-d/ModalSignature";
import { PartRequestStepPanel } from "@/components/maintain-d/PartRequestStepPanel";
import { PartsInventoryPanel } from "@/components/maintain-d/PartsInventoryPanel";
import { ReceiptChecklist, type ReceiptItem } from "@/components/maintain-d/ReceiptChecklist";
import { RepairFeedback } from "@/components/maintain-d/RepairFeedback";
import { RequestedPartsPanel } from "@/components/maintain-d/RequestedPartsPanel";
import { SelecteSparePart } from "@/components/maintain-d/SelecteSparePart";
import { SparePartCardItem, type SparePart } from "@/components/maintain-d/SparePartCardItem";
import { SummaryRequestedParts } from "@/components/maintain-d/SummaryRequestedParts";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { FormModal } from "@/components/patterns/FormModal";
import { NotificationPanel } from "@/components/patterns/NotificationPanel";
import { PhotoGallery } from "@/components/patterns/PhotoGallery";
import { PopupModal } from "@/components/patterns/PopupModal";
import { BadgeOutlineWithLeadingIcon } from "@/components/vms/BadgeOutlineWithLeadingIcon";
import { CardFormRow } from "@/components/vms/CardFormRow";
import { CheckboxTextCard } from "@/components/vms/CheckboxTextCard";
import { ContentDivider } from "@/components/vms/ContentDivider";
import { ContentItemBase } from "@/components/vms/ContentItemBase";
import { ContentItemRow } from "@/components/vms/ContentItemRow";
import { DatePicker } from "@/components/vms/DatePicker";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { FileIcon } from "@/components/vms/FileIcon";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { FileUploadBase } from "@/components/vms/FileUploadBase";
import { FileUploadItemBase } from "@/components/vms/FileUploadItemBase";
import { HorizontalRadioGroups } from "@/components/vms/HorizontalRadioGroups";
import { IconButton } from "@/components/vms/IconButton";
import { Images } from "@/components/vms/Images";
import { ListWithCheckbox } from "@/components/vms/ListWithCheckbox";
import { NotificationCard } from "@/components/vms/NotificationCard";
import { NotificationItemBase } from "@/components/vms/NotificationItemBase";
import { NumberInput } from "@/components/vms/NumberInput";
import { ProgressBar } from "@/components/vms/ProgressBar";
import { RadioButton } from "@/components/vms/RadioButton";
import { RadioTextCard, RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { Status, type StatusState } from "@/components/vms/Status";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput, type TextInputState } from "@/components/vms/TextInput";
import { Block, V } from "./KitBlocks";

const STATES = ["Default", "Hover", "Focused", "Disabled"] as const;

const PARTS: SparePart[] = [
  { name: "น้ำมันไฮโดรลิก ISO VG 46", code: "OL-0011", unit: "ลิตร", price: 120, warehouse: "Smart Inventory", stock: 420 },
  { name: "ไส้กรองไฮโดรลิก", code: "FL-0022", unit: "ชิ้น", price: 680, warehouse: "Smart Inventory", stock: 3 },
  { name: "ไส้กรองน้ำมันเครื่อง", code: "FL-0031", unit: "ชิ้น", price: 250, warehouse: "Smart Inventory", stock: 40 },
  { name: "ไส้กรองอากาศ", code: "FL-0040", unit: "ชิ้น", price: 420, warehouse: "คลังสำรอง", stock: 60 },
  { name: "ไส้กรองเชื้อเพลิง", code: "FL-0052", unit: "ชิ้น", price: 350, warehouse: "คลังสำรอง", stock: 1 },
];
const RECEIPT: ReceiptItem[] = ["แผ่นป้ายทะเบียนหน้า - หลัง", "ป้ายทะเบียนติดกระจกและ พรบ.", "กระจกมองข้างซ้าย - ขวา, กระจกมองหลัง", "ยางอะไหล่", "แบตเตอรี่", "เครื่องมือประจำยานพาหนะ, แม่แรง, ประแจถอดล้อ", "ฝาถังน้ำมัน", "อุปกรณ์บนหน้าปัด, แตร", "ใบปัดน้ำฝน", "วิทยุ, ลำโพง, เสาอากาศ, วิทยุรับ - ส่ง", "ระบบไฟแสงสว่าง", "สภาพยาง", "สภาพตัวถังและสี"]
  .map((name, i) => ({ name, has: i === 1 ? false : i < 6 ? true : null, damaged: i === 0, battery: name === "แบตเตอรี่" ? { brand: "GS Yuasa", qty: "1", unit: "ลูก" } : undefined }));
const INSPECT: InspectionItem[] = ["ชุดเกียร์ PTO", "ชุดกระบอกขาช้างหน้า ซ้าย ขวา", "ชุดกระบอกขาช้างหลัง ซ้าย ขวา", "ชุดวาร์ลคอนโทรลขาช้าง", "เพลาขับปั๊มน้ำมันไฮดรอลิค", "ปั๊มน้ำมันไฮดรอลิค"]
  .map((name, i) => ({ name, ok: i === 1 ? false : i < 4 ? true : null }));
const FILES: UploadFile[] = [
  { name: "ใบรับยานพาหนะ-82-6789.pdf", size: "200 KB", bar: true },
  { name: "ภาพก่อนเริ่มงาน-1.jpg", size: "1.2 MB", progress: 40 },
  { name: "ใบเสร็จ.png", size: "อัปโหลดไม่สำเร็จ — รับเฉพาะไฟล์ PDF หรือ JPG", err: true },
];
const KV: [string, string][] = [["ชื่อแผนเดินทาง", "แผนเดินทาง 1 · กฟฉ.1 ขอนแก่น"], ["แผน", "MRZ7000001 บำรุงรักษากระเช้าแก้ไฟ ภาค 1 และภาค 2 ปีงบประมาณ 2570"], ["ไตรมาส", "ไตรมาส 1"], ["ช่วงวันเดินทาง", "03/11/2569 – 07/11/2569"], ["พนักงานที่เดินทาง", "นายวิชัย ทองดี"], ["ผู้สร้าง", "นายวิชัย ทองดี (กกฟ.1)"], ["อนุมัติเมื่อ", "04/11/2569"]];
const NOTI: { state: StatusState; text: string; time: string }[] = [
  { state: "Brand", text: "แผนเดินทาง แผนเดินทาง 1 อนุมัติแล้ว หน่วยงานผู้ดำเนินการจะเข้าบำรุงรักษายานพาหนะ 4 คัน ระหว่างวันที่ 03/11/2569 ถึง 07/11/2569", time: "10 นาทีที่แล้ว" },
  { state: "Success", text: "บำรุงรักษายานพาหนะ 82-3302 อุดรธานี ตามแผนเดินทางเดือนตุลาคมเสร็จแล้ว", time: "2 วันที่แล้ว" },
];

export function KitMore() {
  const [open, setOpen] = useState<"" | "form" | "popup" | "noti" | "sig" | "sum">("");
  const [radio, setRadio] = useState("เก็บตัวอย่าง");
  const [hr, setHr] = useState<string | null>("ซ่อมเอง");
  const [chk, setChk] = useState(true);
  const [list, setList] = useState(["82-6789", "82-1145"]);
  const [num, setNum] = useState(30);
  const [area, setArea] = useState("");
  const [score, setScore] = useState<number | null>(4);
  const [receipt, setReceipt] = useState(RECEIPT);
  const [inspect, setInspect] = useState(INSPECT);
  const [picked, setPicked] = useState<string[]>(["OL-0011", "FL-0022"]);
  const [qty, setQty] = useState<Record<string, number>>({ "OL-0011": 30, "FL-0022": 2 });
  const [q, setQ] = useState("");
  const [slots, setSlots] = useState<SignerSlot[]>([
    { LabelText: "ผู้ส่งมอบยานพาหนะ (หน่วยงานเจ้าของยานพาหนะ)", Placeholder: "เลือกผู้ส่งมอบยานพาหนะ (หน่วยงานเจ้าของยานพาหนะ)", options: ["นายสุรชัย แก้วมณี", "นางสาวกนกวรรณ ใจมั่น"], value: "นายสุรชัย แก้วมณี", signed: true },
    { LabelText: "ผู้ส่งมอบยานพาหนะ (หน่วยงานผู้ดำเนินการ)", Placeholder: "เลือกผู้ส่งมอบยานพาหนะ (หน่วยงานผู้ดำเนินการ)", options: ["นายวิชัย ทองดี", "นายสมชาย พูลสุข"], value: null },
  ]);
  const [sigFor, setSigFor] = useState(0);
  const pick = (p: SparePart) => setPicked((x) => (x.includes(p.code!) ? x.filter((c) => c !== p.code) : [...x, p.code!]));
  const chosen = PARTS.filter((p) => picked.includes(p.code!));
  const take = chosen.reduce((a, p) => a + p.price * (qty[p.code!] ?? 1), 0);
  return (
    <>
      {/* ---------- ไลบรารี (Component) VMS Plus ---------- */}
      <Block name="Text area" node="Inputs (2:6)">
        {(["Default", "Filled", "Focused", "Error", "Disabled", "Readonly"] as TextInputState[]).map((st) => (
          <V key={st} label={`State=${st}, Size=md`}><TextArea className="w-[352px]" LabelText="เหตุผลที่ส่งกลับ" Optional={st === "Default"} State={st} Text={st === "Default" ? "" : "ช่วงวันที่ตรงกับแผนดับไฟ"} Placeholder="ระบุเหตุผล" HelperText={st === "Error" ? "กรุณาระบุเหตุผล" : undefined} /></V>
        ))}
        <V label="ใช้งานจริง"><TextArea className="w-[352px]" LabelText="หมายเหตุ" Optional Text={area} Placeholder="ระบุหมายเหตุ" onChange={setArea} /></V>
      </Block>
      <Block name="Radio button" node="Radio button (2:17)">
        {[false, true].flatMap((sel) => STATES.map((st) => <V key={st + sel} label={`State=${st}, Selected=${sel ? "True" : "False"}`}><RadioButton Selected={sel} State={st} label="ตัวอย่าง" /></V>))}
      </Block>
      <Block name="Horizontal radio groups" node="Radio button (2:17)">
        <V label="ค่าเริ่ม"><HorizontalRadioGroups Label="รูปแบบการดำเนินการ" options={["ซ่อมเอง", "จ้างดำเนินการ"]} value={hr} onChange={setHr} /></V>
        <V label="Helper = error"><HorizontalRadioGroups Label="ผลการตรวจรับ" options={["ผ่าน", "ไม่ผ่าน"]} value={null} HelperText="กรุณาเลือกผลการตรวจรับ" Error /></V>
      </Block>
      <Block name="Radio text card" node="Radio button (2:17)">
        {[false, true].flatMap((sel) => STATES.map((st) => <V key={st + sel} label={`State=${st}, Selected=${sel ? "True" : "False"}`}><RadioTextCard className="w-60" Text="เก็บตัวอย่าง" SupportingText="Supporting text" Selected={sel} State={st} /></V>))}
        <V label="radioPick() — แถวการ์ดกว้าง/สูงเท่ากัน (มือถือเรียงลง)" wide>
          <RadioTextCards options={[{ Text: "เก็บตัวอย่าง" }, { Text: "เปลี่ยนน้ำมัน" }]} value={radio} onChange={setRadio} />
        </V>
      </Block>
      <Block name="Checkbox text card" node="Checkbox (2:18)">
        {[false, true].flatMap((sel) => STATES.map((st) => <V key={st + sel} label={`State=${st}, Selected=${sel ? "True" : "False"}`}><CheckboxTextCard className="w-60" Text="ชำรุด" SupportingText="Supporting text" Selected={sel} State={st} /></V>))}
        <V label="ใช้งานจริง"><CheckboxTextCard className="w-60" Text="ผิดรุ่น" Selected={chk} onChange={setChk} /></V>
      </Block>
      <Block name="Number input" node="Inputs (2:6)">
        {(["Filled", "Focused", "Error", "Disabled"] as const).map((st) => <V key={st} label={`State=${st}, Size=md`}><NumberInput className="w-[360px]" LabelText="จำนวน" State={st} Number={10} HelperText={st === "Error" ? "จำนวนเกินคงเหลือ" : undefined} /></V>)}
        <V label="ในการ์ดอะไหล่ (กว้าง 120 ไม่มีป้าย)"><NumberInput Label={false} Number={num} min={1} onChange={setNum} className="w-30" /></V>
      </Block>
      <Block name="Progress bar" node="Progress bar (2843:13902)">
        {[0, 20, 40, 60, 80, 100].map((p) => <V key={p} label={`Label=Right, Progress=${p}%, Size=md`}><ProgressBar Progress={p} className="w-[448px]" /></V>)}
        <V label="ในรายการไฟล์ Completed (success-500)"><ProgressBar Progress={100} Color="Success" className="w-[448px]" /></V>
      </Block>
      <Block name="File upload · _File upload base · _File upload item base · _File icon" node="File upload (2123:5261)">
        {(["Default", "Hover", "Focused", "Error", "Disabled"] as const).map((st) => <V key={st} label={`_File upload base State=${st}`}><FileUploadBase className="w-[400px]" State={st} SupportingText="PDF, JPG · สูงสุด 10 ไฟล์ · 0/10 ไฟล์" /></V>)}
        <V label="_File icon Type=Document / Image"><span className="flex gap-3"><FileIcon Type="Document" /><FileIcon Type="Image" /></span></V>
        {(["In progress", "Completed", "Error"] as const).map((st) => <V key={st} label={`_File upload item base State=${st}`}><div className="w-[400px]"><FileUploadItemBase State={st} FileName="Document.pdf" FileSize={st === "Error" ? "อัปโหลดไม่สำเร็จ" : "200 KB"} /></div></V>)}
        <V label="File upload Type=Default (upload() — ไฟล์ 3 สถานะ)"><FileUpload className="w-[402px]" LabelText="เอกสารประกอบ" Optional files={FILES} /></V>
        <V label="File upload readonly (หน้ารายละเอียด)"><FileUpload className="w-[402px]" LabelText="เอกสารประกอบ" readonly files={FILES.slice(0, 1)} /></V>
      </Block>
      <Block name="_Content item base · Content item row" node="Cards (2413:11354)">
        {(["Text", "Text with label", "Attachment", "Big"] as const).map((t) => <V key={t} label={`_Content item base Type=${t}`}><div className="w-60"><ContentItemBase Type={t} Label="Label" Text="Item" SupportingText="Supporting text" /></div></V>)}
        <V label="Content item row Column width=Full (4 ช่อง)" wide><ContentItemRow items={KV.slice(0, 4)} /></V>
      </Block>
      <Block name="Card form row" node="Cards (2413:11354)">
        <V label="Width=Full" wide><CardFormRow Input1={<TextInput LabelText="เบอร์ติดต่อ" Text="081-472-3365" />} Input2={<TextInput LabelText="สถานที่บำรุงรักษา" Text="สำนักงาน กฟฉ.1 ขอนแก่น" />} /></V>
        <V label="Width=50%" wide><CardFormRow Width="50%" Input1={<TextInput LabelText="เบอร์ติดต่อ" Text="081-472-3365" />} /></V>
      </Block>
      <Block name="Content divider" node="Content divider (2635:20181)">
        <V label="Type=Default"><ContentDivider className="w-[348px]" /></V>
        <V label="Type=Text"><ContentDivider Type="Text" className="w-[348px]" /></V>
      </Block>
      <Block name="Empty state/Search not found" node="Table (2:14)">
        <V label="ค่าเริ่มไลบรารี" wide><EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" />} /></V>
      </Block>
      <Block name="Images · Icon button" node="Images (2648:43267) · Button (2:5)">
        <V label="Size=sm, Type=Empty (ไม่มีไฟล์ภาพ)"><Images Size="sm" className="h-39 w-[175px]" /></V>
        <V label="Size=md, Type=Empty"><Images Size="md" className="h-60 w-80" /></V>
        {STATES.map((st) => <V key={st} label={`Icon button State=${st}`}><IconButton IconSwap="keyboard_arrow_right-20-400-round" State={st} aria-label="ถัดไป" /></V>)}
      </Block>
      <Block name="List with checkbox" node="List (3285:58382)">
        <V label="มือถือ — เลือกยานพาหนะเข้าแผนเดินทาง (S6)"><div className="w-[348px]"><ListWithCheckbox Title="ทะเบียน" options={[{ value: "82-6789", Text: "82-6789 ขอนแก่น" }, { value: "82-1145", Text: "82-1145 ขอนแก่น" }, { value: "80-9981", Text: "80-9981 ลำปาง" }]} value={list} onChange={setList} /></div></V>
      </Block>
      <Block name="Date picker" node="Date picker (855:376)">
        <V label="Type=Dual, Time picker=false (S6 ช่วงวันเดินทาง)"><DatePicker Type="Dual" month={new Date(2026, 10, 1)} today={new Date(2026, 10, 4)} value={{ start: new Date(2026, 10, 3), end: new Date(2026, 10, 7) }} /></V>
      </Block>
      <Block name="Status · _Notification item base · Notification card" node="Header navigation (2:4)">
        {(["Success", "Warning", "Error", "Brand", "Info"] as StatusState[]).map((s) => <V key={s} label={`Status State=${s}`}><Status State={s} /></V>)}
        <V label="_Notification item base"><div className="w-[314px]"><NotificationItemBase StatusState="Brand" Text={NOTI[0].text} SupportingText={NOTI[0].time} /></div></V>
        <V label="Notification card"><NotificationCard Badge="1 แจ้งเตือนใหม่">{NOTI.map((n, i) => <NotificationItemBase key={i} StatusState={n.state} Text={n.text} SupportingText={n.time} />)}</NotificationCard></V>
      </Block>
      <Block name="Badge outline with leading icon" node="Badge (2:13)">
        {(["Brand", "Gray", "Success", "Error", "Disabled"] as const).map((c) => <V key={c} label={`Color=${c}`}><BadgeOutlineWithLeadingIcon Color={c} Text="เลือกแล้ว" /></V>)}
      </Block>

      {/* ---------- ไฟล์ Maintain-D (CLAUDE.md ข้อ 12) ---------- */}
      <Block name="VehicleAndReporterInfo (Maintain-D) · กล่องแสดงข้อมูล DisplayBox (ประกอบ)" node="Maintain-D รายละเอียดงานซ่อม (175:79986) · kv() + displayBox()">
        <V label="VehicleAndReporterInfo — desktop แถวละ 4 (มือถือ = DisplayBox แถวละ 2)" wide><VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={KV} /></V>
        <V label="DisplayBox (ประกอบจาก Section label + Content item row)" wide><DisplayBox Title="ข้อมูลแผน" pairs={KV} /></V>
      </Block>
      <Block name="IncidentPhotoGallery (Maintain-D) · PhotoGallery (ประกอบ)" node="Maintain-D รายละเอียดงานซ่อม (175:79986) · photoGallery()">
        <V label="IncidentPhotoGallery — 6 ภาพ (ปุ่มถัดไป)" wide><IncidentPhotoGallery Title="ภาพก่อนเริ่มงาน (6)" photos={Array.from({ length: 6 }, () => ({}))} /></V>
        <V label="PhotoGallery — library fallback" wide><PhotoGallery Title="ภาพก่อนเริ่มงาน (2)" photos={[{}, {}]} /></V>
      </Block>
      <Block name="RepairFeedback (Maintain-D)" node="Maintain-D Design (0:1)">
        <V label="S13 คะแนนความพึงพอใจ" wide><RepairFeedback Title="คะแนนประเมินความพึงพอใจงานบำรุงรักษา" SupportingText="ให้คะแนน 1–5 · 1 ต้องปรับปรุงมาก · 5 ดีมาก" value={score} onChange={setScore} /></V>
      </Block>
      <Block name="HandoverSignature · Modal Signature (Maintain-D)" node="Maintain-D Design (0:1)">
        <V label="State=Signed (ซ้าย) · Default (ขวา)" wide>
          <HandoverSignature slots={slots} onPick={(i, n) => setSlots((s) => s.map((x, j) => (j === i ? { ...x, value: n } : x)))} onSign={(i) => { setSigFor(i); setOpen("sig"); }} />
        </V>
      </Block>
      <Block name="ReceiptChecklist (Maintain-D)" node="Maintain-D Design (0:1)">
        <V label="State=Filled" wide><ReceiptChecklist items={receipt} onChange={(i, p) => setReceipt((r) => r.map((x, j) => (j === i ? { ...x, ...p } : x)))} onAdd={() => undefined} /></V>
      </Block>
      <Block name="InspectionChecklist (Maintain-D)" node="Maintain-D Design (0:1)">
        <V label="ตรวจสภาพยานพาหนะปิดงาน (S10 · AfterRepair)" wide><InspectionChecklist Title="ตรวจสภาพยานพาหนะปิดงาน" Badge={24} items={inspect} onChange={(i, p) => setInspect((r) => r.map((x, j) => (j === i ? { ...x, ...p } : x)))} onAdd={() => undefined} /></V>
      </Block>
      <Block name="Spare Part Card Item · Selecte Spare Part (Maintain-D)" node="Maintain-D Local Component (8:133440)">
        {(["Add", "Checked"] as const).map((s) => <V key={s} label={`Selecte Spare Part State=${s}`}><SelecteSparePart State={s} /></V>)}
        <V label="Selecte Spare Part State=Text"><SelecteSparePart State="Text" Text="2,160 บาท" /></V>
        <V label="อะไหล่=รายการในคลัง"><div className="w-[387px]"><SparePartCardItem part={PARTS[1]} /></div></V>
        <V label="อะไหล่=V2 รายการที่เลือก (ซื้อเพิ่ม)"><div className="w-[560px]"><SparePartCardItem อะไหล่="V2 รายการที่เลือก" part={PARTS[1]} qty={4} buyMore={1} onDelete={() => undefined} /></div></V>
        <V label="อะไหล่=เพิ่มอะไหล่"><div className="w-[560px]"><SparePartCardItem อะไหล่="เพิ่มอะไหล่" qty={2} manual={{ name: "ไส้กรองอากาศขนาดเล็ก", code: "", price: "750" }} onDelete={() => undefined} /></div></V>
      </Block>
      <Block name="PartRequestStepPanel · PartsInventoryPanel · RequestedPartsPanel (Maintain-D)" node="Maintain-D Design (0:1)">
        <V label="S21 อะไหล่ของยานพาหนะ (เลือกจากคลัง ↔ อะไหล่ของยานพาหนะคันนี้)" wide>
          <PartRequestStepPanel
            Inventory={<PartsInventoryPanel parts={PARTS} picked={picked} onPick={pick} query={q} onQuery={setQ} />}
            Requested={
              <RequestedPartsPanel Title="อะไหล่ของยานพาหนะคันนี้" SupportingText="เลือกจากคลังหรือระบุเพิ่มเอง แก้จำนวนหรือเอาออกได้" Badge={chosen.length} costs={[["เบิกจากคลัง", take], ["ต้องจัดซื้อ", 0]]}>
                {chosen.map((p) => <SparePartCardItem key={p.code} อะไหล่="V2 รายการที่เลือก" part={p} qty={qty[p.code!] ?? 1} onQty={(n) => setQty((x) => ({ ...x, [p.code!]: n }))} onDelete={() => pick(p)} />)}
              </RequestedPartsPanel>
            } />
        </V>
        <V label="PartsInventoryPanel State=API error"><div className="w-[421px]"><PartsInventoryPanel parts={PARTS} apiError /></div></V>
        <V label="RequestedPartsPanel State=Default"><div className="w-[560px]"><RequestedPartsPanel costs={[["เบิกจากคลัง", 0], ["ต้องจัดซื้อ", 0]]} /></div></V>
      </Block>

      {/* ---------- pattern ที่ประกอบจากชิ้นไลบรารี (COMPOSED.md ก.) ---------- */}
      <Block name="Pattern: FormModal · PopupModal · NotificationPanel · Modal Signature · SummaryRequestedParts" node="formModal() · popupModal() · notiPanel() · Maintain-D">
        <V label="FormModal (Modal Type=Form)"><SecondaryButton Text="เปิด" onClick={() => setOpen("form")} /></V>
        <V label="PopupModal (เนื้อหาอิสระ 640)"><SecondaryButton Text="เปิด" onClick={() => setOpen("popup")} /></V>
        <V label="NotificationPanel (กระดิ่ง)"><SecondaryButton Text="เปิด" onClick={() => setOpen("noti")} /></V>
        <V label="Modal Signature"><SecondaryButton Text="เปิด" onClick={() => { setSigFor(1); setOpen("sig"); }} /></V>
        <V label="SummaryRequestedParts"><SecondaryButton Text="เปิด" onClick={() => setOpen("sum")} /></V>
      </Block>

      <FormModal open={open === "form"} title="แก้ไขเบอร์ติดต่อและสถานที่ · 82-6789 ขอนแก่น" fields={[{ label: "เบอร์ติดต่อ", value: "081-472-3365" }, { label: "สถานที่บำรุงรักษา", value: "สำนักงาน กฟฉ.1 ขอนแก่น", area: true }]}
        onOk={() => setOpen("")} onCancel={() => setOpen("")} />
      <PopupModal open={open === "popup"} title="เพิ่มยานพาหนะเข้าแผนเดินทาง" sub="ยานพาหนะของไตรมาส 1ที่ยังไม่อยู่ในแผนเดินทางใด · อีก 4 คันอยู่ในแผนเดินทางอื่นแล้ว" ok="เพิ่มเข้าแผนเดินทาง (2)" onOk={() => setOpen("")} onCancel={() => setOpen("")}>
        <FileUpload LabelText="เอกสารประกอบ" Optional files={FILES.slice(0, 1)} />
      </PopupModal>
      <NotificationPanel open={open === "noti"} onClose={() => setOpen("")} badge="1 แจ้งเตือนใหม่" items={NOTI.map((n) => ({ ...n, onClick: () => setOpen("") }))} onClearAll={() => setOpen("")} />
      <ModalSignature open={open === "sig"} Title="ลงนามการรับมอบยานพาหนะ" signer={[slots[sigFor].LabelText, slots[sigFor].value ?? "-"]} onClose={() => setOpen("")}
        onSave={() => { setSlots((s) => s.map((x, j) => (j === sigFor ? { ...x, signed: true } : x))); setOpen(""); }} />
      <SummaryRequestedParts open={open === "sum"} Title="สรุปรายการเบิก/จองอะไหล่" cancel="ยกเลิก" ok="ยืนยันเบิก/จอง" onOk={() => setOpen("")} onCancel={() => setOpen("")}
        groups={[{ title: "อะไหล่ที่เบิก", subs: [{ title: "เบิกที่ Smart Inventory", rows: [["น้ำมันไฮโดรลิก ISO VG 46 x60", 7200], ["ไส้กรองน้ำมันเครื่อง x12", 3000]] }, { title: "เบิกที่คลังสำรอง", rows: [["ไส้กรองอากาศ x12", 5040]] }] },
          { title: "อะไหล่ที่จัดซื้อ", subs: [{ title: "จัดซื้ออะไหล่เพิ่มโดย Smart Inventory", rows: [["ไส้กรองไฮโดรลิก x9", 6120]] }] }]}
        totals={[["เบิกจาก Smart Inventory", 10200], ["เบิกจากคลังสำรอง", 5040], ["จัดซื้ออะไหล่เพิ่มโดย Smart Inventory", 6120]]} />
    </>
  );
}
