"use client";
/* แท็บ "ข้อมูลยานพาหนะ" ของหน้ารายละเอียดยานพาหนะ (S24 · BACKLOG ข้อ 83 · เจ้าของงาน 12 พ.ย. 2569 _"หน้าข้อมูลยานพาหนะ อยากให้อ่าน vehicle-management component แล้วเอามาแสดง"_)
   ตามเฟรม "Vehicle info" ของหน้า 5.2 Vehicle Management · UI Release#2 (component "Vehicle detail" Type=Default · Dept=true · Carpool=false
   · ข้อความทุกชิ้น userflow/figma-ref/vehicle-info-vms-2569-11-12.txt · ดัมป์ design-system/.figma-extract/ui-release2/8-47654.json)
   ดูอย่างเดียว (แบบ R30) — ไม่มีปุ่ม แก้ไข ของทุก Section label · ดูรายละเอียด · เปลี่ยนเลขทะเบียน · เปลี่ยนสังกัด · Carpool toggle ของ VMS+ (งานผู้ดูแลข้อมูลยานพาหนะ ไม่ใช่งานบำรุงรักษา)
     · ดาวน์โหลดไฟล์ใบคู่มือจดทะเบียนคงไว้ · แบบไม่มีปุ่มแก้ไขมีในเฟรม Vehicle info ของ UI Release#2 เอง (เฟรมที่ 6 ของหน้า · เลขที่สัญญาเป็น Text with label ไม่ใช่ลิงก์)
   desktop = 2 คอลัมน์ตาม Section ของ Vehicle detail (ช่องไฟ 24): ซ้าย FILL 746 / ขวา 526 ที่ 1296 = grid 12 ช่อง 7 : 5 (746 / 526 พอดี)
     ซ้าย: ข้อมูลทั่วไป → ข้อมูลการเงินและสัญญา → ข้อมูลสังกัดยานพาหนะ → ข้อมูลการจดทะเบียน → [เครื่องมือกล ของเรา] → (ข้อมูลยานพาหนะไฟฟ้า เฉพาะ EV · ไม่มีในกลุ่มนี้)
     ขวา: รูปยานพาหนะ (Images md) → ใบคู่มือจดทะเบียน (_File upload item base) → บัตรเติมน้ำมัน (Fleet card) → การใช้งานล่าสุด (Last usage)
     ใต้ 2 คอลัมน์ (เต็มแถว · ของเรา): การรับประกัน (เดิมแท็บการรับประกัน · เจ้าของงาน 12 พ.ย. 2569 _"ตัดtab การรับประกัน เดี๋ยวจะเอาข้อมูลไปใส่ในข้อมูลรถ"_ · BACKLOG ข้อ 85)
   กล่องข้อมูล = Section label → ห่าง 8 → กล่อง gray-50 รัศมี 8 ขอบใน 24 ช่องไฟแถว 24 · แถว = Content item row (Full / 50% first column) ช่อง _Content item base Text with label
   มือถือ: เรียง 1 คอลัมน์ ลำดับเดียวกัน · Content item row แถวละ 2 ช่อง (R12 · แบบ DisplayBox) · UI Release#2 ไม่มีเฟรม Vehicle info มือถือ
   ป้ายของ VMS+ ที่มีคำว่า "รถ" เปลี่ยนเป็น "ยานพาหนะ" ตาม R80 (รหัสข้างรถ → รหัสข้างยานพาหนะ · ยี่ห้อรถ → ยี่ห้อยานพาหนะ · เลขตัวรถ → เลขตัวยานพาหนะ · ตำแหน่งเลขตัวรถ · สถานที่จอดรถ)
   ช่องของเราที่ VMS+ ไม่มีที่วาง: ปีที่จดทะเบียน · อายุการใช้งาน → แถวท้ายของข้อมูลการจดทะเบียน · ชั่วโมงเครื่องจักรสะสม → แถวที่ 2 ของการ์ดการใช้งานล่าสุด
     ผู้ดูแลยานพาหนะ + เบอร์ติดต่อ → แถว "เจ้าของยานพาหนะ" ของข้อมูลสังกัด (ช่องที่ 2 ที่ VMS+ ซ่อนไว้) · สถานะยานพาหนะ → Pill outline ใน Page header (หน้า page.tsx)
   ประกอบจากชิ้นไลบรารี — figma-spec/COMPOSED.md หัวข้อ ศ5. */
