# โน้ตของโค้ด: src/app/vehicles

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/app/vehicles/_lib/MachineSection.tsx

**หัวไฟล์**

```text
ส่วน "เครื่องมือกล" ของหน้ารายละเอียดยานพาหนะ แท็บข้อมูลยานพาหนะ (S24 · BACKLOG ข้อ 68 · เจ้าของงาน 11 พ.ย. 2569 · ทำเว็บก่อน Figma)
  Section label "เครื่องมือกล (n)" + Actions Secondary button "เพิ่มเครื่องมือกล" (ไอคอน add · เฉพาะผู้แก้ได้)
  → การ์ด 1 ใบต่อเครื่อง (ข้อ 84 · 12 พ.ย. 2569 แทนตาราง Table/Mobile table เดิม · ดู MachineBody) · วางต่อจากข้อมูลการจดทะเบียน (ข้อ 83 · VehicleInfo.tsx)
  เพิ่ม/แก้ไข = PopupModal (Modal ของไลบรารี · มือถือ Bottom sheet · แบบ popup ของ S10 S26) ช่อง 2 คอลัมน์ (Grid · มือถือเรียงลง):
    ประเภทเครื่องมือกล (Input dropdown · บังคับ) · ยี่ห้อ · รุ่น · รหัสทรัพย์สิน 12 หลัก · รหัสทรัพย์สินย่อย 4 หลัก (บังคับ · คู่รหัสห้ามซ้ำทั้งระบบ)
    · พิกัดยก กก. (บังคับ ยกเว้นถังฉีดน้ำ/อื่นๆ) · ชั่วโมงเครื่องยนต์ · ชั่วโมงเครื่องจักร (บังคับ จำนวนเต็ม ≥ 0 · Cumulative_working_hours NOT NULL)
    · หมายเลข HC · หมายเลขประจำเครื่องจักร (Serial No.) · หมายเลขเครื่องยนต์ (ส่วนเครื่องจักร) (ถ้ามี)
    12 พ.ย. 2569 ข้อ 72 (เจ้าของงาน 12 พ.ย. 2569 เลือกตามไฟล์สรุปประชุม VMS Plus (Notion "meeting 11/11/68" หัวข้อ 9)): เพิ่มหมายเลขเครื่องยนต์ (ส่วนเครื่องจักร) ไม่บังคับ ต่อจาก Serial No. · ป้าย "หมายเลขเครื่อง (Serial No.)" → "หมายเลขประจำเครื่องจักร (Serial No.)"
    12 พ.ย. 2569 ข้อ 73 (เจ้าของงาน 12 พ.ย. 2569 "ใช้เป็น ชั่วโมงเครื่องจักร"): ป้าย "ชั่วโมงเครน" → "ชั่วโมงเครื่องจักร" ทั้งหัวคอลัมน์ ช่องใน popup และข้อความ error · ชื่อช่องข้อมูลคง craneHours (ไม่เปลี่ยนรูปแบบข้อมูลที่เก็บ)
    ค่าที่แมปจากฐานข้อมูลได้ขึ้นเป็นค่าตั้งต้นและแก้ได้ (เจ้าของงาน "ถ้าแมปข้อมูลจากฐานข้อมูลได้ ก็เอามาแสดง แต่สามารถแก้ไขได้") · (ตารางเดิมวางหมายเลขเครื่องยนต์ในบรรทัดรอง · การ์ดข้อ 84 มีแถวของตัวเอง)
    ตรวจตอนกดบันทึก: ช่องผิด = Text input State Error + Helper text · ผ่าน = toast "บันทึกเครื่องมือกลสำเร็จ"
  แก้ได้เฉพาะ กบค. (ผู้ดูแลข้อมูลยานพาหนะ ตามทะเบียนเครื่องมือกลเดิม · เสนอ — PERMISSIONS.md) · บทบาทอื่นดูอย่างเดียว
```

**ก่อน `const key = open ? (edit?.key ?? "new") : null;`**

```text
เปิดใหม่ = ค่าของเครื่องที่แก้ หรือค่าว่าง (เพิ่ม · รหัสทรัพย์สินตั้งต้น = ของเครื่องแรก · รหัสย่อยถัดไปที่ยังว่าง แบบทะเบียนเครื่องมือกลเดิม)
```

**ก่อน `useProtoForm(open ? {`**

```text
ปุ่มต้นแบบ (CLAUDE.md ข้อ 17): กรอกข้อมูลตัวอย่าง = กระเช้า Aichi SK17A รหัสถัดไป พิกัด 200 ชั่วโมง 0 · ล้างค่า = ค่าเริ่มของ popup
```

**ก่อน `{mob && <p className="text-sm text-gray-600">{car.plate}</p>}`**

```text
มือถือ: Bottom sheet header ไม่มี Supporting text ⇒ ทะเบียนเป็นบรรทัดแรกของเนื้อหา (แบบ popup ผลการตรวจ ปจ.2)
```

**ก่อน `export function MachineSection({ carId, car }: { carId: string; car: Car }) {`**

```text
ข้อ 68ก: รหัสข้างรถนอกกลุ่ม (ตารางอ้างอิง REF_VEHICLE_TYPE hasEquipment = false) ⇒ ไม่แสดงส่วนนี้
```

