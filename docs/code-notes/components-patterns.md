# โน้ตของโค้ด: src/components/patterns

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/components/patterns/CheckTable.tsx

**หัวไฟล์**

```text
ตารางรายการตรวจ (ประกอบจากชิ้นไลบรารี · ข้อ 13) — checkTable() + checkCard() + radioCell() + noteCell() ใน screens.js (แบบสำรองของ ReceiptChecklist / InspectionChecklist)
  ใช้ที่ S10 Step 1 "รายการตรวจสภาพ" แบบตรวจสภาพตามประเภทยานพาหนะ (R86 · 9 พ.ย. 2569 · inspectStep() ใน screens.js)
  InspectionChecklist ของไฟล์ Maintain-D มี 25 แถวตายตัว + ส่วนสาเหตุส่งซ่อม (instance เพิ่มแถวไม่ได้) ⇒ จอ Figma ประกอบตารางเอง ที่นี่ประกอบตามนั้น (COMPOSED.md หัวข้อ พ.)
  Desktop: Section header (Title + Badge จำนวน) → ห่าง 16 → ตาราง Table header cell + Table cell วางเป็นคอลัมน์ (ค่าเดียวกับ _checklist ของ ReceiptChecklist / InspectionChecklist)
           คอลัมน์ รายการ (ยืด) · ตัวเลือกละ 100 (Radio button) · หมายเหตุ 448 (Text input ไม่มีป้าย "ระบุหมายเหตุ") · แถวท้าย Secondary button md "เพิ่มรายการ" (ไอคอน add)
  Mobile: การ์ดละรายการ (กรอบ/พื้นของ Mobile table มุม 12): Section label ชื่อรายการ → Radio text card ตัวเลือกละใบ ช่องไฟ 16 · ปุ่ม "เพิ่มรายการ" lg เต็มกว้างท้ายสุด
           (checkCard ของ inspectStep ไม่มีช่องหมายเหตุ — ตามจอ Figma)
```

**ก่อน `sel: number | null;`**

```text
ตัวเลือกที่เลือก (ลำดับใน options) · ยังไม่เลือก = null
```

**ก่อน `Badge?: string | number | null;`**

```text
ป้ายจำนวน (ค่าเริ่ม = จำนวนรายการ)
```

**ก่อน `options: string[];`**

```text
หัวคอลัมน์ตัวเลือก เช่น ["ปกติ", "แก้ไข"]
```

**ก่อน `const label = (it: CheckRow, i: number) => i + 1 + ". " + it.name;`**

```text
ชื่อรายการมีเลขลำดับนำหน้า "1. น้ำมันไฮดรอลิก" ตาม inspectStep()
```

## src/components/patterns/ConfirmDialog.tsx

**หัวไฟล์**

```text
popup ยืนยัน ตาม confirm() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Desktop: Modal Type=Centered image (ซ่อนรูป) · danger = Type=Destructive centered image with input (ซ่อน Form) ปุ่มหลัก Primary danger button · Modal header Alignment=Center + Modal footer Horizontal fill
  Mobile: Bottom sheet (ไม่มีหัว) + Modal header Alignment=Center (ไม่มีปุ่มปิด) + Bottom sheet footer ปุ่ม Size=lg
```

## src/components/patterns/DisplayBox.tsx

**หัวไฟล์**

```text
กล่องแสดงข้อมูล (key-value) ตาม kv() + displayBox() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Section label (ชื่อกล่อง) → ห่าง 16 → กล่อง พื้น gray-50 (Variable Color/surface/secondary-subtle) รัศมี 8 ขอบใน 24 ช่องไฟแถว 24
  แถว = Content item row (Column width=Full) · ช่อง = _Content item base Type="Text with label" ไม่มีไอคอน · desktop แถวละ 4 · มือถือ แถวละ 2
  desktop ของจอ Figma อาจใช้ VehicleAndReporterInfo (ไฟล์ Maintain-D) แทน — ดู components/maintain-d/VehicleAndReporterInfo
```

## src/components/patterns/FormModal.tsx

**หัวไฟล์**

```text
popup แบบฟอร์ม ตาม formModal() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Desktop: Modal Type=Form Size=md (500) · Modal header Alignment=Left (ไม่มี Featured icon · ปุ่มปิด) · Form ขอบในข้าง 24 ช่องไฟ 12 = Card form row ละ 1 ช่อง
           (Text input · แถว area = Text area) · Modal footer Alignment=Horizontal right: Secondary "ยกเลิก" + Primary "บันทึก"
  Mobile: Bottom sheet หัวเรื่อง = ชื่อ popup · ช่องเรียงลง ช่องไฟ 16 · Bottom sheet footer ปุ่ม lg
  ใช้ fields (ช่องตามรูปแบบ formModal) หรือ children (วางช่องเอง — ห่อแต่ละแถวด้วย CardFormRow บน desktop)
```