import type { ReactNode } from "react";
import { ContentItemRow, type KvPair } from "@/components/vms/ContentItemRow";
import { BadgeOutline } from "@/components/vms/BadgeOutline";
import { BadgeOutlineWithIndicator } from "@/components/vms/BadgeOutlineWithIndicator";
import { CardItemRow } from "@/components/vms/CardItemRow";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { FileUploadItemBase } from "@/components/vms/FileUploadItemBase";
import { Images } from "@/components/vms/Images";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { chunk } from "@/components/patterns/DisplayBox";
import type { Car } from "@/lib/mock/data";
import { MA_WAR, ageText, warrantyOf, type MaCar } from "@/lib/mock/maintenance";
import { vehicleInfoOf, type VehicleInfoData } from "@/lib/mock/vehicleInfo";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";
import { MachineSection } from "./MachineSection";
import { MaGrid } from "./ui";

/** แถวของกล่อง — Full (ช่องกว้างเท่ากัน) · Half = Column width "50% first column" (ช่องแรกครึ่งแถว) */
interface Row { items: KvPair[]; half?: boolean }

function InfoBox({ Title, rows, mob }: { Title: string; rows: Row[]; mob: boolean }) {
  return (
    <section className="flex flex-col gap-2" aria-label={Title}>
      <SectionLabel Title={Title} className="min-h-10" />
      <div className="flex flex-col gap-6 rounded-md bg-gray-50 p-6">
        {rows.flatMap((r, i) => mob
          ? chunk(r.items, 2).map((p, k) => <ContentItemRow key={i + "-" + k} items={p} perRow={2} />)
          : [<ContentItemRow key={i} items={r.items} perRow={r.half ? 2 : r.items.length} ColumnWidth={r.half ? "50% first column" : "Full"} />])}
      </div>
    </section>
  );
}

/* Fleet card Status=Valid (UI Release#2 หน้า Vehicle Management · component ของไฟล์ UI ไม่ใช่ไลบรารี — ประกอบตามโครง):
   กรอบ white ขอบ gray-200 รัศมี 16 ขอบใน 16 → Images sm 108 + Content พื้น gray-50 รัศมี 8 ขอบใน 12/16 ช่องไฟ 16
   Content: เลขบัตร 16 SemiBold · ใช้ได้ตั้งแต่ | ใช้ได้ถึง 12 gray-600 (เส้นคั่น 12 gray-300) · Badges ช่องไฟ 8 = Badge outline with indicator Success "ปกติ" + ธนาคาร + วงเงินบัตร
   ไม่มีโลโก้ธนาคาร (Avatar xs ในป้าย) และโลโก้ปั๊ม (Gas stations · Avatar xs × 3) — ภาพ ไม่มีในดัมป์ (COMPOSED.md ค.) */
function FleetCard({ f }: { f: VehicleInfoData["fleet"] }) {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <Images Size="sm" alt="ภาพบัตรเติมน้ำมัน" className="size-27 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 rounded-md bg-gray-50 px-4 py-3">
        <p className="text-md font-semibold break-words text-black">{f.number}</p>
        <p className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span>ใช้ได้ตั้งแต่ {f.from}</span><span aria-hidden="true" className="h-3 w-px bg-gray-300" /><span>ใช้ได้ถึง {f.to}</span>
        </p>
        <div className="flex flex-wrap gap-2"><BadgeOutlineWithIndicator Color="Success" Text="ปกติ" /><BadgeOutline Text={f.bank} /><BadgeOutline Text={f.limit} /></div>
      </div>
    </div>
  );
}

/* Last usage (Fuel=true · EV battery=false): Section label "การใช้งานล่าสุด" → ห่าง 8 → Card white ขอบ gray-200 รัศมี 16 ขอบใน 16 ช่องไฟแถว 16
   แถว = Card item row Type=1 Row · Card item base Type=Text with label (ไอคอน 24 brand-900 · Text ชิดขวา) */