**ก่อน `function MachineBody({ carId, car }: { carId: string; car: Car }) {`**

```text
ข้อ 84 (เจ้าของงาน 12 พ.ย. 2569 _"ส่วน section ของการเพิ่มเครื่องจักร อยากให้เป็น คล้ายๆ การ์ด ในcomponent 1 การ์ด แล้วข้อมูลข้างใน ถ้ามีข้อมูลจาก api ก็แสดง
  ถ้าไม่มี ก็ให้เป็นข้อมูลที่สามารถเพิ่มได้ และที่ แสดง ก็สามารถแก้ไขได้"_) — ตาราง → การ์ด 1 ใบต่อเครื่อง
  การ์ดตามการ์ด "การใช้งานล่าสุด" (Last usage) ของเฟรม Vehicle info หน้า 5.2 Vehicle Management · UI Release#2:
    กรอบ white ขอบ gray-200 รัศมี 16 ขอบใน 16 ช่องไฟ 16 · หัวการ์ด = Section label (ชื่อ ประเภท ยี่ห้อ รุ่น · Supporting text รหัสทรัพย์สิน · Primary action Tertiary brand button "แก้ไข")
    แถว = Card item row Type=1 Row · Card item base Type=Text with label (Leading icon ปิด · Text ชิดขวาแบบ Last usage) ช่องละแถว 11 ช่องตาม popup
  ช่องที่มีค่า (ค่าจาก vms_mas_vehicle_mechanic = ค่าตั้งต้นของ machines.ts) แสดงค่า · ช่องว่าง: กบค. = Tertiary brand button "เพิ่ม" (ไอคอน add) เปิด popup แก้ไขของเครื่องนั้น · บทบาทอื่น "-"
    พิกัดยกของถังฉีดน้ำ/อื่นๆ (ไม่มีพิกัดยก) = "-" ไม่มีปุ่มเพิ่ม
  ยังไม่มีเครื่อง = การ์ดว่างแบบ Fleet card Status=Empty ("ไม่มีบัตรเติมน้ำมัน" · "ยานพาหนะคันนี้ยังไม่มีบัตรเติมน้ำมัน" · Secondary button lg "เพิ่มบัตร"):
    กล่อง gray-50 รัศมี 8 ขอบใน 12/16 · "ไม่มีเครื่องมือกล" 16 SemiBold · "ยานพาหนะคันนี้ยังไม่มีข้อมูลเครื่องมือกล" 14 gray-600 · ปุ่ม "เพิ่มเครื่องมือกล" (กบค.)
  มีเครื่องแล้ว: ปุ่ม "เพิ่มเครื่องมือกล" ที่ Section label ของส่วน (เครื่องที่ 2 ขึ้นไป · แบบเดิม) · popup เพิ่ม/แก้ไข (MachineModal) เดิมทุกอย่าง
  ประกอบจากชิ้นไลบรารี — COMPOSED.md ศ5.
20 พ.ย. 2569 เจ้าของงาน _"ถ้ารถเข้าเงื่อนไข ก็จะมี section นี้ ถ้ามีข้อมูลก็ fill แต่ถ้าไม่ข้อมูลก็แสดง - และ คนที่เป็น กบค สามารถ แก้ไขได้"_
  + _"ไม่มีเครื่องมือกล แต่รถอยู่ในเงื่อนไขที่แสดง ให้ของ section เลย และมี พวกประเภทเครื่องมือกล พิกัดยก ยี่ห้อ รุ่น รหัสทรัพย์สิน พวกนี้ มาเลย แต่ข้อมูลตรงใหนไม่มีก็แสดง - ไป"_ · เคาะตามข้อเสนอ:
  ช่องว่างแสดง "-" ทุกบทบาท (เลิกปุ่ม "เพิ่ม" ในช่องของ กบค. · แก้ผ่าน "แก้ไข" ที่หัวการ์ดอย่างเดียว)
  ยังไม่มีเครื่อง = การ์ด 1 ใบ 11 ช่องเป็น "-" (แทนกล่อง "ไม่มีเครื่องมือกล") · หัวการ์ด "เครื่องมือกล" · รหัสทรัพย์สิน "-" · หัวส่วนไม่มีตัวเลข
    กบค. กด "แก้ไข" = popup "แก้ไขเครื่องมือกล" ค่าตั้งต้นแบบเพิ่มเครื่องแรก (รหัสย่อย 0001) · บันทึกแล้วเป็นเครื่องแรก
  ปุ่ม "เพิ่มเครื่องมือกล" ที่หัวส่วนขึ้นเฉพาะ กบค. เมื่อมีเครื่องแล้ว (เครื่องที่ 2 ขึ้นไป)
  20 พ.ย. 2569 (รอบต่อมา) เจ้าของงาน _"เคสมีอยู่แล้ว ต้องไม่มีปุ่มเพิ่ม มีแต่ แก้ไข"_ ⇒ เอาปุ่ม "เพิ่มเครื่องมือกล" ที่หัวส่วนออก · กบค. แก้ผ่าน "แก้ไข" บนการ์ดอย่างเดียว · popup เป็น "แก้ไขเครื่องมือกล" เสมอ
    หัวส่วนยังนับจำนวนเครื่อง "(n)" เพราะข้อมูลจากฐานข้อมูลมีได้หลายเครื่องต่อคัน
  + _"มีเครื่องมือผลแล้ว ไม่มีปุ่มเพิ่ม มีแต่แก้ไข · ไม่มีเครื่องมือกล มีปุ่มเพิ่ม ไม่มีปุ่มแก้ไข เพิ่มแล้วถึงจะเป็นแก้ไข"_ ⇒ การ์ดของคันที่ยังไม่มีเครื่อง ปุ่มหัวการ์ด = Tertiary brand "เพิ่ม" (ไอคอน add) เปิด popup "เพิ่มเครื่องมือกล" · บันทึกแล้วการ์ดมีปุ่ม "แก้ไข" · การ์ดที่มีเครื่อง ปุ่ม "แก้ไข" อย่างเดียว
```