**ก่อน `danger?: boolean;`**

```text
ปุ่มหลักเป็น Primary danger button (เช่น ส่งกลับแก้ไข)
```

## src/components/patterns/NotificationPanel.tsx

**หัวไฟล์**

```text
แผงแจ้งเตือนใต้กระดิ่ง ตาม notiPanel() ใน screens.js (S8) — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Desktop: Notification card ลอยมุมขวาบน ใต้ Header navigation (ห่างขอบขวา 24 · ใต้หัว 8) · แถว = _Notification item base (Status · Text · เวลา · ไม่มีปุ่ม)
  Mobile: Bottom sheet หัว "แจ้งเตือน (<ป้าย>)" · การ์ดไม่มีหัว/ท้าย · ปุ่มเดียว Primary "ลบข้อความแจ้งเตือนทั้งหมด" (ไม่มีปุ่มยกเลิก)
  กระดิ่ง = Nav button ที่มี Indicator ใน Header navigation (Indicator=true เมื่อมีแจ้งเตือนใหม่)
```

**ก่อน `<div aria-hidden="true" className="fixed inset-0 z-40" onClick={onClose} />`**

```text
คลิกนอกแผง = ปิด (ไม่มีพื้นหลังทึบตามจอ Figma)
```

**ก่อน `<div className="fixed top-[calc(var(--guide-bottom,48px)+24px)] right-6 z-50 animate-fade-`**

```text
top = ใต้แถบต้นแบบ 48 + 24 (เดิม top-18) · โหมดพาดู: ใต้แถบพาดู (--guide-bottom ของ GuideBar) + 24 ไม่ทับปุ่มของแถบ
```

## src/components/patterns/PhotoGallery.tsx

**หัวไฟล์**

```text
แถวภาพ (library fallback ของ IncidentPhotoGallery) ตาม photoGallery() ใน screens.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Section label (ชื่อ "(n)") → ห่าง 16 → Images Size=sm Type=Image ช่องไฟ 16 ไม่มีปุ่ม/จุดเลื่อน · desktop สูงสุด 4 ภาพ · มือถือ 2 ภาพ
  ต้นแบบไม่มีไฟล์ภาพจริง → ไม่ส่ง src = ช่องภาพ Type=Empty ของไลบรารี
```

## src/components/patterns/PlateLink.tsx

**หัวไฟล์**

```text
ลิงก์เลขทะเบียน (ประกอบเอง · figma-spec/COMPOSED.md หัวข้อ น.) — AFTER_SCREEN ใน screens.js 6 พ.ย. 2569
  เจ้าของงาน "อยากให้ กดที่ทะเบียน newtab ไปข้อมูลรถได้ อยากให้ปรับส่วนอื่นที่เป็นเลขทะเบียน ตอนนี้เพิ่มแค่ส่วนของบำรุงรักษาก่อน"
  ⇒ ข้อความที่เป็นเลขทะเบียนทั้งช่อง (PLATE_RE เดียวกับปลั๊กอิน) ในช่องตาราง · กล่องข้อมูล · การ์ดมือถือ · รายการติ๊กมือถือ กดแล้วเปิดแท็บใหม่ไปหน้าข้อมูลยานพาหนะของ Vehicle Management
  ช่องกรอก รายการตัวเลือก Badge Pill Breadcrumb Page header ไม่เป็นลิงก์ (PLATE_SKIP) — ชิ้นเหล่านั้นไม่เรียก linkPlate
  ไลบรารี Component ไม่มี Table cell แบบลิงก์ ⇒ สไตล์ตามค่าลิงก์ใน _Content item base ของ UI Release#2 หน้า Replacement Vehicle ("BRD005678"): สีลิงก์ (Color/text/info) ขีดเส้นใต้
  สีใช้ token info-700 (ใกล้สุด — tokens ยังไม่มีค่าสีลิงก์นี้ ดูแถว _Content item base Type=Attachment และลิงก์เลขทะเบียนใน COMPOSED.md ข.)
  ปลายทาง: ต้นแบบยังไม่มีหน้าข้อมูลยานพาหนะ (แท็บ "ข้อมูลยานพาหนะ" ของ Vehicle Management) ⇒ /soon/ (หน้าเร็วๆ นี้ของต้นแบบ) พร้อม ?car=<ทะเบียนไม่มีจังหวัด>
```

**ก่อน `export function linkPlate(node: ReactNode): ReactNode {`**