function LastUsage({ u }: { u: VehicleInfoData["usage"] }) {
  const rows: [string, string, string][] = [
    ["swap_driving_apps_wheel-24-300-round", "เลขไมล์", u.km],
    ["timer-24-300-round", "ชั่วโมงเครื่องจักรสะสม", u.hours],   // ของเรา (VMS+ ไม่มีแถวนี้)
    ["local_gas_station-24-300-round-filled", "ปริมาณเชื้อเพลิง", u.fuel],
    ["local_car_wash-24-300-round", "ความสะอาด", u.clean],
    ["local_parking-24-300-round-fill", "สถานที่จอดยานพาหนะ", u.parking],
  ];
  return (
    <section className="flex flex-col gap-2" aria-label="การใช้งานล่าสุด">
      <SectionLabel Title="การใช้งานล่าสุด" className="min-h-10" />
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
        {rows.map(([icon, label, text]) => <CardItemRow key={label} items={[{ Type: "Text with label", IconSwap: icon, Label: label, Text: text, TextAlign: "Right" }]} />)}
      </div>
    </section>
  );
}

const WAR_COLS: TableColumn[] = [
  { head: "ประเภทงาน", width: 140, Style: "Lead text" }, { head: "เลขที่งาน / PO", width: 150 }, { head: "ผู้รับจ้าง" }, { head: "รายการที่รับประกัน", width: 220 },
  { head: "วันเริ่ม", width: 120 }, { head: "วันหมดอายุ", width: 170 }, { head: "สถานะ", width: 150, Style: "Badge" },
];

function Side({ title, children }: { title: string; children: ReactNode }) {
  return <section className="flex flex-col gap-2" aria-label={title}><SectionLabel Title={title} className="min-h-10" />{children}</section>;
}