**ก่อน `const fields: [string, string | undefined][] = [`**

```text
[ป้าย, ค่า (ว่าง = ไม่มีข้อมูล แสดง "-")] — ลำดับเดียวกับ popup · x = null คือการ์ดของคันที่ยังไม่มีเครื่อง
```

## src/app/vehicles/_lib/VehicleInfo.tsx

**หัวไฟล์**

```text
แท็บ "ข้อมูลยานพาหนะ" ของหน้ารายละเอียดยานพาหนะ (S24 · BACKLOG ข้อ 83 · เจ้าของงาน 12 พ.ย. 2569 _"หน้าข้อมูลยานพาหนะ อยากให้อ่าน vehicle-management component แล้วเอามาแสดง"_)
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
  ประกอบจากชิ้นไลบรารี — figma-spec/COMPOSED.md หัวข้อ ศ5.
```

**ก่อน `interface Row { items: KvPair[]; half?: boolean }`**

```text
แถวของกล่อง — Full (ช่องกว้างเท่ากัน) · Half = Column width "50% first column" (ช่องแรกครึ่งแถว)
```

**ก่อน `function FleetCard({ f }: { f: VehicleInfoData["fleet"] }) {`**

```text
Fleet card Status=Valid (UI Release#2 หน้า Vehicle Management · component ของไฟล์ UI ไม่ใช่ไลบรารี — ประกอบตามโครง):
  กรอบ white ขอบ gray-200 รัศมี 16 ขอบใน 16 → Images sm 108 + Content พื้น gray-50 รัศมี 8 ขอบใน 12/16 ช่องไฟ 16
  Content: เลขบัตร 16 SemiBold · ใช้ได้ตั้งแต่ | ใช้ได้ถึง 12 gray-600 (เส้นคั่น 12 gray-300) · Badges ช่องไฟ 8 = Badge outline with indicator Success "ปกติ" + ธนาคาร + วงเงินบัตร
  ไม่มีโลโก้ธนาคาร (Avatar xs ในป้าย) และโลโก้ปั๊ม (Gas stations · Avatar xs × 3) — ภาพ ไม่มีในดัมป์ (COMPOSED.md ค.)
```

**ก่อน `function LastUsage({ u }: { u: VehicleInfoData["usage"] }) {`**

```text
Last usage (Fuel=true · EV battery=false): Section label "การใช้งานล่าสุด" → ห่าง 8 → Card white ขอบ gray-200 รัศมี 16 ขอบใน 16 ช่องไฟแถว 16
  แถว = Card item row Type=1 Row · Card item base Type=Text with label (ไอคอน 24 brand-900 · Text ชิดขวา)
```

**ท้ายบรรทัด `["timer-24-300-round", "ชั่วโมงเครื่องจักรสะสม", u.hours],`**

```text
ของเรา (VMS+ ไม่มีแถวนี้)
```

**ท้ายบรรทัด `{ items: [["ปีที่จดทะเบียน", v.reg.year], ["อายุการใช้งาน", v.reg.age]] },`**

```text
ของเรา (VMS+ ไม่มีช่องนี้)
```

**ก่อน `<MachineSection carId={car.id} car={machineCar} />`**

```text
เครื่องมือกล ต่อท้ายข้อมูลการจดทะเบียน (สรุปประชุม VMS Plus "เพิ่มกล่องข้อมูลส่วนใหม่ต่อท้ายจากข้อมูลการจดทะเบียน" · BACKLOG ข้อ 68 84) · เฉพาะรหัสข้างรถในกลุ่ม
```

## src/app/vehicles/_lib/tabs.ts

**หัวไฟล์**

```text
แท็บของหน้ารายละเอียดยานพาหนะ (S24 · 12 พ.ย. 2569 BACKLOG ข้อ 85) — ?tab=<ชื่อ> ไม่ใช้ลำดับ (ลำดับแท็บเปลี่ยนแล้ว 2 ครั้ง)
  ที่อยู่เดิม ?tab=0–4 (5 แท็บเดิม ข้อมูลยานพาหนะ · ตารางบำรุงรักษา · ประวัติการซ่อมบำรุง · การรับประกัน · Overhaul) ยังเปิดได้:
    0 → info · 1 → schedule · 2 → machine (มุมมองเริ่มเดิม "บำรุงรักษาเครื่องจักร") หรือ history ถ้ามี &view=repair (มุมมองเดิม "ซ่อมเครื่องจักร")
    · 3 การรับประกัน → info (ส่วนการรับประกันย้ายมาแท็บข้อมูลยานพาหนะ) · 4 Overhaul → history (งาน Overhaul อยู่ในประวัติการซ่อมบำรุง ป้าย Overhaul)
```