```text
ข้อความเลขทะเบียนทั้งช่อง → ลิงก์ · อย่างอื่นคืนเดิม
```

## src/components/patterns/PopupModal.tsx

**หัวไฟล์**

```text
popup เนื้อหาอิสระ (ตาราง · อัปโหลด · รายการ) ตาม popupModal() ใน screens.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Desktop: Background overlay + กล่อง white รัศมี 12 กว้าง 640 (หรือ 800 ตามที่จอระบุ · 1140 = Modal Size=xl ของไลบรารี สำหรับ popup เลือกยานพาหนะ TripCarPicker BACKLOG ข้อ 89) กลางจอ (ห่างขอบบนอย่างน้อย 40)
           Modal header Alignment=Left (Title + Supporting text · ปุ่มปิด · ไม่มี Featured icon) · เนื้อหา ขอบใน 0/24/24 ช่องไฟ 24
           Modal footer Alignment=Horizontal right: Secondary "ยกเลิก" + Primary ok (okDisabled = State Disabled)
  Mobile: Bottom sheet (Bottom sheet header หัวเรื่อง · เนื้อหา ขอบในข้าง 16 ช่องไฟ 16 · Bottom sheet footer ปุ่ม lg)
```

**ก่อน `width?: 640 | 800 | 1140;`**

```text
กว้าง 640 (ค่าเริ่ม) · 800 · 1140 (Modal Size=xl)
```

**ก่อน `showOk?: boolean;`**

```text
false = ไม่มีปุ่มหลัก (popup ดูอย่างเดียว)
```

## src/components/patterns/RowActions.tsx

**หัวไฟล์**

```text
ช่องท้ายแถวของตารางยานพาหนะ — สวิตช์ทดลอง "แบบ Overhaul" (lib/ohStyle.ts จุดที่ 4)
  เปิด: desktop = ปุ่ม "…" + Dropdown menu (patterns/RowMenu) แบบตารางยานพาหนะของหน้าสร้างแผน Overhaul และฟอร์มแผน S1 ของรีโปนี้
  ปิด: ไอคอนแก้ไข ลบ ในแถวแบบเดิม · มือถือกางไอคอนบนการ์ดทั้งสองแบบ (CLAUDE.md ข้อ 14)
```

## src/components/patterns/RowMenu.tsx

**หัวไฟล์**

```text
เมนู "…" ท้ายแถว ตาม menuAt() / planMenu() ใน core.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
  Desktop: Dropdown menu ลอยใต้ปุ่ม "…" ชิดขวาของปุ่ม (ตำแหน่งคำนวณตอนรันจากปุ่มที่กด)
    · พฤติกรรม (BACKLOG ข้อ 7 · หน้าตาเดิม): ที่ว่างใต้ปุ่มไม่พอ = พลิกขึ้นเหนือปุ่ม · วางตามพิกัดของหน้า (portal ที่ body) เลื่อนหน้าแล้วเมนูเลื่อนตามปุ่ม ไม่ปิด
    · ปิดเมื่อคลิกนอกเมนู · Esc · เปลี่ยนขนาดจอ = คำนวณตำแหน่งใหม่จากปุ่ม (ไม่ปิด)
  Mobile: Bottom sheet (ไม่มีหัว) + Dropdown menu ไม่มีกรอบ
```

**ก่อน `export interface MenuAnchor { top: number; right: number; up?: number; /** ปุ่มที่กด — ใช้`**

```text
พิกัดของหน้า (รวมระยะเลื่อน): top = ขอบล่างของปุ่ม · up = ขอบบนของปุ่ม · right = ระยะจากขอบขวาของหน้าจอถึงขอบขวาของปุ่ม
```

**ท้ายบรรทัด `export interface MenuAnchor { top: number; right: number; up?: number;`**

```text
ปุ่มที่กด — ใช้คำนวณตำแหน่งใหม่เมื่อเปลี่ยนขนาดจอ
```

**ท้ายบรรทัด `const EDGE = 8;`**

```text
ระยะห่างขั้นต่ำจากขอบจอเมื่อพลิก
```

**ก่อน `useLayoutEffect(() => {`**

```text
วัดความสูงเมนูก่อนแสดง: ล้นขอบล่างของจอ และเหนือปุ่มมีที่พอ = พลิกขึ้น (ค่าที่คำนวณตอนรัน)
```

**ก่อน `export const anchorOf = (el: HTMLElement): MenuAnchor => {`**

```text
ตำแหน่งเมนูจากปุ่มที่กด: ใต้ปุ่ม ชิดขวาของปุ่ม (พิกัดของหน้า)
```