export function VehicleInfo({ c, page, onPage }: { c: MaCar; page: number; onPage: (p: number) => void }) {
  const mob = useBreakpoint() === "Mobile";
  const v = vehicleInfoOf(c, ageText(c));
  const car = c.car;
  const machineCar: Car = { plate: car.plate, model: car.model, owner: car.owner, status: "ok", type: car.type };
  const w = warrantyOf(c);
  const left = <>
    <InfoBox Title="ข้อมูลทั่วไป" mob={mob} rows={[
      { items: [["หมวดหมู่ยานพาหนะหลัก", v.general.catMain], ["หมวดหมู่ยานพาหนะย่อย", v.general.catSub]] },
      { items: [["ประเภทยานพาหนะหลัก", v.general.typeMain], ["ประเภทยานพาหนะย่อย", v.general.typeSub]] },
      { items: [["ลักษณะการใช้งาน", v.general.usage], ["ประเภทเกียร์", v.general.gear]] },
      { items: [["หมายเหตุ", v.general.note]] },
    ]} />
    <InfoBox Title="ข้อมูลการเงินและสัญญา" mob={mob} rows={[
      { half: true, items: [["เลขที่สัญญา", v.finance.contract]] }, { half: true, items: [["งวดที่ส่งมอบ", v.finance.lot]] }, { half: true, items: [["มูลค่ายานพาหนะ", v.finance.value]] },
    ]} />
    <InfoBox Title="ข้อมูลสังกัดยานพาหนะ" mob={mob} rows={[
      { items: [["สังกัดยานพาหนะ", v.dept.unit], ["รหัสข้างยานพาหนะ", v.dept.sideCode]] },
      { items: [["ผู้ดูแลยานพาหนะ", v.dept.ctrl], ["เบอร์ติดต่อ", v.dept.phone]] },
      { items: [["ศูนย์ต้นทุน", v.dept.costCenter], ["รหัสประเภทธุรกิจ (BA)", v.dept.ba]] },
      { items: [["รหัสทรัพย์สิน", v.dept.asset], ["วันที่ได้รับยานพาหนะ", v.dept.received]] },
      { items: [["ประเภททรัพย์สิน", v.dept.assetType], ["ประเภทย่อยทรัพย์สิน", v.dept.assetSub]] },
      { items: [["ใช้งานอยู่ในกลุ่มยานพาหนะ", v.dept.inGroup], ["หน่วยงานอื่นสามารถขอใช้งานได้", v.dept.shareable]] },
    ]} />
    <InfoBox Title="ข้อมูลการจดทะเบียน" mob={mob} rows={[
      { half: true, items: [["ประเภทยานพาหนะ", v.reg.dlt]] },
      { items: [["ยี่ห้อยานพาหนะ", v.reg.brand], ["แบบ / รุ่น", v.reg.model], ["รุ่นปี ค.ศ.", v.reg.modelYear], ["สี", v.reg.color]] },
      { items: [["เลขตัวยานพาหนะ", v.reg.vin], ["ตำแหน่งเลขตัวยานพาหนะ", v.reg.vinPos]] },
      { items: [["เลขเครื่องยนต์", v.reg.engineNo], ["ตำแหน่งเลขเครื่องยนต์", v.reg.enginePos]] },
      { half: true, items: [["ประเภทเชื้อเพลิง", v.reg.fuel]] },
      { items: [["ขนาดแรงม้า", v.reg.hp], ["จำนวนเพลา", v.reg.axles], ["จำนวนล้อ", v.reg.wheels], ["จำนวนยาง", v.reg.tires]] },
      { items: [["ปีที่จดทะเบียน", v.reg.year], ["อายุการใช้งาน", v.reg.age]] },   // ของเรา (VMS+ ไม่มีช่องนี้)
    ]} />
    {/* เครื่องมือกล ต่อท้ายข้อมูลการจดทะเบียน (สรุปประชุม VMS Plus "เพิ่มกล่องข้อมูลส่วนใหม่ต่อท้ายจากข้อมูลการจดทะเบียน" · BACKLOG ข้อ 68 84) · เฉพาะรหัสข้างรถในกลุ่ม */}
    <MachineSection carId={car.id} car={machineCar} />
  </>;
  const right = <>
    <Side title="รูปยานพาหนะ"><Images Size="md" alt={"รูปยานพาหนะ " + car.plate} className="aspect-4/3 w-full" /></Side>
    <Side title="ใบคู่มือจดทะเบียน">
      <div className="flex flex-col gap-3">
        {v.files.map((f) => <FileUploadItemBase key={f.name} State="Completed" FileName={f.name} FileSize={f.size} ProgressBar={false} DeleteAction={false} onDownload={() => notify("ต้นแบบไม่มีไฟล์จริง (" + f.name + ")")} />)}
      </div>
    </Side>
    <Side title="บัตรเติมน้ำมัน"><FleetCard f={v.fleet} /></Side>
    <LastUsage u={v.usage} />
  </>;
  return (
    <div className="flex flex-col gap-6" data-vehicle-info>
      <div className={cx(mob ? "flex flex-col gap-6" : "grid grid-cols-12 items-start gap-6")}>
        {mob ? <>{left}{right}</> : <>
          <div className="col-span-7 flex min-w-0 flex-col gap-6">{left}</div>
          <div className="col-span-5 flex min-w-0 flex-col gap-6">{right}</div>
        </>}
      </div>
      <section className="flex flex-col gap-2" aria-label="การรับประกัน">
        <SectionLabel Title={"การรับประกัน (" + w.length + ")"} className="min-h-10" />
        {w.length
          ? <MaGrid cols={WAR_COLS} rows={w.map((x) => [x[0], x[1], x[2], x[3], x[4], x[6] ? { text: x[5], sub: x[6] } : x[5], { pills: [MA_WAR[x[7]]] }])} page={page} onPage={onPage} />
          : <EmptyStateDataEmpty Text="ยังไม่มีงานที่อยู่ในประกัน" SupportingText="เมื่อปิดงานซ่อม Overhaul หรือบำรุงรักษาแผนจ้างที่มีประกันของผู้รับจ้าง รายการจะมาอยู่ที่นี่" />}
      </section>
    </div>
  );
}