## src/app/vehicles/_lib/ui.tsx

**หัวไฟล์**

```text
ชิ้นประกอบของ S24 (/vehicles/*) — ไม่ใช่ component ใหม่ จัดวางชิ้นไลบรารีตาม maList() / maDetail() / filterPanel() / tbl() + toneText() ของปลั๊กอิน Figma
  ที่มาการออกแบบ: Vehicle list + Filter + Vehicle detail ของหน้า "Vehicle Management" ใน UI Release#2 · Table · Table header cell · Table cell · Mobile table · Mobile table item
  · Background overlay · Featured icon · Tertiary button · Tertiary brand button · Secondary button · Primary button · Input dropdown · Dropdown list ของไฟล์ Component (ดู figma-spec/COMPOSED.md หัวข้อ ซ.)
  MaTable / MaCards = Table / MobileCards ที่ช่อง { text, sub, tone } ทำบรรทัดรอง (Supporting text) เป็นสีเตือน/แดงได้ (Table cell ของต้นแบบมี Supporting text สี gray-600 อย่างเดียว)
  FilterPanel = แผงตัวกรองด้านข้าง (Side panel header / Side panel footer ของไลบรารียังไม่มีในต้นแบบ — ประกอบตามค่าในดัมป์) · มือถือ Bottom sheet
```

**ก่อน `export const VEHICLE_ROOT = "ยานพาหนะ";`**

```text
หน้าเมนู Vehicle Management ของระบบ (pageHead o.root ของ maList / maDetail)
```

**ก่อน `export const MA_ROLES = ["หน่วยงาน (กบผ.)", "หน่วยงาน (กปส.)", "หน่วยงาน (กรย.)", "หน่วยงา`**

```text
Permission ของ Scenario 24: กบค. เห็นทุกคัน · ผู้ดูแลยานพาหนะ เห็นเฉพาะยานพาหนะที่ดูแล (ต้นแบบ = คันที่ผู้ควบคุมเป็นผู้ดูแลตัวอย่าง CARETAKER · ไฟล์ 34 ข้อ 13) · บทบาทอื่นกลับราก (useRoleGuard)
```

**ก่อน `export const MA_ROLES = ["หน่วยงาน (กบผ.)", "หน่วยงาน (กปส.)", "หน่วยงาน (กรย.)", "หน่วยงา`**

```text
9 พ.ย. 2569 ตรวจสิทธิ์: หน่วยงานผู้ดำเนินการทุกหน่วยงาน (กบผ. กปส. กรย. กส.1 กส.2) เห็นเฉพาะยานพาหนะในแผนของตัวเอง (unit) · กบค. ทุกคัน · เดิมเฉพาะ กบผ.
```

**ท้ายบรรทัด `export const MA_ROLES = ["หน่วยงาน (กบผ.)", "หน่วยงาน (กปส.)", "หน่วยงาน (กรย.)", "หน่วยงา`**

```text
ข้อ 70 เพิ่ม กส.1 กส.2
```

**ก่อน `export type MaValue = TableValue | { text: string; sub?: string; tone?: DueTone } | { text`**

```text
---------- ช่องตาราง: { text, sub, tone } = บรรทัดรองสีตามสถานะ (toneText() ใน core.js) ----------
```

**ก่อน `export type MaValue = TableValue | { text: string; sub?: string; tone?: DueTone } | { text`**

```text
{ text, sub, href } = เลขทะเบียนเป็นลิงก์เปิดหน้ารายละเอียดยานพาหนะ (S24 รอบ 2 18a432e · ไม่มีคอลัมน์ปุ่ม … · สไตล์ลิงก์ชุดเดียวกับ PlateLink: info-700 ขีดเส้นใต้)
```

**ก่อน `export interface MaSort { col: number; dir: "Down" | "Up" }`**

```text
desktop: Table (Content = Table header cell + Table cell) + Table pagination — แบบเดียวกับ components/vms/Table
```

**ก่อน `export interface MaSort { col: number; dir: "Down" | "Up" }`**

```text
sort/onSort (ไม่ส่ง = เรียงไม่ได้ ตามเดิม) — หัวคอลัมน์ที่มีชื่อมี Sort icon กดได้ แบบ SortTable ของ S4 (แดชบอร์ด S24 แบบ VMS+ 12 พ.ย. 2569)
```

**ก่อน `export function MaCards({ cols, rows }: { cols: TableColumn[]; rows: MaValue[][] }) {`**

```text
มือถือ: Mobile table + Mobile table item ตาม mobileCards() — แถวแรก Lead text · { text, sub } → Supporting text (กติกาข้อ 11) · ปุ่ม → แถวท้าย Action icons (mobileActions · กติกาข้อ 14)
```

**ท้ายบรรทัด `else if (c.head && v && typeof v === "object" && "pills" in v) v.pills.forEach((p) => data`**

```text
หลาย Pill = แถว Badge ละใบ (แบบ MobileCards · ป้าย Overhaul ข้อ 85)
```

**ก่อน `export function MaGrid({ cols, rows, page, onPage, sort, onSort }: { cols: TableColumn[]; `**

```text
ตาราง + pagination ตามขนาดจอ (หน้าละ PER แถว)
```

**ก่อน `export interface FilterField { label: string; options: string[] }`**

```text
---------- แผงตัวกรอง (filterPanel() ใน core.js · Filter ของ Vehicle list ใน UI Release#2) ----------
```

**ก่อน `export function FilterPanel({ open, fields, value, onApply, onClose }: { open: boolean; fi`**

```text
value = ค่าที่ใช้อยู่ (ทั้งหมด = ไม่กรอง) · ตกลง → onApply(ค่าใหม่) · ยกเลิก/ปิด → onClose (ไม่เปลี่ยน) · ล้างตัวกรอง = ทุกช่องกลับเป็น ทั้งหมด (กดตกลงเพื่อใช้)
```

**ก่อน `export function FilterShell({ open, onClose, onClear, onApply, children }: { open: boolean`**

```text
กรอบแผงตัวกรอง (desktop Side panel ชิดขวา · มือถือ Bottom sheet) — เนื้อหาช่องส่งเป็น children · ใช้ร่วม FilterPanel และฟอร์มสร้างแผน (ภาค เขต ประเภทรถ หลายค่า)
```

**ก่อน `<div className="relative flex flex-col gap-4 border-b border-gray-300 p-6">`**

```text
Side panel header: ขอบใน 24 ช่องไฟ 16 เส้นล่าง gray-300 · Featured icon Gray md filter_list · หัวข้อ 20 SemiBold black · Supporting text 14 gray-600 · ปุ่มปิด (Tabs ปิด)
```

**ก่อน `<div className="flex items-center justify-between gap-3 border-t border-gray-300 px-6 py-4`**

```text
Side panel footer: ขอบใน 16/24 ช่องไฟ 12 เส้นบน gray-300 · Tertiary brand button ซ้าย · Secondary + Primary ขวา
```

## src/app/vehicles/detail/page.tsx

**หัวไฟล์**

```text
S24 W.6–W.8 W.11–W.15 · หน้ารายละเอียดยานพาหนะ (/vehicles/detail/?car=<ทะเบียนไม่มีจังหวัด>&tab=<ชื่อแท็บ>) — maDetail() ใน screens.js
  Figma d6ce03a (R90) + 18a432e: เจ้าของงาน 10 พ.ย. 2569 "อยากให้ออกแบบรายละเอียดรถแต่ละคัน โดยเห็นว่ามีแท็บประวัติการซ่อม เลยอยากให้เพิ่ม tab ประกัน การ overhaul ตารางบำรุงรักษา"
  โครงตาม Vehicle detail หน้า 5.2 Vehicle Management ของ UI Release#2 + DASH รายคันของปลั๊กอิน Overhaul · ดูอย่างเดียว ไม่มีปุ่มแก้ไข (ยกเว้นเครื่องมือกลของ กบค.)
  Page header (ทะเบียน + Pill outline สถานะยานพาหนะ แบบ Page header Page=View ของเฟรม Vehicle info · ย้อนกลับ · Breadcrumbs ยานพาหนะ › ข้อมูลยานพาหนะ › ทะเบียน)
    → Section ช่องไฟ 24: Tabs 5 ช่อง (12 พ.ย. 2569 · BACKLOG ข้อ 85 · เจ้าของงาน _"tab นี้ มีเพิ่ม โดยแบ่ง ประวัติการบำรุงรักษาเครื่องจักร ประวัติการบำรุงรักษาเครื่องยนต์
      ประวัติการซ่อมบำรุงจะแสดงทั้งการซ่อมและบำรุง ตัดtab การรับประกัน เดี๋ยวจะเอาข้อมูลไปใส่ในข้อมูลรถ และ tab overhaul ก็เอาออก ให้เป็นส่วนหนึ่งของประวัติการซ่อมบำรุง
      โดยมีแทกว่าเป็นการ overhaul ถ้าการซ่อมนั้นผ่านการ overhaul มา"_)
    info ข้อมูลยานพาหนะ = แบบ Vehicle info ของ VMS+ (BACKLOG ข้อ 83 · _lib/VehicleInfo.tsx) + เครื่องมือกล (การ์ด ข้อ 84) + การรับประกัน (ย้ายจากแท็บเดิม)
    · schedule ตารางบำรุงรักษา (Section label "กำหนดครั้งถัดไป" 5 รายการ MA_NEXT_COLS + "ประวัติการบำรุงรักษา (n)" MA_HIST_COLS · เมนู … ดูรายละเอียดงานที่ปิดแล้ว · คงเดิม)
    · machine ประวัติการบำรุงรักษาเครื่องจักร = บันทึกบำรุงรักษาตามวาระของ flow นี้ (กระเช้า/ถังฉีดน้ำ: ไส้กรองไฮดรอลิก น้ำมันไฮดรอลิก ไส้กรองอากาศ การตรวจ ปจ.2)
        = มุมมอง "บำรุงรักษาเครื่องจักร" เดิมของแท็บประวัติการซ่อมบำรุง (machineHistoryOf().ma · MA_HIST_COLS)
    · engine ประวัติการบำรุงรักษาเครื่องยนต์ = เช็คระยะของแชสซีที่ศูนย์บริการยี่ห้อ (engineHistoryOf · ค่าสมมติ · ENGINE_COLS)
    · history ประวัติการซ่อมบำรุง = Metric item 2 ใบ (บำรุงรักษาเครื่องจักรล่าสุด · ซ่อมเครื่องจักรล่าสุด) + ตารางรวม ซ่อม + บำรุงรักษา (เครื่องจักร + เครื่องยนต์) + ซ่อมตัวยานพาหนะ
        เรียงวันที่ปิดงานใหม่สุดก่อน (serviceHistoryOf) · คอลัมน์ "ประเภท" Pill outline บำรุงรักษา / ซ่อม + Pill "Overhaul" (Purple) ต่อท้ายเมื่องานนั้นมาจาก Overhaul
    ตัวสลับ 2 มุมมองในแท็บประวัติเดิม (Tabs ซ้อน) เอาออก · แท็บการรับประกัน · Overhaul เอาออก
  ที่อยู่เดิม ?tab=0–4 ยังเปิดได้ (TAB_LEGACY): 0 → info · 1 → schedule · 2 → machine (มี &view=repair → history) · 3 การรับประกัน → info · 4 Overhaul → history
  มือถือ: การ์ด Mobile table (+ ไอคอนดูของบันทึกที่เปิดได้ · กติกาข้อ 14)
```

**ก่อน `const MA_REPAIR_COLS: TableColumn[] = [`**

```text
ประวัติการซ่อมบำรุง (ซ่อม + บำรุงรักษา · 11 พ.ย. 2569 · 12 พ.ย. 2569 รวมเครื่องยนต์ ซ่อมตัวยานพาหนะ ป้าย Overhaul): หมายเลขงาน (บรรทัดรอง ประเภทการซ่อม / แผน Overhaul / แผนเดินทาง) · วันที่ปิดงาน · ประเภท (Pill) · ศูนย์บริการ · อาการ / รายละเอียด · การรับประกัน · ค่าซ่อม
```

**ก่อน `const ENGINE_COLS: TableColumn[] = [`**

```text
ประวัติการบำรุงรักษาเครื่องยนต์ (ค่าสมมติ engineHistoryOf)
```

**ก่อน `useEffect(() => { if (ok && !c) router.replace(LIST_HREF); }, [ok, c, router]);`**

```text
ไม่พบยานพาหนะ / นอกขอบเขตที่บทบาทเห็น → กลับรายการ
```

**ก่อน `const histRows = (records: MaRecord[]): MaValue[][] => records.map((r) => [`**

```text
ประวัติการบำรุงรักษา (MA_HIST_COLS) — ใช้ทั้งแท็บตารางบำรุงรักษาและแท็บประวัติการบำรุงรักษาเครื่องจักร
```

**ก่อน `const listOrEmpty = (cols: TableColumn[], rows: MaValue[][], all: number, emptyText: strin`**

```text
ไม่มีบันทึกเลย = Empty state/Data empty · ค้นไม่พบ = Empty state/Search not found
```

**ก่อน `const maHistory = (all: MaRecord[]) => {`**

```text
ประวัติการบำรุงรักษาเครื่องจักร — บันทึกการบำรุงรักษาตามวาระ · ค้นหาเลขที่ MR งานที่ทำ
```

**ก่อน `const serviceHistory = (all: ServiceRow[]) => {`**

```text
ประวัติการซ่อมบำรุง — ซ่อม + บำรุงรักษา (เครื่องจักร เครื่องยนต์) เรียงวันที่ปิดงานใหม่สุดก่อน · ป้ายประเภท + ป้าย Overhaul · ค้นหาหมายเลขงาน อาการ
```

**ก่อน `const h = serviceHistoryOf(c);`**

```text
วันล่าสุด 2 ใบ (Metric item · แบบการ์ดตัวเลขของแดชบอร์ด) · ค่าเท่าคอลัมน์ของฟอร์มแผน (vehicleHistory.ts)
```

## src/app/vehicles/maintenance/dash.ts

**หัวไฟล์**

```text
ตัวเลขของแดชบอร์ด S24 แบบ VMS+ (12 พ.ย. 2569) — คิดจากข้อมูลเดิมของหน้า (MaCar ของ lib/mock/maintenance.ts) ไม่เพิ่มแหล่งข้อมูลใหม่
  วันอ้างอิง = MA_TODAY (10/11/2569 ค่าคงที่ของต้นแบบ) · "ปีนี้" = ปี พ.ศ. ของ MA_TODAY (ปีปฏิทิน)
  สถานะกำหนดบำรุงรักษา = ครั้งถัดไป (c.next) ปกติ / ใกล้ครบ (ภายใน 6 เดือน) / เลยกำหนด · ยังไม่มีข้อมูล = ไม่มีบันทึกการบำรุงรักษา
  กำหนด 12 เดือนข้างหน้า = วันครบรอบบำรุงรักษา (MA_ITEMS[0]) และวันครบเปลี่ยนน้ำมันไฮดรอลิก (MA_ITEMS[2]) รายเดือน + แท่ง "เลยกำหนด"
```

**ก่อน `export const longDate = (s: string) => { const [d, m, y] = s.split("/"); return Number(d) `**

```text
"10/11/2569" → "10 พ.ย. 2569"
```

**ก่อน `export const DUE_ST = ["ปกติ", "ใกล้ครบกำหนด", "เลยกำหนด", "ยังไม่มีข้อมูล"] as const;`**

```text
---------- สถานะกำหนดบำรุงรักษา ----------
```

**ก่อน `export const ageOf = (c: MaCar) => (c.year ? YEAR - c.year : undefined);`**

```text
---------- อายุการใช้งาน ----------
```

**ก่อน `export const zoneOf = (c: MaCar) => c.car.owner.split(" ")[0];`**

```text
---------- เขต (รหัสหน้าชื่อหน่วยงาน "กฟฉ.1 ขอนแก่น" → "กฟฉ.1") ----------
```

**ก่อน `const mk = (t: number) => { const d = new Date(t); return d.getUTCFullYear() * 12 + d.getU`**

```text
---------- กำหนด 12 เดือนข้างหน้า ----------
```

**ก่อน `export const monthsOf = (c: MaCar) => [bucket(c.items[0]?.due), bucket(oilChangeOf(c)?.due`**

```text
[รอบบำรุงรักษา, เปลี่ยนน้ำมันไฮดรอลิก] ของยานพาหนะคันนั้นตกเดือนไหน
```

**ก่อน `export const maintainedThisYear = (c: MaCar) => !!c.latest && Number(c.latest.date.slice(6`**

```text
---------- การ์ดตัวเลข ----------
```

**ก่อน `const INF = Number.MAX_SAFE_INTEGER;`**

```text
---------- เรียงตาราง (คอลัมน์ MA_COLS) ----------
```

## src/app/vehicles/maintenance/page.tsx

**หัวไฟล์**

```text
S24 W.1–W.5 W.8–W.10 · หน้า ข้อมูลยานพาหนะ แท็บ "การบำรุงรักษา" = แดชบอร์ดการบำรุงรักษารายคัน (/vehicles/maintenance/) — maList() ใน screens.js
  Figma d6ce03a (R90) + 18a432e (รอบ 2 · 10 พ.ย. 2569): เจ้าของงาน "ตั้งใจอยากให้หน้านี้เป็นหน้า dashboard ที่สามารถกรองสิ่งต่างๆที่ต้องการ …"
    + "หน้าของ list อยากแสดงรายละเอียดอื่นๆ ตัวอย่างเช่นพวกอายุการใช้งาน หรืออะไรที่เกี่ยวข้องกับการบำรุงรักษา"
  12 พ.ย. 2569 แดชบอร์ดแบบ VMS+ (เจ้าของงาน _"อยากให้ออกแบบเป็นสไตล์นี้ … ให้เฉพาะ dashboard ที่ทำสิ่งนี้ได้ หน้าอื่นๆ ยังคงต้องตาม component เหมือนเดิม"_
    · สเปก userflow/figma-ref/vmsplus-dashboard-2569-11-12/SPEC-maintenance-dashboards.md · CLAUDE.md ข้อ 18 · ชิ้นกราฟ components/dashboard/ · COMPOSED.md หัวข้อ "แดชบอร์ดแบบ VMS+")
  โครง: Page header "ข้อมูลยานพาหนะ" (Breadcrumbs ยานพาหนะ · คงเดิม) → Tabs (ยานพาหนะ · การบำรุงรักษา + ป้ายจำนวนคันที่ใกล้ครบ/ครบกำหนด · คงเดิม)
    → หัวแดชบอร์ด (ไอคอน · "แดชบอร์ดการบำรุงรักษา" · ข้อมูล ณ MA_TODAY) → เรื่องที่ควรดู (กดแล้วกรองทั้งหน้า)
    → แผงตัวกรองพับได้ = ช่องตัวกรองเดิม 7 ช่อง (เลือกแล้วใช้ทันที) + ชิปตัวกรองที่เลือก (รวมที่มาจากการคลิกกราฟ) → การ์ดตัวเลข 6 ใบ
    → กราฟ 6 ใบ (สังกัด หน่วยงาน/เขต · สถานะกำหนด · กำหนด 12 เดือน · ผลตรวจน้ำมัน · ประเภท · อายุการใช้งาน) คลิกแถบ/ชิ้น/แท่ง = เพิ่ม/เอาตัวกรองนั้นออกทั้งหน้า
    → รายการยานพาหนะ: Table header (ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" ใช้กับตารางอย่างเดียว · ปุ่มตัวกรอง = กางแผงตัวกรอง · ส่งออก) + Table 8 คอลัมน์ MA_COLS (เรียงได้ทุกคอลัมน์)
      + pagination / Empty state/Search not found + ล้างตัวกรอง → หมายเหตุแหล่งข้อมูล
  MA_COLS: คอลัมน์สุดท้าย "ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก" แทน "ผู้ดูแลยานพาหนะ" (เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 65) = เปลี่ยนล่าสุด + 3 ปี + บรรทัดรองสีสถานะ MA_DUE
  ตัวกรอง 7 ช่อง: ประเภทยานพาหนะ · สังกัดยานพาหนะ · บำรุงรักษาล่าสุด · ครบกำหนดภายใน · รายการที่ครบกำหนด · ผลตรวจน้ำมันล่าสุด · ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก (11 พ.ย. 2569)
    + ตัวกรองจากกราฟ (เขต · สถานะกำหนด · เดือนที่ครบกำหนด · กลุ่มอายุ) ขึ้นเป็นชิปอย่างเดียว · ผลตรวจน้ำมันเพิ่มตัวเลือก "ยังไม่ตรวจ" (ชิ้นโดนัท)
  แท็บ "ยานพาหนะ" เป็นของระบบ Vehicle Management (ไม่พาไปไหน) · ข้อมูล lib/mock/maintenance.ts (ตัวเลขคิดใน ./dash.ts) · ?sample=S24 = ชุดตัวอย่างของหน้า /scenarios/
```

**ก่อน `const MA_COLS: TableColumn[] = [`**

```text
MA_COLS (18a432e)
```

**ก่อน `const MA_COLS: TableColumn[] = [`**

```text
11 พ.ย. 2569: ช่องสุดท้าย ผู้ดูแลยานพาหนะ (190) → ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก 240 ให้หัวคอลัมน์ไม่ถูกตัด · ทะเบียน 160 · บำรุงรักษาล่าสุด 130 · ประกัน 130 · สถานะยานพาหนะ 140 (เดิม 200 · 140 · 150 · 150) ให้หัวทุกช่องไม่ถูกตัด
```

**ท้ายบรรทัด `const NOT_TESTED = "ยังไม่ตรวจ";`**

```text
ผลตรวจน้ำมัน: ยังไม่มีผล (ชิ้นโดนัท "ยังไม่ตรวจ")
```

**ก่อน `interface MaFilter { types: string[]; units: string[]; last: string; within: string; items`**

```text
ตัวกรอง: 7 ช่องเดิม + ตัวกรองจากกราฟ (zones เขต · due สถานะกำหนด · months เดือนที่ครบกำหนด · ages กลุ่มอายุ)
```

**ก่อน `const chipOf = (s: (typeof SINGLE)[number], v: string) => s.label + " " + (s.label.endsWit`**

```text
ชิป: หลายค่า = ค่าที่เลือก · ค่าเดียว = "ชื่อช่อง ค่า" (W.9 W.10 "บำรุงรักษาล่าสุด เกิน 12 เดือน" "ครบกำหนดภายใน 3 เดือน") · จากกราฟ = "เขต …" "สถานะ …" "กำหนดบำรุงรักษา …" "อายุการใช้งาน …"
```

**ก่อน `const SAMPLES: SampleMap = {`**

```text
?sample=S24 (ของต้นแบบ) — งานรายคันชุด T1_afterClose ของ S10 (82-6789 ปิดงานแล้ว 04/11/2569 รอผลตรวจน้ำมัน) + เอกสาร Safety Inspection ตอนปิดงาน
```

**ก่อน `const maRow = (c: MaCar): MaValue[] => {`**

```text
maRow: ทะเบียน (ลิงก์ · ประเภท) · อายุการใช้งาน (เลขไมล์ · ชั่วโมง) · บำรุงรักษาล่าสุด (MR) · ครั้งถัดไป (วันที่ · รายการ · บรรทัดรองสถานะสี) · ผลตรวจน้ำมัน (เก็บตัวอย่าง วันที่) · ประกัน · สถานะยานพาหนะ
  · ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก (วันที่ · บรรทัดรองสถานะสี · ไม่มีข้อมูล = "-")
```

**ก่อน `const exportRow = (c: MaCar): TableValue[] => maRow(c).map((v) => (v && typeof v === "obje`**

```text
ไฟล์ส่งออก: ช่องลิงก์/สีเป็นข้อความ + บรรทัดรอง
```

**ก่อน `const ownerOrder = useMemo(() => [...groupBy(cars, (c) => c.car.owner)].sort((a, b) => b[1`**

```text
ลำดับสีตามหมวด = ลำดับจากข้อมูลทั้งหมดก่อนกรอง (สียึดตัวรายการ)
```

**ท้ายบรรทัด `const fc = useMemo(() => cars.filter((c) => match(c, filter)), [cars, filter]);`**

```text
ทั้งหน้า (การ์ด กราฟ ตาราง)
```

**ก่อน `const nOver = count(cars, (c) => c.next?.status === "over"), nOil = count(cars, (c) => oil`**

```text
---------- เรื่องที่ควรดู (นับจากยานพาหนะทั้งหมดที่เห็นได้ ไม่ขึ้นกับตัวกรอง) ----------
```

**ก่อน `const n = fc.length, filtered = chips.length > 0;`**

```text
---------- การ์ดตัวเลข ----------
```

**ก่อน `const dueN = (cs: MaCar[]) => count(cs, isDue);`**

```text
---------- กราฟ ----------
```

**ก่อน `const doExport = () => {`**

```text
---------- ส่งออก (popup แบบ S4 · ตามตัวกรองและคำค้นที่ใช้อยู่ / ทั้งหมด) ----------
```
